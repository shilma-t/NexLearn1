package com.nextlearn.nextlearn.model;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillProgress {
    private String skillName;
    private String level; // Beginner, Intermediate, Advanced
    private int totalHours;
    private int hoursCompleted;
}