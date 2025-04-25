package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.Post;
import com.nextlearn.nextlearn.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${file.upload-dir}")
    private String uploadDir; // Property to specify the upload directory

   @PostMapping("/upload")
public Post createPostWithMedia(@RequestParam("userId") String userId,
                                @RequestParam("username") String username,
                                @RequestParam("profilePic") String profilePic,
                                @RequestParam("caption") String caption,
                                @RequestParam("file") MultipartFile[] files) throws IOException {
    String[] mediaUrls = new String[files.length];
    for (int i = 0; i < files.length; i++) {
        String fileName = System.currentTimeMillis() + "_" + files[i].getOriginalFilename();
        File file = new File(uploadDir + File.separator + fileName);
        files[i].transferTo(file);
        mediaUrls[i] = "http://localhost:9006/uploads/" + fileName;
    }
    
    // Ensure the username is set here.
    Post post = new Post();
    post.setUserId(userId);
    post.setUsername(username);
    post.setProfilePic(profilePic);
    post.setCaption(caption);
    post.setMediaUrls(List.of(mediaUrls));
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
    public Post updatePost(@PathVariable String id, @RequestBody Post postDetails) {
        return postService.updatePost(id, postDetails);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        postService.deletePost(id);
    }
}
