package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.User;
import com.nextlearn.nextlearn.repository.UserRepository;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/profile")
    public User getCurrentUserProfile(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return userRepository.findByEmail(email).orElse(null);
    }
    
}
