import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Dummy data for children with performance analytics
    const dummyChildren = [
      {
        id: 1,
        name: 'Kwame Mensah',
        age: 10,
        grade: '5th Grade',
        school: 'Accra International School',
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
          strongAreas: ['Science', 'Math'],
          attendance: 95,
          behavior: 'Excellent'
        }
      },
      {
        id: 2,
        name: 'Ama Osei',
        age: 8,
        grade: '3rd Grade',
        school: 'Accra International School',
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
          strongAreas: ['Math', 'English', 'History'],
          attendance: 98,
          behavior: 'Outstanding'
        }
      },
      {
        id: 3,
        name: 'Yaw Addo',
        age: 12,
        grade: '6th Grade',
        school: 'Accra International School',
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
          strongAreas: ['Social Studies'],
          attendance: 92,
          behavior: 'Good'
        }
      }
    ];

    // Dummy notifications
    const dummyNotifications = [
      {
        id: 1,
        type: 'performance',
        message: 'New performance report available for Kwame Mensah',
        date: '2024-03-15',
        read: false
      },
      {
        id: 2,
        type: 'attendance',
        message: 'Ama Osei has perfect attendance this month!',
        date: '2024-03-14',
        read: false
      },
      {
        id: 3,
        type: 'behavior',
        message: 'Yaw Addo received a commendation for good behavior',
        date: '2024-03-13',
        read: true
      },
      {
        id: 4,
        type: 'general',
        message: 'Parent-teacher meeting scheduled for next week',
        date: '2024-03-12',
        read: false
      }
    ];

    setChildren(dummyChildren);
    setNotifications(dummyNotifications);
    setLoading(false);
  }, []);

  const handleChildSelect = (child) => {
    setSelectedChild(child);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
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
        <h1>Parent Dashboard</h1>
        <div className="dashboard-actions">
          <button className="action-button">
            Schedule Meeting
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="children-section">
          <h2>My Children</h2>
          <div className="children-grid">
            {children.map(child => (
              <div 
                key={child.id} 
                className={`child-card ${selectedChild?.id === child.id ? 'selected' : ''}`}
                onClick={() => handleChildSelect(child)}
              >
                <h3>{child.name}</h3>
                <p>Age: {child.age}</p>
                <p>Grade: {child.grade}</p>
                <p>School: {child.school}</p>
                <p>Attendance: {child.analytics.attendance}%</p>
                <p>Behavior: {child.analytics.behavior}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedChild && (
          <div className="analytics-section">
            <h2>Analytics for {selectedChild.name}</h2>
            
            <div className="analytics-grid">
              <div className="analytics-card performance">
                <h3>Subject Performance</h3>
                <div className="subject-scores">
                  {Object.entries(selectedChild.analytics.performance).map(([subject, score]) => (
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
                  {selectedChild.analytics.trends.map((trend, index) => (
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
                      {selectedChild.analytics.strongAreas.map((area, index) => (
                        <li key={index} className="strong-area">{area}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="area-section">
                    <h4>Areas for Improvement</h4>
                    <ul>
                      {selectedChild.analytics.weakAreas.map((area, index) => (
                        <li key={index} className="weak-area">{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="notifications-section">
          <h2>Notifications</h2>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="notification-header">
                  <span className="notification-type">{notification.type}</span>
                  <span className="notification-date">{notification.date}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard; 