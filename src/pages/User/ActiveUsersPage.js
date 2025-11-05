import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiFilter, FiRefreshCw } from 'react-icons/fi';
import './ActiveUsersPage.css';

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
          id: user.id,
          fullName: user.fullName || '',
          email: user.email || '',
          mobile: user.mobile || '',
          status: user.status || 'active',
          joinedDate: user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : '',
          lastActive: user.lastActive ? new Date(user.lastActive).toLocaleDateString() : '',
        }));

        // Apply client-side filtering
        let filteredData = formattedUsers;
        
        if (emailFilter?.trim()) {
          const emailSearch = emailFilter.trim().toLowerCase();
          filteredData = filteredData.filter(user => 
            user.email.toLowerCase().includes(emailSearch)
          );
        }
        
        if (nameFilter?.trim()) {
          const nameSearch = nameFilter.trim().toLowerCase();
          filteredData = filteredData.filter(user => 
            user.fullName.toLowerCase().includes(nameSearch)
          );
        }
        
        if (dateFrom || dateTo) {
          filteredData = filteredData.filter(user => {
            const userDate = new Date(user.joinedDate);
            if (dateFrom && userDate < new Date(dateFrom)) return false;
            if (dateTo) {
              const toDate = new Date(dateTo);
              toDate.setHours(23, 59, 59, 999);
              if (userDate > toDate) return false;
            }
            return true;
          });
        }
        
        setUsers(filteredData);
        setUsers(formattedUsers);
        setError('');
      } else {
        throw new Error(result?.message || 'Failed to load active users');
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
  }, [fetchUsers, refreshTrigger]);

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
              <th>Mobile Number</th>
              <th>Joined Date</th>
              <th>Last Active</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="loading-cell">
                  <div className="loading-spinner">
                    <FiRefreshCw size={20} className="spin" />
                    Loading users from database...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="error-cell">
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
                <td colSpan="7" className="empty-cell">
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
                  <td>{user.lastActive || '—'}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: STATUS_BADGES[user.status]?.color || '#6b7280',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {STATUS_BADGES[user.status]?.label || user.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="view-details-btn"
                      onClick={() => navigate(`/user/details/${user.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveUsersPage;


