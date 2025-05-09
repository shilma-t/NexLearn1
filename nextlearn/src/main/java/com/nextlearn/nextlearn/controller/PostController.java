package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.Post;
import com.nextlearn.nextlearn.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> createPostWithMedia(
            @RequestParam("userId") String userId,
            @RequestParam("username") String username,
            @RequestParam("profilePic") String profilePic,
            @RequestParam("caption") String caption,
            @RequestParam(value = "file", required = false) MultipartFile[] files) {
        try {
            // Validate user information
            if (userId == null || userId.equals("null") || username == null || username.equals("null")) {
                return ResponseEntity.badRequest().body("User information is required");
            }

            // Create upload directory if it doesn't exist
            File uploadDirectory = new File(uploadDir);
            if (!uploadDirectory.exists()) {
                uploadDirectory.mkdirs();
            }

            String[] mediaUrls = new String[0];
            if (files != null && files.length > 0) {
                mediaUrls = new String[files.length];
                for (int i = 0; i < files.length; i++) {
                    if (files[i] != null && !files[i].isEmpty()) {
                        String fileName = System.currentTimeMillis() + "_" + files[i].getOriginalFilename();
                        File file = new File(uploadDirectory, fileName);
                        files[i].transferTo(file);
                        mediaUrls[i] = "http://localhost:9006/uploads/" + fileName;
                    }
                }
            }

            Post post = new Post();
            post.setUserId(userId);
            post.setUsername(username);
            post.setProfilePic(profilePic);
            post.setCaption(caption);
            post.setMediaUrls(List.of(mediaUrls));
            post.setLikedBy(new HashSet<>());
            post.setLikes(0);
            post.setComments(0);
            
            Post savedPost = postService.createPost(post);
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating post: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        try {
            return ResponseEntity.ok(postService.getAllPosts());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable String id) {
        try {
            Optional<Post> post = postService.getPostById(id);
            return post.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable String id,
            @RequestParam(value = "caption", required = false) String caption,
            @RequestParam(value = "file", required = false) MultipartFile[] files) throws IOException {
        try {
            Optional<Post> postOptional = postService.getPostById(id);
            if (!postOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Post post = postOptional.get();
            if (caption != null) {
                post.setCaption(caption);
            }

            if (files != null && files.length > 0) {
                // Delete old media files
                if (post.getMediaUrls() != null) {
                    for (String url : post.getMediaUrls()) {
                        String fileName = url.substring(url.lastIndexOf("/") + 1);
                        new File(uploadDir + File.separator + fileName).delete();
                    }
                }

                // Upload new media files
                String[] mediaUrls = new String[files.length];
                for (int i = 0; i < files.length; i++) {
                    String fileName = System.currentTimeMillis() + "_" + files[i].getOriginalFilename();
                    File file = new File(uploadDir + File.separator + fileName);
                    files[i].transferTo(file);
                    mediaUrls[i] = "http://localhost:9006/uploads/" + fileName;
                }
                post.setMediaUrls(List.of(mediaUrls));
            }

            return ResponseEntity.ok(postService.updatePost(id, post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating post: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        try {
            Optional<Post> postOptional = postService.getPostById(id);
            if (!postOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // Delete media files
            Post post = postOptional.get();
            if (post.getMediaUrls() != null) {
                for (String url : post.getMediaUrls()) {
                    String fileName = url.substring(url.lastIndexOf("/") + 1);
                    new File(uploadDir + File.separator + fileName).delete();
                }
            }

            postService.deletePost(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting post: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable String id, @RequestParam String userId) {
        try {
            // Validate user information
            if (userId == null || userId.equals("null")) {
                return ResponseEntity.badRequest().body("User ID is required");
            }

            Optional<Post> postOptional = postService.getPostById(id);
            if (!postOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Post post = postOptional.get();
            if (post.getLikedBy() == null) {
                post.setLikedBy(new HashSet<>());
            }

            if (post.getLikedBy().contains(userId)) {
                post.getLikedBy().remove(userId);
                post.setLikes(post.getLikes() - 1);
            } else {
                post.getLikedBy().add(userId);
                post.setLikes(post.getLikes() + 1);
            }

            return ResponseEntity.ok(postService.updatePost(id, post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error liking post: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(@PathVariable String id, @RequestParam String userId, @RequestParam String content) {
        try {
            // Validate user information
            if (userId == null || userId.equals("null")) {
                return ResponseEntity.badRequest().body("User ID is required");
            }

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Comment content is required");
            }

            Optional<Post> postOptional = postService.getPostById(id);
            if (!postOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Post post = postOptional.get();
            post.setComments(post.getComments() + 1);
            return ResponseEntity.ok(postService.updatePost(id, post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding comment: " + e.getMessage());
        }
    }
}
