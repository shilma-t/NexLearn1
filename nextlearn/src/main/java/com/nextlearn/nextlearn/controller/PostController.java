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
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*", allowCredentials = "true")
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> createPostWithMedia(@RequestParam("userId") String userId,
                                               @RequestParam("username") String username,
                                               @RequestParam("profilePic") String profilePic,
                                               @RequestParam("caption") String caption,
                                               @RequestParam(value = "file", required = false) MultipartFile[] files) {
        try {
            String[] mediaUrls = new String[0];
            if (files != null && files.length > 0) {
                mediaUrls = new String[files.length];
                for (int i = 0; i < files.length; i++) {
                    String fileName = System.currentTimeMillis() + "_" + files[i].getOriginalFilename();
                    File file = new File(uploadDir + File.separator + fileName);
                    files[i].transferTo(file);
                    mediaUrls[i] = "http://localhost:9006/uploads/" + fileName;
                }
            }
            
            Post post = new Post();
            post.setUserId(userId);
            post.setUsername(username);
            post.setProfilePic(profilePic);
            post.setCaption(caption);
            post.setMediaUrls(List.of(mediaUrls));
            
            Post savedPost = postService.createPost(post);
            return ResponseEntity.ok(savedPost);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error processing media files: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating post: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        try {
            List<Post> posts = postService.getAllPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable String id) {
        try {
            Optional<Post> post = postService.getPostById(id);
            return post.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id, 
                                      @RequestParam("caption") String caption, 
                                      @RequestParam(value = "file", required = false) MultipartFile[] files) {
        try {
            Optional<Post> postOptional = postService.getPostById(id);
            if (postOptional.isPresent()) {
                Post post = postOptional.get();
                post.setCaption(caption);

                if (files != null && files.length > 0) {
                    // Delete old media files
                    if (post.getMediaUrls() != null) {
                        for (String mediaUrl : post.getMediaUrls()) {
                            String fileName = mediaUrl.substring(mediaUrl.lastIndexOf("/") + 1);
                            File oldFile = new File(uploadDir + File.separator + fileName);
                            if (oldFile.exists()) {
                                oldFile.delete();
                            }
                        }
                    }

                    // Save new media files
                    String[] mediaUrls = new String[files.length];
                    for (int i = 0; i < files.length; i++) {
                        String fileName = System.currentTimeMillis() + "_" + files[i].getOriginalFilename();
                        File file = new File(uploadDir + File.separator + fileName);
                        files[i].transferTo(file);
                        mediaUrls[i] = "http://localhost:9006/uploads/" + fileName;
                    }
                    post.setMediaUrls(List.of(mediaUrls));
                }

                Post updatedPost = postService.updatePost(id, post);
                return ResponseEntity.ok(updatedPost);
            }
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error processing media files: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating post: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        try {
            Optional<Post> postOptional = postService.getPostById(id);
            if (postOptional.isPresent()) {
                Post post = postOptional.get();
                
                // Delete associated media files
                if (post.getMediaUrls() != null) {
                    for (String mediaUrl : post.getMediaUrls()) {
                        String fileName = mediaUrl.substring(mediaUrl.lastIndexOf("/") + 1);
                        File file = new File(uploadDir + File.separator + fileName);
                        if (file.exists()) {
                            file.delete();
                        }
                    }
                }
                
                postService.deletePost(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting post: " + e.getMessage());
        }
    }
}
