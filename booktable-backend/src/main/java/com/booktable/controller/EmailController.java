package com.booktable.controller;

import com.booktable.service.SnsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {

    private final SnsService snsService;

    public EmailController(SnsService snsService) {
        this.snsService = snsService;
    }

    // Example endpoint: GET /api/send-email?subject=Test&message=Hello
    @GetMapping("/api/send-email")
    public String sendEmail(@RequestParam String subject, @RequestParam String message) {
        String messageId = snsService.publishMessage(subject, message);
        return "Email sent via SNS! Message ID: " + messageId;
    }
}
