package com.nextlearn.nextlearn.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;
    private String userId;
    private String username;
    private String profilePic;
    private String postType;
    private String title;
    private String description;
    private String image;
    private int visibilityCount;
    private String caption;
    private List<String> mediaUrls;
    private LocalDateTime timestamp;
    private Set<String> likedBy = new HashSet<>();
    private int commentsCount = 0;

    public Post() {
        this.timestamp = LocalDateTime.now();
    }

    public Post(String userId, String username, String profilePic, String postType, String title, String description, String image, int visibilityCount, String caption, List<String> mediaUrls) {
        this.userId = userId;
        this.username = username;
        this.profilePic = profilePic;
        this.postType = postType;
        this.title = title;
        this.description = description;
        this.image = image;
        this.visibilityCount = visibilityCount;
        this.caption = caption;
        this.mediaUrls = mediaUrls;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }

    public String getPostType() { return postType; }
    public void setPostType(String postType) { this.postType = postType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public int getVisibilityCount() { return visibilityCount; }
    public void setVisibilityCount(int visibilityCount) { this.visibilityCount = visibilityCount; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }

    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Set<String> getLikedBy() { return likedBy; }
    public void setLikedBy(Set<String> likedBy) { this.likedBy = likedBy; }

    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }

    public int getLikesCount() { return likedBy.size(); }
}
