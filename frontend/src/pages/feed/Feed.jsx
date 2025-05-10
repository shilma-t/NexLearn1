                <div className="post-header">
                  <div className="post-user-info">
                    <img
                      src={post.userProfileImage || defaultProfileImage}
                      alt="Profile"
                      className="post-profile-image"
                    />
                    <div className="post-user-details">
                      <span className="post-username" style={{ color: 'white' }}>John Doe</span>
                      <span className="post-timestamp">{formatTimestamp(post.createdAt)}</span>
                    </div>
                  </div>
                  {post.userId === userData?.email && (
                    <div className="post-actions">
                      <button
                        className="post-action-button"
                        onClick={() => handleEditPost(post)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="post-action-button"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div> 