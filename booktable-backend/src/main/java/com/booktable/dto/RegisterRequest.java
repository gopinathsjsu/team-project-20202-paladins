package com.booktable.dto;

import com.booktable.model.Role;
import lombok.Data;

import java.util.Set;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Set<Role> roles;
}
