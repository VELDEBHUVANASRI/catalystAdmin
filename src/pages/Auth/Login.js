import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import '../Auth/Auth.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (emailValue) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(emailValue);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrors({ general: data.message || 'Login failed. Please try again.' });
        setLoading(false);
        return;
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Failed to connect to server. Please try again.' });
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-background"></div>
        <div className="auth-card">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>Login Successful!</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Please login to your account</p>
        </div>

        {errors.general && (
          <div className="error-alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSignIn} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="auth-button-primary"
            disabled={loading || success}
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            {!loading && <FiArrowRight className="button-icon" />}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="auth-text-button"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Forgot Password?
          </button>
          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>
          <button
            type="button"
            className="auth-button-outlined"
            onClick={handleSignUp}
            disabled={loading}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;