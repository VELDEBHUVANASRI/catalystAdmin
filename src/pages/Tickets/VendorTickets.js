import React, { useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './TicketTables.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const generateTicketId = (id) => {
  if (!id) {
    return `TKT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
  const suffix = String(id).slice(-6).toUpperCase();
  return `TKT-${suffix}`;
};

const getPriorityColor = (priority) => {
  const colors = {
    high: '#DC3545',
    medium: '#FFC107',
    low: '#28A745',
  };
  return colors[priority] || '#007BFF';
};

const getStatusLabel = (status) => (status === 'closed' ? 'Closed' : 'Open');

const getStatusClass = (status) => `status-badge ${status}`;

const VendorTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [confirmModal, setConfirmModal] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/tickets`);
        if (!response.ok) {
          throw new Error(`Failed to fetch tickets: ${response.statusText}`);
        }
        const result = await response.json();
        const data = Array.isArray(result.data) ? result.data : [];
  const formatted = data.map((ticket) => {
          const baseId = ticket.ticketId || ticket.id;
          const priorityValue = typeof ticket.priority === 'string' ? ticket.priority.toLowerCase() : 'low';
          const validPriorities = ['high', 'medium', 'low'];
          const status = ticket.status === 'closed' ? 'closed' : 'open';

          return {
            id: ticket.id || baseId || '',
            ticketId: ticket.ticketId ? ticket.ticketId : generateTicketId(baseId),
            vendorId: ticket.vendorId || '',
            title: ticket.title || '',
            priority: validPriorities.includes(priorityValue) ? priorityValue : 'low',
            // attachment removed per UI request
            status,
          };
        });
        setTickets(formatted);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError(err.message);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // attachments removed from Vendor Tickets view

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.vendorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const openConfirmModal = (ticketId, type) => {
    const messages = {
      close: 'Are you sure you want to close this ticket?',
      reopen: 'Are you sure you want to reopen this ticket?',
    };
    const nextStatuses = {
      close: 'closed',
      reopen: 'open',
    };
    setConfirmModal({
      type,
      ticketId,
      message: messages[type] || 'Are you sure you want to proceed?',
      nextStatus: nextStatuses[type] || null,
    });
  };

  const handleCloseTicket = (ticketId) => openConfirmModal(ticketId, 'close');
  const handleReopenTicket = (ticketId) => openConfirmModal(ticketId, 'reopen');

  const confirmAction = () => {
    if (!confirmModal || !confirmModal.nextStatus) {
      setConfirmModal(null);
      return;
    }

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticketId === confirmModal.ticketId
          ? {
              ...ticket,
              status: confirmModal.nextStatus,
            }
          : ticket
      )
    );
    setConfirmModal(null);
  };

  const renderActionButton = (ticket) => {
    if (ticket.status === 'open') {
      return (
        <button className="btn-action btn-close" onClick={() => handleCloseTicket(ticket.ticketId)}>
          Close Ticket
        </button>
      );
    }

    if (ticket.status === 'closed') {
      return (
        <button className="btn-action btn-reopen" onClick={() => handleReopenTicket(ticket.ticketId)}>
          Reopen Ticket
        </button>
      );
    }

    return <span className="no-action">—</span>;
  };

  return (
    <div className="tickets-table-container">
      <div className="tickets-table-header">
        <h1 className="page-title">Vendor Tickets</h1>
      </div>

      <div className="tickets-controls">
        <div className="search-box">
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Search by Ticket ID, Title, or Vendor ID..."
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
              <th>Vendor ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="no-data">
                  Loading tickets...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="no-data">
                  {error}
                </td>
              </tr>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id || ticket.ticketId}>
                  <td className="ticket-id-cell">{ticket.ticketId}</td>
                  <td className="vendor-id-cell">{ticket.vendorId || '—'}</td>
                  <td className="title-cell">{ticket.title || 'Untitled Ticket'}</td>
                  <td className="priority-cell">
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                    >
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span className={getStatusClass(ticket.status)}>{getStatusLabel(ticket.status)}</span>
                  </td>
                  <td className="action-cell">{renderActionButton(ticket)}</td>
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

      {confirmModal && (
        <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Action</h2>
              <button className="modal-close" onClick={() => setConfirmModal(null)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>{confirmModal.message}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-modal btn-cancel" onClick={() => setConfirmModal(null)}>
                Cancel
              </button>
              <button className="btn-modal btn-confirm" onClick={confirmAction}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorTickets;
