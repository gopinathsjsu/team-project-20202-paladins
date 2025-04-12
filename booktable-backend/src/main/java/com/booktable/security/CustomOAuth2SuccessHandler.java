package com.booktable.security;

import com.booktable.model.Role;
import com.booktable.model.User;
import com.booktable.repository.UserRepository;
import jakarta.servlet.ServletException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Collections;

import static com.booktable.model.AuthProvider.GOOGLE;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        // Find user by email, or create if not exists
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setRoles(Collections.singleton(Role.CUSTOMER)); // default role
            newUser.setProvider(GOOGLE);
            return userRepository.save(newUser);
        });

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), "CUSTOMER");

        // Redirect to frontend with token
        response.sendRedirect("http://localhost:3000/oauth2/success?token=" + token);
    }
}
