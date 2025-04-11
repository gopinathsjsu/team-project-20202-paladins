package com.booktable.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;

    private String name;
    private String email;
    private String password;

    private Set<String> roles; // Example: ["CUSTOMER"], ["ADMIN"]
    private AuthProvider provider; // LOCAL, GOOGLE
}
