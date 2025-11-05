import React, { useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle size={20} />;
      case 'error':
        return <FiAlertCircle size={20} />;
      case 'info':
        return <FiInfo size={20} />;
      default:
        return <FiCheckCircle size={20} />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <p className="toast-message">{message}</p>
      <button className="toast-close" onClick={onClose}>
        <FiX size={18} />
      </button>
    </div>
  );
};

export default Toast;