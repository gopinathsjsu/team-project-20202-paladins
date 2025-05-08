package com.booktable.service;

import com.booktable.dto.LoginRequest;
import com.booktable.dto.LoginResponse;
import com.booktable.dto.RegisterRequest;
import com.booktable.model.AuthProvider;
import com.booktable.model.Role;
import com.booktable.model.User;
import com.booktable.repository.UserRepository;
import com.booktable.security.JwtUtil;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private ObjectId userId;
    private User mockUser;
    private RegisterRequest mockRegisterRequest;
    private LoginRequest mockLoginRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        userId = new ObjectId();

        mockUser = new User();
        mockUser.setId(userId.toHexString());
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setRoles(Collections.singleton(Role.CUSTOMER));
        mockUser.setProvider(AuthProvider.LOCAL);

        mockRegisterRequest = new RegisterRequest();
        mockRegisterRequest.setName("Test User");
        mockRegisterRequest.setEmail("test@example.com");
        mockRegisterRequest.setPassword("password123");

        mockLoginRequest = new LoginRequest();
        mockLoginRequest.setEmail("test@example.com");
        mockLoginRequest.setPassword("password123");
    }

    @Test
    void registerUser_ShouldRegisterNewUser() {
        // Arrange
        when(userRepository.existsByEmail(mockRegisterRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(mockRegisterRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Act
        ResponseEntity<String> response = authService.registerUser(mockRegisterRequest);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("User registered successfully.", response.getBody());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_ShouldReturnConflict_WhenEmailExists() {
        // Arrange
        when(userRepository.existsByEmail(mockRegisterRequest.getEmail())).thenReturn(true);

        // Act
        ResponseEntity<String> response = authService.registerUser(mockRegisterRequest);

        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("User with this email already exists.", response.getBody());
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldReturnToken_WhenCredentialsValid() {
        // Arrange
        String mockToken = "mock.jwt.token";
        when(userRepository.findByEmail(mockLoginRequest.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(mockLoginRequest.getPassword(), mockUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(mockUser.getEmail(), Role.CUSTOMER.name())).thenReturn(mockToken);

        // Act
        ResponseEntity<?> response = authService.login(mockLoginRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof LoginResponse);
        LoginResponse loginResponse = (LoginResponse) response.getBody();
        assertEquals(mockToken, loginResponse.getToken());
        assertEquals(mockUser.getEmail(), loginResponse.getEmail());
        assertEquals(Role.CUSTOMER.name(), loginResponse.getRole());
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenUserNotFound() {
        // Arrange
        when(userRepository.findByEmail(mockLoginRequest.getEmail())).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = authService.login(mockLoginRequest);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid email or password.", response.getBody());
        verify(jwtUtil, never()).generateToken(any(), any());
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenPasswordInvalid() {
        // Arrange
        when(userRepository.findByEmail(mockLoginRequest.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(mockLoginRequest.getPassword(), mockUser.getPassword())).thenReturn(false);

        // Act
        ResponseEntity<?> response = authService.login(mockLoginRequest);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid email or password.", response.getBody());
        verify(jwtUtil, never()).generateToken(any(), any());
    }
} 