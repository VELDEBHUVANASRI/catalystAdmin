import React, { useEffect, useState } from 'react';
import { FiSearch, FiDownload, FiX } from 'react-icons/fi';
import './TicketTables.css';

const UserTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [confirmModal, setConfirmModal] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      (!searchTerm ||
        (ticket.ticketId || ticket.id || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.user || ticket.userId || '').toString().toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || (ticket.priority || '').toLowerCase() === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  useEffect(() => {
    const controller = new AbortController();
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError('');
        const params = new URLSearchParams();
        if (priorityFilter && priorityFilter !== 'all') params.append('priority', priorityFilter);
        if (searchTerm) params.append('search', searchTerm);

        const res = await fetch(`/api/tickets${params.toString() ? `?${params.toString()}` : ''}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error ${res.status}: ${text}`);
        }

        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load tickets');

        // Map API tickets to local shape expected by the UI
        const mapped = (json.data || []).map((t) => ({
          id: t.id || t._id,
          ticketId: t.ticketId || t.id,
          userId: t.userId || '',
          user: t.user || '',
          title: t.title || '',
          priority: t.priority || 'low',
          attachment: t.attachment || '',
          attachmentUrl: t.attachmentUrl || t.attachmentData || '',
          status: t.status || 'open',
        }));

        setTickets(mapped);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching tickets:', err);
          setError(err.message || 'Failed to fetch tickets');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
    return () => controller.abort();
  }, [priorityFilter, searchTerm]);

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
            <option value="medium">Medium</option>
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
              <th>Attachment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="no-data">Loading tickets...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="no-data">Error: {error}</td>
              </tr>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="ticket-id-cell">{ticket.ticketId || ticket.id}</td>
                  <td className="user-id-cell">{ticket.user || ticket.userId}</td>
                  <td className="title-cell">{ticket.title}</td>
                  <td className="priority-cell">
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                    >
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </td>
                  <td className="attachment-cell">
                    {ticket.attachmentUrl ? (
                      <a href={ticket.attachmentUrl} target="_blank" rel="noopener noreferrer" className="attachment-btn">
                        <FiDownload size={16} />
                        {ticket.attachment || 'Download'}
                      </a>
                    ) : (
                      <button className="attachment-btn" disabled title="No attachment">
                        <FiDownload size={16} />
                        {ticket.attachment || '—'}
                      </button>
                    )}
                  </td>
                  <td className="status-cell">
                    <span
                      className={`status-badge ${ticket.status}`}
                    >
                      {ticket.status === 'open' ? '🔴 Open' : '✅ Closed'}
                    </span>
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
                <td colSpan="7" className="no-data">
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