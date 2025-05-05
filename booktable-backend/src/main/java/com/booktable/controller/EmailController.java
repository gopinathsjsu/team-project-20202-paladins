package com.booktable.controller;

import com.booktable.service.MailjetEmailService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SecurityRequirement(name = "bearerAuth")
@RestController
public class EmailController {

    private final MailjetEmailService mailjetEmailService;

    public EmailController(MailjetEmailService mailjetEmailService) {
        this.mailjetEmailService = mailjetEmailService;
    }

    // Example: GET /api/send-email?recipient=john.doe@example.com&subject=Test&message=Hello%20World
    @GetMapping("/api/send-email")
    public String sendEmailTest(@RequestParam String recipient,
                                @RequestParam String subject,
                                @RequestParam String message) {
        mailjetEmailService.sendEmail(recipient, subject, message);
        return "Email sent to " + recipient;
    }
}
