import React, { useState } from 'react';
import { MdStore } from 'react-icons/md';
import { FiCheck } from 'react-icons/fi';
import Modal from '../../components/Modal/Modal';
import Toast from '../../components/Toast/Toast';
import './VendorCreate.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const parts = result.split(',');
        resolve(parts.length > 1 ? parts[1] : parts[0]);
        return;
      }
      resolve('');
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const buildDocumentPayload = async (file) => {
  if (!file) {
    return null;
  }

  const data = await fileToBase64(file);

  return {
    name: file.name,
    type: file.type,
    data,
  };
};

const VendorCreate = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    personName: '',
    email: '',
    emailVerified: false,
    emailOtp: '',
    phone: '',
    phoneVerified: false,
    mobileOtp: '',
    category: '',
    city: '',
    password: '',
    confirmPassword: '',
    panDocument: null,
    registrationDocument: null,
    gstDocument: null,
  });

  const [toast, setToast] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Catering',
    'Photography',
    'Decoration',
    'Entertainment',
    'Flowers',
    'Venue',
    'Cake & Bakery',
    'Music & DJ',
    'Transport',
    'Other',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleVerifyEmail = () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: 'Please enter email' }));
      return;
    }
    // Simulate email verification
    setFormData((prev) => ({ ...prev, emailVerified: true }));
    showToast('OTP sent to your email', 'info');
  };

  const handleVerifyPhone = () => {
    if (!formData.phone) {
      setErrors((prev) => ({ ...prev, phone: 'Please enter phone number' }));
      return;
    }
    // Simulate phone verification
    setFormData((prev) => ({ ...prev, phoneVerified: true }));
    showToast('OTP sent to your phone', 'info');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.personName.trim()) newErrors.personName = 'Person name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.emailVerified) newErrors.emailVerified = 'Please verify email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.phoneVerified) newErrors.phoneVerified = 'Please verify phone';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.panDocument) newErrors.panDocument = 'PAN card document is required';
    if (!formData.registrationDocument)
      newErrors.registrationDocument = 'Registration document is required';
    if (!formData.gstDocument) newErrors.gstDocument = 'GST certificate is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const [panDocumentPayload, registrationDocumentPayload, gstDocumentPayload] =
        await Promise.all([
          buildDocumentPayload(formData.panDocument),
          buildDocumentPayload(formData.registrationDocument),
          buildDocumentPayload(formData.gstDocument),
        ]);

      const response = await fetch(`${API_BASE_URL}/api/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          personName: formData.personName,
          category: formData.category,
          city: formData.city,
          email: formData.email,
          emailVerified: formData.emailVerified,
          emailOtp: formData.emailOtp,
          phone: formData.phone,
          phoneVerified: formData.phoneVerified,
          mobileOtp: formData.mobileOtp,
          password: formData.password,
          panDocument: panDocumentPayload,
          registrationDocument: registrationDocumentPayload,
          gstDocument: gstDocumentPayload,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create vendor account');
      }

      const result = await response.json();

      if (result.success) {
        setSuccessModal(true);
      } else {
        showToast(result.message || 'Failed to create vendor account', 'error');
      }

    } catch (error) {
      console.error('Error creating vendor:', error);
      showToast(error.message || 'Failed to create vendor account', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModal(false);
    // Reset form
    setFormData({
      businessName: '',
      personName: '',
      email: '',
      emailVerified: false,
      emailOtp: '',
      phone: '',
      phoneVerified: false,
      mobileOtp: '',
      category: '',
      city: '',
      password: '',
      confirmPassword: '',
      panDocument: null,
      registrationDocument: null,
      gstDocument: null,
    });
    showToast('Vendor account created successfully!', 'success');
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  return (
    <div className="vendor-create-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <MdStore size={28} />
          Create Vendor Account
        </h1>
        <p className="page-subtitle">Add a new vendor to the system</p>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <form onSubmit={handleCreateAccount} className="vendor-form">
          {/* Business Information */}
          <fieldset className="form-section">
            <legend className="section-title">Business Information</legend>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="businessName" className="form-label">
                  Business Name <span className="required">*</span>
                </label>
                <input
                  id="businessName"
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter business name"
                  className={`form-input ${errors.businessName ? 'error' : ''}`}
                />
                {errors.businessName && (
                  <span className="error-message">{errors.businessName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="personName" className="form-label">
                  Person Name <span className="required">*</span>
                </label>
                <input
                  id="personName"
                  type="text"
                  name="personName"
                  value={formData.personName}
                  onChange={handleInputChange}
                  placeholder="Enter person name"
                  className={`form-input ${errors.personName ? 'error' : ''}`}
                />
                {errors.personName && (
                  <span className="error-message">{errors.personName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-input form-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="error-message">{errors.category}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City <span className="required">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>
          </fieldset>

          {/* Contact Information */}
          <fieldset className="form-section">
            <legend className="section-title">Contact Information</legend>

            <div className="form-grid">
              <div className="form-group form-group-verify">
                <label htmlFor="email" className="form-label">
                  Email <span className="required">*</span>
                </label>
                <div className="verify-input-wrapper">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    disabled={formData.emailVerified}
                  />
                  {formData.emailVerified ? (
                    <button type="button" className="verify-badge verified">
                      <FiCheck size={18} />
                      Verified
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="verify-btn"
                      onClick={handleVerifyEmail}
                    >
                      Verify
                    </button>
                  )}
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {formData.emailVerified && (
                <div className="form-group">
                  <label htmlFor="emailOtp" className="form-label">
                    Email OTP
                  </label>
                  <input
                    id="emailOtp"
                    type="text"
                    name="emailOtp"
                    value={formData.emailOtp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP"
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group form-group-verify">
                <label htmlFor="phone" className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <div className="verify-input-wrapper">
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    disabled={formData.phoneVerified}
                  />
                  {formData.phoneVerified ? (
                    <button type="button" className="verify-badge verified">
                      <FiCheck size={18} />
                      Verified
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="verify-btn"
                      onClick={handleVerifyPhone}
                    >
                      Verify
                    </button>
                  )}
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              {formData.phoneVerified && (
                <div className="form-group">
                  <label htmlFor="mobileOtp" className="form-label">
                    Mobile OTP
                  </label>
                  <input
                    id="mobileOtp"
                    type="text"
                    name="mobileOtp"
                    value={formData.mobileOtp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP"
                    className="form-input"
                  />
                </div>
              )}
            </div>
          </fieldset>

          {/* Security */}
          <fieldset className="form-section">
            <legend className="section-title">Security</legend>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Documents */}
          <fieldset className="form-section">
            <legend className="section-title">Documents</legend>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="panDocument" className="form-label">
                  Upload PAN Card Document <span className="required">*</span>
                </label>
                <input
                  id="panDocument"
                  type="file"
                  name="panDocument"
                  onChange={handleFileChange}
                  className={`form-input file-input ${
                    errors.panDocument ? 'error' : ''
                  }`}
                  accept=".pdf,.jpg,.png,.jpeg"
                />
                {formData.panDocument && (
                  <p className="file-name">{formData.panDocument.name}</p>
                )}
                {errors.panDocument && (
                  <span className="error-message">{errors.panDocument}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="registrationDocument" className="form-label">
                  Upload Registration/Ownership Document{' '}
                  <span className="required">*</span>
                </label>
                <input
                  id="registrationDocument"
                  type="file"
                  name="registrationDocument"
                  onChange={handleFileChange}
                  className={`form-input file-input ${
                    errors.registrationDocument ? 'error' : ''
                  }`}
                  accept=".pdf,.jpg,.png,.jpeg"
                />
                {formData.registrationDocument && (
                  <p className="file-name">{formData.registrationDocument.name}</p>
                )}
                {errors.registrationDocument && (
                  <span className="error-message">{errors.registrationDocument}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="gstDocument" className="form-label">
                  Upload GST/VAT Certificate <span className="required">*</span>
                </label>
                <input
                  id="gstDocument"
                  type="file"
                  name="gstDocument"
                  onChange={handleFileChange}
                  className={`form-input file-input ${errors.gstDocument ? 'error' : ''}`}
                  accept=".pdf,.jpg,.png,.jpeg"
                />
                {formData.gstDocument && (
                  <p className="file-name">{formData.gstDocument.name}</p>
                )}
                {errors.gstDocument && (
                  <span className="error-message">{errors.gstDocument}</span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        title="Vendor Account Created"
        message="Vendor account has been created successfully!"
        onClose={handleSuccessClose}
        footer={
          <button className="btn-close" onClick={handleSuccessClose}>
            Close
          </button>
        }
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default VendorCreate;