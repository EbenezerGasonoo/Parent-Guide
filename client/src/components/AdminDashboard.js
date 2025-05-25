import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    activeUsers: 0,
    systemHealth: {
      cpu: 0,
      memory: 0,
      storage: 0
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showSystemHealth, setShowSystemHealth] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student',
    status: 'Active'
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [120, 150, 180, 210, 240, 280],
    activeUsers: [80, 95, 110, 130, 150, 180],
    loginFrequency: [2.5, 3.1, 3.8, 4.2, 4.5, 4.8],
    monthlyActivity: {
      logins: 4500,
      uploads: 320,
      downloads: 890,
      messages: 1200
    }
  });
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      action: 'User Login',
      user: 'Kwesi Owusu',
      timestamp: '2024-03-15 14:30',
      ip: '192.168.1.1',
      status: 'Success'
    },
    {
      id: 2,
      action: 'File Upload',
      user: 'Abena Mensah',
      timestamp: '2024-03-15 13:45',
      ip: '192.168.1.2',
      status: 'Success'
    },
    {
      id: 3,
      action: 'User Creation',
      user: 'System',
      timestamp: '2024-03-15 12:30',
      ip: '192.168.1.3',
      status: 'Success'
    }
  ]);
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    backupFrequency: 'daily',
    maxFileSize: 10,
    sessionTimeout: 30,
    emailNotifications: true
  });
  const [showRoles, setShowRoles] = useState(false);
  const [showBackups, setShowBackups] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Administrator',
      permissions: ['all'],
      users: 3,
      description: 'Full system access'
    },
    {
      id: 2,
      name: 'Teacher',
      permissions: ['manage_courses', 'manage_students', 'view_analytics'],
      users: 25,
      description: 'Course and student management'
    },
    {
      id: 3,
      name: 'Parent',
      permissions: ['view_grades', 'view_attendance', 'view_courses'],
      users: 120,
      description: 'Student progress monitoring'
    }
  ]);
  const [backups, setBackups] = useState([
    {
      id: 1,
      date: '2024-03-15 00:00',
      size: '2.5 GB',
      type: 'Full',
      status: 'Completed',
      downloadUrl: '#'
    },
    {
      id: 2,
      date: '2024-03-14 00:00',
      size: '2.3 GB',
      type: 'Full',
      status: 'Completed',
      downloadUrl: '#'
    },
    {
      id: 3,
      date: '2024-03-13 00:00',
      size: '2.4 GB',
      type: 'Full',
      status: 'Completed',
      downloadUrl: '#'
    }
  ]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'system',
      title: 'System Update Available',
      message: 'A new version (2.1.0) is available for installation',
      date: '2024-03-15 10:00',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'security',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected',
      date: '2024-03-15 09:30',
      priority: 'critical',
      read: false
    },
    {
      id: 3,
      type: 'backup',
      title: 'Backup Completed',
      message: 'Daily backup completed successfully',
      date: '2024-03-15 00:00',
      priority: 'normal',
      read: true
    }
  ]);
  const [showApiManagement, setShowApiManagement] = useState(false);
  const [showSystemLogs, setShowSystemLogs] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Mobile App API',
      key: 'sk_live_51N...',
      created: '2024-03-01',
      lastUsed: '2024-03-15',
      status: 'Active',
      usage: {
        requests: 15000,
        bandwidth: '2.5 GB'
      }
    },
    {
      id: 2,
      name: 'Web App API',
      key: 'sk_live_52M...',
      created: '2024-02-15',
      lastUsed: '2024-03-15',
      status: 'Active',
      usage: {
        requests: 25000,
        bandwidth: '4.2 GB'
      }
    }
  ]);
  const [systemLogs, setSystemLogs] = useState([
    {
      id: 1,
      timestamp: '2024-03-15 15:30:45',
      level: 'ERROR',
      component: 'Database',
      message: 'Connection timeout after 30 seconds',
      details: {
        host: 'db-01',
        port: 5432,
        error: 'ETIMEDOUT'
      }
    },
    {
      id: 2,
      timestamp: '2024-03-15 15:29:30',
      level: 'WARNING',
      component: 'Cache',
      message: 'Memory usage above 80%',
      details: {
        current: '8.2 GB',
        limit: '10 GB'
      }
    },
    {
      id: 3,
      timestamp: '2024-03-15 15:28:15',
      level: 'INFO',
      component: 'API',
      message: 'Rate limit threshold reached',
      details: {
        endpoint: '/api/v1/users',
        limit: '1000/hour',
        current: '950'
      }
    }
  ]);
  const [advancedAnalytics, setAdvancedAnalytics] = useState({
    userEngagement: {
      dailyActive: 450,
      weeklyActive: 1200,
      monthlyActive: 3500,
      averageSession: '25m',
      bounceRate: '32%'
    },
    performance: {
      averageResponse: '120ms',
      uptime: '99.9%',
      errorRate: '0.1%',
      peakLoad: '1500 req/min'
    },
    resourceUsage: {
      cpu: {
        current: 45,
        peak: 78,
        average: 35
      },
      memory: {
        current: 62,
        peak: 85,
        average: 55
      },
      storage: {
        used: '750 GB',
        total: '1 TB',
        growth: '+5%'
      }
    }
  });

  const [showSystemDropdown, setShowSystemDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showProfiles, setShowProfiles] = useState({ admin: false, teacher: false, student: false });

  useEffect(() => {
    // For now, we'll use dummy data since we're not requiring authentication
    const dummyUsers = [
      {
        id: 1,
        name: 'Kwesi Owusu',
        email: 'kwesi@accraschool.com',
        role: 'teacher',
        status: 'Active',
        lastActive: '2024-03-15 14:30',
        joinDate: '2023-09-01',
        lastLogin: '2024-03-15 14:30',
        loginCount: 156
      },
      {
        id: 2,
        name: 'Abena Mensah',
        email: 'abena@accraschool.com',
        role: 'parent',
        status: 'Active',
        lastActive: '2024-03-15 13:45',
        joinDate: '2023-08-15',
        lastLogin: '2024-03-15 13:45',
        loginCount: 89
      },
      {
        id: 3,
        name: 'Kofi Asante',
        email: 'kofi@accraschool.com',
        role: 'teacher',
        status: 'Active',
        lastActive: '2024-03-15 15:20',
        joinDate: '2023-10-01',
        lastLogin: '2024-03-15 15:20',
        loginCount: 142
      },
      {
        id: 4,
        name: 'Efua Addo',
        email: 'efua@accraschool.com',
        role: 'parent',
        status: 'Active',
        lastActive: '2024-03-15 12:15',
        joinDate: '2023-11-15',
        lastLogin: '2024-03-15 12:15',
        loginCount: 67
      },
      {
        id: 5,
        name: 'Yaw Osei',
        email: 'yaw@accraschool.com',
        role: 'teacher',
        status: 'Inactive',
        lastActive: '2024-03-14 09:30',
        joinDate: '2023-07-01',
        lastLogin: '2024-03-14 09:30',
        loginCount: 98
      }
    ];

    // Set dummy stats
    setStats({
      totalStudents: 150,
      totalTeachers: 25,
      totalParents: 120,
      activeUsers: 280,
      systemHealth: {
        cpu: 45,
        memory: 62,
        storage: 78
      }
    });

    setUsers(dummyUsers);
    setLoading(false);
  }, []);

  const handleAddUser = () => {
    // Add user logic here
    setShowAddUserModal(false);
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      status: 'Active'
    });
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'Active' } : user
        ));
        break;
      case 'deactivate':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'Inactive' } : user
        ));
        break;
      case 'delete':
        setUsers(users.filter(user => !selectedUsers.includes(user.id)));
        break;
      default:
        break;
    }
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const handleExport = (format) => {
    // Export logic here
    console.log(`Exporting to ${format} format`);
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleShowProfile = (profileType) => {
    setShowProfiles({ admin: false, teacher: false, student: false, [profileType]: true });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          {/* Profiles Dropdown */}
          <div className="dropdown" onMouseEnter={() => setShowProfiles({ ...showProfiles, dropdown: true })} onMouseLeave={() => setShowProfiles({ ...showProfiles, dropdown: false })}>
            <button className="dropdown-button">
              <i className="fas fa-user-circle"></i>
              Profiles
            </button>
            {showProfiles.dropdown && (
              <div className="dropdown-content">
                <button className="action-button" onClick={() => handleShowProfile('admin')}>Admin Profile</button>
                <button className="action-button" onClick={() => handleShowProfile('teacher')}>Teacher Profile</button>
                <button className="action-button" onClick={() => handleShowProfile('student')}>Student Profile</button>
              </div>
            )}
          </div>

          {/* System Dropdown */}
          <div className="dropdown" onMouseEnter={() => setShowSystemDropdown(true)} onMouseLeave={() => setShowSystemDropdown(false)}>
            <button className="dropdown-button">
              <i className="fas fa-cog"></i>
              System
            </button>
            {showSystemDropdown && (
              <div className="dropdown-content">
                <button className="action-button" onClick={() => setShowSystemHealth(!showSystemHealth)}>System Health</button>
                <button className="action-button" onClick={() => setShowSettings(!showSettings)}>Settings</button>
                <button className="action-button" onClick={() => setShowBackups(!showBackups)}>Backup Management</button>
                <button className="action-button" onClick={() => setShowAuditLogs(!showAuditLogs)}>Audit Logs</button>
                <button className="action-button" onClick={() => setShowSystemLogs(!showSystemLogs)}>System Logs</button>
                <button className="action-button" onClick={() => setShowNotifications(!showNotifications)}>Notifications {notifications.filter(n => !n.read).length > 0 && (<span className="notification-badge">{notifications.filter(n => !n.read).length}</span>)}</button>
              </div>
            )}
          </div>

          {/* Users Dropdown */}
          <div className="dropdown" onMouseEnter={() => setShowUserDropdown(true)} onMouseLeave={() => setShowUserDropdown(false)}>
            <button className="dropdown-button">
              <i className="fas fa-users"></i>
              Users
            </button>
            {showUserDropdown && (
              <div className="dropdown-content">
                <button className="action-button" onClick={() => setShowBulkActions(!showBulkActions)}>Manage Users</button>
                <button className="action-button" onClick={() => setShowRoles(!showRoles)}>Roles</button>
                <button className="action-button" onClick={() => setShowAddUserModal(true)}>Add User</button>
              </div>
            )}
          </div>

          {/* Tools Dropdown */}
          <div className="dropdown" onMouseEnter={() => setShowToolsDropdown(true)} onMouseLeave={() => setShowToolsDropdown(false)}>
            <button className="dropdown-button">
              <i className="fas fa-tools"></i>
              Tools
            </button>
            {showToolsDropdown && (
              <div className="dropdown-content">
                <button className="action-button" onClick={() => setShowApiManagement(!showApiManagement)}>API Management</button>
                <button className="action-button" onClick={() => setShowAnalytics(!showAnalytics)}>Analytics</button>
                <button className="action-button" onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}>Advanced Analytics</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSystemHealth && (
        <div className="system-health-section">
          <h2>System Health</h2>
          <div className="health-grid">
            <div className="health-card">
              <div className="health-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <div className="health-content">
                <h3>CPU Usage</h3>
                <div className="health-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.systemHealth.cpu}%` }}></div>
                  </div>
                  <span>{stats.systemHealth.cpu}%</span>
                </div>
              </div>
            </div>
            <div className="health-card">
              <div className="health-icon">
                <i className="fas fa-memory"></i>
              </div>
              <div className="health-content">
                <h3>Memory Usage</h3>
                <div className="health-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.systemHealth.memory}%` }}></div>
                  </div>
                  <span>{stats.systemHealth.memory}%</span>
                </div>
              </div>
            </div>
            <div className="health-card">
              <div className="health-icon">
                <i className="fas fa-hdd"></i>
              </div>
              <div className="health-content">
                <h3>Storage Usage</h3>
                <div className="health-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${stats.systemHealth.storage}%` }}></div>
                  </div>
                  <span>{stats.systemHealth.storage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="stat-content">
            <h3>Total Students</h3>
            <p className="stat-number">{stats.totalStudents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div className="stat-content">
            <h3>Total Teachers</h3>
            <p className="stat-number">{stats.totalTeachers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Total Parents</h3>
            <p className="stat-number">{stats.totalParents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-number">{stats.activeUsers}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="users-section">
          <div className="section-header">
            <h2>User Management</h2>
            <div className="user-controls">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="teacher">Teachers</option>
                <option value="parent">Parents</option>
                <option value="student">Students</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="export-actions">
                <button className="action-button secondary" onClick={() => handleExport('csv')}>
                  <i className="fas fa-file-csv"></i>
                  Export CSV
                </button>
                <button className="action-button secondary" onClick={() => handleExport('pdf')}>
                  <i className="fas fa-file-pdf"></i>
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedUsers.length} users selected</span>
              <div className="bulk-buttons">
                <button className="action-button secondary" onClick={() => handleBulkAction('activate')}>
                  <i className="fas fa-check"></i>
                  Activate
                </button>
                <button className="action-button secondary" onClick={() => handleBulkAction('deactivate')}>
                  <i className="fas fa-ban"></i>
                  Deactivate
                </button>
                <button className="action-button danger" onClick={() => handleBulkAction('delete')}>
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          )}

          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Last Login</th>
                  <th>Login Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.joinDate}</td>
                    <td>{user.lastLogin}</td>
                    <td>{user.loginCount}</td>
                    <td>
                      <button className="action-button edit" title="Edit User">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-button view" title="View Details">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-button delete" title="Delete User">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="activity-content">
                <p className="activity-text">New teacher account created for Kofi Asante</p>
                <p className="activity-time">Today at 14:30</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-cog"></i>
              </div>
              <div className="activity-content">
                <p className="activity-text">System maintenance completed</p>
                <p className="activity-time">Yesterday at 23:00</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-user-edit"></i>
              </div>
              <div className="activity-content">
                <p className="activity-text">User profile updated: Abena Mensah</p>
                <p className="activity-time">Yesterday at 15:45</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New User</h2>
            <form className="user-form" onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Add User</button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAnalytics && (
        <div className="analytics-section">
          <h2>User Analytics</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>User Growth</h3>
              <div className="chart-container">
                <div className="chart">
                  {analyticsData.userGrowth.map((value, index) => (
                    <div key={index} className="chart-bar" style={{ height: `${value / 3}px` }}>
                      <span className="chart-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="analytics-card">
              <h3>Active Users</h3>
              <div className="chart-container">
                <div className="chart">
                  {analyticsData.activeUsers.map((value, index) => (
                    <div key={index} className="chart-bar" style={{ height: `${value / 2}px` }}>
                      <span className="chart-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="analytics-card">
              <h3>Monthly Activity</h3>
              <div className="activity-stats">
                <div className="activity-stat">
                  <i className="fas fa-sign-in-alt"></i>
                  <span>{analyticsData.monthlyActivity.logins} Logins</span>
                </div>
                <div className="activity-stat">
                  <i className="fas fa-upload"></i>
                  <span>{analyticsData.monthlyActivity.uploads} Uploads</span>
                </div>
                <div className="activity-stat">
                  <i className="fas fa-download"></i>
                  <span>{analyticsData.monthlyActivity.downloads} Downloads</span>
                </div>
                <div className="activity-stat">
                  <i className="fas fa-comments"></i>
                  <span>{analyticsData.monthlyActivity.messages} Messages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAuditLogs && (
        <div className="audit-logs-section">
          <h2>Audit Logs</h2>
          <div className="audit-logs-table">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Timestamp</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.action}</td>
                    <td>{log.user}</td>
                    <td>{log.timestamp}</td>
                    <td>{log.ip}</td>
                    <td>
                      <span className={`status-badge ${log.status.toLowerCase()}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-section">
          <h2>System Settings</h2>
          <div className="settings-grid">
            <div className="settings-card">
              <h3>General Settings</h3>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      maintenanceMode: e.target.checked
                    })}
                  />
                  Maintenance Mode
                </label>
              </div>
              <div className="setting-item">
                <label>Backup Frequency</label>
                <select
                  value={systemSettings.backupFrequency}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    backupFrequency: e.target.value
                  })}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            <div className="settings-card">
              <h3>System Limits</h3>
              <div className="setting-item">
                <label>Max File Size (MB)</label>
                <input
                  type="number"
                  value={systemSettings.maxFileSize}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    maxFileSize: parseInt(e.target.value)
                  })}
                />
              </div>
              <div className="setting-item">
                <label>Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    sessionTimeout: parseInt(e.target.value)
                  })}
                />
              </div>
            </div>
            <div className="settings-card">
              <h3>Notifications</h3>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={systemSettings.emailNotifications}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      emailNotifications: e.target.checked
                    })}
                  />
                  Enable Email Notifications
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRoles && (
        <div className="roles-section">
          <h2>Role Management</h2>
          <div className="roles-grid">
            {roles.map(role => (
              <div key={role.id} className="role-card">
                <div className="role-header">
                  <h3>{role.name}</h3>
                  <span className="user-count">{role.users} users</span>
                </div>
                <p className="role-description">{role.description}</p>
                <div className="permissions-list">
                  {role.permissions.map((permission, index) => (
                    <span key={index} className="permission-badge">
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                <div className="role-actions">
                  <button className="action-button edit">
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button className="action-button view">
                    <i className="fas fa-users"></i>
                    View Users
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBackups && (
        <div className="backups-section">
          <h2>Backup Management</h2>
          <div className="backup-controls">
            <button className="action-button primary">
              <i className="fas fa-plus"></i>
              Create Backup
            </button>
            <div className="backup-filters">
              <select className="filter-select">
                <option value="all">All Types</option>
                <option value="full">Full Backup</option>
                <option value="incremental">Incremental</option>
              </select>
              <select className="filter-select">
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>
          <div className="backups-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.map(backup => (
                  <tr key={backup.id}>
                    <td>{backup.date}</td>
                    <td>{backup.size}</td>
                    <td>{backup.type}</td>
                    <td>
                      <span className={`status-badge ${backup.status.toLowerCase()}`}>
                        {backup.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-button download">
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="action-button restore">
                        <i className="fas fa-undo"></i>
                      </button>
                      <button className="action-button delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="notifications-section">
          <h2>System Notifications</h2>
          <div className="notifications-filters">
            <button className={`filter-button ${!showNotifications ? 'active' : ''}`}>
              All
            </button>
            <button className="filter-button">
              Unread
            </button>
            <button className="filter-button">
              Critical
            </button>
          </div>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div key={notification.id} className={`notification-item ${notification.priority} ${notification.read ? 'read' : 'unread'}`}>
                <div className="notification-icon">
                  <i className={`fas fa-${notification.type === 'system' ? 'cog' : notification.type === 'security' ? 'shield-alt' : 'database'}`}></i>
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <span className="notification-date">{notification.date}</span>
                  </div>
                  <p>{notification.message}</p>
                  {notification.priority === 'critical' && (
                    <div className="notification-actions">
                      <button className="action-button primary">Take Action</button>
                      <button className="action-button secondary">Dismiss</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showApiManagement && (
        <div className="api-management-section">
          <h2>API Management</h2>
          <div className="api-controls">
            <button className="action-button primary">
              <i className="fas fa-plus"></i>
              Generate New API Key
            </button>
            <div className="api-filters">
              <select className="filter-select">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input type="text" className="search-input" placeholder="Search API keys..." />
            </div>
          </div>
          <div className="api-keys-grid">
            {apiKeys.map(apiKey => (
              <div key={apiKey.id} className="api-key-card">
                <div className="api-key-header">
                  <h3>{apiKey.name}</h3>
                  <span className={`status-badge ${apiKey.status.toLowerCase()}`}>
                    {apiKey.status}
                  </span>
                </div>
                <div className="api-key-details">
                  <div className="detail-item">
                    <span className="label">API Key:</span>
                    <span className="value">{apiKey.key}</span>
                    <button className="copy-button" title="Copy to clipboard">
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                  <div className="detail-item">
                    <span className="label">Created:</span>
                    <span className="value">{apiKey.created}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Last Used:</span>
                    <span className="value">{apiKey.lastUsed}</span>
                  </div>
                </div>
                <div className="api-usage">
                  <div className="usage-item">
                    <span className="usage-label">Requests</span>
                    <span className="usage-value">{apiKey.usage.requests.toLocaleString()}</span>
                  </div>
                  <div className="usage-item">
                    <span className="usage-label">Bandwidth</span>
                    <span className="usage-value">{apiKey.usage.bandwidth}</span>
                  </div>
                </div>
                <div className="api-actions">
                  <button className="action-button edit">
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button className="action-button view">
                    <i className="fas fa-chart-line"></i>
                    Usage
                  </button>
                  <button className="action-button delete">
                    <i className="fas fa-trash"></i>
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSystemLogs && (
        <div className="system-logs-section">
          <h2>System Logs</h2>
          <div className="logs-controls">
            <div className="logs-filters">
              <select className="filter-select">
                <option value="all">All Levels</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
              <select className="filter-select">
                <option value="all">All Components</option>
                <option value="database">Database</option>
                <option value="cache">Cache</option>
                <option value="api">API</option>
              </select>
              <input type="text" className="search-input" placeholder="Search logs..." />
            </div>
            <button className="action-button secondary">
              <i className="fas fa-download"></i>
              Export Logs
            </button>
          </div>
          <div className="logs-table">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Level</th>
                  <th>Component</th>
                  <th>Message</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {systemLogs.map(log => (
                  <tr key={log.id} className={`log-row ${log.level.toLowerCase()}`}>
                    <td>{log.timestamp}</td>
                    <td>
                      <span className={`log-badge ${log.level.toLowerCase()}`}>
                        {log.level}
                      </span>
                    </td>
                    <td>{log.component}</td>
                    <td>{log.message}</td>
                    <td>
                      <button className="details-button" title="View Details">
                        <i className="fas fa-info-circle"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdvancedAnalytics && (
        <div className="advanced-analytics-section">
          <h2>Advanced Analytics</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>User Engagement</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Daily Active</span>
                  <span className="metric-value">{advancedAnalytics.userEngagement.dailyActive}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Weekly Active</span>
                  <span className="metric-value">{advancedAnalytics.userEngagement.weeklyActive}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Monthly Active</span>
                  <span className="metric-value">{advancedAnalytics.userEngagement.monthlyActive}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Avg. Session</span>
                  <span className="metric-value">{advancedAnalytics.userEngagement.averageSession}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Bounce Rate</span>
                  <span className="metric-value">{advancedAnalytics.userEngagement.bounceRate}</span>
                </div>
              </div>
            </div>
            <div className="analytics-card">
              <h3>System Performance</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Avg. Response</span>
                  <span className="metric-value">{advancedAnalytics.performance.averageResponse}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Uptime</span>
                  <span className="metric-value">{advancedAnalytics.performance.uptime}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Error Rate</span>
                  <span className="metric-value">{advancedAnalytics.performance.errorRate}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Peak Load</span>
                  <span className="metric-value">{advancedAnalytics.performance.peakLoad}</span>
                </div>
              </div>
            </div>
            <div className="analytics-card">
              <h3>Resource Usage</h3>
              <div className="resource-usage">
                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">CPU Usage</span>
                    <span className="resource-value">{advancedAnalytics.resourceUsage.cpu.current}%</span>
                  </div>
                  <div className="resource-chart">
                    <div className="chart-bar">
                      <div className="chart-fill" style={{ width: `${advancedAnalytics.resourceUsage.cpu.current}%` }}></div>
                    </div>
                    <div className="chart-metrics">
                      <span>Peak: {advancedAnalytics.resourceUsage.cpu.peak}%</span>
                      <span>Avg: {advancedAnalytics.resourceUsage.cpu.average}%</span>
                    </div>
                  </div>
                </div>
                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">Memory Usage</span>
                    <span className="resource-value">{advancedAnalytics.resourceUsage.memory.current}%</span>
                  </div>
                  <div className="resource-chart">
                    <div className="chart-bar">
                      <div className="chart-fill" style={{ width: `${advancedAnalytics.resourceUsage.memory.current}%` }}></div>
                    </div>
                    <div className="chart-metrics">
                      <span>Peak: {advancedAnalytics.resourceUsage.memory.peak}%</span>
                      <span>Avg: {advancedAnalytics.resourceUsage.memory.average}%</span>
                    </div>
                  </div>
                </div>
                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">Storage</span>
                    <span className="resource-value">{advancedAnalytics.resourceUsage.storage.used}</span>
                  </div>
                  <div className="resource-chart">
                    <div className="chart-bar">
                      <div className="chart-fill" style={{ width: '75%' }}></div>
                    </div>
                    <div className="chart-metrics">
                      <span>Total: {advancedAnalytics.resourceUsage.storage.total}</span>
                      <span>Growth: {advancedAnalytics.resourceUsage.storage.growth}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Profile Section */}
      {showProfiles.admin && (
        <div className="profile-section">
          <h2>Admin Profile</h2>
          <div className="profile-details">
            <p><strong>Name:</strong> [Admin Name]</p>
            <p><strong>Email:</strong> [Admin Email]</p>
            <p><strong>Role:</strong> Administrator</p>
            <p><strong>Last Login:</strong> [Date and Time]</p>
            <h3>Quick Actions</h3>
            <ul>
              <li>Manage Users</li>
              <li>View System Logs</li>
              <li>Configure Settings</li>
            </ul>
            <h3>System Overview</h3>
            <p>Summary of system health, user activity, etc. goes here.</p>
          </div>
        </div>
      )}

      {/* Teacher Profile Section */}
      {showProfiles.teacher && (
        <div className="profile-section">
          <h2>Teacher Profile</h2>
          <div className="profile-details">
            <p><strong>Name:</strong> [Teacher Name]</p>
            <p><strong>Email:</strong> [Teacher Email]</p>
            <p><strong>Role:</strong> Teacher</p>
            <p><strong>Assigned Courses:</strong> [Number of courses]</p>
            <p><strong>Number of Students:</strong> [Number of students]</p>
            <h3>Quick Links</h3>
            <ul>
              <li>View My Courses</li>
              <li>Manage My Students</li>
              <li>Access Analytics</li>
            </ul>
            <h3>Recent Activity</h3>
            <p>Teacher's recent activities like grading, video uploads, etc. go here.</p>
          </div>
        </div>
      )}

      {/* Student Profile Section */}
      {showProfiles.student && (
        <div className="profile-section">
          <h2>Student Profile</h2>
          <div className="profile-details">
            <p><strong>Name:</strong> [Student Name]</p>
            <p><strong>Email:</strong> [Student Email]</p>
            <p><strong>Role:</strong> Student</p>
            <p><strong>Enrolled Courses:</strong> [Number of courses]</p>
            <p><strong>Overall Progress:</strong> [Progress percentage]</p>
            <h3>Quick Links</h3>
            <ul>
              <li>View My Courses</li>
              <li>Check My Grades</li>
              <li>Access Study Materials</li>
            </ul>
            <h3>Academic Summary</h3>
            <p>Summary of academic performance, attendance, etc. goes here.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 