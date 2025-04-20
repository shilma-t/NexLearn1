// src/pages/Progress/AllProgress.jsx
import React, { useState, useEffect } from 'react';
import './AllProgress.css';

const AllProgress = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState('user123'); //  Replace with actual user ID

  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        const response = await fetch('http://localhost:9006/api/progress');
        if (!response.ok) {
          throw new Error(`Failed to fetch progress updates: ${response.status}`);
        }
        const data = await response.json();
        setProgressUpdates(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressUpdates();
  }, []);

  const handleLike = async (id) => {
    try {
      const response = await fetch(`http://localhost:9006/api/progress/${id}/like?userId=${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to like progress update');
      }
      // Update the local state to reflect the like
      setProgressUpdates(prevUpdates =>
        prevUpdates.map(update => {
          if (update.id === id) {
            const liked = update.likedBy.includes(userId);
            return {
              ...update,
              likedBy: liked
                ? update.likedBy.filter(uId => uId !== userId)
                : [...update.likedBy, userId],
            };
          }
          return update;
        })
      );
    } catch (error) {
      console.error('Error liking progress update:', error);
      setError('Failed to like progress update. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading-message">Loading progress updates...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error.message}</div>;
  }

  if (progressUpdates.length === 0) {
    return <div className="no-progress-message">No progress updates available.</div>;
  }

  const getProgressDetails = (update) => {
    switch (update.type) {
      case 'COURSE':
        return (
          <>
            <p><span className="detail-label">Course Title:</span> {update.courseProgress?.courseTitle}</p>
            <p><span className="detail-label">Platform:</span> {update.courseProgress?.platform}</p>
            <p><span className="detail-label">Completed Modules:</span> {update.courseProgress?.completedModules} / {update.courseProgress?.totalModules}</p>
          </>
        );
      case 'READING':
        return (
          <>
            <p><span className="detail-label">Book Title:</span> {update.readingProgress?.bookTitle}</p>
            <p><span className="detail-label">Author:</span> {update.readingProgress?.author}</p>
            <p><span className="detail-label">Pages Read:</span> {update.readingProgress?.pagesRead} / {update.readingProgress?.totalPages}</p>
          </>
        );
      case 'SKILL':
        return (
          <>
            <p><span className="detail-label">Skill Name:</span> {update.skillProgress?.skillName}</p>
            <p><span className="detail-label">Level:</span> {update.skillProgress?.level}</p>
            <p><span className="detail-label">Hours Completed:</span> {update.skillProgress?.hoursCompleted} / {update.skillProgress?.totalHours}</p>
          </>
        );
      case 'PROJECT':
        return (
          <>
            <p><span className="detail-label">Project Name:</span> {update.projectProgress?.projectName}</p>
            <p><span className="detail-label">GitHub Link:</span> {update.projectProgress?.githubLink}</p>
            <p><span className="detail-label">Tech Stack:</span> {update.projectProgress?.techStack}</p>
            <p><span className="detail-label">Completed Tasks:</span> {update.projectProgress?.completedTasks} / {update.projectProgress?.totalTasks}</p>
          </>
        );
      case 'CERTIFICATION':
        return (
          <>
            <p><span className="detail-label">Certification Name:</span> {update.certificationProgress?.certificationName}</p>
            <p><span className="detail-label">Organization:</span> {update.certificationProgress?.organization}</p>
            <p><span className="detail-label">Enrolled:</span> {update.certificationProgress?.enrolled ? 'Yes' : 'No'}</p>
            <p><span className="detail-label">Exam Taken:</span> {update.certificationProgress?.examTaken ? 'Yes' : 'No'}</p>
            <p><span className="detail-label">Certified:</span> {update.certificationProgress?.certified ? 'Yes' : 'No'}</p>
          </>
        );
      default:
        return <p>No specific details available.</p>;
    }
  };

  return (
    <div className="all-progress-container">
      <h2 className="page-title">All Progress Updates</h2>
      <div className="progress-feed">
        {progressUpdates.map((update) => (
          <div key={update.id} className="progress-card">
            <div className="card-header">
              <h3 className="update-title">{update.title}</h3>
              <p className="update-date">
                Posted: {new Date(update.createdAt).toLocaleString()}
              </p>
            </div>
            <p className="update-description">{update.description}</p>
            <p><span className="detail-label">Type:</span> {update.type}</p>
            {getProgressDetails(update)}
            <div className="like-section">
              <button
                className="like-button"
                onClick={() => handleLike(update.id)}
              >
                {update.likedBy.includes(userId) ? 'Unlike' : 'Like'}
              </button>
              <span className="like-count">
                {update.likedBy.length} {update.likedBy.length === 1 ? 'Like' : 'Likes'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProgress;
