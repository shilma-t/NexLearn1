// src/pages/Progress/ProgressCreation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProgressCreation.css';

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

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    switch (type) {
      case 'COURSE':
        if (!courseTitle.trim()) newErrors.courseTitle = 'Course Title is required';
        if (!platform.trim()) newErrors.platform = 'Platform is required';
        if (isNaN(totalModules) || totalModules <= 0) newErrors.totalModules = 'Total Modules must be a positive number';
        if (isNaN(completedModules) || completedModules < 0 || completedModules > totalModules)
          newErrors.completedModules = 'Completed Modules must be a non-negative number less than or equal to Total Modules';
        break;
      case 'READING':
        if (!bookTitle.trim()) newErrors.bookTitle = 'Book Title is required';
        if (!author.trim()) newErrors.author = 'Author is required';
        if (isNaN(totalPages) || totalPages <= 0) newErrors.totalPages = 'Total Pages must be a positive number';
        if (isNaN(pagesRead) || pagesRead < 0 || pagesRead > totalPages)
          newErrors.pagesRead = 'Pages Read must be a non-negative number less than or equal to Total Pages';
        break;
      case 'SKILL':
        if (!skillName.trim()) newErrors.skillName = 'Skill Name is required';
        if (!['Beginner', 'Intermediate', 'Advanced'].includes(level)) newErrors.level = 'Invalid Level';
        if (isNaN(totalHours) || totalHours <= 0) newErrors.totalHours = 'Total Hours must be a positive number';
        if (isNaN(hoursCompleted) || hoursCompleted < 0 || hoursCompleted > totalHours)
          newErrors.hoursCompleted = 'Hours Completed must be a non-negative number less than or equal to Total Hours';
        break;
      case 'PROJECT':
        if (!projectName.trim()) newErrors.projectName = 'Project Name is required';
        if (!githubLink.trim()) newErrors.githubLink = 'GitHub Link is required';
        if (isNaN(totalTasks) || totalTasks <= 0) newErrors.totalTasks = 'Total Tasks must be a positive number';
        if (isNaN(completedTasks) || completedTasks < 0 || completedTasks > totalTasks)
          newErrors.completedTasks = 'Completed Tasks must be a non-negative number less than or equal to Total Tasks';
        break;
      case 'CERTIFICATION':
        if (!certificationName.trim()) newErrors.certificationName = 'Certification Name is required';
        if (!organization.trim()) newErrors.organization = 'Organization is required';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if the form is invalid
    }

    const progressData = {
      userId,
      type,
      title,
      description,
    };

    switch (type) {
      case 'COURSE':
        progressData.courseProgress = { courseTitle, platform, totalModules: parseInt(totalModules), completedModules: parseInt(completedModules) };
        break;
      case 'READING':
        progressData.readingProgress = { bookTitle, author, totalPages: parseInt(totalPages), pagesRead: parseInt(pagesRead) };
        break;
      case 'SKILL':
        progressData.skillProgress = { skillName, level, totalHours: parseInt(totalHours), hoursCompleted: parseInt(hoursCompleted) };
        break;
      case 'PROJECT':
        progressData.projectProgress = { projectName, githubLink, techStack, totalTasks: parseInt(totalTasks), completedTasks: parseInt(completedTasks) };
        break;
      case 'CERTIFICATION':
        progressData.certificationProgress = { certificationName, organization, enrolled, examTaken, certified };
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
        console.error('Failed to create progress update');
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
            <div className="form-full-width">
              <label htmlFor="courseTitle">Course Title:</label>
              <input type="text" id="courseTitle" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
              {errors.courseTitle && <p className="error-message">{errors.courseTitle}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="platform">Platform:</label>
              <input type="text" id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} />
              {errors.platform && <p className="error-message">{errors.platform}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="totalModules">Total Modules:</label>
              <input type="number" id="totalModules" value={totalModules} onChange={(e) => setTotalModules(e.target.value)} />
              {errors.totalModules && <p className="error-message">{errors.totalModules}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="completedModules">Completed Modules:</label>
              <input type="number" id="completedModules" value={completedModules} onChange={(e) => setCompletedModules(e.target.value)} />
              {errors.completedModules && <p className="error-message">{errors.completedModules}</p>}
            </div>
          </>
        );
      case 'READING':
        return (
          <>
            <div className="form-full-width">
              <label htmlFor="bookTitle">Book Title:</label>
              <input type="text" id="bookTitle" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
              {errors.bookTitle && <p className="error-message">{errors.bookTitle}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="author">Author:</label>
              <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
              {errors.author && <p className="error-message">{errors.author}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="totalPages">Total Pages:</label>
              <input type="number" id="totalPages" value={totalPages} onChange={(e) => setTotalPages(e.target.value)} />
              {errors.totalPages && <p className="error-message">{errors.totalPages}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="pagesRead">Pages Read:</label>
              <input type="number" id="pagesRead" value={pagesRead} onChange={(e) => setPagesRead(e.target.value)} />
              {errors.pagesRead && <p className="error-message">{errors.pagesRead}</p>}
            </div>
          </>
        );
      case 'SKILL':
        return (
          <>
            <div className="form-full-width">
              <label htmlFor="skillName">Skill Name:</label>
              <input type="text" id="skillName" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
              {errors.skillName && <p className="error-message">{errors.skillName}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="level">Level:</label>
              <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.level && <p className="error-message">{errors.level}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="totalHours">Total Hours:</label>
              <input type="number" id="totalHours" value={totalHours} onChange={(e) => setTotalHours(e.target.value)} />
              {errors.totalHours && <p className="error-message">{errors.totalHours}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="hoursCompleted">Hours Completed:</label>
              <input type="number" id="hoursCompleted" value={hoursCompleted} onChange={(e) => setHoursCompleted(e.target.value)} />
              {errors.hoursCompleted && <p className="error-message">{errors.hoursCompleted}</p>}
            </div>
          </>
        );
      case 'PROJECT':
        return (
          <>
            <div className="form-full-width">
              <label htmlFor="projectName">Project Name:</label>
              <input type="text" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              {errors.projectName && <p className="error-message">{errors.projectName}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="githubLink">GitHub Link:</label>
              <input type="text" id="githubLink" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
              {errors.githubLink && <p className="error-message">{errors.githubLink}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="techStack">Tech Stack:</label>
              <input type="text" id="techStack" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
              {errors.techStack && <p className="error-message">{errors.techStack}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="totalTasks">Total Tasks:</label>
              <input type="number" id="totalTasks" value={totalTasks} onChange={(e) => setTotalTasks(e.target.value)} />
              {errors.totalTasks && <p className="error-message">{errors.totalTasks}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="completedTasks">Completed Tasks:</label>
              <input type="number" id="completedTasks" value={completedTasks} onChange={(e) => setCompletedTasks(e.target.value)} />
              {errors.completedTasks && <p className="error-message">{errors.completedTasks}</p>}
            </div>
          </>
        );
      case 'CERTIFICATION':
        return (
          <>
            <div className="form-full-width">
              <label htmlFor="certificationName">Certification Name:</label>
              <input type="text" id="certificationName" value={certificationName} onChange={(e) => setCertificationName(e.target.value)} />
              {errors.certificationName && <p className="error-message">{errors.certificationName}</p>}
            </div>
            <div className="form-full-width">
              <label htmlFor="organization">Organization:</label>
              <input type="text" id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} />
              {errors.organization && <p className="error-message">{errors.organization}</p>}
            </div>
            <div className="checkbox-container form-full-width">
              <label htmlFor="enrolled">Enrolled:</label>
              <input type="checkbox" id="enrolled" checked={enrolled} onChange={(e) => setEnrolled(e.target.checked)} />
            </div>
            <div className="checkbox-container form-full-width">
              <label htmlFor="examTaken">Exam Taken:</label>
              <input type="checkbox" id="examTaken" checked={examTaken} onChange={(e) => setExamTaken(e.target.checked)} />
            </div>
            <div className="checkbox-container form-full-width">
              <label htmlFor="certified">Certified:</label>
              <input type="checkbox" id="certified" checked={certified} onChange={(e) => setCertified(e.target.checked)} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="progress-creation-container">
        <h2 className="form-title">Create Progress Update</h2>
        <form onSubmit={handleSubmit} className="centered-form">
          <div className="form-full-width">
            <label htmlFor="type">Type:</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="COURSE">Course</option>
              <option value="READING">Reading</option>
              <option value="SKILL">Skill</option>
              <option value="PROJECT">Project</option>
              <option value="CERTIFICATION">Certification</option>
            </select>
          </div>
          <div className="form-full-width">
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>
          <div className="form-full-width">
            <label htmlFor="description">Description:</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            {errors.description && <p className="error-message">{errors.description}</p>}
          </div>

          {renderSpecificFields()}

          <button type="submit" className="form-full-width">CREATE PROGRESS</button>
        </form>
      </div>
    </div>
  );
};

export default ProgressCreation;
