package com.cmg.server;


import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;


/**
 * Created by Hai Lu on 05/06/2014.
 */
public class ContactMailService {
	private static final Logger logger = Logger.getLogger(ContactMailService.class.getCanonicalName());
    private final String body;
    public ContactMailService(String body) {
        this.body = body;
    }
    public String send(String[] recipients, String subject, String body) {

		if (recipients == null || recipients.length == 0) {
			return "No recipient found.";
		}
		StringBuffer sb = new StringBuffer();
		Properties props = new Properties();

		Session session = Session.getDefaultInstance(props, null);
		int problem = 0;
		Message msg = new MimeMessage(session);
		try {
			msg.setHeader("Content-Type", "text/html");
			msg.setFrom(new InternetAddress("tutorialsimply@gmail.com", "Simply Tutorial"));
		} catch (Exception ex) {
			problem++;
			logger.log(Level.SEVERE, "Cannot not set sender. Message: " + ex.getMessage());
		}
		for (String rec : recipients) {
			sb.append("\nAdd recipient " + rec + " ... ");
			try {
				msg.addRecipient(Message.RecipientType.TO, new InternetAddress(rec));
				sb.append("DONE.");
			} catch (Exception ex) {
				problem++;
				sb.append("FAIL. Message: " + ex.getMessage());
			}
		}
		sb.append("\n" + "Start sendmail ...");
		try {
			msg.setSubject(subject);
			msg.setDataHandler(new DataHandler(new HTMLDATASource(body)));

			Transport.send(msg);
			sb.append("DONE.");
		} catch (Exception ex) {
			problem++;
			logger.log(Level.SEVERE, "Cannot sendmail. Message: " + ex.getMessage());
			sb.append("FAIL. Message: " + ex.getMessage());
		} finally {
			logger.log(Level.INFO, sb.toString());
		}
		return sb.toString();
	}

    public void run() {
        try {
        	String[] m = new String[1];
        	m[0] = "tutorialsimply@gmail.com";
        	send( m ,"[Contact Form] " + new Date(),body);
        } catch (Exception e) {
        	logger.log(Level.SEVERE, "Could not send email. Message: " + e.getMessage());
        }

    }
    
    public class HTMLDATASource implements DataSource {

    	private final String html;

    	public HTMLDATASource(String htmlString) {
    		html = htmlString;
    	}

    	// Return html string in an InputStream.
    	// A new stream must be returned each time.
    	@Override
    	public InputStream getInputStream() throws IOException {
    		if (html == null)
    			throw new IOException("Null HTML");
    		return new ByteArrayInputStream(html.getBytes());
    	}

    	@Override
    	public OutputStream getOutputStream() throws IOException {
    		throw new IOException("This DataHandler cannot write HTML");
    	}

    	@Override
    	public String getContentType() {
    		return "text/html";
    	}

    	@Override
    	public String getName() {
    		return "JAF text/html dataSource to send e-mail only";
    	}
    }
}
