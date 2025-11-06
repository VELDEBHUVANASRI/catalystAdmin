import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdStore } from 'react-icons/md';
import { FiEye, FiCheck, FiX } from 'react-icons/fi';
import Toast from '../../components/Toast/Toast';
import VendorDetailsModal from '../../components/Modal/VendorDetailsModal';
import './VendorRequest.css';

const fetchPendingVendors = async () => {
  try {
    console.log('Fetching pending vendors from:', `${API_BASE_URL}/api/vendors/pending`);
    const response = await fetch(`${API_BASE_URL}/api/vendors/pending`);
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Received data:', data);
    if (data.success) {
      console.log('Successfully fetched vendors:', data.data.length);
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch pending vendors');
  } catch (error) {
    console.error('Error fetching pending vendors:', error);
    throw error;
  }
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// For the Vendor Request page we show Pending, Approved, Rejected, and All vendors
const TABS = [
  { key: 'pending', label: 'Pending Vendors' },
  { key: 'approved', label: 'Approved Vendors' },
  { key: 'rejected', label: 'Rejected Vendors' },
  // 'all' tab removed as per UI update
];

const formatVendor = (vendor) => {
  if (!vendor) return null;
  
  // Ensure we have a valid ID
  const id = vendor._id?.toString() || vendor.id || '';
  if (!id) {
    console.error('Invalid vendor ID:', vendor);
    return null;
  }

  return {
    id,
    businessName: vendor.businessName || '',
    contactName: vendor.contactName || '',
    category: vendor.category || '',
    email: vendor.email || '',
    phone: vendor.phone || '',
    city: vendor.city || '',
    status: (vendor.status || '').toLowerCase(),
    role: vendor.role || 'vendor',
    panCard: vendor.panCard || '',
    registrationDoc: vendor.registrationDoc || '',
    gstCertificate: vendor.gstCertificate || '',
    createdAt: vendor.createdAt,
    updatedAt: vendor.updatedAt,
    rejectionReason: vendor.rejectionReason || ''
  };
};

const tabEndpoint = {
  pending: '/api/vendors/pending',
  approved: '/api/vendors/approved',
  rejected: '/api/vendors/rejected',
  all: '/api/vendors'
};

const VendorRequest = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [vendors, setVendors] = useState({ pending: [], approved: [], rejected: [] });
  const [loading, setLoading] = useState({ pending: false, approved: false, rejected: false });
  const [errors, setErrors] = useState({ pending: '', approved: '', rejected: '' });
  const [toast, setToast] = useState(null);
  const [approveVendor, setApproveVendor] = useState(null);
  const [rejectVendor, setRejectVendor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);



  const handleViewDetails = (vendor) => {
    // Navigate to the details page and pass vendor (or id) in state
    // The details page will fetch full vendor data from the vendors collection
    navigate('/vendor/request-details', { state: { vendor, vendorId: vendor.id || vendor._id } });
  };

  const handleApproveVendor = async (vendor) => {
    try {
      // Validate vendor object
      if (!vendor) {
        throw new Error('Invalid vendor data');
      }

      // Accept both vendor.id and vendor._id (Mongoose documents)
      const vendorIdRaw = vendor.id || vendor._id;
      const vendorId = vendorIdRaw ? String(vendorIdRaw).trim() : '';
      if (!vendorId) {
        console.error('Invalid vendor ID:', vendor);
        throw new Error('Invalid vendor ID');
      }

      // Check if already approved
      if ((vendor.status || '').toLowerCase() === 'approved') {
        showToast('This vendor is already approved', 'info');
        return;
      }

      // Prevent multiple submissions
      if (actionLoading) {
        return;
      }

      // Ask for confirmation
      const displayName = vendor.businessName || vendor.email || 'this vendor';
      if (!window.confirm(`Are you sure you want to approve ${displayName}?`)) {
        return;
      }

      setActionLoading(true);
      console.log('Approving vendor:', { id: vendorId, business: vendor.businessName });
      
      const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          rejectionReason: ''
        })
      });

      const result = await response.json();
      console.log('Approval response:', { status: response.status, data: result });

      // Handle non-200 responses
      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      // Handle unsuccessful operations
      if (!result.success) {
        throw new Error(result.message || 'Failed to approve vendor');
      }

      // Get the updated vendor data from the response
      const updatedVendor = {
        ...vendor,
        ...result.data,
        id: vendorId,
        status: 'approved',
        rejectionReason: '',
        updatedAt: new Date().toISOString()
      };

      // Update local state (no 'all' tab)
      setVendors(prevVendors => ({
        ...prevVendors,
        pending: prevVendors.pending.filter(v => (v.id || v._id) !== vendorId),
        approved: [...prevVendors.approved, updatedVendor]
      }));

      showToast('Vendor approved successfully', 'success');
      setIsDetailsModalOpen(false);

      // Trigger a status update event
      window.dispatchEvent(
        new CustomEvent('vendor-status-updated', {
          detail: { 
            vendorId, 
            status: 'approved',
            timestamp: new Date().toISOString()
          },
        })
      );

      // Refresh lists to ensure data consistency
      await requestRefreshAll();
    } catch (error) {
      console.error('Error approving vendor:', error);
      showToast(error.message || 'Failed to approve vendor', 'error');
    } finally {
      setActionLoading(false);
      setApproveVendor(null);
    }
  };

  const handleRejectVendor = async (vendor, reason) => {
    if (actionLoading) return;

    if (!reason?.trim()) {
      showToast('Rejection reason is required', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/vendors/${vendor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason: reason.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject vendor');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state to reflect changes immediately
        setVendors(prevVendors => ({
          ...prevVendors,
          pending: prevVendors.pending.filter(v => v.id !== vendor.id),
          rejected: [...prevVendors.rejected, { ...vendor, status: 'rejected', rejectionReason: reason }]
        }));

        showToast('Vendor rejected successfully', 'success');
        setIsDetailsModalOpen(false);

        // Trigger a status update event
        window.dispatchEvent(
          new CustomEvent('vendor-status-updated', {
            detail: { vendorId: vendor.id, status: 'rejected' },
          })
        );

        // Refresh affected tabs
        await Promise.all([
          fetchVendors('pending'),
          fetchVendors('rejected')
        ]);
      }
    } catch (error) {
      showToast(error.message || 'Failed to reject vendor', 'error');
    } finally {
      setActionLoading(false);
      setRejectVendor(null);
      setRejectionReason('');
    }
  };

  const fetchVendors = useCallback(async (tab = 'pending') => {
    if (!tab || !tabEndpoint[tab]) {
      console.warn(`Invalid tab: ${tab}`);
      return;
    }
    
    try {
      console.log(`🔄 Fetching ${tab} vendors...`);
      setLoading((prev) => ({ ...prev, [tab]: true }));
      setErrors((prev) => ({ ...prev, [tab]: '' }));
      
      const apiUrl = `${API_BASE_URL}${tabEndpoint[tab]}`;
      console.log('📡 Fetching from URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`📦 Raw ${tab} vendors response:`, data);
      console.log(`✅ Success:`, data.success);
      console.log(`📊 Data array length:`, data.data?.length || 0);
      
      if (!data.success) {
        throw new Error(data.message || `Failed to fetch ${tab} vendors`);
      }
      
      if (!data.data || !Array.isArray(data.data)) {
        console.warn('⚠️ Data is not an array:', data.data);
        setVendors((prev) => ({ ...prev, [tab]: [] }));
        setErrors((prev) => ({ ...prev, [tab]: 'Invalid data format received' }));
        return;
      }
      
      const formattedVendors = data.data.map(vendor => {
        const formatted = formatVendor(vendor);
        console.log('✨ Formatted vendor:', formatted);
        return formatted;
      });
      
      console.log(`✅ Total ${tab} vendors formatted:`, formattedVendors.length);
      console.log(`📋 Vendors list:`, formattedVendors);
      
      setVendors((prev) => {
        const updated = { ...prev, [tab]: formattedVendors };
        console.log(`💾 Updated vendors state:`, updated);
        return updated;
      });

      if (tab === activeTab && formattedVendors.length && !selectedVendor) {
        console.log('🎯 Setting selected vendor:', formattedVendors[0]);
        setSelectedVendor(formattedVendors[0]);
      }
    } catch (error) {
      console.error(`❌ Error fetching ${tab} vendors:`, error);
      const errorMessage = error.message || 'Failed to load vendors';
      console.log('🚨 Setting error message:', errorMessage);
      setErrors((prev) => ({ ...prev, [tab]: errorMessage }));
      setVendors((prev) => ({ ...prev, [tab]: [] }));
      
      // Show error toast
      showToast(`Failed to load ${tab} vendors: ${errorMessage}`, 'error');
    } finally {
      setLoading((prev) => ({ ...prev, [tab]: false }));
      console.log(`✅ Finished fetching ${tab} vendors`);
    }
  }, [activeTab, selectedVendor, showToast]);

  useEffect(() => {
    console.log('🚀 Component mounted, fetching all vendors...');
    // Fetch vendor tabs on mount (pending, approved, rejected)
    Promise.all([
      fetchVendors('pending'),
      fetchVendors('approved'),
      fetchVendors('rejected')
    ]).then(() => {
      console.log('✅ All vendor tabs loaded successfully');
    }).catch(err => {
      console.error('❌ Error loading vendor tabs:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  useEffect(() => {
      const handler = (event) => {
        if (!event?.detail?.status) {
          return;
        }
        const { status } = event.detail;
        if (status === 'approved') {
          fetchVendors('approved');
        }
        if (status === 'rejected') {
          fetchVendors('rejected');
        }
        if (status === 'pending') {
          fetchVendors('pending');
        }
      };

    window.addEventListener('vendor-status-updated', handler);
    return () => window.removeEventListener('vendor-status-updated', handler);
  }, [fetchVendors]);

  useEffect(() => {
    const list = vendors[activeTab];
    if (!list.length) {
      setSelectedVendor(null);
      return;
    }
    if (selectedVendor && list.some((item) => item.id === selectedVendor.id)) {
      return;
    }
    setSelectedVendor(list[0]);
  }, [vendors, activeTab, selectedVendor]);

  const activeVendors = useMemo(() => vendors[activeTab] || [], [vendors, activeTab]);
  const activeError = errors[activeTab];
  const activeLoading = loading[activeTab];

  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor);
    setApproveVendor(null);
    setRejectVendor(null);
    setRejectionReason(vendor.rejectionReason || '');
  };

  const requestRefreshAll = useCallback(() => {
    fetchVendors('pending');
    fetchVendors('approved');
    fetchVendors('rejected');
  }, [fetchVendors]);

  const confirmApprove = async () => {
    if (!approveVendor?.id) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/vendors/${approveVendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          rejectionReason: '' // Explicitly clear any rejection reason
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve vendor');
      }

      const result = await response.json();
      if (result.success) {
        showToast('Vendor approved successfully!', 'success');
        
        // Update local state to remove from pending and add to approved
        setVendors(prevVendors => ({
          ...prevVendors,
          pending: prevVendors.pending.filter(v => v.id !== approveVendor.id),
          approved: [...prevVendors.approved, { ...approveVendor, status: 'approved', rejectionReason: '' }]
        }));

        // Refresh all lists to ensure consistency
        requestRefreshAll();
        
        window.dispatchEvent(
          new CustomEvent('vendor-status-updated', {
            detail: { vendorId: approveVendor.id, status: 'approved' },
          })
        );
      }
    } catch (error) {
      showToast(error.message || 'Failed to approve vendor', 'error');
    } finally {
      setActionLoading(false);
      setApproveVendor(null);
    }
  };

  const handleRequestModification = async () => {
    if (!rejectVendor?.id) {
      return;
    }
    if (!rejectionReason.trim()) {
      showToast('Reason for rejection is required', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/vendors/${rejectVendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: rejectionReason.trim() }),
      });
      if (!response.ok) {
        throw new Error('Failed to request modification');
      }
      const result = await response.json();
      if (result.success) {
        showToast("Modification request saved", 'success');
        requestRefreshAll();
        window.dispatchEvent(
          new CustomEvent('vendor-status-updated', {
            detail: { vendorId: rejectVendor.id, status: 'pending' },
          })
        );
      }
    } catch (error) {
      showToast(error.message || 'Failed to request modification', 'error');
    } finally {
      setActionLoading(false);
      setRejectVendor(null);
      setRejectionReason('');
    }
  };

  const confirmReject = async () => {
    if (!rejectVendor?.id) {
      return;
    }
    if (!rejectionReason.trim()) {
      showToast('Reason for rejection is required', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/vendors/${rejectVendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason: rejectionReason.trim() }),
      });
      if (!response.ok) {
        throw new Error('Failed to reject vendor');
      }
      const result = await response.json();
      if (result.success) {
        showToast('Vendor rejected successfully!', 'success');
        requestRefreshAll();
        window.dispatchEvent(
          new CustomEvent('vendor-status-updated', {
            detail: { vendorId: rejectVendor.id, status: 'rejected' },
          })
        );
      }
    } catch (error) {
      showToast(error.message || 'Failed to reject vendor', 'error');
    } finally {
      setActionLoading(false);
      setRejectVendor(null);
      setRejectionReason('');
    }
  };

  const closeRejectModal = () => {
    setRejectVendor(null);
    setRejectionReason('');
  };

  const renderTableHead = () => {
    return (
      <tr>
        <th>Business Name</th>
        <th>Category</th>
        <th>Email</th>
        <th>Phone Number</th>
        <th>Status</th>
        <th>View Details</th>
        {activeTab === 'pending' && <th>Action</th>}
      </tr>
    );
  };

  const renderRow = (vendor, index) => {
    return (
      <tr key={vendor.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
        <td>
          <div className="cell-primary">{vendor.businessName || '—'}</div>
          <div className="cell-secondary">{vendor.contactName || '—'}{vendor.city ? ` • ${vendor.city}` : ''}</div>
        </td>
        <td>{vendor.category || '—'}</td>
        <td>{vendor.email || '—'}</td>
        <td>{vendor.phone || '—'}</td>
        <td>
          <span className={`status-badge ${vendor.status}`}>{vendor.status}</span>
        </td>
        <td>
          <button
            type="button"
            className="table-btn view-btn"
            onClick={() => handleViewDetails(vendor)}
          >
            <FiEye size={18} />
            View Details
          </button>
        </td>
        {activeTab === 'pending' && (
          <td>
            <div className="action-buttons">
              <button
                type="button"
                className="action-btn approve"
                onClick={() => handleApproveVendor(vendor)}
                disabled={actionLoading || vendor.status === 'approved'}
                title={vendor.status === 'approved' ? 'Already approved' : 'Approve vendor'}
              >
                <FiCheck size={18} color="#22c55e" />
              </button>
              <button
                type="button"
                className="action-btn reject"
                onClick={() => setRejectVendor(vendor)}
                disabled={actionLoading || vendor.status === 'approved'}
                title="Reject vendor"
              >
                <FiX size={18} color="#ef4444" />
              </button>
            </div>
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="vendor-request-page">
      <div className="page-head">
        <div className="title-block">
          <div className="icon-wrapper">
            <MdStore size={28} />
          </div>
          <div>
            <h1>Vendor Management</h1>
            <p>Review pending requests and manage approved or rejected vendors</p>
          </div>
        </div>
      </div>

      <VendorDetailsModal
        vendor={selectedVendor}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onApprove={() => handleApproveVendor(selectedVendor)}
        onReject={(reason) => handleRejectVendor(selectedVendor, reason)}
      />

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.key);
              if (!vendors[tab.key].length && !loading[tab.key]) {
                fetchVendors(tab.key);
              }
            }}
          >
            {tab.label}
            <span className="tab-count">{vendors[tab.key].length}</span>
          </button>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
            <h2>{TABS.find((tab) => tab.key === activeTab)?.label || 'Vendors'}</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="create-btn" onClick={() => navigate('/vendor/create')}>
              + Create Vendor
            </button>
            <button 
              type="button" 
              className="refresh-btn" 
              onClick={() => {
                fetchVendors('pending');
                fetchVendors('approved');
                fetchVendors('rejected');
              }} 
              disabled={Object.values(loading).some(l => l)}
              title="Refresh vendor tabs"
            >
              Refresh All
            </button>
          </div>
        </div>

        {activeLoading ? (
          <div className="table-state">
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div className="loading-spinner"></div>
              <p>Loading vendors...</p>
            </div>
          </div>
        ) : activeError ? (
          <div className="table-state error">
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: '#ef4444', marginBottom: '10px' }}>⚠️ Error: {activeError}</p>
              <button 
                type="button" 
                className="refresh-btn" 
                onClick={() => fetchVendors(activeTab)}
                style={{ marginTop: '10px' }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : activeVendors.length === 0 ? (
          <div className="table-state empty">
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>No vendors to display</p>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                Showing <strong>{activeTab}</strong> vendors.
                <br />
                Found: <strong>{vendors.pending.length}</strong> pending, <strong>{vendors.approved.length}</strong> approved, <strong>{vendors.rejected.length}</strong> rejected.
              </p>
              <button 
                type="button" 
                className="refresh-btn" 
                onClick={() => {
                  fetchVendors('pending');
                  fetchVendors('approved');
                  fetchVendors('rejected');
                }}
                style={{ marginTop: '10px' }}
              >
                Refresh All Tabs
              </button>
            </div>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>{renderTableHead()}</thead>
              <tbody>{activeVendors.map((vendor, index) => renderRow(vendor, index))}</tbody>
            </table>
          </div>
        )}
      </div>

      {approveVendor && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Approve Vendor Request</h3>
            <p>Are you sure you want to approve this Vendor's Request?</p>
            <div className="modal-actions">
              <button type="button" className="modal-btn secondary" onClick={() => setApproveVendor(null)} disabled={actionLoading}>
                Cancel
              </button>
              <button type="button" className="modal-btn primary" onClick={confirmApprove} disabled={actionLoading}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectVendor && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Reject Vendor Request</h3>
            <label htmlFor="rejectionReason">
              Reason for Rejection <span className="required">*</span>
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Enter reason for rejection"
            />
            <div className="modal-actions">
              <button type="button" className="modal-btn secondary" onClick={closeRejectModal} disabled={actionLoading}>
                Cancel
              </button>
              <button type="button" className="modal-btn warning" onClick={handleRequestModification} disabled={actionLoading}>
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
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default VendorRequest;
