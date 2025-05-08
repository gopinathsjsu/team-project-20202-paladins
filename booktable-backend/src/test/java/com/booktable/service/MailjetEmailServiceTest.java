package com.booktable.service;

import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import org.json.JSONException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MailjetEmailServiceTest {

    @Mock
    private MailjetClient mailjetClient;

    @Mock
    private MailjetResponse mailjetResponse;

    @InjectMocks
    private MailjetEmailService mailjetEmailService;

    private String recipient;
    private String subject;
    private String messageBody;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Set required properties using reflection
        ReflectionTestUtils.setField(mailjetEmailService, "apiKey", "test-api-key");
        ReflectionTestUtils.setField(mailjetEmailService, "secretKey", "test-secret-key");
        ReflectionTestUtils.setField(mailjetEmailService, "senderEmail", "test@booktable.com");

        recipient = "recipient@example.com";
        subject = "Test Subject";
        messageBody = "Test Message Body";
    }




}