import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Close, ArrowBack, ArrowForward, FilterAlt } from '@mui/icons-material';
import './CreatePostModal.css';

const FILTERS = {
  none: 'None',
  grayscale: 'Grayscale',
  sepia: 'Sepia',
  blur: 'Blur',
  brightness: 'Brightness',
  contrast: 'Contrast',
  saturate: 'Saturate',
};

const CreatePostModal = ({ onClose, fetchPosts }) => {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [filterValue, setFilterValue] = useState(100);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const getUserInfo = () => {
    const sessionData = localStorage.getItem('skillhub_user_session');
    if (sessionData) {
      try {
        const userData = JSON.parse(sessionData);
        return {
          userId: userData.email,
          username: userData.name,
          profilePic: userData.picture
        };
      } catch (e) {
        console.error("Error parsing session:", e);
      }
    }
    return null;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilter = (imageUrl, filter, value) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply filter
      ctx.filter = `${filter}(${value}%)`;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  };

  useEffect(() => {
    if (previewUrl && selectedFilter !== 'none') {
      applyFilter(previewUrl, selectedFilter, filterValue);
    }
  }, [previewUrl, selectedFilter, filterValue]);

  const handleNext = () => {
    if (step === 1 && !selectedFile) {
      setError('Please select an image first');
      return;
    }
    setStep(step + 1);
    setError(null);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleShare = async () => {
    if (!caption.trim()) {
      setError('Please add a caption');
      return;
    }

    const userInfo = getUserInfo();
    if (!userInfo) {
      setError('Please login to create a post');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('userId', userInfo.userId);
      formData.append('username', userInfo.username);
      formData.append('profilePic', userInfo.profilePic);

      // If a filter is applied, get the filtered image from canvas
      if (selectedFilter !== 'none' && canvasRef.current) {
        const filteredImageBlob = await new Promise(resolve => {
          canvasRef.current.toBlob(resolve, 'image/jpeg', 0.9);
        });
        formData.append('file', filteredImageBlob, selectedFile.name);
      } else {
        formData.append('file', selectedFile);
      }

      const res = await axios.post('http://localhost:9006/api/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      if (res.data) {
        onClose();
        fetchPosts();
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data || 'Failed to create post. Please try again.');
    }
  };

  return (
    <div className="createPostModalOverlay">
      <div className="createPostModalContent">
        <div className="createPostHeader">
          {step > 1 && (
            <button className="backButton" onClick={handleBack}>
              <ArrowBack />
            </button>
          )}
          <h3>
            {step === 1 ? 'Create new post' :
             step === 2 ? 'Edit' :
             'Create new post'}
          </h3>
          {step === 3 && (
            <button 
              className="shareButton"
              onClick={handleShare}
              disabled={!caption.trim()}
            >
              Share
            </button>
          )}
          <button className="closeButton" onClick={onClose}>
            <Close />
          </button>
        </div>

        {error && (
          <div className="error-message" onClick={() => setError(null)}>
            {error}
          </div>
        )}

        <div className="createPostBody">
          {step === 1 && (
            <div className="uploadStep">
              <div className="uploadIcon">
                <img src="/images/upload.png" alt="Upload" />
              </div>
              <p>Drag photos and videos here</p>
              <button 
                className="selectButton"
                onClick={() => fileInputRef.current?.click()}
              >
                Select from computer
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {step === 2 && previewUrl && (
            <div className="filterStep">
              <div className="filterPreview">
                <img 
                  src={selectedFilter === 'none' ? previewUrl : canvasRef.current?.toDataURL()} 
                  alt="Preview" 
                  style={{
                    filter: selectedFilter !== 'none' ? `${selectedFilter}(${filterValue}%)` : 'none'
                  }}
                />
              </div>
              <div className="filterOptions">
                {Object.entries(FILTERS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`filterButton ${selectedFilter === key ? 'active' : ''}`}
                    onClick={() => setSelectedFilter(key)}
                  >
                    {label}
                  </button>
                ))}
                {selectedFilter !== 'none' && (
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="filterSlider"
                  />
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="captionStep">
              <div className="postPreview">
                <img 
                  src={selectedFilter === 'none' ? previewUrl : canvasRef.current?.toDataURL()} 
                  alt="Preview" 
                  style={{
                    filter: selectedFilter !== 'none' ? `${selectedFilter}(${filterValue}%)` : 'none'
                  }}
                />
              </div>
              <div className="captionInput">
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="createPostFooter">
            <button 
              className="nextButton"
              onClick={handleNext}
              disabled={step === 1 && !selectedFile}
            >
              Next
              <ArrowForward />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
