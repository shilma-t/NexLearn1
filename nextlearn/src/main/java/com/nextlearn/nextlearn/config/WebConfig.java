package com.nextlearn.nextlearn.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get("C:/Users/shafr/Desktop/Updated_Project/NexLearn1/nextlearn/src/main/resources/uploads/").toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}