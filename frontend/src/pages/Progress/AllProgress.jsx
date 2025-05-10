import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AllProgress.css'; 
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';

const AllProgress = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState(() => {
    const session = localStorage.getItem('skillhub_user_session');
    return session ? JSON.parse(session).email : '';
  });
  const [filterType, setFilterType] = useState('ALL');
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    const fetchProgressUpdates = async () => {
      try {
        const response = await fetch('http://localhost:9006/api/progress');
        if (!response.ok) {
          throw new Error(`Failed to fetch progress updates: ${response.status}`);
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProgressUpdates(sortedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressUpdates();
  }, [navigate]);

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
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percentage}%` }}
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {percentage}%
              </div>
            </div>
          </>
        );
      case 'READING':
        percentage = calculatePercentage(update.readingProgress?.pagesRead, update.readingProgress?.totalPages);
        return (
          <>
            <p><span className="detail-label">Book Title:</span> {update.readingProgress?.bookTitle}</p>
            <p><span className="detail-label">Author:</span> {update.readingProgress?.author}</p>
            <p><span className="detail-label">Pages Read:</span> {update.readingProgress?.pagesRead} / {update.readingProgress?.totalPages}</p>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percentage}%` }}
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {percentage}%
              </div>
            </div>
          </>
        );
      case 'SKILL':
        percentage = calculatePercentage(update.skillProgress?.hoursCompleted, update.skillProgress?.totalHours);
        return (
          <>
            <p><span className="detail-label">Skill Name:</span> {update.skillProgress?.skillName}</p>
            <p><span className="detail-label">Level:</span> {update.skillProgress?.level}</p>
            <p><span className="detail-label">Hours Completed:</span> {update.skillProgress?.hoursCompleted} / {update.skillProgress?.totalHours}</p>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percentage}%` }}
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {percentage}%
              </div>
            </div>
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
             <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percentage}%` }}
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {percentage}%
              </div>
            </div>
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      <Sidebar />
      <main style={{
        marginLeft: '260px',
        width: '100%',
        padding: '80px 32px 40px',
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
      }}>
        <h2 style={{ color: '#fff', fontWeight: 700, marginBottom: 32 }}>All Progress Updates</h2>
        <div className="filter-section" style={{ marginBottom: 24 }}>
          <label htmlFor="filterType" className="filter-label" style={{ color: '#fff', marginRight: 12 }}>Filter by Type:</label>
          <select
            id="filterType"
            className="form-select filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333', maxWidth: 200 }}
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
          <div className="no-progress-message" style={{ color: '#ccc', textAlign: 'center', marginTop: 32 }}>No progress updates available for the selected filter.</div>
        ) : (
          <div className="progress-feed">
            {filteredUpdates.map((update) => (
              <div key={update.id} className="card progress-card mb-4 shadow-sm" style={{ background: '#181818', border: '1px solid #333', borderRadius: 16 }}>
                <div className="card-body">
                  <h3 className="card-title update-title" style={{ color: '#fff' }}>{update.title}</h3>
                  <p className="text-muted update-date" style={{ color: '#aaa' }}>
                    Posted: {new Date(update.createdAt).toLocaleString()}
                  </p>
                  <p className="card-text update-description" style={{ color: '#ccc' }}>{update.description}</p>
                  <p style={{ color: '#fff' }}><span className="detail-label">Type:</span> {update.type}</p>
                  <div style={{ color: '#fff' }}>{getProgressDetails(update)}</div>
                  <p className="text-muted" style={{ color: '#aaa' }}><span className="detail-label">Last Updated:</span> {new Date(update.updatedAt).toLocaleString()}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                      className={`btn btn-sm ${update.likedBy.includes(userId) ? 'btn-danger' : 'btn-outline-primary'} like-button`}
                      onClick={() => handleLike(update.id)}
                      style={{ 
                        background: update.likedBy.includes(userId) ? '#dc3545' : 'transparent',
                        borderColor: update.likedBy.includes(userId) ? '#dc3545' : '#4b0076',
                        color: update.likedBy.includes(userId) ? '#fff' : '#4b0076'
                      }}
                    >
                      {update.likedBy.includes(userId) ? 'Unlike' : 'Like'}
                    </button>
                    <span className="text-muted like-count" style={{ color: '#aaa' }}>
                      {update.likedBy.length} {update.likedBy.length === 1 ? 'Like' : 'Likes'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllProgress;
