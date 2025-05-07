// src/pages/Progress/ProgressCreation.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ProgressCreation = () => {
  const [type, setType] = useState('COURSE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [totalModules, setTotalModules] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);
  const [skillName, setSkillName] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [totalHours, setTotalHours] = useState(0);
  const [hoursCompleted, setHoursCompleted] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [techStack, setTechStack] = useState('');
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [certificationName, setCertificationName] = useState('');
  const [organization, setOrganization] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const [examTaken, setExamTaken] = useState(false);
  const [certified, setCertified] = useState(false);
  const [userId, setUserId] = useState('user123');
  const [errors, setErrors] = useState({}); // State for validation errors
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  // useEffect to update progress
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
        newProgress = certified ? 100 : examTaken ? 50 : enrolled ? 25 : 0;
        break;
      default:
        newProgress = 0;
    }
    setProgress(newProgress);
  }, [completedModules, totalModules, pagesRead, totalPages, hoursCompleted, totalHours, completedTasks, totalTasks, type, enrolled, examTaken, certified]);


  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Common validations
    if (!title.trim()) {
      newErrors.title = 'Title is Required';
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
      return; // Stop submission if the form is invalid
    }

    const progressData = {
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
      const response = await fetch('http://localhost:9006/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });

      if (response.ok) {
        console.log('Progress update created successfully!');
        navigate('/all-progress'); // Navigate to AllProgress on success
      } else {
        const errorData = await response.json();
        console.error('Failed to create progress update:', errorData);
        // Optionally, set an error message to display to the user
      }
    } catch (error) {
      console.error('There was an error creating the progress update:', error);
      // Optionally, set an error message to display to the user
    }
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
                className="form-control"
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
              {errors.courseTitle && (
                <div className="text-danger">{errors.courseTitle}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="platform" className="form-label">
                Platform:
              </label>
              <input
                type="text"
                className="form-control"
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
              {errors.platform && (
                <div className="text-danger">{errors.platform}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="totalModules" className="form-label">
                Total Modules:
              </label>
              <input
                type="number"
                className="form-control"
                id="totalModules"
                value={totalModules}
                onChange={(e) => setTotalModules(e.target.value)}
              />
              {errors.totalModules && (
                <div className="text-danger">{errors.totalModules}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="completedModules" className="form-label">
                Completed Modules:
              </label>
              <input
                type="number"
                className="form-control"
                id="completedModules"
                value={completedModules}
                onChange={(e) => setCompletedModules(e.target.value)}
              />
              {errors.completedModules && (
                <div className="text-danger">{errors.completedModules}</div>
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
                className="form-control"
                id="bookTitle"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
              />
              {errors.bookTitle && (
                <div className="text-danger">{errors.bookTitle}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">
                Author:
              </label>
              <input
                type="text"
                className="form-control"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              {errors.author && (
                <div className="text-danger">{errors.author}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="totalPages" className="form-label">
                Total Pages:
              </label>
              <input
                type="number"
                className="form-control"
                id="totalPages"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
              />
              {errors.totalPages && (
                <div className="text-danger">{errors.totalPages}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="pagesRead" className="form-label">
                Pages Read:
              </label>
              <input
                type="number"
                className="form-control"
                id="pagesRead"
                value={pagesRead}
                onChange={(e) => setPagesRead(e.target.value)}
              />
              {errors.pagesRead && (
                <div className="text-danger">{errors.pagesRead}</div>
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
                className="form-control"
                id="skillName"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
              {errors.skillName && (
                <div className="text-danger">{errors.skillName}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="level" className="form-label">
                Level:
              </label>
              <select
                className="form-select"
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.level && <div className="text-danger">{errors.level}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="totalHours" className="form-label">
                Total Hours:
              </label>
              <input
                type="number"
                className="form-control"
                id="totalHours"
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
              />
              {errors.totalHours && (
                <div className="text-danger">{errors.totalHours}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="hoursCompleted" className="form-label">
                Hours Completed:
              </label>
              <input
                type="number"
                className="form-control"
                id="hoursCompleted"
                value={hoursCompleted}
                onChange={(e) => setHoursCompleted(e.target.value)}
              />
              {errors.hoursCompleted && (
                <div className="text-danger">{errors.hoursCompleted}</div>
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
                className="form-control"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              {errors.projectName && (
                <div className="text-danger">{errors.projectName}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="githubLink" className="form-label">
                GitHub Link:
              </label>
              <input
                type="text"
                className="form-control"
                id="githubLink"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />
              {errors.githubLink && (
                <div className="text-danger">{errors.githubLink}</div>
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
              {errors.techStack && (
                <div className="text-danger">{errors.techStack}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="totalTasks" className="form-label">
                Total Tasks:
              </label>
              <input
                type="number"
                className="form-control"
                id="totalTasks"
                value={totalTasks}
                onChange={(e) => setTotalTasks(e.target.value)}
              />
              {errors.totalTasks && (
                <div className="text-danger">{errors.totalTasks}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="completedTasks" className="form-label">
                Completed Tasks:
              </label>
              <input
                type="number"
                className="form-control"
                id="completedTasks"
                value={completedTasks}
                onChange={(e) => setCompletedTasks(e.target.value)}
              />
              {errors.completedTasks && (
                <div className="text-danger">{errors.completedTasks}</div>
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
                className="form-control"
                id="certificationName"
                value={certificationName}
                onChange={(e) => setCertificationName(e.target.value)}
              />
              {errors.certificationName && (
                <div className="text-danger">{errors.certificationName}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="organization" className="form-label">
                Organization:
              </label>
              <input
                type="text"
                className="form-control"
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
              {errors.organization && (
                <div className="text-danger">{errors.organization}</div>
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

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            Create Progress Update
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type:
              </label>
              <select
                className="form-select"
                id="type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setErrors({}); // Clear errors when changing type
                }}
              >
                <option value="COURSE">Course</option>
                <option value="READING">Reading</option>
                <option value="SKILL">Skill</option>
                <option value="PROJECT">Project</option>
                <option value="CERTIFICATION">Certification</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title:
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <div className="text-danger">{errors.title}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description:
              </label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              {errors.description && (
                <div className="text-danger">{errors.description}</div>
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

            <button type="submit" className="btn btn-primary w-100">
              CREATE PROGRESS
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgressCreation;
