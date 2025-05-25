import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'video/mp4') {
      setSelectedFile(file);
      setVideoUrl(''); // Clear previous preview
      setMessage(''); // Clear previous messages
    } else {
      setMessage('Please select a valid MP4 video file.');
      setSelectedFile(null);
    }
  };

  const onFileUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first!');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData);
      setVideoUrl(`http://localhost:5001${response.data.url}`);
      setMessage('Upload successful!');
    } catch (error) {
      setMessage('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload Video</h2>
      <p>Upload an MP4 video file to share with students.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <input 
          type="file" 
          accept="video/mp4" 
          onChange={onFileChange}
          style={{ marginBottom: '1rem' }}
        />
        
        {selectedFile && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Selected file: {selectedFile.name}</p>
            <p>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        )}

        <button 
          className="btn" 
          onClick={onFileUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </div>

      {message && (
        <div className={message.includes('successful') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      {videoUrl && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Preview:</h3>
          <video 
            width="100%" 
            height="auto" 
            controls
            style={{ marginTop: '1rem', borderRadius: 'var(--border-radius)' }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p style={{ marginTop: '1rem', wordBreak: 'break-all' }}>
            Video URL: {videoUrl}
          </p>
        </div>
      )}
    </div>
  );
}

export default UploadForm; 