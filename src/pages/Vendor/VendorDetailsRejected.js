import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiExternalLink, FiAlertCircle } from 'react-icons/fi';
import Toast from '../../components/Toast/Toast';
import './VendorDetailsRejected.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const buildDataUrl = (document) => {
  if (!document?.data) {
    return null;
  }
  const type = document.type ? document.type.trim() : 'application/octet-stream';
  return `data:${type};base64,${document.data}`;
};

const VendorDetailsRejected = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const stateVendorId = location.state?.vendorId || location.state?.vendor?.id || '';
  const vendorId = params.id || stateVendorId;

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(Boolean(vendorId));
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  const fetchVendor = useCallback(async () => {
    if (!vendorId) {
      setError('Vendor details unavailable');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`);
      if (!response.ok) {
        throw new Error('Failed to load vendor details');
      }
      const result = await response.json();
      if (result?.success && result?.data) {
        setVendor(result.data);
      } else {
        throw new Error(result?.message || 'Vendor details unavailable');
      }
    } catch (err) {
      setError(err.message || 'Failed to load vendor details');
      setVendor(null);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  const documents = useMemo(
    () => [
      { key: 'panDocument', title: 'PAN Card', document: vendor?.panDocument },
      { key: 'registrationDocument', title: 'Registration / Ownership Document', document: vendor?.registrationDocument },
      { key: 'gstDocument', title: 'GST / VAT Certificate', document: vendor?.gstDocument },
    ],
    [vendor]
  );

  const openDocument = (doc) => {
    const url = buildDataUrl(doc);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const downloadDocument = (doc, title) => {
    const url = buildDataUrl(doc);
    if (!url) {
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = doc?.name || title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="vendor-details-rejected-container">
      <button className="back-button" onClick={() => navigate('/vendor/request')}>
        <FiArrowLeft size={20} />
        Back to Vendor Requests
      </button>

      <div className="vendor-info-section">
        <div className="page-header">
          <h1 className="page-title">Rejected Vendor Details</h1>
          <span className="rejected-badge">
            <FiAlertCircle size={16} />
            Rejected
          </span>
        </div>

        {loading && <div className="loading-state">Loading vendor details...</div>}
        {error && !loading && <div className="error-state">{error}</div>}

        {vendor && !loading && !error && (
          <>
            <div className="vendor-card">
              <div className="vendor-profile-section">
                <div className="profile-left">
                  <div className="profile-picture">
                    {vendor?.profilePicture ? (
                      <img src={vendor.profilePicture} alt={vendor.businessName || 'Vendor'} />
                    ) : (
                      <span>{vendor.businessName?.[0] || vendor.personName?.[0] || 'V'}</span>
                    )}
                  </div>
                </div>

                <div className="profile-right">
                  <h2 className="vendor-business-name">{vendor.businessName || '—'}</h2>

                  <div className="vendor-info-grid">
                    <div className="info-item">
                      <label>Person Name</label>
                      <span>{vendor.personName || '—'}</span>
                    </div>
                    <div className="info-item">
                      <label>Category</label>
                      <span className="category-badge">{vendor.category || '—'}</span>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <span>{vendor.email || '—'}</span>
                    </div>
                    <div className="info-item">
                      <label>Phone Number</label>
                      <span>{vendor.phone || '—'}</span>
                    </div>
                    <div className="info-item">
                      <label>City</label>
                      <span>{vendor.city || '—'}</span>
                    </div>
                    <div className="info-item">
                      <label>Status</label>
                      <span className="status-badge rejected">Rejected</span>
                    </div>
                    <div className="info-item">
                      <label>Rejected On</label>
                      <span>{vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleDateString() : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rejection-reason-section">
                <div className="rejection-reason-card">
                  <div className="rejection-reason-header">
                    <FiAlertCircle size={20} />
                    <h3>Reason for Rejection</h3>
                  </div>
                  <p className="rejection-reason-text">{vendor.rejectionReason || 'Reason not provided'}</p>
                </div>
              </div>

              <div className="documents-section">
                <h3 className="section-title">Submitted Documents</h3>
                <div className="documents-list">
                  {documents.map(({ key, title, document }) => {
                    const url = buildDataUrl(document);
                    return (
                      <div key={key} className="document-item">
                        <span className="document-name">{title}</span>
                        <div className="document-actions">
                          <button className="document-link" onClick={() => openDocument(document)} disabled={!url}>
                            <FiExternalLink size={16} />
                            View
                          </button>
                          <button className="document-link" onClick={() => downloadDocument(document, title)} disabled={!url}>
                            <FiDownload size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="timeline-section">
              <h3 className="section-title">Status Timeline</h3>
              <div className="timeline">
                <div className="timeline-item completed">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Application Submitted</h4>
                    <p>Vendor application received in the system</p>
                    <span className="timeline-date">{vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : '—'}</span>
                  </div>
                </div>

                <div className="timeline-item completed">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Under Review</h4>
                    <p>Documents reviewed by the admin team</p>
                    <span className="timeline-date">{vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleDateString() : '—'}</span>
                  </div>
                </div>

                <div className="timeline-item rejected">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Rejected</h4>
                    <p>{vendor.rejectionReason || 'Application was rejected by admin'}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
};

export default VendorDetailsRejected;
