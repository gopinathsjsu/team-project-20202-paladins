package com.booktable.model;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    CUSTOMER, RESTAURANT_MANAGER, ADMIN;

    @Override
    public String getAuthority() {
        return name(); // returns "CUSTOMER", "ADMIN", etc.
    }
}
