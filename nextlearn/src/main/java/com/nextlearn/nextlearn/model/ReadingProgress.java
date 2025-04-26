package com.nextlearn.nextlearn.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadingProgress {
    private String bookTitle;
    private String author;
    private int totalPages;
    private int pagesRead;
}