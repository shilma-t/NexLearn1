package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.LearningPlan;
import com.nextlearn.nextlearn.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/api/plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllPlans() {
        return ResponseEntity.ok(learningPlanService.getAllPlans());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlan>> getPlansByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(learningPlanService.getPlansByUserId(userId));
    }

    @GetMapping("/shared/{userId}")
    public ResponseEntity<List<LearningPlan>> getSharedPlans(@PathVariable String userId) {
        return ResponseEntity.ok(learningPlanService.getSharedPlans(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable String id) {
        Optional<LearningPlan> plan = learningPlanService.getPlanById(id);
        return plan.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LearningPlan> createPlan(@RequestBody LearningPlan plan) {
        try {
            LearningPlan createdPlan = learningPlanService.createPlan(plan);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updatePlan(@PathVariable String id, @RequestBody LearningPlan plan) {
        try {
            LearningPlan updatedPlan = learningPlanService.updatePlan(plan);
            return ResponseEntity.ok(updatedPlan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        try {
            learningPlanService.deletePlan(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{planId}/share/{userId}")
    public ResponseEntity<LearningPlan> sharePlan(@PathVariable String planId, @PathVariable String userId) {
        try {
            LearningPlan plan = learningPlanService.sharePlan(planId, userId);
            if (plan != null) {
                return ResponseEntity.ok(plan);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{planId}/share/{userId}")
    public ResponseEntity<LearningPlan> unsharePlan(@PathVariable String planId, @PathVariable String userId) {
        try {
            LearningPlan plan = learningPlanService.unsharePlan(planId, userId);
            if (plan != null) {
                return ResponseEntity.ok(plan);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{planId}/share/all")
    public ResponseEntity<LearningPlan> sharePlanWithAll(@PathVariable String planId) {
        try {
            LearningPlan plan = learningPlanService.sharePlanWithAll(planId);
            if (plan != null) {
                return ResponseEntity.ok(plan);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/shared/all")
    public ResponseEntity<List<LearningPlan>> getAllSharedPlans() {
        return ResponseEntity.ok(learningPlanService.getAllSharedPlans());
    }
}

