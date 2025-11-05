import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import './Service.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const Service = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState({
    pending: [],
    accepted: [],
    rejected: [],
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const [pendingRes, acceptedRes, rejectedRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/services/pending`),
          fetch(`${API_BASE_URL}/api/services/accepted`),
          fetch(`${API_BASE_URL}/api/services/rejected`),
        ]);

        const pendingData = await pendingRes.json();
        const acceptedData = await acceptedRes.json();
        const rejectedData = await rejectedRes.json();

        setServices({
          pending: pendingData.success ? pendingData.data : [],
          accepted: acceptedData.success ? acceptedData.data : [],
          rejected: rejectedData.success ? rejectedData.data : [],
        });
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get unique service types and cities from data
  const allServices = [...services.pending, ...services.accepted, ...services.rejected];
  const serviceTypes = [...new Set(allServices.map((s) => s.type))].sort();
  const cities = [...new Set(allServices.map((s) => s.city))].sort();

  const currentServices = services[activeTab] || [];

  const filteredServices = currentServices.filter((service) => {
    const matchType = !typeFilter || service.type === typeFilter;
    const matchCity = !cityFilter || service.city === cityFilter;
    return matchType && matchCity;
  });

  const handleApprove = async (serviceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' }),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh services
        const updatedRes = await fetch(`${API_BASE_URL}/api/services/pending`);
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setServices({ ...services, pending: updatedData.data });
        }
        alert(`Service approved successfully!`);
      }
    } catch (error) {
      console.error('Error approving service:', error);
      alert('Failed to approve service');
    }
  };

  const handleReject = async (serviceId) => {
    const reason = prompt('Enter reason for rejection:');
    if (reason) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'rejected', rejectionReason: reason }),
        });

        const result = await response.json();
        if (result.success) {
          // Refresh services
          const updatedRes = await fetch(`${API_BASE_URL}/api/services/pending`);
          const updatedData = await updatedRes.json();
          if (updatedData.success) {
            setServices({ ...services, pending: updatedData.data });
          }
          alert(`Service rejected successfully!`);
        }
      } catch (error) {
        console.error('Error rejecting service:', error);
        alert('Failed to reject service');
      }
    }
  };

  const handleViewDetails = (serviceId) => {
    const service = currentServices.find((s) => s.id === serviceId);
    if (activeTab === 'pending') {
      navigate(`/vendor/service/pending-details/${serviceId}`, {
        state: { service },
      });
    } else if (activeTab === 'accepted') {
      navigate(`/vendor/service/accepted-details/${serviceId}`, {
        state: { service },
      });
    } else if (activeTab === 'rejected') {
      navigate(`/vendor/service/rejected-details/${serviceId}`, {
        state: { service },
      });
    }
  };

  if (loading) {
    return (
      <div className="service-container">
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-container">
      <div className="service-header">
        <h1 className="service-title">Services</h1>
        <button
          className="create-service-btn"
          onClick={() => navigate('/vendor/service/create')}
        >
          <FiPlus size={20} />
          Create Service
        </button>
      </div>

      {/* Filters Section */}
      <div className="service-filters">
        <div className="filter-group">
          <label htmlFor="type-filter">Type</label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="city-filter">City</label>
          <select
            id="city-filter"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <button
          className="reset-filters-btn"
          onClick={() => {
            setTypeFilter('');
            setCityFilter('');
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Tabs Section */}
      <div className="service-tabs">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Services ({services.pending.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'accepted' ? 'active' : ''}`}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted Services ({services.accepted.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected Services ({services.rejected.length})
        </button>
      </div>

      {/* Table Section */}
      <div className="service-table-wrapper">
        <table className="service-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Subcategory</th>
              <th>Name</th>
              <th>City</th>
              <th>Details</th>
              {activeTab === 'pending' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.type}</td>
                  <td>{service.subcategory}</td>
                  <td>{service.name}</td>
                  <td>{service.city}</td>
                  <td>
                    <button
                      className="details-btn"
                      onClick={() => handleViewDetails(service.id)}
                    >
                      View Details
                    </button>
                  </td>
                  {activeTab === 'pending' && (
                    <td className="action-cell">
                      <button
                        className="action-btn approve-btn"
                        onClick={() => handleApprove(service.id)}
                        title="Approve"
                      >
                        <MdCheckCircle size={20} />
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleReject(service.id)}
                        title="Reject"
                      >
                        <MdCancel size={20} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === 'pending' ? 6 : 5} className="no-data">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Service;