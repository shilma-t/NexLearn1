package com.nextlearn.nextlearn.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseProgress {
    private String courseTitle;
    private String platform;
    private int totalModules;
    private int completedModules;
}