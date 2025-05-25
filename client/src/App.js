import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import ParentDashboard from './components/ParentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import './index.css';

// Navigation Component
function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/');
  const location = useLocation();

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <h1>Parent's Guide</h1>
          </div>

          <button 
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={activeRoute === '/' ? 'active' : ''}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/parent-dashboard" 
                className={activeRoute === '/parent-dashboard' ? 'active' : ''}
              >
                Parent Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/teacher-dashboard" 
                className={activeRoute === '/teacher-dashboard' ? 'active' : ''}
              >
                Teacher Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/student-dashboard" 
                className={activeRoute === '/student-dashboard' ? 'active' : ''}
              >
                Student Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin-dashboard" 
                className={activeRoute === '/admin-dashboard' ? 'active' : ''}
              >
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h2>Menu</h2>
          <button 
            className="close-button"
            onClick={() => setIsMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <ul className="mobile-nav-links">
          <li>
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className={activeRoute === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/parent-dashboard" 
              onClick={() => setIsMenuOpen(false)}
              className={activeRoute === '/parent-dashboard' ? 'active' : ''}
            >
              Parent Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/teacher-dashboard" 
              onClick={() => setIsMenuOpen(false)}
              className={activeRoute === '/teacher-dashboard' ? 'active' : ''}
            >
              Teacher Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/student-dashboard" 
              onClick={() => setIsMenuOpen(false)}
              className={activeRoute === '/student-dashboard' ? 'active' : ''}
            >
              Student Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin-dashboard" 
              onClick={() => setIsMenuOpen(false)}
              className={activeRoute === '/admin-dashboard' ? 'active' : ''}
            >
              Admin Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

// Home Component
function Home() {
  return (
    <div className="home-container">
      <div className="floating-emojis">
        <div className="floating-emoji">📚</div>
        <div className="floating-emoji">✏️</div>
        <div className="floating-emoji">🎓</div>
        <div className="floating-emoji">📝</div>
        <div className="floating-emoji">🎨</div>
        <div className="floating-emoji">🔬</div>
        <div className="floating-emoji">📊</div>
        <div className="floating-emoji">🎯</div>
        <div className="floating-emoji">🌟</div>
        <div className="floating-emoji">💡</div>
        <div className="floating-emoji">📖</div>
        <div className="floating-emoji">🎮</div>
      </div>
      
      <div className="hero-section">
        <h1>Welcome to Parent's Guide</h1>
        <p className="hero-subtitle">Your comprehensive platform for managing your child's education</p>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">👨‍👩‍👧‍👦</div>
          <h3>For Parents</h3>
          <p>Track your child's progress, communicate with teachers, and access educational resources.</p>
          <Link to="/parent-dashboard" className="feature-btn parent-btn">Parent Dashboard</Link>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👨‍🏫</div>
          <h3>For Teachers</h3>
          <p>Manage classes, create assignments, and communicate with parents effectively.</p>
          <Link to="/teacher-dashboard" className="feature-btn teacher-btn">Teacher Dashboard</Link>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👨‍🎓</div>
          <h3>For Students</h3>
          <p>Access learning materials, track your progress, and engage with educational content.</p>
          <Link to="/student-dashboard" className="feature-btn student-btn">Student Dashboard</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👨‍💼</div>
          <h3>For Administrators</h3>
          <p>Oversee the entire system, manage users, and ensure smooth operations.</p>
          <Link to="/admin-dashboard" className="feature-btn admin-btn">Admin Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/upload" element={<UploadForm />} />
      </Routes>
    </Router>
  );
}

export default App; 