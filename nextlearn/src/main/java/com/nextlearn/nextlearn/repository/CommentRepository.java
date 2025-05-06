package com.nextlearn.nextlearn.repository;

import com.nextlearn.nextlearn.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    List<Comment> findByPostIdAndType(String postId, String type);
    Comment findByPostIdAndUserIdAndType(String postId, String userId, String type);
}
