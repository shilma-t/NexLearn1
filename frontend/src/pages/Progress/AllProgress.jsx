// src/pages/Progress/AllProgress.jsx
import React, { useState, useEffect } from 'react';
import './AllProgress.css';

const AllProgress = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState('user123'); // Replace with actual user ID
  const [filterType, setFilterType] = useState('ALL');
  const [filteredUpdates, setFilteredUpdates] = useState([]);

  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        const response = await fetch('http://localhost:9006/api/progress');
        if (!response.ok) {
          throw new Error(`Failed to fetch progress updates: ${response.status}`);
        }
        const data = await response.json();
        // Sort updates by createdAt in descending order (latest first)
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProgressUpdates(sortedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressUpdates();
  }, []);

  useEffect(() => {
    if (filterType === 'ALL') {
      setFilteredUpdates(progressUpdates);
    } else {
      const filtered = progressUpdates.filter(update => update.type === filterType);
      setFilteredUpdates(filtered);
    }
  }, [progressUpdates, filterType]);

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

  const calculatePercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getProgressDetails = (update) => {
    let percentage = 0;
    switch (update.type) {
      case 'COURSE':
        percentage = calculatePercentage(update.courseProgress?.completedModules, update.courseProgress?.totalModules);
        return (
          <>
            <p><span className="detail-label">Course Title:</span> {update.courseProgress?.courseTitle}</p>
            <p><span className="detail-label">Platform:</span> {update.courseProgress?.platform}</p>
            <p><span className="detail-label">Completed Modules:</span> {update.courseProgress?.completedModules} / {update.courseProgress?.totalModules}</p>
            <p><span className="detail-label">Progress:</span> {percentage}%</p>
          </>
        );
      case 'READING':
        percentage = calculatePercentage(update.readingProgress?.pagesRead, update.readingProgress?.totalPages);
        return (
          <>
            <p><span className="detail-label">Book Title:</span> {update.readingProgress?.bookTitle}</p>
            <p><span className="detail-label">Author:</span> {update.readingProgress?.author}</p>
            <p><span className="detail-label">Pages Read:</span> {update.readingProgress?.pagesRead} / {update.readingProgress?.totalPages}</p>
            <p><span className="detail-label">Progress:</span> {percentage}%</p>
          </>
        );
      case 'SKILL':
        percentage = calculatePercentage(update.skillProgress?.hoursCompleted, update.skillProgress?.totalHours);
        return (
          <>
            <p><span className="detail-label">Skill Name:</span> {update.skillProgress?.skillName}</p>
            <p><span className="detail-label">Level:</span> {update.skillProgress?.level}</p>
            <p><span className="detail-label">Hours Completed:</span> {update.skillProgress?.hoursCompleted} / {update.skillProgress?.totalHours}</p>
            <p><span className="detail-label">Progress:</span> {percentage}%</p>
          </>
        );
      case 'PROJECT':
        percentage = calculatePercentage(update.projectProgress?.completedTasks, update.projectProgress?.totalTasks);
        return (
          <>
            <p><span className="detail-label">Project Name:</span> {update.projectProgress?.projectName}</p>
            <p><span className="detail-label">GitHub Link:</span> {update.projectProgress?.githubLink}</p>
            <p><span className="detail-label">Tech Stack:</span> {update.projectProgress?.techStack}</p>
            <p><span className="detail-label">Completed Tasks:</span> {update.projectProgress?.completedTasks} / {update.projectProgress?.totalTasks}</p>
            <p><span className="detail-label">Progress:</span> {percentage}%</p>
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

  if (loading) {
    return <div className="loading-message">Loading progress updates...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error.message}</div>;
  }

  return (
    <div className="all-progress-container">
      <h2 className="page-title">All Progress Updates</h2>
      <div className="filter-section">
        <label htmlFor="filterType" className="filter-label">Filter by Type:</label>
        <select
          id="filterType"
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="COURSE">Course</option>
          <option value="READING">Reading</option>
          <option value="SKILL">Skill</option>
          <option value="PROJECT">Project</option>
          <option value="CERTIFICATION">Certification</option>
        </select>
      </div>
      {filteredUpdates.length === 0 && !loading ? (
        <div className="no-progress-message">No progress updates available for the selected filter.</div>
      ) : (
        <div className="progress-feed">
          {filteredUpdates.map((update) => (
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
              <p><span className="detail-label">Last Updated:</span> {new Date(update.updatedAt).toLocaleString()}</p>
              <div className="like-section">
                <button
                  className={`like-button ${update.likedBy.includes(userId) ? 'liked' : ''}`}
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
      )}
    </div>
  );
};

export default AllProgress;