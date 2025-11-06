import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiFilter, FiRefreshCw } from 'react-icons/fi';
import './ActiveUsersPage.css';
import Toast from '../../components/Toast/Toast';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const STATUS_BADGES = {
  active: { label: 'Active', color: '#10b981' },
  inactive: { label: 'Inactive', color: '#6b7280' },
  suspended: { label: 'Suspended', color: '#ef4444' },
};

const ActiveUsersPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [emailFilter, setEmailFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `Server error: ${response.status}`);
      }

      if (responseData?.success) {
        const formattedUsers = (responseData.data || []).map(user => ({
          id: user._id?.toString() || user.id || '',  // Ensure we get the MongoDB _id
          fullName: user.name || user.fullName || '',
          email: user.email || '',
          mobile: user.mobile || '',
          status: user.status || 'active',
          joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
          lastActive: user.lastActive ? new Date(user.lastActive).toLocaleDateString() : '',
        }));
        setUsers(formattedUsers);
        setError('');
      } else {
        throw new Error(responseData?.message || 'Failed to load active users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [emailFilter, nameFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger, emailFilter, nameFilter, dateFrom, dateTo]);

  const refreshUsers = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Email filter
      if (emailFilter && !(u.email || '').toLowerCase().includes(emailFilter.toLowerCase())) {
        return false;
      }

      // Name filter
      if (nameFilter) {
        const name = (u.fullName || '').toLowerCase();
        if (!name.includes(nameFilter.toLowerCase())) {
          return false;
        }
      }

      // Date range filter
      if (dateFrom || dateTo) {
        const userDate = new Date(u.joinedDate);
        
        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          if (userDate < fromDate) return false;
        }
        
        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999); // Include the entire day
          if (userDate > toDate) return false;
        }
      }

      return true;
    });
  }, [users, emailFilter, nameFilter, dateFrom, dateTo]);

  const resetFilters = () => {
    setEmailFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="users-page-container">
      <div className="users-page-header">
        <h1>Active Users</h1>
        <button
          type="button"
          className="create-user-btn"
          onClick={() => navigate('/user/create')}
        >
          <FiPlus size={16} />
          Create User
        </button>
      </div>

      <div className="users-filters">
        <div className="filter-row">
          <div className="filter-item">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Filter by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <label>Email</label>
            <input
              type="text"
              placeholder="Filter by email"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <label>Date Range</label>
            <div className="date-range">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="date-input"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="date-input"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button 
              type="button" 
              className="refresh-btn" 
              onClick={refreshUsers} 
              disabled={loading}
            >
              <FiRefreshCw size={16} className={loading ? 'spin' : ''} />
              Refresh
            </button>
            <button 
              type="button" 
              className="reset-btn" 
              onClick={resetFilters} 
              disabled={loading}
            >
              <FiFilter size={16} />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="users-error">{error}</div>
      )}

      <div className="users-table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="loading-cell">
                  <div className="loading-spinner">
                    <FiRefreshCw size={20} className="spin" />
                    Loading users from database...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="error-cell">
                  <div className="error-message">
                    {error}
                    <button onClick={refreshUsers} className="retry-btn">
                      <FiRefreshCw size={16} /> Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  {error ? (
                    <div className="error-message">
                      <span>{error}</span>
                      <button onClick={refreshUsers} className="retry-btn">
                        <FiRefreshCw size={16} /> Retry
                      </button>
                    </div>
                  ) : (
                    'No users found'
                  )}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td>{user.fullName || '—'}</td>
                  <td>{user.email || '—'}</td>
                  <td>{user.mobile || '—'}</td>
                  <td>{user.joinedDate || '—'}</td>
                  <td>
                    {/* View Details removed - only Block User action available */}
                    <button
                      type="button"
                      className="block-user-btn"
                      onClick={async () => {
                        // Validate user data first
                        if (!user) {
                          setError('Invalid user data');
                          return;
                        }

                        // Ensure we have a valid ID
                        if (!user.id || typeof user.id !== 'string' || user.id.trim() === '') {
                          console.error('Invalid user ID:', user);
                          setError('Invalid user ID');
                          return;
                        }

                        // Ask for confirmation
                        const displayName = user.fullName || user.email || 'this user';
                        if (!window.confirm(`Are you sure you want to block ${displayName}?`)) {
                          return;
                        }

                        try {
                          setError(''); // Clear any previous errors
                          
                          // Ensure we have a valid user ID
                          const userId = user.id || (user._id && user._id.toString()) || user._id;
                          if (!userId) {
                            throw new Error('User ID is missing');
                          }
                          
                          // Ensure we have a clean string ID
                          const cleanUserId = String(userId).trim();
                          if (!cleanUserId) {
                            throw new Error('Invalid User ID format');
                          }
                          
                          console.log('Blocking user:', cleanUserId);

                          const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(cleanUserId)}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              status: 'blocked',
                              blockedAt: new Date().toISOString()
                            }),
                          });

                          const body = await res.json();
                          console.log('Block user response:', body);

                          if (!res.ok) {
                            throw new Error(body?.message || `Failed to block user (${res.status})`);
                          }

                          if (!body?.success) {
                            throw new Error(body?.message || 'Failed to block user');
                          }

                          // Update local state
                          setUsers((prev) => prev.filter((u) => (u.id || u._id) !== cleanUserId));
                          setToast({ message: 'User blocked successfully', type: 'success' });
                          
                          // Notify other components
                          window.dispatchEvent(new CustomEvent('user-blocked', { 
                            detail: { 
                              userId: cleanUserId,
                              userEmail: user.email,
                              blockedAt: new Date().toISOString()
                            } 
                          }));

                          // Refresh the user list
                          refreshUsers();
                        } catch (err) {
                          console.error('Error blocking user:', err);
                          setError(err.message || 'Failed to block user');
                          setToast({ message: err.message || 'Failed to block user', type: 'error' });
                        }
                      }}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                      disabled={user.status === 'blocked'}
                    >
                      {user.status === 'blocked' ? 'Blocked' : 'Block User'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ActiveUsersPage;

// Render Toast at root of the component


