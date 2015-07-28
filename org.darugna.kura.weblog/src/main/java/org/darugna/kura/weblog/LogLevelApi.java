package org.darugna.kura.weblog;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Level;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("serial")
public final class LogLevelApi extends HttpServlet {
	
	private static final Logger s_logger = LoggerFactory.getLogger(LogLevelApi.class);
	
	public final void doGet(HttpServletRequest request, HttpServletResponse response) {
		response.setContentType("application/json");
		PrintWriter out = null;
		
		try {
			out = response.getWriter();
			JSONArray json = new JSONArray();
			Map<String,String>[] orderedLoggers = getLoggersLevel();
			for (int i = 0; i < orderedLoggers.length; ++i) {
				json.put(orderedLoggers[i]);
			}
					
			out.print(json.toString());
			out.flush();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (out != null) {
				out.close();
			}
		}
	}
	
	public final void doPost(HttpServletRequest request, HttpServletResponse response) {
		Map<String, String[]> m = request.getParameterMap();

		for (String p : m.keySet()) {
			s_logger.debug("{}:{}", p, m.get(p)[0]);
		}
		String loggerName = request.getParameter("name");
		String loggerLevel = request.getParameter("level");
		
		Enumeration<?> currentLoggers = org.apache.log4j.LogManager.getCurrentLoggers();
		
		while (currentLoggers.hasMoreElements()) {
			org.apache.log4j.Logger log4jLogger = (org.apache.log4j.Logger)currentLoggers.nextElement();
			
			if (loggerName.equals(log4jLogger.getName())) {
				Level oldLevel = log4jLogger.getEffectiveLevel();
				log4jLogger.setLevel(Level.toLevel(loggerLevel, oldLevel));
				s_logger.info("{}: {}", loggerName, log4jLogger.getEffectiveLevel());
			}
		}
		
		response.setStatus(HttpServletResponse.SC_OK);
	}
	
	private Map<String,String>[] getLoggersLevel() {
		Enumeration<?> currentLoggers = org.apache.log4j.LogManager.getCurrentLoggers();
		HashMap<String,String> loggersLevel = new HashMap<>();
		ArrayList<String> loggerNames = new ArrayList<String>();
		while (currentLoggers.hasMoreElements()) {
			org.apache.log4j.Logger log4jLogger = (org.apache.log4j.Logger)currentLoggers.nextElement();
			loggersLevel.put(log4jLogger.getName(), log4jLogger.getEffectiveLevel().toString());
			loggerNames.add(log4jLogger.getName());
		}
		Collections.sort(loggerNames);
		@SuppressWarnings("unchecked")
		Map<String,String>[] orderedLoggers = new Map[loggerNames.size()];
		for (int i = 0; i < loggerNames.size(); ++i) {
			orderedLoggers[i] = new HashMap<String,String>();
			orderedLoggers[i].put("name", loggerNames.get(i));
			orderedLoggers[i].put("level", loggersLevel.get(loggerNames.get(i)));
		}
		return orderedLoggers;
	}

}
