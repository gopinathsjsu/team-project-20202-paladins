package com.booktable.controller;

import com.booktable.service.MailjetEmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {

    private static final Logger log = LoggerFactory.getLogger(EmailController.class);
    private final MailjetEmailService mailjetEmailService;

    public EmailController(MailjetEmailService mailjetEmailService) {
        this.mailjetEmailService = mailjetEmailService;
    }

    // Example: GET /api/send-email?recipient=john.doe@example.com&subject=Test&message=Hello%20World
    @GetMapping("/api/send-email")
    public String sendEmailTest(@RequestParam String recipient,
                                @RequestParam String subject,
                                @RequestParam String message) {
        log.info("Sending email to: {}, subject: {}", recipient, subject);
        mailjetEmailService.sendEmail(recipient, subject, message);
        return "Email sent to " + recipient;
    }
}
