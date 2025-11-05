import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './ServiceCreate.css';

const ServiceCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    type: '',
    name: '',
    city: '',
    location: '',
    price: '',
    capacity: '',
    venueType: '',
  });

  const serviceTypes = [
    'Catering',
    'Decoration',
    'Photography',
    'Music',
    'Videography',
    'Beauty Parlour',
    'Venue',
  ];

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'];
  const venueTypes = ['Indoor', 'Outdoor', 'Both'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields
    if (
      !formData.id ||
      !formData.type ||
      !formData.name ||
      !formData.city ||
      !formData.location ||
      !formData.price ||
      !formData.capacity ||
      !formData.venueType
    ) {
      alert('Please fill all fields');
      return;
    }
    alert('Service created successfully!');
    navigate('/vendor/services');
  };

  return (
    <div className="service-create-container">
      <button className="back-btn" onClick={() => navigate('/vendor/services')}>
        <FiArrowLeft size={20} />
        Back to Services
      </button>

      <div className="service-create-card">
        <h1 className="form-title">Create Service</h1>

        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id">
                Id <span className="required">*</span>
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Enter service ID"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">
                Type <span className="required">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Service Type</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter service name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">
                Location <span className="required">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Price <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacity">
                Capacity <span className="required">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Enter capacity"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="venueType">
                Venue Type <span className="required">*</span>
              </label>
              <select
                id="venueType"
                name="venueType"
                value={formData.venueType}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Venue Type</option>
                {venueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/vendor/services')}
            >
              Cancel
            </button>
            <button type="submit" className="create-btn">
              Create Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceCreate;