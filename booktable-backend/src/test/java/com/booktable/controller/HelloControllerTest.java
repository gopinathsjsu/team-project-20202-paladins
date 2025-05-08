package com.booktable.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;

class HelloControllerTest {

    @InjectMocks
    private HelloController helloController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void sayHello_ShouldReturnWelcomeMessage() {
        // Act
        String result = helloController.sayHello();

        // Assert
        assertEquals("Hello from BookTable!", result);
    }
} 