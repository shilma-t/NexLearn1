package com.nextlearn.nextlearn.service;

import com.nextlearn.nextlearn.model.CommunityGroup;
import com.nextlearn.nextlearn.model.GroupMessage;
import com.nextlearn.nextlearn.repository.CommunityGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommunityGroupService {
    @Autowired
    private CommunityGroupRepository groupRepository;

    public CommunityGroup createGroup(CommunityGroup group) {
        group.setCreatedAt(new Date());
        group.setUpdatedAt(new Date());
        group.setId(UUID.randomUUID().toString());
        group.getMembers().add(group.getOwnerId()); // owner is a member
        return groupRepository.save(group);
    }

    public List<CommunityGroup> getGroupsForUser(String userId) {
        return groupRepository.findByMembersContaining(userId);
    }

    public Optional<CommunityGroup> getGroupById(String id) {
        return groupRepository.findById(id);
    }

    public CommunityGroup updateGroup(CommunityGroup group, String userId) {
        if (!group.getOwnerId().equals(userId)) {
            throw new RuntimeException("Only the owner can update the group");
        }
        group.setUpdatedAt(new Date());
        return groupRepository.save(group);
    }

    public void deleteGroup(String id, String userId) {
        CommunityGroup group = groupRepository.findById(id).orElseThrow();
        if (!group.getOwnerId().equals(userId)) {
            throw new RuntimeException("Only the owner can delete the group");
        }
        groupRepository.deleteById(id);
    }

    public CommunityGroup addMember(String groupId, String ownerId, String userId, String ownerName) {
        CommunityGroup group = groupRepository.findById(groupId).orElseThrow();
        if (!group.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Only the owner can add members");
        }
        if (!group.getMembers().contains(userId)) {
            group.getMembers().add(userId);
            if (!userId.equals(ownerId)) {
                group.getSystemMessages().add("You were added to the community by " + ownerName);
            }
            group.setUpdatedAt(new Date());
            return groupRepository.save(group);
        }
        return group;
    }

    public CommunityGroup removeMember(String groupId, String ownerId, String userId) {
        CommunityGroup group = groupRepository.findById(groupId).orElseThrow();
        if (!group.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Only the owner can remove members");
        }
        group.getMembers().remove(userId);
        group.setUpdatedAt(new Date());
        return groupRepository.save(group);
    }

    public CommunityGroup leaveGroup(String groupId, String userId) {
        CommunityGroup group = groupRepository.findById(groupId).orElseThrow();
        if (group.getOwnerId().equals(userId)) {
            throw new RuntimeException("Owner cannot leave the group");
        }
        group.getMembers().remove(userId);
        group.getSystemMessages().add(userId + " left the community.");
        group.setUpdatedAt(new Date());
        return groupRepository.save(group);
    }

    public CommunityGroup sendMessage(String groupId, String senderId, GroupMessage message) {
        CommunityGroup group = groupRepository.findById(groupId).orElseThrow();
        if (!group.getMembers().contains(senderId)) {
            throw new RuntimeException("Only members can send messages");
        }
        message.setId(UUID.randomUUID().toString());
        message.setTimestamp(new Date());
        group.getMessages().add(message);
        group.setUpdatedAt(new Date());
        return groupRepository.save(group);
    }
} 