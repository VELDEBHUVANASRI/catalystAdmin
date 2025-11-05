import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi';
import Toast from '../../components/Toast/Toast';
import './VendorDetails.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const VendorDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('approved');
  const [businessNameFilter, setBusinessNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const categories = ['Catering', 'Decoration', 'Photography', 'Music', 'Videography', 'Entertainment', 'Flowers', 'Other'];

  const fetchApprovedVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/vendors/approved`);
      if (!response.ok) {
        throw new Error('Failed to load approved vendors');
      }
      const result = await response.json();
      if (Array.isArray(result.data)) {
        const formatted = result.data.map((vendor) => ({
          id: vendor.id || vendor._id || '',
          businessName: vendor.businessName || '',
          contactName: vendor.contactName || '',
          category: vendor.category || '',
          email: vendor.email || '',
          phone: vendor.phone || '',
          city: vendor.city || '',
          status: typeof vendor.status === 'string' ? vendor.status.toLowerCase() : 'approved',
          createdAt: vendor.createdAt || '',
          updatedAt: vendor.updatedAt || '',
        }));
        setApprovedVendors(formatted);
      } else {
        setApprovedVendors([]);
      }
    } catch (error) {
      setApprovedVendors([]);
      setToast({ message: error.message || 'Failed to load approved vendors', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedVendors();
  }, []);

  useEffect(() => {
    const handler = (event) => {
      if (event?.detail?.status === 'approved') {
        fetchApprovedVendors();
      }
    };

    window.addEventListener('vendor-status-updated', handler);
    return () => window.removeEventListener('vendor-status-updated', handler);
  }, []);

  const filterVendors = useMemo(
    () => (vendors) => {
      return vendors.filter((vendor) => {
        const matchesBusinessName = (vendor.businessName || '')
          .toLowerCase()
          .includes(businessNameFilter.toLowerCase());
        const matchesCategory =
          categoryFilter === '' || (vendor.category || '').toLowerCase() === categoryFilter.toLowerCase();

        let matchesDate = true;
        if (dateRange.from) {
          matchesDate = matchesDate && new Date(vendor.createdAt) >= new Date(dateRange.from);
        }
        if (dateRange.to) {
          matchesDate = matchesDate && new Date(vendor.createdAt) <= new Date(dateRange.to);
        }

        return matchesBusinessName && matchesCategory && matchesDate;
      });
    },
    [businessNameFilter, categoryFilter, dateRange.from, dateRange.to]
  );

  const filteredApprovedVendors = filterVendors(approvedVendors);
  const filteredRejectedVendors = [];

  const handleResetFilters = () => {
    setBusinessNameFilter('');
    setCategoryFilter('');
    setDateFilter('');
    setDateRange({ from: '', to: '' });
  };

  const handleRefresh = () => {
    fetchApprovedVendors();
  };

  const handleViewDetails = (vendor) => {
    navigate(`/vendor/details/approved/${vendor.id}`, { state: { vendor } });
  };

  return (
    <div className="vendor-details-container">
      {/* Header Section */}
      <div className="vendor-details-header">
        <div className="header-left">
          <h1>Vendor Details</h1>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
            <FiRefreshCw size={18} className={loading ? 'spin' : ''} />
            Refresh
          </button>
          <button
            className="create-vendor-btn"
            onClick={() => navigate('/vendor/create')}
          >
            <FiPlus size={20} />
            Create Vendor
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <button
            className={`date-filter-btn ${dateFilter === 'week' ? 'active' : ''}`}
            onClick={() => setDateFilter('week')}
          >
            Week
          </button>
          <button
            className={`date-filter-btn ${dateFilter === 'month' ? 'active' : ''}`}
            onClick={() => setDateFilter('month')}
          >
            Month
          </button>
          <button
            className={`date-filter-btn ${dateFilter === 'year' ? 'active' : ''}`}
            onClick={() => setDateFilter('year')}
          >
            Year
          </button>
        </div>

        <div className="filter-group">
          <div className="date-range-inputs">
            <input
              type="date"
              placeholder="From"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              title="Select custom date range"
            />
            <span>to</span>
            <input
              type="date"
              placeholder="To"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              title="Select custom date range"
            />
          </div>
        </div>

        <div className="filter-group">
          <select
            className="category-dropdown"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <div className="search-input-wrapper">
            <FiSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Business Name"
              value={businessNameFilter}
              onChange={(e) => setBusinessNameFilter(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <button className="reset-filters-btn" onClick={handleResetFilters}>
          Reset
        </button>
      </div>

      {/* Tabs Section */}
      <div className="tabs-section">
        <button
          className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Vendors ({filteredApprovedVendors.length})
        </button>
      </div>

      {/* Tables Section */}
      <div className="table-container">
        <div className="vendors-table-wrapper">
          {loading ? (
            <div className="table-loading">Loading approved vendors...</div>
          ) : filteredApprovedVendors.length > 0 ? (
            <table className="vendors-table">
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Category</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApprovedVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>
                      <div className="vendor-info">
                        <span className="vendor-name">{vendor.businessName}</span>
                        <span className="vendor-city">{vendor.city || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{vendor.category || '—'}</span>
                    </td>
                    <td>{vendor.email || '—'}</td>
                    <td>{vendor.phone || '—'}</td>
                    <td>
                      <span className={`status-chip ${vendor.status}`}>{vendor.status?.charAt(0).toUpperCase() + vendor.status?.slice(1)}</span>
                    </td>
                    <td>
                      <button
                        className="view-details-btn"
                        onClick={() => handleViewDetails(vendor)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data-message">No approved vendors found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;