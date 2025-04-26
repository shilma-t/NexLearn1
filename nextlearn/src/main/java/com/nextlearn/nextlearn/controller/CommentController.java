package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.Comment;
import com.nextlearn.nextlearn.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173")  // Adjust to match React port
public class CommentController {

    @Autowired
    private CommentService commentService;

    // ✅ Matches frontend request to /api/comments/post/1
    @GetMapping("/post/{postId}")
    public List<Comment> getComments(@PathVariable String postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return commentService.addComment(comment);
    }

    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable String id, @RequestBody Comment comment) {
        return commentService.updateComment(id, comment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable String id) {
        commentService.deleteComment(id);
    }
}
