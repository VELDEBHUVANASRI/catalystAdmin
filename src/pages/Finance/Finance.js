import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdPeople, MdAttachMoney } from 'react-icons/md';
import './Finance.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const Finance = () => {
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [vendorSubscriptions, setVendorSubscriptions] = useState([]);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activePlans: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/subscriptions`);
        const result = await response.json();

        if (result.success) {
          setVendorSubscriptions(result.data || []);
          if (result.stats) {
            setStats(result.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Filter data based on search input
  const filteredData = vendorSubscriptions.filter((vendor) =>
    vendor.clientName.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

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

      {/* Standard Plan Card Section */}
      <div className="standard-plan-card">
        <div className="plan-header">
          <h3>Standard Plan</h3>
        </div>
        <div className="plan-details">
          <div className="plan-item">
            <div className="plan-icon">
              <MdPeople size={24} />
            </div>
            <div className="plan-info">
              <p className="plan-label">Count</p>
              <p className="plan-value">
                {vendorSubscriptions.filter((sub) => sub.planType === 'standard').length} vendors
              </p>
            </div>
          </div>
          <div className="plan-item">
            <div className="plan-icon">
              <MdAttachMoney size={24} />
            </div>
            <div className="plan-info">
              <p className="plan-label">Revenue</p>
              <p className="plan-value">
                ₹
                {vendorSubscriptions
                  .filter((sub) => sub.planType === 'standard' && sub.paymentStatus === 'paid')
                  .reduce((sum, sub) => sum + (sub.amount || 0), 0)
                  .toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Subscription Details Table Section */}
      <div className="subscription-table-section">
        <div className="table-header">
          <h3>Vendor Subscription Details</h3>
          <div className="filter-container">
            <FiSearch className="filter-icon" size={18} />
            <input
              type="text"
              placeholder="Search client name…"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="subscription-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Subscription Date</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((vendor, index) => (
                  <tr key={vendor.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                    <td>{vendor.clientName}</td>
                    <td>{formatDate(vendor.subscriptionDate)}</td>
                    <td>{formatDate(vendor.expiryDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    No vendors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;