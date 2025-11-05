import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdStore } from 'react-icons/md';
import { FiArrowLeft, FiCheck, FiDownload, FiExternalLink, FiLoader, FiX } from 'react-icons/fi';
import Toast from '../../components/Toast/Toast';
import DocumentPreview from '../../components/DocumentPreview/DocumentPreview';
import './VendorRequestDetails.css';
import { buildDataUrl, getDocument } from '../../lib/vendorDocs';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';



const VendorRequestDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateVendor = location.state?.vendor || null;
  const stateVendorId = location.state?.vendorId || stateVendor?.id || stateVendor?._id || '';
  const searchParams = new URLSearchParams(location.search);
  const queryVendorId = searchParams.get('id') || '';
  const vendorId = stateVendorId || queryVendorId;

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(Boolean(vendorId));
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activePreview, setActivePreview] = useState(null);

  const closePreview = () => {
    setActivePreview(null);
  };

  const downloadDocument = useCallback((doc, fallbackName) => {
    if (!doc) return;
    const url = buildDataUrl(doc);
    if (!url) return;

    // use window.document to avoid shadowing the `document` param
    const link = window.document.createElement('a');
    link.href = url;
    link.download = doc?.name || fallbackName || 'document';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  }, []);

  const openDocument = useCallback((document, title) => {
    if (!document) return;
    setActivePreview({ document, title });
  }, []);

  const statusLabel = vendor?.status ? vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1) : 'Pending';

  const fetchVendor = useCallback(async () => {
    if (!vendorId) {
      setError("Vendor details unavailable.");
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
        if (result.data.rejectionReason) {
          setRejectionReason(result.data.rejectionReason);
        }
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

  const documents = useMemo(() => {
    return [
      {
        key: 'pan',
        title: 'PAN Card',
        // prefer multiple possible keys coming from different APIs
        document: getDocument(vendor, ['panCard', 'panDocument', 'pan']),
      },
      {
        key: 'registration',
        title: 'Registration / Ownership Document',
        document: getDocument(vendor, ['registrationDoc', 'registrationDocument', 'registration']),
      },
      {
        key: 'gst',
        title: 'GST / VAT Certificate',
        document: getDocument(vendor, ['gstCertificate', 'gstDocument', 'gst']),
      },
    ];
  }, [vendor]);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  const dispatchStatusUpdate = useCallback(
    (status) => {
      window.dispatchEvent(
        new CustomEvent('vendor-status-updated', {
          detail: { vendorId, status },
        })
      );
    },
    [vendorId]
  );

  const handleApprove = () => {
    setApproveOpen(true);
  };

  const handleReject = () => {
    setRejectOpen(true);
  };

  const handleCloseReject = () => {
    setRejectOpen(false);
    setRejectionReason(vendor?.rejectionReason || '');
  };

  const updateVendorStatus = useCallback(
    async (payload, successMessage) => {
      if (!vendorId) {
        return;
      }
      try {
        setActionLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Request failed');
        }
        const result = await response.json();
        if (result?.success) {
          showToast(successMessage, 'success');
          await fetchVendor();
          if (payload.status) {
            dispatchStatusUpdate(payload.status);
          } else {
            dispatchStatusUpdate(vendor?.status || 'pending');
          }
          navigate('/vendor/request');
        } else {
          throw new Error(result?.message || 'Request failed');
        }
      } catch (err) {
        showToast(err.message || 'Unable to process request', 'error');
      } finally {
        setActionLoading(false);
        setApproveOpen(false);
        setRejectOpen(false);
      }
    },
    [vendorId, fetchVendor, dispatchStatusUpdate, navigate, showToast, vendor?.status]
  );

  const confirmApprove = () => {
    updateVendorStatus({ status: 'approved', rejectionReason: '' }, 'Vendor approved successfully!');
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      showToast('Reason for rejection is required', 'error');
      return;
    }
    updateVendorStatus({ status: 'rejected', rejectionReason: rejectionReason.trim() }, 'Vendor rejected successfully!');
  };

  const requestModification = () => {
    if (!rejectionReason.trim()) {
      showToast('Reason for rejection is required', 'error');
      return;
    }
    updateVendorStatus({ rejectionReason: rejectionReason.trim() }, 'Modification request saved');
  };

  return (
    <div className="vendor-details-container">
      <button type="button" className="back-btn" onClick={() => navigate('/vendor/request')}>
        <FiArrowLeft size={18} />
        Back to Vendor Requests
      </button>

      <div className="details-heading">
        <div className="heading-icon">
          <MdStore size={26} />
        </div>
        <div>
          <h1>Vendor Request Details</h1>
          <p>Review vendor information, verify documents, and manage the request.</p>
        </div>
      </div>

      {loading && (
        <div className="details-loading">
          <FiLoader size={20} className="details-loading-spinner" />
          <span>Loading vendor details...</span>
        </div>
      )}

      {error && !loading && (
        <div className="details-alert">
          <span>{error}</span>
          <button type="button" className="details-retry-btn" onClick={fetchVendor}>
            Retry
          </button>
        </div>
      )}

      {vendor && !loading && !error && (
        <div className="details-grid">
          <section className="card">
            <h2 className="card-title">Vendor Information</h2>
            <div className="vendor-profile">
              <div className="profile-avatar">{vendor.businessName?.[0] || vendor.contactName?.[0] || 'V'}</div>
              <div className="profile-info">
                <h3 className="profile-name">{vendor.businessName || '—'}</h3>
                <p className="profile-subtitle">{vendor.category || '—'}</p>
              </div>
            </div>
            <div className="details-list">
              <div className="detail-item">
                <span className="detail-label">Business Name</span>
                <span className="detail-value">{vendor.businessName || '—'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Person Name</span>
                <span className="detail-value">{vendor.contactName || vendor.personName || '—'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Category</span>
                <span className="detail-value">
                  <span className="category-badge">{vendor.category || '—'}</span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">
                  {vendor.email ? (
                    <a href={`mailto:${vendor.email}`}>{vendor.email}</a>
                  ) : (
                    '—'
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">
                  {vendor.phone ? (
                    <a href={`tel:${vendor.phone}`}>{vendor.phone}</a>
                  ) : (
                    '—'
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">City</span>
                <span className="detail-value">{vendor.city || '—'}</span>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">Request Status</h2>
            <div className="status-summary">
              <div className={`status-badge ${vendor.status || 'pending'}`}>
                <span className="status-dot"></span>
                {statusLabel}
              </div>
              {vendor.rejectionReason && (
                <div className="status-reason">{vendor.rejectionReason}</div>
              )}
            </div>
            <p className="status-text">
              Approve the vendor to move them to the Approved Vendors list or reject to move to Rejected Vendors.
            </p>
            <div className="status-actions">
              <button
                type="button"
                className="status-action-btn accept"
                onClick={handleApprove}
                disabled={vendor.status === 'approved' || actionLoading}
              >
                <FiCheck size={18} />
                Approve Request
              </button>
              <button
                type="button"
                className="status-action-btn reject"
                onClick={handleReject}
                disabled={vendor.status === 'rejected' || actionLoading}
              >
                <FiX size={18} />
                Reject Request
              </button>
            </div>
          </section>

          <section className="card documents-card">
            <h2 className="card-title">Documents</h2>
            <div className="documents-grid">
              {documents.map(({ key, title, document }) => {
                const previewUrl = buildDataUrl(document);
                const handleOpenDocument = (e) => {
                  e.stopPropagation();
                  openDocument(document, title);
                };
                return (
                  <div
                    key={key}
                    className="document-card"
                  >
                    <div className="document-header">
                      <h3>{title}</h3>
                      <div className="document-actions">
                        <button
                          type="button"
                          className="doc-btn"
                          onClick={handleOpenDocument}
                          disabled={!previewUrl}
                        >
                          <FiExternalLink size={16} />
                          View
                        </button>
                        <button
                          type="button"
                          className="doc-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadDocument(document, title);
                          }}
                          disabled={!previewUrl}
                        >
                          <FiDownload size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="document-preview">
                      {previewUrl ? (
                        document?.type?.toLowerCase().includes('pdf') ? (
                          <iframe title={title} src={previewUrl} className="document-frame" />
                        ) : document?.type?.toLowerCase().startsWith('image/') ? (
                          <img src={previewUrl} alt={title} className="document-image" />
                        ) : (
                          <object data={previewUrl} type={document?.type || 'application/octet-stream'} className="document-frame" aria-label={title}>
                            <div className="document-placeholder">Preview not available</div>
                          </object>
                        )
                      ) : (
                        <div className="document-placeholder">Document not provided</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {approveOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Approve Vendor Request</h3>
            <p>Are you sure you want to approve this Vendor's Request?</p>
            <div className="modal-actions">
              <button type="button" className="modal-btn secondary" onClick={() => setApproveOpen(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button type="button" className="modal-btn primary" onClick={confirmApprove} disabled={actionLoading}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Reject Vendor Request</h3>
            <label htmlFor="rejectReason">
              Reason for Rejection <span className="required">*</span>
            </label>
            <textarea
              id="rejectReason"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Enter detailed reason for rejection"
            />
            <div className="modal-actions">
              <button type="button" className="modal-btn secondary" onClick={handleCloseReject} disabled={actionLoading}>
                Cancel
              </button>
              <button type="button" className="modal-btn warning" onClick={requestModification} disabled={actionLoading}>
                Request Modification
              </button>
              <button type="button" className="modal-btn danger" onClick={confirmReject} disabled={actionLoading}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {activePreview && (
        <DocumentPreview
          document={activePreview.document}
          title={activePreview.title}
          onClose={closePreview}
          onDownload={() => downloadDocument(activePreview.document)}
        />
      )}
    </div>
  );
};

export default VendorRequestDetails;
