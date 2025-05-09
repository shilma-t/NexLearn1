package com.nextlearn.nextlearn.repository;

import com.nextlearn.nextlearn.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
    List<LearningPlan> findBySharedWithContaining(String userId);
    List<LearningPlan> findBySharedWithTrue();
    List<LearningPlan> findBySharedWithAllTrue();
}
