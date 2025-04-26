package com.nextlearn.nextlearn.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationProgress {
    private String certificationName;
    private String organization;
    private boolean enrolled;
    private boolean examTaken;
    private boolean certified;
}