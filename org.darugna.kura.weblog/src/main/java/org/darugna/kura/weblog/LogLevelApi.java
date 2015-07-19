package org.darugna.kura.weblog;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Level;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class LogLevelApi extends HttpServlet {
	
	private static final Logger s_logger = LoggerFactory.getLogger(LogLevelApi.class);
	
	public final void doGet(HttpServletRequest request, HttpServletResponse response) {
		response.setContentType("application/json");
	}
	
	
	private Map<String,String> getLoggersLevel() {
		Enumeration<?> currentLoggers = org.apache.log4j.LogManager.getCurrentLoggers();
		HashMap<String,String> loggersLevel = new HashMap<>();
		while (currentLoggers.hasMoreElements()) {
			org.apache.log4j.Logger log4jLogger = (org.apache.log4j.Logger)currentLoggers.nextElement();
			loggersLevel.put(log4jLogger.getName(), log4jLogger.getEffectiveLevel().toString());
		}
		return loggersLevel;
	}

}
