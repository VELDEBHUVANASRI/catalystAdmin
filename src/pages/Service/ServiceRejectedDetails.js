import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiDollarSign, FiUsers, FiAlertCircle } from 'react-icons/fi';
import './ServiceDetails.css';

const ServiceRejectedDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const service = location.state?.service || {};

  // Mock service details
  const mockDetails = {
    6: {
      type: 'Videography',
      name: 'Cinema Pro Films',
      city: 'Bangalore',
      location: 'Indiranagar, Bangalore',
      price: 40000,
      capacity: 1000,
      venueType: 'Outdoor',
      status: 'Rejected',
      rejectionReason: 'Documentation incomplete. Please provide updated business license and GST certificate.',
      profileImage: 'https://via.placeholder.com/100?text=Video',
    },
  };

  const details = mockDetails[service.id] || mockDetails[6];

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
            className="service-image rejected"
          />
          <div className="header-info">
            <h1 className="service-name">{details.name}</h1>
            <span className="status-badge rejected">
              <FiAlertCircle size={16} />
              {details.status}
            </span>
          </div>
        </div>

        {details.rejectionReason && (
          <div className="rejection-reason-card">
            <div className="rejection-header">
              <FiAlertCircle size={20} />
              <h3>Reason for Rejection</h3>
            </div>
            <p className="rejection-text">{details.rejectionReason}</p>
          </div>
        )}

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

          <div className="timeline-section">
            <h3 className="timeline-title">Service Timeline</h3>
            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Service Submitted</h4>
                  <p className="timeline-date">Oct 10, 2024</p>
                </div>
              </div>

              <div className="timeline-item completed">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Under Review</h4>
                  <p className="timeline-date">Oct 11-13, 2024</p>
                </div>
              </div>

              <div className="timeline-item rejected">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Service Rejected</h4>
                  <p className="timeline-date">Oct 14, 2024</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Reapplication Available</h4>
                  <p className="timeline-date">Anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRejectedDetails;