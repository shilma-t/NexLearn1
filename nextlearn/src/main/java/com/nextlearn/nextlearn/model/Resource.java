package com.nextlearn.nextlearn.model;

import lombok.Data;

@Data
public class Resource {
    private String id;
    private String name;
    private String url;
    private ResourceType type;
}
