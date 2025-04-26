package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.Post;
import com.nextlearn.nextlearn.service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173",allowCredentials = "true")
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public Post createPostWithMedia(@RequestParam("userId") String userId,
                                    @RequestParam("username") String username,
                                    @RequestParam("profilePic") String profilePic,
                                    @RequestParam("caption") String caption,
                                    @RequestParam("file") MultipartFile[] files) throws IOException {
        // Ensure uploadDir is properly set
        if (uploadDir == null || uploadDir.isEmpty()) {
            uploadDir = Paths.get("uploads").toString(); // Default path
        }
        
        String[] mediaUrls = new String[files.length];
        for (int i = 0; i < files.length; i++) {
            String fileName = System.currentTimeMillis() + "_" + files[i].getOriginalFilename();
            File file = new File(uploadDir + File.separator + fileName);
            files[i].transferTo(file);
            mediaUrls[i] = "http://localhost:9006/uploads/" + fileName;  // Ensure this is the correct URL
        }

        // Create and save the post
        Post post = new Post(userId, username, profilePic, "post", "Sample Title", "Sample Description", "image_url", 100, caption, List.of(mediaUrls));
        return postService.createPost(post);
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public Post getPost(@PathVariable String id) {
        return postService.getPostById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Post updatePost(@PathVariable String id, 
                           @RequestParam("caption") String caption, 
                           @RequestParam("file") MultipartFile[] files) throws IOException {
        String[] mediaUrls = new String[files.length];
        for (int i = 0; i < files.length; i++) {
            String fileName = System.currentTimeMillis() + "_" + files[i].getOriginalFilename();
            File file = new File(uploadDir + File.separator + fileName);
            files[i].transferTo(file);
            mediaUrls[i] = "http://localhost:9006/uploads/" + fileName;
        }

        Optional<Post> postOptional = postService.getPostById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setCaption(caption);
            post.setMediaUrls(List.of(mediaUrls));
            return postService.createPost(post);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        postService.deletePost(id);
    }
}
