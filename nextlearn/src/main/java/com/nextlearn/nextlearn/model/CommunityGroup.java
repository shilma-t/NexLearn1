package com.nextlearn.nextlearn.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "community_groups")
public class CommunityGroup {
    @Id
    private String id;
    private String name;
    private String description;
    private String ownerId; // owner's email
    private List<String> members = new ArrayList<>(); // user emails
    private List<GroupMessage> messages = new ArrayList<>();
    private List<String> systemMessages = new ArrayList<>();
    private Date createdAt;
    private Date updatedAt;
} 