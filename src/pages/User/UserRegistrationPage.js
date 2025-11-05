import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './UserRegistrationPage.css';

const UserRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    emailOtp: '',
    mobileNumber: '',
    mobileOtp: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
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

  const handleVerifyEmail = () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
      return;
    }
    alert('OTP sent to ' + formData.email);
  };

  const handleVerifyMobile = () => {
    if (!formData.mobileNumber) {
      setErrors((prev) => ({ ...prev, mobileNumber: 'Mobile number is required' }));
      return;
    }
    if (!validateMobile(formData.mobileNumber)) {
      setErrors((prev) => ({ ...prev, mobileNumber: 'Please enter a valid mobile number' }));
      return;
    }
    alert('OTP sent to ' + formData.mobileNumber);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate all fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.emailOtp.trim()) newErrors.emailOtp = 'Email OTP is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!validateMobile(formData.mobileNumber)) newErrors.mobileNumber = 'Please enter a valid mobile number';
    if (!formData.mobileOtp.trim()) newErrors.mobileOtp = 'Mobile OTP is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    alert('User Created Successfully!');
    setTimeout(() => {
      navigate('/user');
    }, 500);
  };

  return (
    <div className="registration-container">
      <button className="back-btn" onClick={() => navigate('/user')}>
        <FiArrowLeft size={20} />
        Back to Users
      </button>

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
                Email (Verify) <span className="required">*</span>
              </label>
              <div className="input-with-button">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className={errors.email ? 'error' : ''}
                />
                <button
                  type="button"
                  className="verify-btn"
                  onClick={handleVerifyEmail}
                  disabled={emailVerified}
                >
                  {emailVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Email OTP <span className="required">*</span>
              </label>
              <input
                type="text"
                name="emailOtp"
                value={formData.emailOtp}
                onChange={handleInputChange}
                placeholder="Enter OTP"
                className={errors.emailOtp ? 'error' : ''}
              />
              {errors.emailOtp && <span className="error-text">{errors.emailOtp}</span>}
            </div>

            <div className="form-group">
              <label>
                Mobile Number (Verify) <span className="required">*</span>
              </label>
              <div className="input-with-button">
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  className={errors.mobileNumber ? 'error' : ''}
                />
                <button
                  type="button"
                  className="verify-btn"
                  onClick={handleVerifyMobile}
                  disabled={mobileVerified}
                >
                  {mobileVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
              {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Mobile OTP <span className="required">*</span>
              </label>
              <input
                type="text"
                name="mobileOtp"
                value={formData.mobileOtp}
                onChange={handleInputChange}
                placeholder="Enter OTP"
                className={errors.mobileOtp ? 'error' : ''}
              />
              {errors.mobileOtp && <span className="error-text">{errors.mobileOtp}</span>}
            </div>

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
            <button type="button" className="btn-back" onClick={() => navigate('/user')}>
              Back to Users
            </button>
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