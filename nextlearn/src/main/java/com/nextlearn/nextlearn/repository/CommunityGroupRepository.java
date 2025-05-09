package com.nextlearn.nextlearn.repository;

import com.nextlearn.nextlearn.model.CommunityGroup;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityGroupRepository extends MongoRepository<CommunityGroup, String> {
    List<CommunityGroup> findByOwnerId(String ownerId);
    List<CommunityGroup> findByMembersContaining(String userId);
} 