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
        e.printStackTrace(); // logs to console
        return new ArrayList<>(); // prevent crash
    }}

    public Comment addComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
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