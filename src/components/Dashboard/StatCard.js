import React from 'react';
import './StatCard.css';

const StatCard = ({ title, count, change, icon, isPositive }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-icon">{icon}</div>
      </div>

      <div className="stat-body">
        <div className="stat-count">{count}</div>
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
};

export default StatCard;