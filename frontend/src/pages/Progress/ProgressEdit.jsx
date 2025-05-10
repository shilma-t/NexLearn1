// src/pages/Progress/ProgressEdit.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProgressEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState(() => {
    const session = localStorage.getItem('skillhub_user_session');
    return session ? JSON.parse(session).email : '';
  });
  
  // Form states
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Course progress states
  const [courseTitle, setCourseTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [totalModules, setTotalModules] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);
  
  // Reading progress states
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);
  
  // Skill progress states
  const [skillName, setSkillName] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [totalHours, setTotalHours] = useState(0);
  const [hoursCompleted, setHoursCompleted] = useState(0);
  
  // Project progress states
  const [projectName, setProjectName] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [techStack, setTechStack] = useState('');
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  
  // Certification progress states
  const [certificationName, setCertificationName] = useState('');
  const [organization, setOrganization] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const [examTaken, setExamTaken] = useState(false);
  const [certified, setCertified] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState({
    userId: (() => {
      const session = localStorage.getItem('skillhub_user_session');
      return session ? JSON.parse(session).email : '';
    })(),
    examTaken: false,
    certified: false,
    examScore: 0,
    certificationName: '',
    certificationDate: '',
    notes: ''
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    const fetchProgressData = async () => {
      try {
        const response = await fetch(`http://localhost:9006/api/progress/${id}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch progress: ${response.status}`);
        }
        
        const progressData = await response.json();
        
        if (!progressData) {
          throw new Error('Progress update not found');
        }
        
        // Store original data for comparison or reset
        setOriginalData(progressData);
        
        // Set common fields
        setType(progressData.type);
        setTitle(progressData.title);
        setDescription(progressData.description);
        
        // Set type-specific fields
        switch (progressData.type) {
          case 'COURSE':
            setCourseTitle(progressData.courseProgress?.courseTitle || '');
            setPlatform(progressData.courseProgress?.platform || '');
            setTotalModules(progressData.courseProgress?.totalModules || 0);
            setCompletedModules(progressData.courseProgress?.completedModules || 0);
            break;
          case 'READING':
            setBookTitle(progressData.readingProgress?.bookTitle || '');
            setAuthor(progressData.readingProgress?.author || '');
            setTotalPages(progressData.readingProgress?.totalPages || 0);
            setPagesRead(progressData.readingProgress?.pagesRead || 0);
            break;
          case 'SKILL':
            setSkillName(progressData.skillProgress?.skillName || '');
            setLevel(progressData.skillProgress?.level || 'Beginner');
            setTotalHours(progressData.skillProgress?.totalHours || 0);
            setHoursCompleted(progressData.skillProgress?.hoursCompleted || 0);
            break;
          case 'PROJECT':
            setProjectName(progressData.projectProgress?.projectName || '');
            setGithubLink(progressData.projectProgress?.githubLink || '');
            setTechStack(progressData.projectProgress?.techStack || '');
            setTotalTasks(progressData.projectProgress?.totalTasks || 0);
            setCompletedTasks(progressData.projectProgress?.completedTasks || 0);
            break;
          case 'CERTIFICATION':
            setCertificationName(progressData.certificationProgress?.certificationName || '');
            setOrganization(progressData.certificationProgress?.organization || '');
            setEnrolled(progressData.certificationProgress?.enrolled || false);
            setExamTaken(progressData.certificationProgress?.examTaken || false);
            setCertified(progressData.certificationProgress?.certified || false);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [id, userId, navigate]);

  // Update progress calculation
  useEffect(() => {
    let newProgress = 0;
    switch (type) {
      case 'COURSE':
        if (totalModules > 0) {
          newProgress = Math.round((completedModules / totalModules) * 100);
        }
        break;
      case 'READING':
        if (totalPages > 0) {
          newProgress = Math.round((pagesRead / totalPages) * 100);
        }
        break;
      case 'SKILL':
        if (totalHours > 0) {
          newProgress = Math.round((hoursCompleted / totalHours) * 100);
        }
        break;
      case 'PROJECT':
        if (totalTasks > 0) {
          newProgress = Math.round((completedTasks / totalTasks) * 100);
        }
        break;
      case 'CERTIFICATION':
        newProgress = certified ? 100 : examTaken ? 66 : enrolled ? 33 : 0;
        break;
      default:
        newProgress = 0;
    }
    setProgress(newProgress);
  }, [
    type, 
    completedModules, totalModules, 
    pagesRead, totalPages, 
    hoursCompleted, totalHours, 
    completedTasks, totalTasks, 
    enrolled, examTaken, certified
  ]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Common validations
    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    // Type-specific validations
    switch (type) {
      case 'COURSE':
        if (!courseTitle.trim()) {
          newErrors.courseTitle = 'Course Title is required';
          isValid = false;
        }

        if (!platform.trim()) {
          newErrors.platform = 'Platform is required';
          isValid = false;
        }

        if (isNaN(totalModules) || totalModules <= 0) {
          newErrors.totalModules = 'Total Modules must be a positive number';
          isValid = false;
        }

        if (isNaN(completedModules) || completedModules < 0) {
          newErrors.completedModules = 'Completed Modules must be a non-negative number';
          isValid = false;
        } else if (Number(completedModules) > Number(totalModules)) {
          newErrors.completedModules = 'Completed Modules cannot exceed Total Modules';
          isValid = false;
        }
        break;

      case 'READING':
        if (!bookTitle.trim()) {
          newErrors.bookTitle = 'Book Title is required';
          isValid = false;
        }

        if (!author.trim()) {
          newErrors.author = 'Author is required';
          isValid = false;
        }

        if (isNaN(totalPages) || totalPages <= 0) {
          newErrors.totalPages = 'Total Pages must be a positive number';
          isValid = false;
        }

        if (isNaN(pagesRead) || pagesRead < 0) {
          newErrors.pagesRead = 'Pages Read must be a non-negative number';
          isValid = false;
        } else if (Number(pagesRead) > Number(totalPages)) {
          newErrors.pagesRead = 'Pages Read cannot exceed Total Pages';
          isValid = false;
        }
        break;

      case 'SKILL':
        if (!skillName.trim()) {
          newErrors.skillName = 'Skill Name is required';
          isValid = false;
        }

        if (!['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
          newErrors.level = 'Invalid Level';
          isValid = false;
        }

        if (isNaN(totalHours) || totalHours <= 0) {
          newErrors.totalHours = 'Total Hours must be a positive number';
          isValid = false;
        }

        if (isNaN(hoursCompleted) || hoursCompleted < 0) {
          newErrors.hoursCompleted = 'Hours Completed must be a non-negative number';
          isValid = false;
        } else if (Number(hoursCompleted) > Number(totalHours)) {
          newErrors.hoursCompleted = 'Hours Completed cannot exceed Total Hours';
          isValid = false;
        }
        break;

      case 'PROJECT':
        if (!projectName.trim()) {
          newErrors.projectName = 'Project Name is required';
          isValid = false;
        }

        if (!githubLink.trim()) {
          newErrors.githubLink = 'GitHub Link is required';
          isValid = false;
        }

        if (isNaN(totalTasks) || totalTasks <= 0) {
          newErrors.totalTasks = 'Total Tasks must be a positive number';
          isValid = false;
        }

        if (isNaN(completedTasks) || completedTasks < 0) {
          newErrors.completedTasks = 'Completed Tasks must be a non-negative number';
          isValid = false;
        } else if (Number(completedTasks) > Number(totalTasks)) {
          newErrors.completedTasks = 'Completed Tasks cannot exceed Total Tasks';
          isValid = false;
        }
        break;

      case 'CERTIFICATION':
        if (!certificationName.trim()) {
          newErrors.certificationName = 'Certification Name is required';
          isValid = false;
        }

        if (!organization.trim()) {
          newErrors.organization = 'Organization is required';
          isValid = false;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Run validation and stop if invalid
    const isValid = validateForm();
    if (!isValid) {
      console.log('Form validation failed');
      return;
    }

    const progressData = {
      id,
      userId,
      type,
      title,
      description,
    };

    // Add type-specific data
    switch (type) {
      case 'COURSE':
        progressData.courseProgress = {
          courseTitle,
          platform,
          totalModules: parseInt(totalModules),
          completedModules: parseInt(completedModules)
        };
        break;
      case 'READING':
        progressData.readingProgress = {
          bookTitle,
          author,
          totalPages: parseInt(totalPages),
          pagesRead: parseInt(pagesRead)
        };
        break;
      case 'SKILL':
        progressData.skillProgress = {
          skillName,
          level,
          totalHours: parseInt(totalHours),
          hoursCompleted: parseInt(hoursCompleted)
        };
        break;
      case 'PROJECT':
        progressData.projectProgress = {
          projectName,
          githubLink,
          techStack,
          totalTasks: parseInt(totalTasks),
          completedTasks: parseInt(completedTasks)
        };
        break;
      case 'CERTIFICATION':
        progressData.certificationProgress = {
          certificationName,
          organization,
          enrolled,
          examTaken,
          certified
        };
        break;
      default:
        break;
    }

    try {
      const response = await fetch(`http://localhost:9006/api/progress/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(progressData)
      });

      if (response.ok) {
        console.log('Progress update edited successfully!');
        navigate('/my-progress'); // Navigate to user progress page
      } else {
        const errorData = await response.json();
        console.error('Failed to update progress:', errorData);
        setError('Failed to update progress. Please try again.');
      }
    } catch (error) {
      console.error('There was an error updating the progress:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/my-progress');
  };

  const renderSpecificFields = () => {
    switch (type) {
      case 'COURSE':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="courseTitle" className="form-label">
                Course Title:
              </label>
              <input
                type="text"
                className={`form-control ${errors.courseTitle ? 'is-invalid' : ''}`}
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
              {errors.courseTitle && (
                <div className="invalid-feedback">{errors.courseTitle}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="platform" className="form-label">
                Platform:
              </label>
              <input
                type="text"
                className={`form-control ${errors.platform ? 'is-invalid' : ''}`}
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
              {errors.platform && (
                <div className="invalid-feedback">{errors.platform}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="totalModules" className="form-label">
                Total Modules:
              </label>
              <input
                type="number"
                className={`form-control ${errors.totalModules ? 'is-invalid' : ''}`}
                id="totalModules"
                value={totalModules}
                onChange={(e) => setTotalModules(e.target.value)}
              />
              {errors.totalModules && (
                <div className="invalid-feedback">{errors.totalModules}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="completedModules" className="form-label">
                Completed Modules:
              </label>
              <input
                type="number"
                className={`form-control ${errors.completedModules ? 'is-invalid' : ''}`}
                id="completedModules"
                value={completedModules}
                onChange={(e) => setCompletedModules(e.target.value)}
              />
              {errors.completedModules && (
                <div className="invalid-feedback">{errors.completedModules}</div>
              )}
            </div>
          </>
        );
      case 'READING':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="bookTitle" className="form-label">
                Book Title:
              </label>
              <input
                type="text"
                className={`form-control ${errors.bookTitle ? 'is-invalid' : ''}`}
                id="bookTitle"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
              />
              {errors.bookTitle && (
                <div className="invalid-feedback">{errors.bookTitle}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">
                Author:
              </label>
              <input
                type="text"
                className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              {errors.author && (
                <div className="invalid-feedback">{errors.author}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="totalPages" className="form-label">
                Total Pages:
              </label>
              <input
                type="number"
                className={`form-control ${errors.totalPages ? 'is-invalid' : ''}`}
                id="totalPages"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
              />
              {errors.totalPages && (
                <div className="invalid-feedback">{errors.totalPages}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="pagesRead" className="form-label">
                Pages Read:
              </label>
              <input
                type="number"
                className={`form-control ${errors.pagesRead ? 'is-invalid' : ''}`}
                id="pagesRead"
                value={pagesRead}
                onChange={(e) => setPagesRead(e.target.value)}
              />
              {errors.pagesRead && (
                <div className="invalid-feedback">{errors.pagesRead}</div>
              )}
            </div>
          </>
        );
      case 'SKILL':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="skillName" className="form-label">
                Skill Name:
              </label>
              <input
                type="text"
                className={`form-control ${errors.skillName ? 'is-invalid' : ''}`}
                id="skillName"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
              {errors.skillName && (
                <div className="invalid-feedback">{errors.skillName}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="level" className="form-label">
                Level:
              </label>
              <select
                className={`form-select ${errors.level ? 'is-invalid' : ''}`}
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.level && 
                <div className="invalid-feedback">{errors.level}</div>
              }
            </div>
            <div className="mb-3">
              <label htmlFor="totalHours" className="form-label">
                Total Hours:
              </label>
              <input
                type="number"
                className={`form-control ${errors.totalHours ? 'is-invalid' : ''}`}
                id="totalHours"
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
              />
              {errors.totalHours && (
                <div className="invalid-feedback">{errors.totalHours}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="hoursCompleted" className="form-label">
                Hours Completed:
              </label>
              <input
                type="number"
                className={`form-control ${errors.hoursCompleted ? 'is-invalid' : ''}`}
                id="hoursCompleted"
                value={hoursCompleted}
                onChange={(e) => setHoursCompleted(e.target.value)}
              />
              {errors.hoursCompleted && (
                <div className="invalid-feedback">{errors.hoursCompleted}</div>
              )}
            </div>
          </>
        );
      case 'PROJECT':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="projectName" className="form-label">
                Project Name:
              </label>
              <input
                type="text"
                className={`form-control ${errors.projectName ? 'is-invalid' : ''}`}
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              {errors.projectName && (
                <div className="invalid-feedback">{errors.projectName}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="githubLink" className="form-label">
                GitHub Link:
              </label>
              <input
                type="text"
                className={`form-control ${errors.githubLink ? 'is-invalid' : ''}`}
                id="githubLink"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />
              {errors.githubLink && (
                <div className="invalid-feedback">{errors.githubLink}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="techStack" className="form-label">
                Tech Stack:
              </label>
              <input
                type="text"
                className="form-control"
                id="techStack"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="totalTasks" className="form-label">
                Total Tasks:
              </label>
              <input
                type="number"
                className={`form-control ${errors.totalTasks ? 'is-invalid' : ''}`}
                id="totalTasks"
                value={totalTasks}
                onChange={(e) => setTotalTasks(e.target.value)}
              />
              {errors.totalTasks && (
                <div className="invalid-feedback">{errors.totalTasks}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="completedTasks" className="form-label">
                Completed Tasks:
              </label>
              <input
                type="number"
                className={`form-control ${errors.completedTasks ? 'is-invalid' : ''}`}
                id="completedTasks"
                value={completedTasks}
                onChange={(e) => setCompletedTasks(e.target.value)}
              />
              {errors.completedTasks && (
                <div className="invalid-feedback">{errors.completedTasks}</div>
              )}
            </div>
          </>
        );
      case 'CERTIFICATION':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="certificationName" className="form-label">
                Certification Name:
              </label>
              <input
                type="text"
                className={`form-control ${errors.certificationName ? 'is-invalid' : ''}`}
                id="certificationName"
                value={certificationName}
                onChange={(e) => setCertificationName(e.target.value)}
              />
              {errors.certificationName && (
                <div className="invalid-feedback">{errors.certificationName}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="organization" className="form-label">
                Organization:
              </label>
              <input
                type="text"
                className={`form-control ${errors.organization ? 'is-invalid' : ''}`}
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
              {errors.organization && (
                <div className="invalid-feedback">{errors.organization}</div>
              )}
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="enrolled"
                checked={enrolled}
                onChange={(e) => setEnrolled(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="enrolled">
                Enrolled
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="examTaken"
                checked={examTaken}
                onChange={(e) => setExamTaken(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="examTaken">
                Exam Taken
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="certified"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="certified">
                Certified
              </label>
            </div>
          </>
        );
      default:
        return null;
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
          <p className="mt-2">Loading progress data...</p>
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
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            Edit Progress Update
          </h2>
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type:
              </label>
              <input
                type="text"
                className="form-control"
                id="type"
                value={type}
                disabled
              />
              <small className="text-muted">Type cannot be changed.</small>
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title:
              </label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description:
              </label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            {renderSpecificFields()}
            
            {type !== 'CERTIFICATION' && (
              <div className="mb-3">
                <label htmlFor="progress" className="form-label">Progress:</label>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {progress}%
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                CANCEL
              </button>
              <button type="submit" className="btn btn-primary">
                SAVE CHANGES
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgressEdit;