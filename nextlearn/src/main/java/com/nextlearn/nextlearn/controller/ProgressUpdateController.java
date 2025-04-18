package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.ProgressUpdate;
import com.nextlearn.nextlearn.service.ProgressUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@CrossOrigin
public class ProgressUpdateController {

    private final ProgressUpdateService service;

    @PostMapping
    public ResponseEntity<ProgressUpdate> create(@RequestBody ProgressUpdate progress) {
        return ResponseEntity.ok(service.createProgress(progress));
    }

    @GetMapping
    public ResponseEntity<List<ProgressUpdate>> getAll() {
        return ResponseEntity.ok(service.getAllProgress());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdate>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(service.getUserProgress(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody ProgressUpdate updated) {
        return service.updateProgress(id, updated)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id, @RequestParam String userId) {
        boolean deleted = service.deleteProgress(id, userId);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.status(403).build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> like(@PathVariable String id, @RequestParam String userId) {
        return service.likeProgress(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
