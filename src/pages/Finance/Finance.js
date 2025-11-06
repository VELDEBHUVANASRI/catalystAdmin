import React, { useState, useEffect } from 'react';
import { MdPeople, MdAttachMoney } from 'react-icons/md';
import './Finance.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const Finance = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activePlans: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/subscriptions`);
        const result = await response.json();

        if (result.success && result.stats) {
          setStats(result.stats);
        }
      } catch (error) {
        console.error('Error fetching finance stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="finance-container">
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-container">
      {/* Page Title */}
      <h1 className="page-title">Finance Management</h1>

      {/* Overview Cards Section */}
      <div className="overview-cards">
        <div className="overview-card">
          <div className="card-icon">
            <MdPeople size={32} />
          </div>
          <div className="card-content">
            <p className="card-title">Total Subscribers</p>
            <p className="card-count">{stats.totalSubscribers}</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">
            <MdAttachMoney size={32} />
          </div>
          <div className="card-content">
            <p className="card-title">Active Plans</p>
            <p className="card-count">{stats.activePlans}</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">
            <MdAttachMoney size={32} />
          </div>
          <div className="card-content">
            <p className="card-title">Pending Payments</p>
            <p className="card-count">{stats.pendingPayments}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;