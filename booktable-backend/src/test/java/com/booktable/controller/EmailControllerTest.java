package com.booktable.controller;

import com.booktable.service.MailjetEmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailControllerTest {

    @Mock
    private MailjetEmailService mailjetEmailService;

    @InjectMocks
    private EmailController emailController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void sendEmailTest_ShouldSendEmail() {
        // Arrange
        String recipient = "test@example.com";
        String subject = "Test Subject";
        String message = "Test Message";
        doNothing().when(mailjetEmailService).sendEmail(any(), any(), any());

        // Act
        String result = emailController.sendEmailTest(recipient, subject, message);

        // Assert
        assertEquals("Email sent to " + recipient, result);
        verify(mailjetEmailService).sendEmail(recipient, subject, message);
    }

    @Test
    void sendEmailTest_ShouldHandleEmptyMessage() {
        // Arrange
        String recipient = "test@example.com";
        String subject = "Test Subject";
        String message = "";
        doNothing().when(mailjetEmailService).sendEmail(any(), any(), any());

        // Act
        String result = emailController.sendEmailTest(recipient, subject, message);

        // Assert
        assertEquals("Email sent to " + recipient, result);
        verify(mailjetEmailService).sendEmail(recipient, subject, message);
    }
} 