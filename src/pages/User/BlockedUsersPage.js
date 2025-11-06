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

  
  useEffect(() => {
  

    // Listen for 'user-blocked' events to refresh the list automatically
    const handler = () => ();
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
    if (!window.confirm('Unblock this user?')) return;
    try {
      // First try to fetch the user from blocked_users to get the most up-to-date ID
      const fetchRes = await fetch(`${API_BASE_URL}/api/users/blocked`);
      const fetchBody = await fetchRes.json();
      const blockedUser = fetchBody.data?.find(u => u.id === userId || u._id === userId || u.userId === userId);
      
      if (!blockedUser) {
        throw new Error('User no longer appears to be blocked');
      }

      // Use the most reliable ID we have
      const finalUserId = blockedUser.userId || blockedUser._id || blockedUser.id;
      
      const res = await fetch(`${API_BASE_URL}/api/users/${finalUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'active',
          source: 'blocked_user' // Add source to help backend identify the operation
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Failed to unblock user (${res.status})`);
      }

      const body = await res.json();
      if (!body?.success) {
        throw new Error(body?.message || 'Failed to unblock user');
      }

      // remove from list
      setUsers(prev => prev.filter(u => u.id !== userId));

      // Show success message
      setError(''); // Clear any existing error
      // You could add a success message state if you want to show positive feedback
    } catch (err) {
      console.error('Failed to unblock user', err);
      setError(err.message || 'Failed to unblock user');
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
