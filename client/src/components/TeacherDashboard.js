import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [feedback, setFeedback] = useState('');
  const [question, setQuestion] = useState('');
  const [videoComments, setVideoComments] = useState([]);

  // Dummy comments data
  const dummyComments = [
    {
      id: 1,
      student: 'Kwame Mensah',
      type: 'question',
      content: 'Can you explain more about quadratic equations?',
      timestamp: '15:30',
      date: '2024-03-15',
      replies: [
        {
          id: 2,
          teacher: 'Kwesi Owusu',
          content: "I'll cover that in more detail in the next video. For now, remember that quadratic equations are in the form ax² + bx + c = 0.",
          date: '2024-03-15'
        }
      ]
    },
    {
      id: 3,
      student: 'Ama Osei',
      type: 'feedback',
      content: 'This explanation was very clear! The examples helped a lot.',
      timestamp: '20:15',
      date: '2024-03-14'
    }
  ];

  useEffect(() => {
    // For now, we'll use dummy data since we're not requiring authentication
    const dummyStudents = [
      {
        id: 1,
        name: 'Kwame Mensah',
        grade: '5th Grade',
        parent: 'Abena Mensah',
        progress: 'Good',
        analytics: {
          performance: {
            math: 85,
            english: 78,
            science: 92,
            socialStudies: 88,
            history: 75
          },
          trends: [
            { month: 'Jan', average: 82 },
            { month: 'Feb', average: 85 },
            { month: 'Mar', average: 88 },
            { month: 'Apr', average: 84 },
            { month: 'May', average: 86 }
          ],
          weakAreas: ['History', 'English'],
          strongAreas: ['Science', 'Math']
        }
      },
      {
        id: 2,
        name: 'Ama Osei',
        grade: '5th Grade',
        parent: 'Kofi Osei',
        progress: 'Excellent',
        analytics: {
          performance: {
            math: 95,
            english: 92,
            science: 88,
            socialStudies: 94,
            history: 90
          },
          trends: [
            { month: 'Jan', average: 90 },
            { month: 'Feb', average: 92 },
            { month: 'Mar', average: 91 },
            { month: 'Apr', average: 93 },
            { month: 'May', average: 92 }
          ],
          weakAreas: ['Science'],
          strongAreas: ['Math', 'English', 'History']
        }
      },
      {
        id: 3,
        name: 'Yaw Addo',
        grade: '5th Grade',
        parent: 'Efua Addo',
        progress: 'Needs Improvement',
        analytics: {
          performance: {
            math: 65,
            english: 72,
            science: 68,
            socialStudies: 75,
            history: 70
          },
          trends: [
            { month: 'Jan', average: 70 },
            { month: 'Feb', average: 68 },
            { month: 'Mar', average: 72 },
            { month: 'Apr', average: 69 },
            { month: 'May', average: 70 }
          ],
          weakAreas: ['Math', 'Science'],
          strongAreas: ['Social Studies']
        }
      },
      {
        id: 4,
        name: 'Akua Owusu',
        grade: '5th Grade',
        parent: 'Kwesi Owusu',
        progress: 'Good',
        analytics: {
          performance: {
            math: 82,
            english: 85,
            science: 80,
            socialStudies: 88,
            history: 83
          },
          trends: [
            { month: 'Jan', average: 80 },
            { month: 'Feb', average: 82 },
            { month: 'Mar', average: 84 },
            { month: 'Apr', average: 83 },
            { month: 'May', average: 84 }
          ],
          weakAreas: ['Science'],
          strongAreas: ['Social Studies', 'English']
        }
      },
      {
        id: 5,
        name: 'Kojo Asante',
        grade: '5th Grade',
        parent: 'Ama Asante',
        progress: 'Excellent',
        analytics: {
          performance: {
            math: 90,
            english: 88,
            science: 92,
            socialStudies: 85,
            history: 89
          },
          trends: [
            { month: 'Jan', average: 87 },
            { month: 'Feb', average: 89 },
            { month: 'Mar', average: 90 },
            { month: 'Apr', average: 88 },
            { month: 'May', average: 89 }
          ],
          weakAreas: ['Social Studies'],
          strongAreas: ['Science', 'Math']
        }
      }
    ];
    setStudents(dummyStudents);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      setVideoComments(dummyComments);
    }
  }, [selectedVideo]);

  // Dummy video library data
  const videoLibrary = {
    math: [
      {
        id: 1,
        title: 'Introduction to Algebra',
        description: 'Basic concepts of algebraic expressions and equations',
        duration: '15:30',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60',
        url: 'https://example.com/videos/algebra-intro.mp4',
        uploadDate: '2024-03-10',
        views: 245,
        category: 'Mathematics',
        teacher: 'Kwesi Owusu'
      },
      {
        id: 2,
        title: 'Geometry Basics',
        description: 'Understanding shapes, angles, and measurements',
        duration: '20:15',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60',
        url: 'https://example.com/videos/geometry-basics.mp4',
        uploadDate: '2024-03-08',
        views: 189,
        category: 'Mathematics',
        teacher: 'Kwesi Owusu'
      }
    ],
    science: [
      {
        id: 3,
        title: 'The Solar System',
        description: 'Exploring planets and space phenomena',
        duration: '18:45',
        thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&auto=format&fit=crop&q=60',
        url: 'https://example.com/videos/solar-system.mp4',
        uploadDate: '2024-03-12',
        views: 312,
        category: 'Science',
        teacher: 'Kofi Asante'
      },
      {
        id: 4,
        title: 'Basic Chemistry',
        description: 'Introduction to atoms and molecules',
        duration: '22:30',
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60',
        url: 'https://example.com/videos/chemistry-basics.mp4',
        uploadDate: '2024-03-05',
        views: 276,
        category: 'Science',
        teacher: 'Kofi Asante'
      }
    ],
    english: [
      {
        id: 5,
        title: 'Grammar Essentials',
        description: 'Understanding parts of speech and sentence structure',
        duration: '25:20',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60',
        url: 'https://example.com/videos/grammar-essentials.mp4',
        uploadDate: '2024-03-15',
        views: 198,
        category: 'English',
        teacher: 'Abena Mensah'
      },
      {
        id: 6,
        title: 'Creative Writing',
        description: 'Tips for developing writing skills',
        duration: '19:45',
        thumbnail: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=60',
        url: 'https://example.com/videos/creative-writing.mp4',
        uploadDate: '2024-03-14',
        views: 156,
        category: 'English',
        teacher: 'Abena Mensah'
      }
    ]
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleSubjectFilter = (subject) => {
    setSelectedSubject(subject);
  };

  const getFilteredVideos = () => {
    if (selectedSubject === 'all') {
      return Object.values(videoLibrary).flat();
    }
    return videoLibrary[selectedSubject] || [];
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      const newFeedback = {
        id: Date.now(),
        student: 'Current Student',
        type: 'feedback',
        content: feedback,
        timestamp: 'Current Time',
        date: new Date().toISOString().split('T')[0]
      };
      setVideoComments([...videoComments, newFeedback]);
      setFeedback('');
    }
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (question.trim()) {
      const newQuestion = {
        id: Date.now(),
        student: 'Current Student',
        type: 'question',
        content: question,
        timestamp: 'Current Time',
        date: new Date().toISOString().split('T')[0],
        replies: []
      };
      setVideoComments([...videoComments, newQuestion]);
      setQuestion('');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="dashboard-actions">
          <button className="action-button">
            Add Assignment
          </button>
          <button className="action-button">
            Upload Video
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="students-section">
          <h2>My Students</h2>
          <div className="students-grid">
            {students.map(student => (
              <div 
                key={student.id} 
                className={`student-card ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                onClick={() => handleStudentSelect(student)}
              >
                <h3>{student.name}</h3>
                <p>Grade: {student.grade}</p>
                <p>Parent: {student.parent}</p>
                <p>Progress: {student.progress}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedStudent && (
          <div className="analytics-section">
            <h2>Analytics for {selectedStudent.name}</h2>
            
            <div className="analytics-grid">
              <div className="analytics-card performance">
                <h3>Subject Performance</h3>
                <div className="subject-scores">
                  {Object.entries(selectedStudent.analytics.performance).map(([subject, score]) => (
                    <div key={subject} className="subject-score">
                      <span className="subject-name">{subject}</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ 
                            width: `${score}%`,
                            backgroundColor: score >= 90 ? '#28a745' : 
                                           score >= 80 ? '#17a2b8' :
                                           score >= 70 ? '#ffc107' : '#dc3545'
                          }}
                        ></div>
                      </div>
                      <span className="score-value">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analytics-card trends">
                <h3>Performance Trends</h3>
                <div className="trend-chart">
                  {selectedStudent.analytics.trends.map((trend, index) => (
                    <div key={index} className="trend-point">
                      <div 
                        className="trend-bar"
                        style={{ height: `${trend.average}%` }}
                      ></div>
                      <span className="trend-label">{trend.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analytics-card areas">
                <h3>Strong & Weak Areas</h3>
                <div className="areas-grid">
                  <div className="area-section">
                    <h4>Strong Areas</h4>
                    <ul>
                      {selectedStudent.analytics.strongAreas.map((area, index) => (
                        <li key={index} className="strong-area">{area}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="area-section">
                    <h4>Areas for Improvement</h4>
                    <ul>
                      {selectedStudent.analytics.weakAreas.map((area, index) => (
                        <li key={index} className="weak-area">{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="video-library-section">
          <div className="section-header">
            <h2>Video Library</h2>
            <div className="section-actions">
              <button className="action-button primary">
                <i className="fas fa-upload"></i> Upload Video
              </button>
              <button className="action-button secondary">
                <i className="fas fa-folder-plus"></i> Create Playlist
              </button>
            </div>
          </div>
          
          <div className="video-filters">
            <button 
              className={`filter-button ${selectedSubject === 'all' ? 'active' : ''}`}
              onClick={() => handleSubjectFilter('all')}
            >
              <i className="fas fa-th-large"></i> All Subjects
            </button>
            <button 
              className={`filter-button ${selectedSubject === 'math' ? 'active' : ''}`}
              onClick={() => handleSubjectFilter('math')}
            >
              <i className="fas fa-calculator"></i> Mathematics
            </button>
            <button 
              className={`filter-button ${selectedSubject === 'science' ? 'active' : ''}`}
              onClick={() => handleSubjectFilter('science')}
            >
              <i className="fas fa-flask"></i> Science
            </button>
            <button 
              className={`filter-button ${selectedSubject === 'english' ? 'active' : ''}`}
              onClick={() => handleSubjectFilter('english')}
            >
              <i className="fas fa-book"></i> English
            </button>
          </div>

          {selectedVideo ? (
            <div className="video-player-container">
              <div className="video-player-header">
                <div className="video-title-section">
                  <h3>{selectedVideo.title}</h3>
                  <div className="video-stats">
                    <span><i className="fas fa-eye"></i> {selectedVideo.views} views</span>
                    <span><i className="fas fa-calendar"></i> {selectedVideo.uploadDate}</span>
                  </div>
                </div>
                <button 
                  className="close-button"
                  onClick={() => setSelectedVideo(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="video-player">
                <video 
                  controls 
                  src={selectedVideo.url}
                  poster={selectedVideo.thumbnail}
                  className="video-element"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="video-details">
                <div className="video-description">
                  <h4>Description</h4>
                  <p>{selectedVideo.description}</p>
                </div>
                <div className="video-meta">
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>Duration: {selectedVideo.duration}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-tag"></i>
                    <span>Category: {selectedVideo.category}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-user"></i>
                    <span>Teacher: {selectedVideo.teacher}</span>
                  </div>
                </div>

                {/* Feedback and Q&A Section */}
                <div className="video-interaction-section">
                  <div className="interaction-tabs">
                    <button className="tab-button active">Comments & Questions</button>
                    <button className="tab-button">Resources</button>
                  </div>

                  <div className="interaction-forms">
                    <form onSubmit={handleSubmitQuestion} className="question-form">
                      <h4>Ask a Question</h4>
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question here..."
                        rows="3"
                      />
                      <button type="submit" className="submit-button">
                        <i className="fas fa-question-circle"></i> Submit Question
                      </button>
                    </form>

                    <form onSubmit={handleSubmitFeedback} className="feedback-form">
                      <h4>Share Feedback</h4>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your thoughts about this video..."
                        rows="3"
                      />
                      <button type="submit" className="submit-button">
                        <i className="fas fa-comment"></i> Submit Feedback
                      </button>
                    </form>
                  </div>

                  <div className="comments-section">
                    <h4>Comments & Questions</h4>
                    <div className="comments-list">
                      {videoComments.map(comment => (
                        <div key={comment.id} className={`comment-item ${comment.type}`}>
                          <div className="comment-header">
                            <span className="comment-author">{comment.student}</span>
                            <span className="comment-timestamp">{comment.timestamp}</span>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="replies-section">
                              {comment.replies.map(reply => (
                                <div key={reply.id} className="reply-item">
                                  <div className="reply-header">
                                    <span className="reply-author">{reply.teacher}</span>
                                    <span className="reply-date">{reply.date}</span>
                                  </div>
                                  <p className="reply-content">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="video-grid">
              {getFilteredVideos().map(video => (
                <div 
                  key={video.id} 
                  className="video-card"
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <span className="video-duration">
                      <i className="fas fa-clock"></i> {video.duration}
                    </span>
                    <div className="video-overlay">
                      <i className="fas fa-play"></i>
                    </div>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                    <div className="video-meta">
                      <div className="meta-item">
                        <i className="fas fa-eye"></i>
                        <span>{video.views} views</span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-calendar"></i>
                        <span>{video.uploadDate}</span>
                      </div>
                    </div>
                    <div className="video-actions">
                      <button className="action-icon">
                        <i className="fas fa-share"></i>
                      </button>
                      <button className="action-icon">
                        <i className="fas fa-bookmark"></i>
                      </button>
                      <button className="action-icon">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-date">Today</span>
              <p>New video submitted by Kwame Mensah</p>
            </div>
            <div className="activity-item">
              <span className="activity-date">Yesterday</span>
              <p>Feedback sent to Ama Osei</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard; 