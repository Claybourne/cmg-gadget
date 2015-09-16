package  com.cmg.server;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
/**
 * Created by lantb on 2014-04-22.
 */
public class ContactHandler extends BaseServlet {
	private static final Logger logger = Logger.getLogger(ContactHandler.class.getCanonicalName());
    private static String POST_DATA = "postData";
    
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException 
    { 
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setHeader("Access-Control-Allow-Origin", "*");
        try {
            boolean sended = false;
            ContactModel contact = new ContactModel();
            contact.setEmail(getParameter(request, "email"));
            contact.setFirstName(getParameter(request, "firstName"));
            contact.setLastName(getParameter(request, "lastName"));
            contact.setHappy(getParameter(request, "happy").equalsIgnoreCase("true"));
            contact.setMessage(getParameter(request, "message"));
            if (contact.getEmail() != null && contact.getEmail().length() > 0) {
            	ContactMailService cms = new ContactMailService(getBodyContactMail(contact));
            	cms.run();
            	sended = true;
            }
            if (sended) {
                printMessage(response, "success");
            } else {
                printMessage(response, "Missing parameter!");
            }

        }catch (Exception e){
        	logger.log(Level.SEVERE, "Error when receive contact form. Message: " + e.getMessage());
            printMessage(response, "fail. Message: " + e.getMessage());
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
    
    public String getBodyContactMail(ContactModel model) {
        StringBuffer temp = new StringBuffer();
        temp.append("<p style=\"color:#666; font-family: arial; font-size:10pt;\">Dear admin,</p>\n");
        temp.append("<p style=\"color:#666; font-family: arial; font-size:10pt;\">There is a contact information from simply-tutorial.com :  </p>\n");
        temp.append("<p style=\"color:#666; font-family: arial; font-size:10pt;\">Email : "+model.getEmail()+" </p>\n");
        temp.append("<p style=\"color:#666; font-family: arial; font-size:10pt;\">First name : "+model.getFirstName()+" </p>\n");
        temp.append("<p style=\"color:#666; font-family: arial; font-size:10pt;\">Last name : "+model.getLastName()+" </p>\n");
        temp.append("<p style=\"color:#666; font-family: arial; font-size:10pt;\">Message : "+model.getMessage() +"</p>\n");
        temp.append("<p style=\"color:#666; font-family: arial; font-size:10pt;\">Happy to keep update with blog : "+ (model.isHappy() ? "Yes" : "No") +" </p>\n");
        temp.append("<p style=\"color:#666; font-family: arial; font-size:10pt;\">Kind regards,<br />\n" +
                "Contact Support</p>");
        String body = temp.toString();
        logger.info(body);
        return body;
    }
    
    public class ContactModel {
        private String firstName;
        private String lastName;
        private String email;
        private String message;
        private boolean happy;

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public boolean isHappy() {
            return happy;
        }

        public void setHappy(boolean happy) {
            this.happy = happy;
        }
    }

}
