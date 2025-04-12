package com.booktable.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements UserDetails {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;

    private Set<Role> roles; // Example: ["CUSTOMER"], ["ADMIN"]
    private AuthProvider provider; // LOCAL, GOOGLE

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles; // Each Role implements GrantedAuthority
    }

    @Override
    public String getUsername() {
        return email; // Used as the principal identity
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // You can later add logic to expire accounts
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // You can later lock users if needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credential rotation can go here
    }

    @Override
    public boolean isEnabled() {
        return true; // You can disable accounts if needed
    }
}
