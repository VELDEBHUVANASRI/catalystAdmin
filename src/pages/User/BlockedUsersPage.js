import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import './BlockedUsersPage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const BlockedUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [emailFilter, setEmailFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const buildUrl = () => {
    // Use the dedicated blocked users endpoint which reads from the blocked_user collection
    // Additional client-side filters (email/date) are applied after fetch
    return `${API_BASE_URL}/api/users/blocked`;
  };

  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(buildUrl());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch blocked users');
      }

      setUsers(data.data.map(user => ({
        id: user.userId || user._id || user.id,
        fullName: user.name || user.fullName || '',
        email: user.email || '',
        mobile: user.mobile || user.mobileNumber || '',
        blockedDate: user.blockedAt || user.joinedDate || null,
        joinedDate: user.blockedAt ? new Date(user.blockedAt).toLocaleDateString() : '',
      })));
    } catch (err) {
      console.error('Error fetching blocked users:', err);
      setError(err.message || 'Failed to fetch blocked users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Listen for 'user-blocked' events to refresh the list automatically
    const handler = () => fetchUsers();
    window.addEventListener('user-blocked', handler);
    return () => {
      window.removeEventListener('user-blocked', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (emailFilter && !(u.email || '').toLowerCase().includes(emailFilter.toLowerCase())) return false;
      return true;
    });
  }, [users, emailFilter]);

  const handleUnblock = async (userId) => {
    if (!window.confirm('Are you sure you want to unblock this user?')) return;
    
    try {
      setError(''); // Clear any existing error
      setLoading(true); // Show loading state
      
      // Call unblock endpoint
      const res = await fetch(`${API_BASE_URL}/api/users/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ userId }),
      });

      // Parse response even if not ok to get error message
      const body = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        const errorMessage = body?.message || `Failed to unblock user (HTTP ${res.status})`;
        // If we get a 404, the user might already be unblocked
        if (res.status === 404) {
          // Refresh the list to verify
          await fetchUsers();
          return;
        }
        throw new Error(errorMessage);
      }
      
      if (!body?.success) {
        throw new Error(body?.message || 'Server reported failure to unblock user');
      }

      // On success, remove user from the list
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      // Show success feedback
      setError('User successfully unblocked');
      setTimeout(() => setError(''), 3000); // Clear success message after 3 seconds
      
    } catch (err) {
      console.error('Failed to unblock user:', err);
      setError(err.message || 'Failed to unblock user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blocked-users-container">
      <div className="blocked-users-header">
        <h1>Blocked Users</h1>
        <div className="header-actions">
          <button className="create-user-btn" onClick={() => navigate('/user/create')}>
            <FiPlus size={14} />
            Create User
          </button>
        
        </div>
      </div>

      <div className="filters-row">
        <div className="filter-item">
          <label>Custom Date Range</label>
          <div className="date-range">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <span>to</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>

        <div className="filter-item">
          <label>Email</label>
          <input type="text" placeholder="Filter by email" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} />
        </div>

        <div className="filter-actions">
          <button onClick={fetchUsers} className="apply-btn">Apply</button>
          <button onClick={() => { setEmailFilter(''); setDateFrom(''); setDateTo(''); fetchUsers(); }} className="reset-btn">Reset</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Joined Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="loading-cell">Loading blocked users...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="no-data">No blocked users found</td></tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.fullName || '—'}</td>
                  <td>{user.email || '—'}</td>
                  <td>{user.mobile || '—'}</td>
                  <td>{user.joinedDate || '—'}</td>
                  <td>
                    <button className="unblock-btn" onClick={() => handleUnblock(user.id)}>Unblock</button>
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

export default BlockedUsersPage;
