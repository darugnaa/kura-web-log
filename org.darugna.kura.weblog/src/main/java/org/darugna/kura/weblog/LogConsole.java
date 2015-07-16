package org.darugna.kura.weblog;

import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentException;
import org.osgi.service.http.HttpContext;
import org.osgi.service.http.HttpService;
import org.osgi.service.http.NamespaceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogConsole {
	
	private static final Logger s_logger = LoggerFactory.getLogger(LogConsole.class);

	private HttpService m_httpService;

	public void setHttpService(HttpService httpService) {
		this.m_httpService = httpService;
	}

	public void unsetHttpService(HttpService httpService) {
		this.m_httpService = null;
	}
	
	protected void activate(BundleContext context) {
		HttpContext httpContext = new DefaultHttpContext(m_httpService.createDefaultHttpContext());
		
		try {
			m_httpService.registerResources("/weblog", "www/index.html", httpContext);
		} catch (NamespaceException e) {
			s_logger.error("Error registering weblog", e);
			throw new ComponentException(e);
		}
		s_logger.info("WebLog activated");
	}
	
	protected void deactivate(BundleContext context) {
		m_httpService.unregister("/weblog");
		
		s_logger.info("WebLog deactivated");
	}
}
