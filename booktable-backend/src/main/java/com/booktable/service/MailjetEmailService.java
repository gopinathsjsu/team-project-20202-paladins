package com.booktable.service;

import com.booktable.controller.ReviewController;
import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.resource.Emailv31;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MailjetEmailService {

    private static final Logger log = LoggerFactory.getLogger(MailjetEmailService.class);
    private final String apiKey;
    private final String secretKey;
    private final String senderEmail;

    public MailjetEmailService(@Value("${mailjet.api.key}") String apiKey,
                               @Value("${mailjet.secret.key}") String secretKey,
                               @Value("${mailjet.sender.email}") String senderEmail) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.senderEmail = senderEmail;
    }

    public void sendEmail(String recipient, String subject, String messageBody) {
        log.info("Sending email to: {}, subject: {}", recipient, subject);
        MailjetClient client = new MailjetClient(apiKey, secretKey);

        // Build the Mailjet request
        MailjetRequest request;
        MailjetResponse response;

        try {
            request = new MailjetRequest(Emailv31.resource)
                    .property(Emailv31.MESSAGES, new JSONArray()
                            .put(new JSONObject()
                                    .put(Emailv31.Message.FROM, new JSONObject()
                                            .put("Email", senderEmail)
                                            .put("Name", "BookTable App"))
                                    .put(Emailv31.Message.TO, new JSONArray()
                                            .put(new JSONObject()
                                                    .put("Email", recipient)))
                                    .put(Emailv31.Message.SUBJECT, subject)
                                    .put(Emailv31.Message.TEXTPART, messageBody)
                                    .put(Emailv31.Message.CUSTOMID, "BookTable Email")));

            // Send the request
            response = client.post(request);
            log.info("Mailjet response status: {}", response.getStatus());
            log.info("Mailjet response data: {}", response.getData());
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (Exception e) {
            log.error("Error sending email via Mailjet: {}", e.getMessage());
            e.printStackTrace();
        }
    }
}
