package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.User;
import com.nextlearn.nextlearn.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

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
    public ResponseEntity<?> loginUser(@RequestBody User user, HttpSession session) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            User dbUser = existingUser.get();
            if (passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
                session.setAttribute("user", dbUser);
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful!",
                        "user", Map.of(
                                "name", dbUser.getName(),
                                "email", dbUser.getEmail()
                        )
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid password!"));
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Not logged in"));
        }
        return ResponseEntity.ok(Map.of(
                "name", user.getName(),
                "email", user.getEmail()
        ));
    }
}
