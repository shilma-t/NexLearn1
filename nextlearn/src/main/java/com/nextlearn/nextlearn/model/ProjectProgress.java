package com.nextlearn.nextlearn.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectProgress {
    private String projectName;
    private String githubLink;
    private String techStack;
    private int totalTasks;
    private int completedTasks;
}