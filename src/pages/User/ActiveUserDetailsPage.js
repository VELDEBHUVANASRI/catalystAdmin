import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSlash } from 'react-icons/fi';
import './ActiveUserDetailsPage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const ActiveUserDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [blocking, setBlocking] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!id) {
      setError('User id is missing');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(id)}`);
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = (data && data.message) || `Failed to load user (${response.status})`;
        throw new Error(msg);
      }
      const result = await response.json();
      if (result?.success && result?.data?.user) {
        setUser(result.data.user);
        setOrders(Array.isArray(result.data.orders) ? result.data.orders : []);
      } else {
        throw new Error(result?.message || 'Failed to load user');
      }
    } catch (err) {
      setError(err.message || 'Failed to load user');
      setUser(null);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleBlockUser = async () => {
    if (!id) return;
    try {
      setBlocking(true);
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'blocked' }),
      });
      if (!response.ok) {
        throw new Error('Failed to block user');
      }
      const result = await response.json();
      if (result?.success && result?.data?.user) {
        setUser(result.data.user);
      }
      navigate('/user');
    } catch (err) {
      setError(err.message || 'Failed to block user');
    } finally {
      setBlocking(false);
    }
  };

  return (
    <div className="user-details-page">
      <div className="user-details-header">
        <button type="button" className="back-btn" onClick={() => navigate('/user')}>
          <FiArrowLeft size={18} />
          Back to active Users
        </button>

        <button
          type="button"
          className="block-btn"
          onClick={handleBlockUser}
          disabled={blocking}
          title="Block User"
        >
          <FiSlash size={16} />
          Block User
        </button>
      </div>

      {loading && <div className="status-row">Loading user...</div>}
      {error && !loading && <div className="error-row">{error}</div>}

      {user && !loading && (
        <div className="user-details-grid">
          <section className="card">
            <h2 className="card-title">User Details</h2>
            <div className="user-profile">
              <div className="profile-pic">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName || 'User'} />
                ) : (
                  <div className="avatar-fallback">{(user.fullName || 'U').charAt(0)}</div>
                )}
              </div>
              <div className="profile-info">
                <div className="row"><span className="label">Full Name</span><span className="value">{user.fullName || '—'}</span></div>
                <div className="row"><span className="label">Email</span><span className="value">{user.email || '—'}</span></div>
                <div className="row"><span className="label">Mobile Number</span><span className="value">{user.mobileNumber || '—'}</span></div>
                <div className="row"><span className="label">Address</span><span className="value">{user.address || '—'}</span></div>
                <div className="row"><span className="label">Member Since</span><span className="value member-since">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span></div>
              </div>
            </div>
          </section>

          {orders.length > 0 && (
            <section className="card">
              <h2 className="card-title">Recent Orders</h2>
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Service Type</th>
                      <th>Vendor</th>
                      <th>Amount Paid</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td>{o.orderId || '—'}</td>
                        <td>{o.serviceType || '—'}</td>
                        <td>{o.vendorName || '—'}</td>
                        <td>{o.amountPaid != null ? o.amountPaid : '—'}</td>
                        <td>{o.dateOfService ? new Date(o.dateOfService).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveUserDetailsPage;


