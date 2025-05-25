import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    children: [{ name: '', age: '', grade: '', school: '' }]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('child_')) {
      const childField = name.split('_')[1];
      const updatedChildren = [...formData.children];
      updatedChildren[index] = {
        ...updatedChildren[index],
        [childField]: value
      };
      setFormData({ ...formData, children: updatedChildren });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addChild = () => {
    setFormData({
      ...formData,
      children: [...formData.children, { name: '', age: '', grade: '', school: '' }]
    });
  };

  const removeChild = (index) => {
    const updatedChildren = formData.children.filter((_, i) => i !== index);
    setFormData({ ...formData, children: updatedChildren });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/auth/parent/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        children: formData.children
      });

      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', 'parent');

      // Redirect to parent dashboard
      navigate('/parent-dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Parent Registration</h1>
        <p className="register-subtitle">Create your account to manage your children's education</p>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-section">
            <h2>Parent Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
              <small className="password-hint">
                Password must be at least 8 characters long and include uppercase, lowercase, number, and special character
              </small>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h2>Children Information</h2>
              <button
                type="button"
                className="add-child-button"
                onClick={addChild}
              >
                <span className="button-icon">➕</span>
                Add Child
              </button>
            </div>

            {formData.children.map((child, index) => (
              <div key={index} className="child-form">
                <div className="child-header">
                  <h3>Child {index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      className="remove-child-button"
                      onClick={() => removeChild(index)}
                    >
                      <span className="button-icon">🗑️</span>
                      Remove
                    </button>
                  )}
                </div>

                <div className="child-fields">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name={`child_name`}
                      value={child.name}
                      onChange={(e) => handleChange(e, index)}
                      required
                      placeholder="Enter child's name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name={`child_age`}
                      value={child.age}
                      onChange={(e) => handleChange(e, index)}
                      required
                      min="3"
                      max="18"
                      placeholder="Enter child's age"
                    />
                  </div>

                  <div className="form-group">
                    <label>Grade</label>
                    <select
                      name={`child_grade`}
                      value={child.grade}
                      onChange={(e) => handleChange(e, index)}
                      required
                    >
                      <option value="">Select Grade</option>
                      <option value="Kindergarten">Kindergarten</option>
                      <option value="1st Grade">1st Grade</option>
                      <option value="2nd Grade">2nd Grade</option>
                      <option value="3rd Grade">3rd Grade</option>
                      <option value="4th Grade">4th Grade</option>
                      <option value="5th Grade">5th Grade</option>
                      <option value="6th Grade">6th Grade</option>
                      <option value="7th Grade">7th Grade</option>
                      <option value="8th Grade">8th Grade</option>
                      <option value="9th Grade">9th Grade</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>School</label>
                    <input
                      type="text"
                      name={`child_school`}
                      value={child.school}
                      onChange={(e) => handleChange(e, index)}
                      required
                      placeholder="Enter school name"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
            <p className="login-link">
              Already have an account? <Link to="/parent-login">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 