package com.nextlearn.nextlearn.controller;

import com.nextlearn.nextlearn.model.CommunityGroup;
import com.nextlearn.nextlearn.model.GroupMessage;
import com.nextlearn.nextlearn.service.CommunityGroupService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/api/groups")
public class CommunityGroupController {
    private final CommunityGroupService groupService;

    @PostMapping
    public ResponseEntity<CommunityGroup> createGroup(@RequestBody CommunityGroup group) {
        return ResponseEntity.ok(groupService.createGroup(group));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CommunityGroup>> getGroupsForUser(@PathVariable String userId) {
        return ResponseEntity.ok(groupService.getGroupsForUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityGroup> getGroupById(@PathVariable String id) {
        Optional<CommunityGroup> group = groupService.getGroupById(id);
        return group.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<CommunityGroup> updateGroup(@RequestBody CommunityGroup group, @RequestParam String userId) {
        return ResponseEntity.ok(groupService.updateGroup(group, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String id, @RequestParam String userId) {
        groupService.deleteGroup(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{groupId}/add/{userId}")
    public ResponseEntity<CommunityGroup> addMember(@PathVariable String groupId, @RequestParam String ownerId, @PathVariable String userId, @RequestParam String ownerName) {
        return ResponseEntity.ok(groupService.addMember(groupId, ownerId, userId, ownerName));
    }

    @PostMapping("/{groupId}/remove/{userId}")
    public ResponseEntity<CommunityGroup> removeMember(@PathVariable String groupId, @RequestParam String ownerId, @PathVariable String userId) {
        return ResponseEntity.ok(groupService.removeMember(groupId, ownerId, userId));
    }

    @PostMapping("/{groupId}/leave")
    public ResponseEntity<CommunityGroup> leaveGroup(@PathVariable String groupId, @RequestParam String userId) {
        return ResponseEntity.ok(groupService.leaveGroup(groupId, userId));
    }

    @PostMapping("/{groupId}/message")
    public ResponseEntity<CommunityGroup> sendMessage(@PathVariable String groupId, @RequestParam String senderId, @RequestBody GroupMessage message) {
        return ResponseEntity.ok(groupService.sendMessage(groupId, senderId, message));
    }
} 