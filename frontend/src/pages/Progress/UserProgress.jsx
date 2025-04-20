import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './UserProgress.css'; // Import CSS

const API_BASE_URL = 'http://localhost:9006/api/progress'; // Adjust if your backend URL is different

const UserProgress = () => {
    const [progressUpdates, setProgressUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Assume you have a way to get the current user's ID
    const userId = 'user123'; // Replace with actual user ID retrieval

    useEffect(() => {
        const fetchUserProgress = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
                setProgressUpdates(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user progress:', error);
                setError('Failed to fetch progress updates.');
                setLoading(false);
            }
        };

        fetchUserProgress();
    }, [userId]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this progress update?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}?userId=${userId}`);
                setProgressUpdates(progressUpdates.filter(progress => progress.id !== id));
            } catch (error) {
                console.error('Error deleting progress:', error);
                alert('Failed to delete progress update.');
            }
        }
    };

    if (loading) {
        return <div>Loading progress updates...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="user-progress-container">
            <h2>Your Progress Updates</h2>
            {progressUpdates.length === 0 ? (
                <p>No progress updates yet.</p>
            ) : (
                <ul className="progress-list">
                    {progressUpdates.map(progress => (
                        <li key={progress.id} className="progress-item">
                            <h3>{progress.title}</h3>
                            <p>Type: {progress.type}</p>
                            <p>Progress: {progress.progressPercentage.toFixed(2)}%</p>
                            <div className="progress-actions">
                                <Link to={`/update-progress/${progress.id}`} className="update-button">Update</Link>
                                <button onClick={() => handleDelete(progress.id)} className="delete-button">Delete</button>
                            </div>
                            {progress.type === 'COURSE' && progress.courseProgress && (
                                <div className="progress-details">
                                    <p>Course: {progress.courseProgress.courseTitle}</p>
                                    <p>Platform: {progress.courseProgress.platform}</p>
                                    <p>Completed Modules: {progress.courseProgress.completedModules} / {progress.courseProgress.totalModules}</p>
                                </div>
                            )}
                            {progress.type === 'READING' && progress.readingProgress && (
                                <div className="progress-details">
                                    <p>Book: {progress.readingProgress.bookTitle}</p>
                                    <p>Author: {progress.readingProgress.author}</p>
                                    <p>Pages Read: {progress.readingProgress.pagesRead} / {progress.readingProgress.totalPages}</p>
                                </div>
                            )}
                            {progress.type === 'SKILL' && progress.skillProgress && (
                                <div className="progress-details">
                                    <p>Skill: {progress.skillProgress.skillName}</p>
                                    <p>Level: {progress.skillProgress.level}</p>
                                    <p>Hours Completed: {progress.skillProgress.hoursCompleted} / {progress.skillProgress.totalHours}</p>
                                </div>
                            )}
                            {progress.type === 'PROJECT' && progress.projectProgress && (
                                <div className="progress-details">
                                    <p>Project: {progress.projectProgress.projectName}</p>
                                    <p>Tech Stack: {progress.projectProgress.techStack}</p>
                                    <p>Completed Tasks: {progress.projectProgress.completedTasks} / {progress.projectProgress.totalTasks}</p>
                                </div>
                            )}
                            {progress.type === 'CERTIFICATION' && progress.certificationProgress && (
                                <div className="progress-details">
                                    <p>Certification: {progress.certificationProgress.certificationName}</p>
                                    <p>Organization: {progress.certificationProgress.organization}</p>
                                    <p>Enrolled: {progress.certificationProgress.enrolled ? 'Yes' : 'No'}</p>
                                    <p>Exam Taken: {progress.certificationProgress.examTaken ? 'Yes' : 'No'}</p>
                                    <p>Certified: {progress.certificationProgress.certified ? 'Yes' : 'No'}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserProgress;