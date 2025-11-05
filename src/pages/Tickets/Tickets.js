import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';
import './Tickets.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterStatus !== 'all') {
          params.append('status', filterStatus);
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }

        const response = await fetch(`${API_BASE_URL}/api/tickets?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          setTickets(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [filterStatus, searchTerm]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <FiCheck size={16} />;
      case 'in-progress':
        return <FiClock size={16} />;
      case 'pending':
        return <FiAlertCircle size={16} />;
      default:
        return <FiAlertCircle size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return '#10b981';
      case 'open':
        return '#ef4444';
      case 'in-progress':
        return '#f59e0b';
      case 'pending':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const filteredTickets = tickets;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getAvatar = (vendor) => {
    const avatars = ['👰', '🎉', '🍽️', '✨', '💙', '💎', '🎭', '📋'];
    const index = vendor ? vendor.charCodeAt(0) % avatars.length : 0;
    return avatars[index];
  };

  if (loading) {
    return (
      <div className="tickets-container">
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <div className="header-top">
          <h1 className="page-title">Support Tickets</h1>
          <button className="btn-create-ticket">
            <FiPlus size={18} />
            Create Ticket
          </button>
        </div>

        <div className="filter-section">
          <div className="search-box">
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search by ID, title, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterStatus === 'open' ? 'active' : ''}`}
              onClick={() => setFilterStatus('open')}
            >
              Open
            </button>
            <button
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </button>
            <button
              className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilterStatus('in-progress')}
            >
              In Progress
            </button>
            <button
              className={`filter-btn ${filterStatus === 'resolved' ? 'active' : ''}`}
              onClick={() => setFilterStatus('resolved')}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      <div className="tickets-list">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-left">
                <div className="ticket-avatar">{getAvatar(ticket.vendor)}</div>
                <div className="ticket-main">
                  <div className="ticket-title-row">
                    <h3 className="ticket-id">{ticket.ticketId || ticket.id}</h3>
                    <p className="ticket-title">{ticket.title}</p>
                  </div>
                  <p className="ticket-description">{ticket.description}</p>
                  <p className="ticket-vendor">📌 {ticket.vendor || 'N/A'}</p>
                </div>
              </div>

              <div className="ticket-right">
                <div className="ticket-status">
                  <div
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    {getStatusIcon(ticket.status)}
                    <span>{ticket.status.replace('-', ' ')}</span>
                  </div>
                </div>

                <div className="ticket-priority">
                  <div
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                  >
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </div>
                </div>

                <div className="ticket-date">
                  <p className="date-text">{formatDate(ticket.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tickets">
            <p>No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;