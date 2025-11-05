import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import './UserDetailsPage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const UserDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const presetUser = location.state?.user || null;
  const [user, setUser] = useState(presetUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(!presetUser);
  const [error, setError] = useState('');
  const [blocking, setBlocking] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const loadUser = useCallback(async () => {
    if (!id) {
      setError('Invalid user reference');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`);

      if (!response.ok) {
        throw new Error('Failed to load user');
      }

      const result = await response.json();
      const data = result.data || {};
      setUser(data.user || null);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setError(err.message || 'Unable to fetch user');
      setUser(null);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) {
      return 'N/A';
    }
    const date = new Date(user.createdAt);
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  }, [user]);

  const statusLabel = useMemo(() => {
    if (!user?.status) {
      return 'Unknown';
    }
    return user.status.charAt(0).toUpperCase() + user.status.slice(1);
  }, [user]);

  const handleBlockUser = () => {
    setShowBlockModal(true);
  };

  const confirmBlockUser = async () => {
    if (!id) {
      return;
    }

    try {
      setBlocking(true);
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'blocked' }),
      });

      if (!response.ok) {
        throw new Error('Failed to block user');
      }

      window.dispatchEvent(new CustomEvent('user-blocked', { detail: { userId: id } }));
      setShowBlockModal(false);
      navigate('/user');
    } catch (err) {
      alert(err.message || 'Failed to block user');
    } finally {
      setBlocking(false);
    }
  };

  const formatAmount = (value) => {
    if (value === null || value === undefined) {
      return '—';
    }
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      return '—';
    }
    return `₹${numberValue.toLocaleString('en-IN')}`;
  };

  const formatDate = (value) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="user-details-container">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/user')}>
          <FiArrowLeft size={20} />
          Back to Users
        </button>
        <button className="block-btn" onClick={handleBlockUser} disabled={!user || blocking || user?.status === 'blocked'}>
          <FiAlertCircle size={18} />
          {blocking ? 'Blocking...' : 'Block User'}
        </button>
      </div>

      {loading && <div className="loading-state">Loading user...</div>}

      {!loading && error && <div className="error-state">{error}</div>}

      {!loading && !error && user && (
        <>
          <div className="user-info-card">
            <div className="user-header-section">
              <img
                src={user.profileImage || 'https://via.placeholder.com/120?text=User'}
                alt="User Profile"
                className="user-avatar"
              />
              <div className="user-header-info">
                <h2>{user.fullName || 'User Name'}</h2>
                <span className="member-since">Member since {memberSince}</span>
              </div>
            </div>

            <div className="user-details-grid">
              <div className="detail-item">
                <label>Email</label>
                <p>{user.email || '—'}</p>
              </div>
              <div className="detail-item">
                <label>Mobile Number</label>
                <p>{user.mobileNumber || '—'}</p>
              </div>
              <div className="detail-item">
                <label>Address</label>
                <p>{user.address || '—'}</p>
              </div>
              <div className="detail-item">
                <label>City</label>
                <p>{user.city || '—'}</p>
              </div>
              <div className="detail-item">
                <label>State</label>
                <p>{user.state || '—'}</p>
              </div>
              <div className="detail-item">
                <label>Postal Code</label>
                <p>{user.postalCode || '—'}</p>
              </div>
              <div className="detail-item">
                <label>Country</label>
                <p>{user.country || '—'}</p>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <span className={`status-pill ${user.status || ''}`}>{statusLabel}</span>
              </div>
            </div>
          </div>

          <div className="order-history-section">
            <h3>Order History</h3>
            {orders.length === 0 ? (
              <div className="empty-orders">No past orders found</div>
            ) : (
              <div className="orders-grid">
                {orders.map((order) => (
                  <div key={order.id || order.orderId} className="order-card">
                    <div className="order-header">
                      <h4>{order.serviceType || 'Service'}</h4>
                      <span className="order-id">{order.orderId || 'N/A'}</span>
                    </div>
                    <div className="order-details">
                      <div className="detail">
                        <span className="label">Vendor Name:</span>
                        <span className="value">{order.vendorName || '—'}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Amount Paid:</span>
                        <span className="value">{formatAmount(order.amountPaid)}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Date of Service:</span>
                        <span className="value">{formatDate(order.dateOfService)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {showBlockModal && (
        <div className="modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Block User</h3>
            <p>Are you sure you want to block this user?</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowBlockModal(false)} disabled={blocking}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmBlockUser} disabled={blocking}>
                {blocking ? 'Blocking...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPage;
