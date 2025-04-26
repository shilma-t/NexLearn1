import React from "react";

export default function PostItem({ post }) {
  return (
    <div className="post">
      <div className="postTop">
        <span>
          <strong>User ID:</strong> {post.userId} -{" "}
          {new Date(post.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="postCenter">
        <span>{post.caption}</span>
        <div className="mediaGallery">
          {post.mediaUrls &&
            post.mediaUrls.map((url, idx) => (
              <div key={idx} className="mediaItem">
                {url.match(/\.mp4|\.webm|\.ogg/) ? (
                  <video controls width="100%">
                    <source src={url} />
                  </video>
                ) : (
                  <img className="postImg" src={url} alt="media" />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
