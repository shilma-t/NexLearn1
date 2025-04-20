package com.nextlearn.nextlearn.model;



import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "progress_updates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressUpdate {

    @Id
    private String id;

    private String userId;

    private ProgressType type;

    private String title;
    private String description;

    private double progressPercentage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Set<String> likedBy = new HashSet<>();

    // Template-specific fields
    private CourseProgress courseProgress;
    private ReadingProgress readingProgress;
    private SkillProgress skillProgress;
    private ProjectProgress projectProgress;
    private CertificationProgress certificationProgress;
}