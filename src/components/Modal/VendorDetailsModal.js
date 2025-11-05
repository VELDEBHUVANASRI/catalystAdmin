import React, { useState } from 'react';
import { FiX, FiCheck, FiDownload, FiExternalLink } from 'react-icons/fi';
import Modal from './Modal';
import './VendorDetailsModal.css';
import { buildDataUrl, getDocument } from '../../lib/vendorDocs';



const openDocument = (document) => {
  const url = buildDataUrl(document);
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const downloadDocument = (document, fallbackName) => {
  const url = buildDataUrl(document);
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  // prefer provided name field, else fallback
  link.download = typeof document === 'object' ? (document.name || fallbackName) : fallbackName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const VendorDetailsModal = ({ vendor, isOpen, onClose, onApprove, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!vendor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="vendor-details-modal">
      <div className="vendor-details-content">
        <div className="vendor-details-header">
          <h2>Accepted Vendor</h2>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="vendor-details-body">
          <div className="detail-group">
            <h3>Business Information</h3>
            <div className="detail-row">
              <span className="detail-label">Business Name:</span>
              <span className="detail-value">{vendor.businessName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{vendor.category}</span>
            </div>
          </div>

          <div className="detail-group">
            <h3>Contact Information</h3>
            <div className="detail-row">
              <span className="detail-label">Person Name:</span>
              <span className="detail-value">{vendor.personName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{vendor.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{vendor.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">City:</span>
              <span className="detail-value">{vendor.city}</span>
            </div>
          </div>

          <div className="detail-group">
            <h3>Documents</h3>
            {/* Accept multiple naming conventions from different APIs (panCard / panDocument etc) */}
            {(() => {
              const pan = getDocument(vendor, ['panCard', 'panDocument', 'pan']);
              return pan ? (
                <div className="document-row">
                  <span>PAN Card</span>
                  <div className="doc-actions">
                    <button type="button" className="doc-btn" onClick={() => openDocument(pan)} disabled={!buildDataUrl(pan)}>
                      <FiExternalLink /> View
                    </button>
                    <button type="button" className="doc-btn" onClick={() => downloadDocument(pan, 'pan-card')} disabled={!buildDataUrl(pan)}>
                      <FiDownload /> Download
                    </button>
                  </div>
                </div>
              ) : null;
            })()}

            {(() => {
              const gst = getDocument(vendor, ['gstCertificate', 'gstDocument', 'gst']);
              return gst ? (
                <div className="document-row">
                  <span>GST Certificate</span>
                  <div className="doc-actions">
                    <button type="button" className="doc-btn" onClick={() => openDocument(gst)} disabled={!buildDataUrl(gst)}>
                      <FiExternalLink /> View
                    </button>
                    <button type="button" className="doc-btn" onClick={() => downloadDocument(gst, 'gst-certificate')} disabled={!buildDataUrl(gst)}>
                      <FiDownload /> Download
                    </button>
                  </div>
                </div>
              ) : null;
            })()}

            {(() => {
              const reg = getDocument(vendor, ['registrationDoc', 'registrationDocument', 'registration']);
              return reg ? (
                <div className="document-row">
                  <span>Registration Document</span>
                  <div className="doc-actions">
                    <button type="button" className="doc-btn" onClick={() => openDocument(reg)} disabled={!buildDataUrl(reg)}>
                      <FiExternalLink /> View
                    </button>
                    <button type="button" className="doc-btn" onClick={() => downloadDocument(reg, 'registration-doc')} disabled={!buildDataUrl(reg)}>
                      <FiDownload /> Download
                    </button>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </div>

        <div className="vendor-details-footer">
          {!showRejectInput ? (
            <>
              <button
                className="approve-button"
                onClick={onApprove}
              >
                <FiCheck /> Approve
              </button>
              <button
                className="reject-button"
                onClick={() => setShowRejectInput(true)}
              >
                <FiX /> Reject
              </button>
            </>
          ) : (
            <div className="rejection-form">
              <textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="rejection-buttons">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setShowRejectInput(false);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="confirm-reject-button"
                  onClick={() => onReject(rejectionReason)}
                  disabled={!rejectionReason.trim()}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VendorDetailsModal;