package com.nextlearn.nextlearn.repository;

import com.nextlearn.nextlearn.model.ProgressUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
    List<ProgressUpdate> findByUserId(String userId);
}