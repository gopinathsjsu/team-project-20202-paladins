package com.booktable.config;

import java.util.List;

public class SecurityConstants {
    public static final List<String> PUBLIC_URLS = List.of(
            "/api/auth/**",
            "/api/public/**",
            "/oauth2/**",
            "/login/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/swagger-resources/**",
            "/webjars/**"
    );
}
