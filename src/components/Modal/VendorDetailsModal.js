import React, { useState } from 'react';
import { FiX, FiCheck, FiDownload } from 'react-icons/fi';
import Modal from './Modal';
import './VendorDetailsModal.css';

const VendorDetailsModal = ({ vendor, isOpen, onClose, onApprove, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!vendor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="vendor-details-modal">
      <div className="vendor-details-content">
        <div className="vendor-details-header">
          <h2>Vendor Details</h2>
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
            {vendor.panDocument && (
              <div className="document-row">
                <span>PAN Document</span>
                <a href={vendor.panDocument} target="_blank" rel="noopener noreferrer">
                  <FiDownload /> Download
                </a>
              </div>
            )}
            {vendor.gstDocument && (
              <div className="document-row">
                <span>GST Document</span>
                <a href={vendor.gstDocument} target="_blank" rel="noopener noreferrer">
                  <FiDownload /> Download
                </a>
              </div>
            )}
            {vendor.registrationDocument && (
              <div className="document-row">
                <span>Registration Document</span>
                <a href={vendor.registrationDocument} target="_blank" rel="noopener noreferrer">
                  <FiDownload /> Download
                </a>
              </div>
            )}
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