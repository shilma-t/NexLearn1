// src/pages/Progress/UserProgress.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProgress.css'; 

const UserProgress = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState('user123'); // This would typically come from authentication
  const [filterType, setFilterType] = useState('ALL');
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const navigate = useNavigate();

  // Fetch progress updates for the specific user
  useEffect(() => {
    const fetchUserProgressUpdates = async () => {
      try {
        const response = await fetch(`http://localhost:9006/api/progress/user/${userId}`);
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

    fetchUserProgressUpdates();
  }, [userId]);

  // Filter updates based on selected type
  useEffect(() => {
    if (filterType === 'ALL') {
      setFilteredUpdates(progressUpdates);
    } else {
      const filtered = progressUpdates.filter(update => update.type === filterType);
      setFilteredUpdates(filtered);
    }
  }, [progressUpdates, filterType]);

  // Calculate percentage for progress bars
  const calculatePercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Handle edit button click
  const handleEdit = (id) => {
    navigate(`/edit-progress/${id}`);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`http://localhost:9006/api/progress/${deleteId}?userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete progress update');
      }
      
      // Remove the deleted update from state
      setProgressUpdates(prevUpdates => 
        prevUpdates.filter(update => update.id !== deleteId)
      );
      
      // Close modal
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting progress update:', error);
      setError('Failed to delete progress update. Please try again.');
    }
  };

  // Show delete confirmation modal
  const promptDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Get progress details based on update type
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
            <div className="progress mb-3">
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
            <div className="progress mb-3">
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
            <div className="progress mb-3">
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
            <p><span className="detail-label">GitHub Link:</span> <a href={update.projectProgress?.githubLink} target="_blank" rel="noopener noreferrer">{update.projectProgress?.githubLink}</a></p>
            <p><span className="detail-label">Tech Stack:</span> {update.projectProgress?.techStack}</p>
            <p><span className="detail-label">Completed Tasks:</span> {update.projectProgress?.completedTasks} / {update.projectProgress?.totalTasks}</p>
            <div className="progress mb-3">
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
            <p><span className="detail-label">Status:</span> 
              {update.certificationProgress?.certified ? 'Certified' : 
              update.certificationProgress?.examTaken ? 'Exam Taken' : 
              update.certificationProgress?.enrolled ? 'Enrolled' : 'Not Started'}
            </p>
          </>
        );
      default:
        return <p>No specific details available.</p>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your progress updates...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error.message || error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">My Progress Updates</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/create-progress')}
        >
          Add New Progress
        </button>
      </div>
      
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <label htmlFor="filterType" className="form-label">Filter by Type:</label>
          <select
            id="filterType"
            className="form-select"
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
      </div>

      {filteredUpdates.length === 0 && !loading ? (
        <div className="alert alert-info">
          No progress updates available for the selected type.
        </div>
      ) : (
        <div className="row">
          {filteredUpdates.map((update) => (
            <div key={update.id} className="col-md-6 mb-4">
              <div className="card progress-card h-100 shadow-sm border-0">
                <div className="card-header bg-transparent">
                  <h3 className="card-title update-title">{update.title}</h3>
                  <span className="badge bg-primary">{update.type}</span>
                </div>
                <div className="card-body">
                  <p className="card-text update-description">{update.description}</p>
                  <div className="progress-details">
                    {getProgressDetails(update)}
                  </div>
                  <p className="text-muted small">
                    <span className="detail-label">Created:</span> {new Date(update.createdAt).toLocaleString()}
                  </p>
                  <p className="text-muted small">
                    <span className="detail-label">Last Updated:</span> {new Date(update.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => handleEdit(update.id)}
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger"
                      onClick={() => promptDelete(update.id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDeleteModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this progress update?</p>
                  
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowDeleteModal(false)}></div>
        </>
      )}
    </div>
  );
};

export default UserProgress;