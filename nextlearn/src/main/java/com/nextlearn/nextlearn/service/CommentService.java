package com.nextlearn.nextlearn.service;

import com.nextlearn.nextlearn.model.Comment;
import com.nextlearn.nextlearn.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getCommentsByPostId(String postId) {
        try {
            return commentRepository.findByPostId(postId);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Comment> getLikesByPostId(String postId) {
        try {
            return commentRepository.findByPostIdAndType(postId, "like");
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Comment addComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public Comment toggleLike(String postId, String userId, String username) {
        // Check if user already liked the post
        Comment existingLike = commentRepository.findByPostIdAndUserIdAndType(postId, userId, "like");
        
        if (existingLike != null) {
            // Unlike: remove the like
            commentRepository.delete(existingLike);
            return null;
        } else {
            // Like: create new like
            Comment like = new Comment();
            like.setPostId(postId);
            like.setUserId(userId);
            like.setUsername(username);
            like.setContent("liked this post");
            like.setType("like");
            like.setCreatedAt(LocalDateTime.now());
            return commentRepository.save(like);
        }
    }

    public Comment updateComment(String id, Comment updated) {
        Comment comment = commentRepository.findById(id).orElseThrow();
        comment.setContent(updated.getContent());
        return commentRepository.save(comment);
    }

    public void deleteComment(String id) {
        commentRepository.deleteById(id);
    }
}