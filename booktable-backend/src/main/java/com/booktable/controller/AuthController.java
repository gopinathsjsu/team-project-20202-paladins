package com.booktable.controller;

import com.booktable.dto.RegisterRequest;
import com.booktable.dto.LoginRequest;
import com.booktable.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Authentication", description = "Endpoints for login and signup")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Operation(summary = "Sign up with email", description = "Registers a new user using email/password")
    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        log.info("Received signup request: {}", request);
        return authService.registerUser(request);
    }

    @Operation(summary = "Login with email", description = "Generates JWT token upon successful login")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("Received login request: {}", request);
        return authService.login(request);
    }
}