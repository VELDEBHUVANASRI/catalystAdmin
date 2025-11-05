import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import './User.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const User = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [emailFilter, setEmailFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');

  const [activeUsers, setActiveUsers] = useState([]);
  const [activeLoading, setActiveLoading] = useState(true);
  const [activeError, setActiveError] = useState('');

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [blockedLoading, setBlockedLoading] = useState(true);
  const [blockedError, setBlockedError] = useState('');

  const fetchActiveUsers = useCallback(async () => {
    try {
      setActiveLoading(true);
      setActiveError('');

      const response = await fetch(`${API_BASE_URL}/api/users/active`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const result = await response.json();
      const data = Array.isArray(result.data) ? result.data : [];
      const formatted = data.map((user) => ({
        id: user.id || user._id || '',
        fullName: user.name || user.fullName || '',
        email: user.email || '',
        mobileNumber: user.mobile || user.phone || '',
        joinDate: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : '',
        status: typeof user.status === 'string' ? user.status.toLowerCase() : 'active',
        city: user.city || '',
        raw: user,
      }));

      setActiveUsers(formatted);
    } catch (error) {
      console.error('Error fetching active users:', error);
      setActiveError(error.message);
      setActiveUsers([]);
    } finally {
      setActiveLoading(false);
    }
  }, []);

  const fetchBlockedUsers = useCallback(async () => {
    try {
      setBlockedLoading(true);
      setBlockedError('');

      const response = await fetch(`${API_BASE_URL}/api/users/blocked`);
      if (!response.ok) {
        throw new Error(`Failed to fetch blocked users: ${response.statusText}`);
      }

      const result = await response.json();
      const data = Array.isArray(result.data) ? result.data : [];
      const formatted = data.map((user) => {
        const blockedAt = user.blockedAt || user.updatedAt || user.createdAt;
        return {
          id: user.userId || user.id || '',
          fullName: user.name || user.fullName || '',
          email: user.email || '',
          mobileNumber: user.mobile || user.phone || '',
          blockedDate: blockedAt ? new Date(blockedAt).toISOString().slice(0, 10) : '',
          status: 'blocked',
          raw: user,
        };
      });

      setBlockedUsers(formatted);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      setBlockedError(error.message);
      setBlockedUsers([]);
    } finally {
      setBlockedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveUsers();
  }, [fetchActiveUsers]);

  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  useEffect(() => {
    const handleUserBlocked = () => {
      fetchActiveUsers();
      fetchBlockedUsers();
    };

    window.addEventListener('user-blocked', handleUserBlocked);
    return () => {
      window.removeEventListener('user-blocked', handleUserBlocked);
    };
  }, [fetchActiveUsers, fetchBlockedUsers]);

  const getFilteredUsers = useCallback(
    (users) => {
      return users.filter((user) => {
        const emailMatch = user.email.toLowerCase().includes(emailFilter.toLowerCase());

        let dateMatch = true;
        const today = new Date();
        const dateValue = user.joinDate || user.blockedDate;
        const userDate = dateValue ? new Date(dateValue) : null;

        const isValidDate = userDate instanceof Date && !Number.isNaN(userDate.getTime());

        if (dateFilter === 'week') {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateMatch = isValidDate ? userDate >= weekAgo : true;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateMatch = isValidDate ? userDate >= monthAgo : true;
        } else if (dateFilter === 'year') {
          const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
          dateMatch = isValidDate ? userDate >= yearAgo : true;
        } else if (dateFilter === 'custom' && customDateStart && customDateEnd) {
          const start = new Date(customDateStart);
          const end = new Date(customDateEnd);
          dateMatch = isValidDate ? userDate >= start && userDate <= end : true;
        }

        return emailMatch && dateMatch;
      });
    },
    [customDateEnd, customDateStart, dateFilter, emailFilter]
  );

  const filteredActiveUsers = useMemo(() => getFilteredUsers(activeUsers), [activeUsers, getFilteredUsers]);
  const filteredBlockedUsers = useMemo(() => getFilteredUsers(blockedUsers), [blockedUsers, getFilteredUsers]);

  const handleResetFilters = () => {
    setEmailFilter('');
    setDateFilter('all');
    setCustomDateStart('');
    setCustomDateEnd('');
  };

  const handleUnblockUser = async (userId) => {
    if (!userId) {
      return;
    }

    const confirmAction = window.confirm('Do you want to unblock this user?');
    if (!confirmAction) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'active' }),
      });

      if (!response.ok) {
        throw new Error('Failed to unblock user');
      }

      alert('User unblocked successfully!');
      await fetchBlockedUsers();
      await fetchActiveUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert(error.message || 'Failed to unblock user');
    }
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h1>User Management</h1>
        <button className="create-btn" onClick={() => navigate('/user/create')}>
          <FiPlus size={20} /> Create User
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <button
            className={`filter-btn ${dateFilter === 'week' ? 'active' : ''}`}
            onClick={() => setDateFilter('week')}
          >
            Week
          </button>
          <button
            className={`filter-btn ${dateFilter === 'month' ? 'active' : ''}`}
            onClick={() => setDateFilter('month')}
          >
            Month
          </button>
          <button
            className={`filter-btn ${dateFilter === 'year' ? 'active' : ''}`}
            onClick={() => setDateFilter('year')}
          >
            Year
          </button>
        </div>

        <div className="filter-inputs">
          <div className="date-range-filter">
            <input
              type="date"
              value={customDateStart}
              onChange={(e) => {
                setCustomDateStart(e.target.value);
                setDateFilter('custom');
              }}
              placeholder="Start Date"
            />
            <span className="separator">-</span>
            <input
              type="date"
              value={customDateEnd}
              onChange={(e) => {
                setCustomDateEnd(e.target.value);
                setDateFilter('custom');
              }}
              placeholder="End Date"
            />
          </div>

          <div className="email-filter">
            <FiSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Filter by email..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
          </div>

          <button className="reset-btn" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="tabs-section">
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Users ({activeLoading ? '...' : filteredActiveUsers.length})
          </button>
          <button
            className={`tab ${activeTab === 'blocked' ? 'active' : ''}`}
            onClick={() => setActiveTab('blocked')}
          >
            Blocked Users ({blockedLoading ? '...' : filteredBlockedUsers.length})
          </button>
        </div>
      </div>

      <div className="content-section">
        {activeTab === 'active' && (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>City</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeLoading ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      Loading active users...
                    </td>
                  </tr>
                ) : activeError ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      {activeError}
                    </td>
                  </tr>
                ) : filteredActiveUsers.length > 0 ? (
                  filteredActiveUsers.map((user, index) => (
                    <tr key={user.id || index}>
                      <td>
                        <div className="user-name-cell">
                          <span className="user-name">{user.fullName || 'Unnamed User'}</span>
                          {user.raw?.role && <span className="user-role">{user.raw.role}</span>}
                        </div>
                      </td>
                      <td>{user.email || '—'}</td>
                      <td>{user.mobileNumber || '—'}</td>
                      <td>{user.city || '—'}</td>
                      <td>{user.joinDate || '—'}</td>
                      <td>
                        <span className={`user-status ${user.status}`}>
                          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="details-btn"
                          onClick={() =>
                            navigate(`/user/details/${user.id}`, {
                              state: { user, status: 'active' },
                            })
                          }
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No active users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'blocked' && (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {blockedLoading ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      Loading blocked users...
                    </td>
                  </tr>
                ) : blockedError ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      {blockedError}
                    </td>
                  </tr>
                ) : filteredBlockedUsers.length > 0 ? (
                  filteredBlockedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fullName || 'Unnamed User'}</td>
                      <td>{user.email || '—'}</td>
                      <td>{user.mobileNumber || '—'}</td>
                      <td>
                        <button className="unblock-btn" onClick={() => handleUnblockUser(user.id)}>
                          Unblock
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No blocked users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
