import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './UserRegistrationPage.css';

const UserRegistrationPage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9\s\-\+\(\)]{10,}$/;
    return mobileRegex.test(mobile);
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate all fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
  if (!formData.email.trim()) newErrors.email = 'Email is required';
  if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
  if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
  if (!validateMobile(formData.mobileNumber)) newErrors.mobileNumber = 'Please enter a valid mobile number';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);

    // send to backend
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            mobile: formData.mobileNumber,
            password: formData.password,
          }),
        });

        const body = await res.json().catch(() => ({}));
        if (!res.ok || !body?.success) {
          const message = body?.message || `HTTP ${res.status}`;
          setErrors((prev) => ({ ...prev, form: message }));
          setSubmitted(false);
          return;
        }

        // success
        navigate('/user');
      } catch (err) {
        console.error('Registration failed', err);
        setErrors((prev) => ({ ...prev, form: err.message || 'Registration failed' }));
        setSubmitted(false);
      }
    })();
  };

  return (
    <div className="registration-container">

      <div className="registration-card">
        <h1>Create User Account</h1>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Mobile Number <span className="required">*</span>
              </label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="Enter mobile number"
                className={errors.mobileNumber ? 'error' : ''}
              />
              {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>&nbsp;</label>
              <div style={{ visibility: 'hidden' }}>-</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Min 8 characters"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-buttons">
            {errors.form && <div className="error-text" style={{ marginRight: 'auto' }}>{errors.form}</div>}
            <button type="submit" className="btn-signup" disabled={submitted}>
              {submitted ? 'Creating...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistrationPage;