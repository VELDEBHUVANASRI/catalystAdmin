import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiDollarSign, FiUsers } from 'react-icons/fi';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import './ServiceDetails.css';

const ServicePendingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const service = location.state?.service || {};
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Mock service details
  const mockDetails = {
    1: {
      type: 'Catering',
      name: 'Delicious Catering Co.',
      city: 'Mumbai',
      location: 'Bandra, Mumbai',
      price: 50000,
      capacity: 500,
      venueType: 'Indoor',
      status: 'Pending',
      profileImage: 'https://via.placeholder.com/100?text=Catering',
    },
    2: {
      type: 'Photography',
      name: 'Frame Perfect Studios',
      city: 'Delhi',
      location: 'CP, Delhi',
      price: 35000,
      capacity: 1000,
      venueType: 'Both',
      status: 'Pending',
      profileImage: 'https://via.placeholder.com/100?text=Photo',
    },
    3: {
      type: 'Decoration',
      name: 'Dream Decor Events',
      city: 'Bangalore',
      location: 'MG Road, Bangalore',
      price: 25000,
      capacity: 800,
      venueType: 'Outdoor',
      status: 'Pending',
      profileImage: 'https://via.placeholder.com/100?text=Decor',
    },
  };

  const details = mockDetails[service.id] || mockDetails[1];

  const handleApprove = () => {
    alert(`Service ${details.name} approved successfully!`);
    navigate('/vendor/services');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    alert(`Service rejected with reason: ${rejectionReason}`);
    navigate('/vendor/services');
  };

  return (
    <div className="service-details-container">
      <button
        className="back-btn"
        onClick={() => navigate('/vendor/services')}
      >
        <FiArrowLeft size={20} />
        Back to Services
      </button>

      <div className="service-details-card">
        <div className="details-header">
          <img
            src={details.profileImage}
            alt={details.name}
            className="service-image"
          />
          <div className="header-info">
            <h1 className="service-name">{details.name}</h1>
            <span className="status-badge pending">
              {details.status}
            </span>
          </div>
        </div>

        <div className="details-content">
          <div className="info-grid">
            <div className="info-item">
              <label>Service Type</label>
              <p>{details.type}</p>
            </div>
            <div className="info-item">
              <label>City</label>
              <p>{details.city}</p>
            </div>
            <div className="info-item">
              <label>Location</label>
              <div className="info-with-icon">
                <FiMapPin size={16} />
                <p>{details.location}</p>
              </div>
            </div>
            <div className="info-item">
              <label>Price</label>
              <div className="info-with-icon">
                <FiDollarSign size={16} />
                <p>₹{details.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="info-item">
              <label>Capacity</label>
              <div className="info-with-icon">
                <FiUsers size={16} />
                <p>{details.capacity} people</p>
              </div>
            </div>
            <div className="info-item">
              <label>Venue Type</label>
              <p>{details.venueType}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="approve-action-btn" onClick={handleApprove}>
              <MdCheckCircle size={18} />
              Approve Service
            </button>
            <button
              className="reject-action-btn"
              onClick={() => setShowRejectModal(true)}
            >
              <MdCancel size={18} />
              Reject Service
            </button>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Service</h2>
            <p>Are you sure you want to reject this service?</p>

            <div className="modal-form-group">
              <label htmlFor="reason">
                Reason for Rejection <span className="required">*</span>
              </label>
              <textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="modal-textarea"
                rows="4"
              />
            </div>

            <div className="modal-buttons">
              <button
                className="modal-cancel-btn"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-reject-btn"
                onClick={handleReject}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePendingDetails;