package com.booktable.service;

import com.booktable.dto.LoginRequest;
import com.booktable.dto.LoginResponse;
import com.booktable.dto.RegisterRequest;
import com.booktable.model.AuthProvider;
import com.booktable.model.Role;
import com.booktable.model.User;
import com.booktable.repository.UserRepository;
import com.booktable.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public ResponseEntity<String> registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("User with this email already exists.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(Role.CUSTOMER));  // Default to CUSTOMER role
        user.setProvider(AuthProvider.LOCAL);

        userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully.");
    }

    public ResponseEntity<?> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRoles().iterator().next().name());

        LoginResponse response = new LoginResponse(token, user.getEmail(), user.getRoles().iterator().next().name());

        return ResponseEntity.ok(response);
    }

}
