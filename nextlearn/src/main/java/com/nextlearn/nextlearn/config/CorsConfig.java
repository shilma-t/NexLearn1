package com.nextlearn.nextlearn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow all origins for development
        config.addAllowedOrigin("http://localhost:5173");
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow all methods
        config.addAllowedMethod("*");
        
        // Apply this configuration to all paths
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
} 