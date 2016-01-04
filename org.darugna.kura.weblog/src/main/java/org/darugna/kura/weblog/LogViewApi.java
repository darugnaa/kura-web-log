package org.darugna.kura.weblog;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.AppenderSkeleton;
import org.apache.log4j.spi.LoggingEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("serial")
final class LogViewApi extends HttpServlet {
	
	private static final Logger s_logger = LoggerFactory.getLogger(LogViewApi.class);
	
	private static final long EXPIRE_INTERVAL_MS = 5000;
	private AtomicBoolean m_enabled = new AtomicBoolean(false);
	private ScheduledExecutorService m_scheduledExecutor = Executors.newSingleThreadScheduledExecutor();
	private ScheduledFuture<?> m_scheduledFuture;
	private WebAppender m_webAppender;
	
	public final void doGet(HttpServletRequest request, HttpServletResponse response) {
		response.setContentType("application/json");
		if (!m_enabled.get()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
		
		List<String> messages = m_webAppender.readLogMessages();
		
		
	}
	
	public final void doPost(HttpServletRequest request, HttpServletResponse response) {
		if (m_enabled.get()) {
			s_logger.debug("POST request to enable WebAppender, ignoring because it is already enabled");
			return;
		}
		m_webAppender = new WebAppender();
		org.apache.log4j.LogManager.getRootLogger().addAppender(m_webAppender);
		m_enabled.set(true);
		m_scheduledFuture = m_scheduledExecutor.scheduleAtFixedRate(new ExpireCheckTask(),
																	5, 5, TimeUnit.SECONDS);
		s_logger.info("Added WebAppender");
	}
	
	
	private final class WebAppender extends AppenderSkeleton {

		private final ConcurrentLinkedQueue<LoggingEvent> m_queue = new ConcurrentLinkedQueue<>();
		private long m_lastChecked = 0L;
		
		@Override
		public void close() {
		}

		@Override
		public boolean requiresLayout() {
			return false;
		}

		@Override
		protected void append(LoggingEvent loggingEvent) {
			m_queue.add(loggingEvent);
		}
		
		public boolean isExpired() {
			return System.currentTimeMillis() - m_lastChecked > EXPIRE_INTERVAL_MS;
		}
		
		public List<String> readLogMessages() {
			List<String> messages = new ArrayList<>();
			
			LoggingEvent le = m_queue.poll();
			while (le != null) {
				messages.add(le.getRenderedMessage());
			}
			
			return messages;
		}
		
	}
	
	
	private final class ExpireCheckTask implements Runnable {

		@Override
		public void run() {
			// Just return if there's nothing to do
			if (!m_enabled.get() || m_webAppender == null) {
				return;
			}
			try {
				if (m_webAppender.isExpired()) {
					s_logger.warn("WebAppender expired, no requests from browser in {} milliseconds", EXPIRE_INTERVAL_MS);
					org.apache.log4j.LogManager.getRootLogger().removeAppender(m_webAppender);
					m_enabled.set(false);
					m_webAppender = null;
					m_scheduledFuture.cancel(false);
					s_logger.info("WebAppender disabled");
				}
			} catch (Exception e) {
				s_logger.error("Unexpected exception", e);
			}
			
		}
		
	}
}