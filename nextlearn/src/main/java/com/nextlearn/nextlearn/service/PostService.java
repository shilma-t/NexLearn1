package com.nextlearn.nextlearn.service;

import com.nextlearn.nextlearn.model.Post;
import com.nextlearn.nextlearn.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public Post updatePost(String id, Post postDetails) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setCaption(postDetails.getCaption());
            post.setMediaUrls(postDetails.getMediaUrls());
            post.setTimestamp(postDetails.getTimestamp());
            return postRepository.save(post);
        }
        return null;
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }
}
