import React, { useState } from 'react';
import { FiSearch, FiDownload, FiX } from 'react-icons/fi';
import './TicketTables.css';

const UserTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [confirmModal, setConfirmModal] = useState(null);
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-101',
      userId: 'U-001',
      title: 'Unable to Book Event',
      priority: 'high',
      attachment: 'error_screenshot.png',
      status: 'open',
    },
    {
      id: 'TKT-102',
      userId: 'U-005',
      title: 'Refund Request for Cancelled Event',
      priority: 'high',
      attachment: 'cancellation_request.pdf',
      status: 'open',
    },
    {
      id: 'TKT-103',
      userId: 'U-003',
      title: 'Password Reset Not Working',
      priority: 'medium',
      attachment: 'account_issue.docx',
      status: 'closed',
    },
    {
      id: 'TKT-104',
      userId: 'U-002',
      title: 'Event Date Changed by Vendor',
      priority: 'medium',
      attachment: 'date_change_notice.pdf',
      status: 'open',
    },
    {
      id: 'TKT-105',
      userId: 'U-004',
      title: 'Missing Invoice for Event',
      priority: 'low',
      attachment: 'invoice_request.txt',
      status: 'closed',
    },
    {
      id: 'TKT-106',
      userId: 'U-006',
      title: 'Payment Charged Twice',
      priority: 'high',
      attachment: 'payment_duplicate.xlsx',
      status: 'open',
    },
  ]);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

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
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="ticket-id-cell">{ticket.id}</td>
                  <td className="user-id-cell">{ticket.userId}</td>
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
                    <button className="attachment-btn" title="Download attachment">
                      <FiDownload size={16} />
                      {ticket.attachment}
                    </button>
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