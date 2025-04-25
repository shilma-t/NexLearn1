package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.User;
import com.nextlearn.nextlearn.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Email already exists!";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setProvider("manual");
        userRepository.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public Map<String, String> loginUser(@RequestBody User user, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            User dbUser = existingUser.get();
            if (passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
                // Set session user
                request.getSession().setAttribute("user", dbUser);
                response.put("message", "Login successful");
            } else {
                response.put("message", "Invalid password");
            }
        } else {
            response.put("message", "User not found");
        }

        return response;
    }

    // ✅ Fetch current user from session
    @GetMapping("/current-user")
    public User getCurrentUser(HttpServletRequest request) {
        return (User) request.getSession().getAttribute("user");
    }
}
