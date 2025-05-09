package com.nextlearn.nextlearn.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "nextlearn")
public class LearningPlan {
        @Id
        private String id;
        private String title;
        private String description;
        private String userId;
        private Date createdAt;
        private Date updatedAt;
        private List<String> sharedWith = new ArrayList<>();
        private boolean sharedWithAll = false;
        private List<Topic> topics = new ArrayList<>();
    }
