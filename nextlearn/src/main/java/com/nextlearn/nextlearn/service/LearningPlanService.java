package com.nextlearn.nextlearn.service;

import com.nextlearn.nextlearn.model.LearningPlan;
import com.nextlearn.nextlearn.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public List<LearningPlan> getAllPlans() {
        return learningPlanRepository.findAll();
    }

    public List<LearningPlan> getPlansByUserId(String userId) {
        return learningPlanRepository.findByUserId(userId);
    }

    public List<LearningPlan> getSharedPlans(String userId) {
        return learningPlanRepository.findBySharedWithContaining(userId);
    }

    public Optional<LearningPlan> getPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    public LearningPlan createPlan(LearningPlan plan) {
        plan.setCreatedAt(new Date());
        plan.setUpdatedAt(new Date());
        
        // Generate IDs for topics and resources
        plan.getTopics().forEach(topic -> {
            if (topic.getId() == null) {
                topic.setId(UUID.randomUUID().toString());
            }
            topic.getResources().forEach(resource -> {
                if (resource.getId() == null) {
                    resource.setId(UUID.randomUUID().toString());
                }
            });
        });
        
        return learningPlanRepository.save(plan);
    }

    public LearningPlan updatePlan(LearningPlan plan) {
        plan.setUpdatedAt(new Date());
        return learningPlanRepository.save(plan);
    }

    public void deletePlan(String id) {
        Optional<LearningPlan> planOpt = learningPlanRepository.findById(id);
        if (planOpt.isPresent()) {
            LearningPlan plan = planOpt.get();
            learningPlanRepository.delete(plan);
        } else {
            throw new RuntimeException("Plan not found with id: " + id);
        }
    }

    public LearningPlan sharePlan(String planId, String userId) {
        Optional<LearningPlan> planOpt = learningPlanRepository.findById(planId);
        if (planOpt.isPresent()) {
            LearningPlan plan = planOpt.get();
            if (!plan.getSharedWith().contains(userId)) {
                plan.getSharedWith().add(userId);
                plan.setUpdatedAt(new Date());
                return learningPlanRepository.save(plan);
            }
            return plan;
        }
        return null;
    }

    public LearningPlan unsharePlan(String planId, String userId) {
        Optional<LearningPlan> planOpt = learningPlanRepository.findById(planId);
        if (planOpt.isPresent()) {
            LearningPlan plan = planOpt.get();
            plan.getSharedWith().remove(userId);
            plan.setUpdatedAt(new Date());
            return learningPlanRepository.save(plan);
        }
        return null;
    }

    public LearningPlan sharePlanWithAll(String planId) {
        LearningPlan plan = learningPlanRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Learning plan not found"));
        
        plan.setSharedWithAll(true);
        return learningPlanRepository.save(plan);
    }

    public List<LearningPlan> getAllSharedPlans() {
        return learningPlanRepository.findBySharedWithAllTrue();
    }
}

