package com.booktable.service;

import com.booktable.model.User;
import com.booktable.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

//    @Autowired
    private UserRepository userRepository;
    private

    User saveUser(User user) {
        log.info("Saving user: {}", user);
        return userRepository.save(user);
    }
}