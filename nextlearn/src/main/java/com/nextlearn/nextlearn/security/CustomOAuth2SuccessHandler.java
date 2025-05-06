package com.nextlearn.nextlearn.security;

import com.nextlearn.nextlearn.model.User;
import com.nextlearn.nextlearn.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public CustomOAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture"); // may return null if not available

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isEmpty()) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setProvider("google");
            userRepository.save(user);
        } else {
            user = existingUser.get();
        }

        // Redirect to frontend with user data
        String redirectUrl = String.format(
            "http://localhost:5173/oauth2-redirect?email=%s&name=%s&picture=%s",
            URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8),
            URLEncoder.encode(user.getName(), StandardCharsets.UTF_8),
            URLEncoder.encode(picture != null ? picture : "", StandardCharsets.UTF_8)
        );

        response.sendRedirect(redirectUrl);
    }
}
