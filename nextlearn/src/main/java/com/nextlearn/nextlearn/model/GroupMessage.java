package com.nextlearn.nextlearn.model;

import lombok.Data;
import java.util.Date;
import org.springframework.data.annotation.Id;

@Data
public class GroupMessage {
    @Id
    private String id;
    private String senderId; // sender's email
    private String senderName;
    private String content;
    private Date timestamp;
} 