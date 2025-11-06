import React, { useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './TicketTables.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const UserTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [confirmModal, setConfirmModal] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
  const res = await fetch(`${API_BASE_URL}/api/usertickets`);
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const body = await res.json();
      if (!body?.success) throw new Error(body?.message || 'Failed to fetch tickets');
      setTickets(body.data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message || 'Failed to fetch tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const q = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (ticket.id || '').toLowerCase().includes(q) ||
      (ticket.title || '').toLowerCase().includes(q) ||
      (ticket.userId || ticket.user || '').toLowerCase().includes(q);
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getStatusLabel = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'open':
        return 'Open';
      case 'pending':
        return 'Pending';
      case 'in-progress':
      case 'inprogress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      default:
        return status || '';
    }
  };

  const getStatusClass = (status) => `status-badge ${status}`;

  const handleCloseTicket = (ticketId) => {
    setConfirmModal({
      type: 'close',
      ticketId,
      message: 'Are you sure you want to close this ticket?',
    });
  };

  const handleReopenTicket = (ticketId) => {
    setConfirmModal({
      type: 'reopen',
      ticketId,
      message: 'Are you sure you want to reopen this ticket?',
    });
  };

  const confirmAction = () => {
    if (!confirmModal) return;

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === confirmModal.ticketId
          ? {
              ...ticket,
              status: confirmModal.type === 'close' ? 'closed' : 'open',
            }
          : ticket
      )
    );
    setConfirmModal(null);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#DC3545',
      medium: '#FFC107',
      low: '#28A745',
    };
    return colors[priority] || '#007BFF';
  };

  return (
    <div className="tickets-table-container">
      <div className="tickets-table-header">
        <h1 className="page-title">User Tickets</h1>
      </div>

      <div className="tickets-controls">
        <div className="search-box">
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Search by Ticket ID, Title, or User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-section">
          <label htmlFor="priority-filter">Priority:</label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>User ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="no-data">Loading tickets...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="no-data">Error: {error}</td>
              </tr>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="ticket-id-cell">{ticket.ticketId || ticket.id}</td>
                  <td className="user-id-cell">{ticket.userId || ticket.user}</td>
                  <td className="title-cell">{ticket.title}</td>
                  <td className="priority-cell">
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                    >
                      {ticket.priority ? ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1) : ''}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span className={getStatusClass(ticket.status)}>{getStatusLabel(ticket.status)}</span>
                  </td>
                  <td className="action-cell">
                    {ticket.status === 'open' ? (
                      <button
                        className="btn-action btn-close"
                        onClick={() => handleCloseTicket(ticket.id)}
                      >
                        Close Ticket
                      </button>
                    ) : (
                      <button
                        className="btn-action btn-reopen"
                        onClick={() => handleReopenTicket(ticket.id)}
                      >
                        Reopen Ticket
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Action</h2>
              <button
                className="modal-close"
                onClick={() => setConfirmModal(null)}
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>{confirmModal.message}</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-modal btn-cancel"
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn-modal btn-confirm"
                onClick={confirmAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTickets;