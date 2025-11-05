import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiDollarSign, FiUsers } from 'react-icons/fi';
import './ServiceDetails.css';

const ServiceAcceptedDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const service = location.state?.service || {};

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
      status: 'Approved',
      profileImage: 'https://via.placeholder.com/100?text=Catering',
    },
    4: {
      type: 'Music',
      name: 'Beat Master DJ',
      city: 'Mumbai',
      location: 'Andheri, Mumbai',
      price: 30000,
      capacity: 1000,
      venueType: 'Both',
      status: 'Approved',
      profileImage: 'https://via.placeholder.com/100?text=Music',
    },
    5: {
      type: 'Venue',
      name: 'Grand Ballroom',
      city: 'Delhi',
      location: 'Connaught Place, Delhi',
      price: 100000,
      capacity: 800,
      venueType: 'Indoor',
      status: 'Approved',
      profileImage: 'https://via.placeholder.com/100?text=Venue',
    },
  };

  const details = mockDetails[service.id] || mockDetails[4];

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
            <span className="status-badge accepted">
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

          <div className="timeline-section">
            <h3 className="timeline-title">Service Timeline</h3>
            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Service Submitted</h4>
                  <p className="timeline-date">Oct 15, 2024</p>
                </div>
              </div>

              <div className="timeline-item completed">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Under Review</h4>
                  <p className="timeline-date">Oct 16-18, 2024</p>
                </div>
              </div>

              <div className="timeline-item completed">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Service Approved</h4>
                  <p className="timeline-date">Oct 19, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAcceptedDetails;