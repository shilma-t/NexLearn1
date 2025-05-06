package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.Comment;
import com.nextlearn.nextlearn.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String postId) {
        try {
            return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/post/{postId}/likes")
    public ResponseEntity<List<Comment>> getLikes(@PathVariable String postId) {
        try {
            return ResponseEntity.ok(commentService.getLikesByPostId(postId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        try {
            if (comment.getType() == null || comment.getType().isEmpty()) {
                comment.setType("comment");
            }
            return ResponseEntity.ok(commentService.addComment(comment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/like")
    public ResponseEntity<?> toggleLike(
            @RequestParam String postId,
            @RequestParam String userId,
            @RequestParam String username) {
        try {
            Comment result = commentService.toggleLike(postId, userId, username);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling like: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable String id, @RequestBody Comment comment) {
        try {
            return ResponseEntity.ok(commentService.updateComment(id, comment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting comment: " + e.getMessage());
        }
    }
}
