import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [grades, setGrades] = useState({
    Mathematics: {
      assignments: [
        { title: 'Algebra Quiz', score: 85, total: 100, date: '2024-02-15' },
        { title: 'Geometry Test', score: 92, total: 100, date: '2024-02-20' }
      ],
      exams: [
        { title: 'Midterm Exam', score: 88, total: 100, date: '2024-02-10' }
      ],
      overall: 88
    },
    Science: {
      assignments: [
        { title: 'Lab Report', score: 90, total: 100, date: '2024-02-18' },
        { title: 'Chemistry Quiz', score: 85, total: 100, date: '2024-02-22' }
      ],
      exams: [
        { title: 'Midterm Exam', score: 92, total: 100, date: '2024-02-12' }
      ],
      overall: 89
    },
    English: {
      assignments: [
        { title: 'Essay Writing', score: 88, total: 100, date: '2024-02-16' },
        { title: 'Grammar Test', score: 95, total: 100, date: '2024-02-21' }
      ],
      exams: [
        { title: 'Midterm Exam', score: 90, total: 100, date: '2024-02-14' }
      ],
      overall: 91
    }
  });

  // Add new state variables for materials section
  const [searchQuery, setSearchQuery] = useState('');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [favorites, setFavorites] = useState([]);
  const [recentViews, setRecentViews] = useState([]);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Add filter options
  const materialFilters = [
    { value: 'all', label: 'All Materials' },
    { value: 'notes', label: 'Notes' },
    { value: 'practice', label: 'Practice' },
    { value: 'lab', label: 'Lab' },
    { value: 'guide', label: 'Guides' }
  ];

  // Add sorting options
  const sortOptions = [
    { value: 'date', label: 'Date Uploaded' },
    { value: 'name', label: 'Name' },
    { value: 'category', label: 'Category' }
  ];

  // Update the courses data to include syllabus and more detailed study materials
  const courses = [
    {
      id: 1,
      subject: 'Mathematics',
      teacher: 'Kwesi Owusu',
      progress: 75,
      nextClass: '2024-03-20 09:00',
      syllabus: {
        title: 'Mathematics Syllabus 2024',
        topics: [
          'Algebra and Functions',
          'Geometry and Trigonometry',
          'Calculus and Analysis',
          'Statistics and Probability'
        ],
        objectives: [
          'Develop mathematical thinking and problem-solving skills',
          'Understand core mathematical concepts and their applications',
          'Master essential mathematical techniques and methods'
        ],
        assessment: {
          assignments: '30%',
          quizzes: '20%',
          midterm: '20%',
          final: '30%'
        }
      },
      assignments: [
        {
          id: 1,
          title: 'Algebra Practice',
          dueDate: '2024-03-22',
          status: 'Pending',
          grade: null
        },
        {
          id: 2,
          title: 'Geometry Quiz',
          dueDate: '2024-03-25',
          status: 'Not Started',
          grade: null
        }
      ],
      grades: {
        assignments: 85,
        quizzes: 78,
        projects: 92,
        overall: 85
      },
      attendance: {
        present: 18,
        absent: 2,
        late: 1
      },
      studyMaterials: [
        {
          id: 1,
          title: 'Algebra Formulas',
          type: 'pdf',
          category: 'Notes',
          description: 'Comprehensive collection of algebraic formulas and equations',
          url: '#',
          uploadDate: '2024-02-15'
        },
        {
          id: 2,
          title: 'Geometry Notes',
          type: 'pdf',
          category: 'Notes',
          description: 'Detailed notes on geometric concepts and theorems',
          url: '#',
          uploadDate: '2024-02-18'
        },
        {
          id: 3,
          title: 'Practice Problems Set 1',
          type: 'pdf',
          category: 'Practice',
          description: 'Collection of practice problems with solutions',
          url: '#',
          uploadDate: '2024-02-20'
        }
      ]
    },
    {
      id: 2,
      subject: 'Science',
      teacher: 'Kofi Asante',
      progress: 85,
      nextClass: '2024-03-21 10:30',
      syllabus: {
        title: 'Science Syllabus 2024',
        topics: [
          'Physics Fundamentals',
          'Chemistry Basics',
          'Biology Essentials',
          'Environmental Science'
        ],
        objectives: [
          'Understand scientific principles and their applications',
          'Develop laboratory skills and scientific inquiry',
          'Apply scientific knowledge to real-world problems'
        ],
        assessment: {
          labReports: '25%',
          quizzes: '20%',
          projects: '25%',
          final: '30%'
        }
      },
      assignments: [
        {
          id: 3,
          title: 'Solar System Project',
          dueDate: '2024-03-28',
          status: 'In Progress'
        }
      ],
      studyMaterials: [
        {
          id: 4,
          title: 'Physics Lab Manual',
          type: 'pdf',
          category: 'Lab',
          description: 'Complete guide for physics laboratory experiments',
          url: '#',
          uploadDate: '2024-02-16'
        },
        {
          id: 5,
          title: 'Chemistry Notes',
          type: 'pdf',
          category: 'Notes',
          description: 'Comprehensive chemistry study materials',
          url: '#',
          uploadDate: '2024-02-19'
        }
      ]
    },
    {
      id: 3,
      subject: 'English',
      teacher: 'Abena Mensah',
      progress: 90,
      nextClass: '2024-03-22 11:45',
      syllabus: {
        title: 'English Syllabus 2024',
        topics: [
          'Literature Analysis',
          'Grammar and Composition',
          'Creative Writing',
          'Communication Skills'
        ],
        objectives: [
          'Develop advanced reading and writing skills',
          'Master English grammar and composition',
          'Enhance communication and presentation abilities'
        ],
        assessment: {
          essays: '30%',
          presentations: '20%',
          participation: '20%',
          final: '30%'
        }
      },
      assignments: [
        {
          id: 4,
          title: 'Essay Writing',
          dueDate: '2024-03-24',
          status: 'Completed'
        }
      ],
      studyMaterials: [
        {
          id: 6,
          title: 'Grammar Guide',
          type: 'pdf',
          category: 'Notes',
          description: 'Complete guide to English grammar rules',
          url: '#',
          uploadDate: '2024-02-17'
        },
        {
          id: 7,
          title: 'Essay Writing Tips',
          type: 'pdf',
          category: 'Guide',
          description: 'Tips and techniques for effective essay writing',
          url: '#',
          uploadDate: '2024-02-21'
        }
      ]
    }
  ];

  // Video library data (similar to TeacherDashboard)
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
      // ... more math videos ...
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
      // ... more science videos ...
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
      // ... more english videos ...
    ]
  };

  // Dummy data for calendar events
  const calendarEvents = [
    {
      id: 1,
      title: 'Mathematics Class',
      date: '2024-03-20',
      time: '09:00',
      type: 'class'
    },
    {
      id: 2,
      title: 'Science Quiz',
      date: '2024-03-21',
      time: '10:30',
      type: 'quiz'
    },
    {
      id: 3,
      title: 'Essay Submission',
      date: '2024-03-24',
      time: '23:59',
      type: 'assignment'
    }
  ];

  // Dummy data for performance analytics
  const performanceAnalytics = {
    overallProgress: 83,
    subjectPerformance: {
      Mathematics: 85,
      Science: 88,
      English: 76
    },
    attendanceRate: 90,
    assignmentCompletion: 85,
    quizAverage: 82
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

  const renderGradesContent = () => (
    <div className="grades-section">
      <div className="grades-overview">
        <h2>Academic Performance</h2>
        <div className="grades-grid">
          {Object.entries(grades).map(([subject, data]) => (
            <div key={subject} className="grade-card">
              <h3>{subject}</h3>
              <div className="grade-overall">
                <div className="grade-circle">
                  <span>{data.overall}%</span>
                </div>
              </div>
              <div className="grade-details">
                <div className="grade-category">
                  <h4>Assignments</h4>
                  {data.assignments.map((assignment, index) => (
                    <div key={index} className="grade-item">
                      <span className="grade-title">{assignment.title}</span>
                      <span className="grade-score">{assignment.score}/{assignment.total}</span>
                      <span className="grade-date">{assignment.date}</span>
                    </div>
                  ))}
                </div>
                <div className="grade-category">
                  <h4>Exams</h4>
                  {data.exams.map((exam, index) => (
                    <div key={index} className="grade-item">
                      <span className="grade-title">{exam.title}</span>
                      <span className="grade-score">{exam.score}/{exam.total}</span>
                      <span className="grade-date">{exam.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="courses-section">
              <h2>My Courses</h2>
              <div className="courses-grid">
                {courses.map(course => (
                  <div key={course.id} className="course-card">
                    <h3>{course.subject}</h3>
                    <p>Teacher: {course.teacher}</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p>Progress: {course.progress}%</p>
                    <p>Next Class: {course.nextClass}</p>
                    <div className="assignments-preview">
                      <h4>Recent Assignments</h4>
                      <ul>
                        {course.assignments.map(assignment => (
                          <li key={assignment.id} className={`assignment-item ${assignment.status.toLowerCase()}`}>
                            {assignment.title} - {assignment.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-overview">
              <h2>Performance Overview</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Overall Progress</h3>
                  <div className="progress-circle">
                    {performanceAnalytics.overallProgress}%
                  </div>
                </div>
                <div className="analytics-card">
                  <h3>Attendance Rate</h3>
                  <div className="progress-circle">
                    {performanceAnalytics.attendanceRate}%
                  </div>
                </div>
                <div className="analytics-card">
                  <h3>Assignment Completion</h3>
                  <div className="progress-circle">
                    {performanceAnalytics.assignmentCompletion}%
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'videos':
        return (
          <div className="video-library-section">
            <div className="section-header">
              <h2>Video Library</h2>
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'grades':
        return renderGradesContent();

      case 'calendar':
        return (
          <div className="calendar-section">
            <h2>Upcoming Events</h2>
            <div className="calendar-grid">
              {calendarEvents.map(event => (
                <div key={event.id} className={`calendar-event ${event.type}`}>
                  <div className="event-date">
                    <span className="date">{event.date}</span>
                    <span className="time">{event.time}</span>
                  </div>
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <span className="event-type">{event.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'materials':
        return renderStudyMaterialsContent();

      default:
        return null;
    }
  };

  const renderStudyMaterialsContent = () => {
    // Filter and sort materials
    const filteredMaterials = courses.map(course => ({
      ...course,
      studyMaterials: course.studyMaterials
        .filter(material => {
          const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              material.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter = materialFilter === 'all' || material.category.toLowerCase() === materialFilter;
          return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'date':
              return new Date(b.uploadDate) - new Date(a.uploadDate);
            case 'name':
              return a.title.localeCompare(b.title);
            case 'category':
              return a.category.localeCompare(b.category);
            default:
              return 0;
          }
        })
    }));

    return (
      <div className="materials-section">
        <div className="materials-header">
          <h2>Study Materials</h2>
          <div className="materials-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-sort-controls">
              <select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                className="filter-select"
              >
                {materialFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by: {option.label}
                  </option>
                ))}
              </select>
              <div className="view-toggle">
                <button
                  className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Views Section */}
        {recentViews.length > 0 && (
          <div className="recent-views-section">
            <h3>Recently Viewed</h3>
            <div className="recent-views-list">
              {recentViews.map(material => (
                <div key={material.id} className="recent-view-item" onClick={() => handlePreview(material)}>
                  <i className={`fas fa-file-${material.type}`}></i>
                  <span>{material.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`materials-grid ${viewMode}`}>
          {filteredMaterials.map(course => (
            <div key={course.id} className="materials-card">
              <div className="course-header">
                <h3>{course.subject}</h3>
                <span className="course-teacher">Teacher: {course.teacher}</span>
              </div>
              
              {/* Syllabus Section */}
              <div className="syllabus-section">
                <div className="syllabus-header">
                  <div className="syllabus-title">
                    <h4>Syllabus</h4>
                    <h5>{course.syllabus.title}</h5>
                  </div>
                  <button className="download-button">
                    <i className="fas fa-download"></i> Download Syllabus
                  </button>
                </div>
                
                <div className="syllabus-details">
                  <div className="syllabus-section">
                    <h6>Topics</h6>
                    <ul>
                      {course.syllabus.topics.map((topic, index) => (
                        <li key={index}>
                          <i className="fas fa-check-circle"></i>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="syllabus-section">
                    <h6>Objectives</h6>
                    <ul>
                      {course.syllabus.objectives.map((objective, index) => (
                        <li key={index}>
                          <i className="fas fa-bullseye"></i>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="syllabus-section">
                    <h6>Assessment</h6>
                    <div className="assessment-grid">
                      {Object.entries(course.syllabus.assessment).map(([type, percentage]) => (
                        <div key={type} className="assessment-item">
                          <span className="assessment-type">
                            <i className="fas fa-chart-pie"></i>
                            {type}
                          </span>
                          <span className="assessment-percentage">{percentage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Materials Section */}
              <div className="materials-list">
                <div className="materials-header">
                  <h4>Course Materials</h4>
                  <span className="materials-count">
                    {course.studyMaterials.length} materials
                  </span>
                </div>
                {course.studyMaterials.length > 0 ? (
                  course.studyMaterials.map(material => (
                    <div key={material.id} className="material-item">
                      <div className="material-icon">
                        <i className={`fas fa-file-${material.type}`}></i>
                      </div>
                      <div className="material-info">
                        <span className="material-title">{material.title}</span>
                        <span className="material-category">
                          <i className="fas fa-tag"></i>
                          {material.category}
                        </span>
                        <span className="material-description">{material.description}</span>
                        <span className="material-date">
                          <i className="fas fa-calendar"></i>
                          Uploaded: {material.uploadDate}
                        </span>
                      </div>
                      <div className="material-actions">
                        <button 
                          className={`favorite-button ${favorites.includes(material.id) ? 'active' : ''}`}
                          onClick={() => toggleFavorite(material.id)}
                          title={favorites.includes(material.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <i className={`fas fa-star ${favorites.includes(material.id) ? 'filled' : ''}`}></i>
                        </button>
                        <button 
                          className="preview-button" 
                          onClick={() => handlePreview(material)}
                          title="Preview"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="download-button" title="Download">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-materials">
                    <i className="fas fa-folder-open"></i>
                    <p>No materials found matching your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Material Preview Modal */}
        {previewMaterial && (
          <div className="preview-modal">
            <div className="preview-content">
              <div className="preview-header">
                <h3>{previewMaterial.title}</h3>
                <button className="close-button" onClick={closePreview}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="preview-body">
                <div className="preview-info">
                  <div className="preview-meta">
                    <span><i className="fas fa-tag"></i> {previewMaterial.category}</span>
                    <span><i className="fas fa-calendar"></i> Uploaded: {previewMaterial.uploadDate}</span>
                  </div>
                  <p className="preview-description">{previewMaterial.description}</p>
                </div>
                <div className="preview-file">
                  <div className="file-preview-placeholder">
                    <i className={`fas fa-file-${previewMaterial.type} fa-3x`}></i>
                    <p>Preview not available</p>
                  </div>
                </div>
              </div>
              <div className="preview-footer">
                <button className="download-button">
                  <i className="fas fa-download"></i> Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Add function to handle favorites
  const toggleFavorite = (materialId) => {
    setFavorites(prev => 
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  // Add function to handle material preview
  const handlePreview = (material) => {
    setPreviewMaterial(material);
    // Add to recent views
    setRecentViews(prev => {
      const filtered = prev.filter(m => m.id !== material.id);
      return [material, ...filtered].slice(0, 5);
    });
  };

  // Add function to close preview
  const closePreview = () => {
    setPreviewMaterial(null);
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="dashboard-actions">
          <button className="action-button">
            <i className="fas fa-calendar"></i> View Schedule
          </button>
          <button className="action-button">
            <i className="fas fa-tasks"></i> My Assignments
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-home"></i> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          <i className="fas fa-video"></i> Video Library
        </button>
        <button 
          className={`tab-button ${activeTab === 'grades' ? 'active' : ''}`}
          onClick={() => setActiveTab('grades')}
        >
          <i className="fas fa-chart-bar"></i> Grades
        </button>
        <button 
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <i className="fas fa-calendar-alt"></i> Calendar
        </button>
        <button 
          className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          <i className="fas fa-book"></i> Study Materials
        </button>
      </div>

      <div className="dashboard-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default StudentDashboard; 