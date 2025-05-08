package com.booktable.service;

import com.booktable.model.User;
import com.booktable.repository.UserRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private ObjectId userId;
    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        userId = new ObjectId();

        mockUser = new User();
        mockUser.setId(userId.toHexString());
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");
    }


} 
