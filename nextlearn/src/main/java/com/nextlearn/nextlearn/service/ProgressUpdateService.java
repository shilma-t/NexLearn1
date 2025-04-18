package com.nextlearn.nextlearn.service;

import com.nextlearn.nextlearn.model.*;
import com.nextlearn.nextlearn.repository.ProgressUpdateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgressUpdateService {

    private final ProgressUpdateRepository repository;

    public ProgressUpdate createProgress(ProgressUpdate progress) {
        progress.setCreatedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());
        progress.setProgressPercentage(calculatePercentage(progress));
        return repository.save(progress);
    }

    public List<ProgressUpdate> getAllProgress() {
        return repository.findAll();
    }

    public List<ProgressUpdate> getUserProgress(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<ProgressUpdate> updateProgress(String id, ProgressUpdate updated) {
        return repository.findById(id).map(existing -> {
            updated.setId(id);
            updated.setUserId(existing.getUserId());
            updated.setCreatedAt(existing.getCreatedAt());
            updated.setUpdatedAt(LocalDateTime.now());
            updated.setProgressPercentage(calculatePercentage(updated));
            updated.setLikedBy(existing.getLikedBy());
            return repository.save(updated);
        });
    }

    public boolean deleteProgress(String id, String userId) {
        return repository.findById(id).map(p -> {
            if (p.getUserId().equals(userId)) {
                repository.deleteById(id);
                return true;
            }
            return false;
        }).orElse(false);
    }

    public Optional<ProgressUpdate> likeProgress(String id, String userId) {
        return repository.findById(id).map(p -> {
            if (p.getLikedBy().contains(userId)) {
                p.getLikedBy().remove(userId);
            } else {
                p.getLikedBy().add(userId);
            }
            return repository.save(p);
        });
    }

    private double calculatePercentage(ProgressUpdate p) {
        switch (p.getType()) {
            case COURSE:
                if (p.getCourseProgress() != null && p.getCourseProgress().getTotalModules() > 0)
                    return (p.getCourseProgress().getCompletedModules() * 100.0) / p.getCourseProgress().getTotalModules();
                break;
            case READING:
                if (p.getReadingProgress() != null && p.getReadingProgress().getTotalPages() > 0)
                    return (p.getReadingProgress().getPagesRead() * 100.0) / p.getReadingProgress().getTotalPages();
                break;
            case SKILL:
                if (p.getSkillProgress() != null && p.getSkillProgress().getTotalHours() > 0)
                    return (p.getSkillProgress().getHoursCompleted() * 100.0) / p.getSkillProgress().getTotalHours();
                break;
            case PROJECT:
                if (p.getProjectProgress() != null && p.getProjectProgress().getTotalTasks() > 0)
                    return (p.getProjectProgress().getCompletedTasks() * 100.0) / p.getProjectProgress().getTotalTasks();
                break;
            case CERTIFICATION:
                if (p.getCertificationProgress() != null) {
                    int total = 3;
                    int completed = 0;
                    if (p.getCertificationProgress().isEnrolled()) completed++;
                    if (p.getCertificationProgress().isExamTaken()) completed++;
                    if (p.getCertificationProgress().isCertified()) completed++;
                    return (completed * 100.0) / total;
                }
                break;
        }
        return 0.0;
    }
}

