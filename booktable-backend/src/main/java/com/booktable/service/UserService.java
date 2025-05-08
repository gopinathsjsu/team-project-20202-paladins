package com.booktable.service;

import com.booktable.model.User;
import com.booktable.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    //    @Autowired
    private UserRepository userRepository;

    private User saveUser(User user) {
        return userRepository.save(user);
    }
}