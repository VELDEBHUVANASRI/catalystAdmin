import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';
import '../Auth/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSendReset = (e) => {
    e.preventDefault();
    if (email) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-card">
        {showSuccess && (
          <div className="success-message">
            <FiCheck className="success-icon" />
            <p>Password reset link sent to your email.</p>
          </div>
        )}

        {!showSuccess && (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Reset Your Password</h1>
              <p className="auth-subtitle">
                Enter your email to receive a password reset link.
              </p>
            </div>

            <form onSubmit={handleSendReset} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-button-primary">
                Send Reset Link
              </button>
            </form>

            <div className="auth-footer">
              <button
                type="button"
                className="auth-button-outlined"
                onClick={handleBackToLogin}
              >
                <FiArrowLeft className="button-icon" />
                <span>Back to Login</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;