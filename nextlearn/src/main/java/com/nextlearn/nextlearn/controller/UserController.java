package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.User;
import com.nextlearn.nextlearn.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam("q") String query) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }

    @PostMapping("/update-profile-pic")
    public ResponseEntity<?> updateProfilePicture(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId,
            @RequestParam("username") String username) {
        try {
            // Find the user
            User user = userRepository.findByEmail(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Convert the image to base64
            String base64Image = java.util.Base64.getEncoder().encodeToString(file.getBytes());
            String imageUrl = "data:" + file.getContentType() + ";base64," + base64Image;

            // Update user's profile picture
            user.setProfilePic(imageUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "message", "Profile picture updated successfully",
                "profilePic", imageUrl
            ));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to process image: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to update profile picture: " + e.getMessage()
            ));
        }
    }
}
