import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCheckCircle, FiAlertCircle, FiUser } from 'react-icons/fi';
import { MdStore, MdDashboard } from 'react-icons/md';
import StatCard from '../../components/Dashboard/StatCard';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [userStats, setUserStats] = useState({ totalUsers: 0, activeUsers: 0, blockedUsers: 0 });
  const [vendorStats, setVendorStats] = useState({ totalVendors: 0, activeVendors: 0, blockedVendors: 0 });
  const [userOverviewData, setUserOverviewData] = useState([]);
  const [vendorRegistrationData, setVendorRegistrationData] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');

    if (!storedUser || !authToken) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDataLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/analytics`);
        const result = await response.json();

        if (result.success && result.data) {
          setUserStats(result.data.userStats || {});
          setVendorStats(result.data.vendorStats || {});
          setUserOverviewData(result.data.userOverviewData || []);
          setVendorRegistrationData(result.data.vendorRegistrationData || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    if (!loading) {
      fetchDashboardData();
    }
  }, [loading]);

  if (loading || dataLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const userOverviewCards = [
    {
      title: 'Total Users',
      count: userStats.totalUsers?.toLocaleString() || '0',
      change: 5,
      icon: <FiUsers size={32} />,
      isPositive: true,
    },
    {
      title: 'Active Users',
      count: userStats.activeUsers?.toLocaleString() || '0',
      change: 2,
      icon: <FiCheckCircle size={32} />,
      isPositive: true,
    },
    {
      title: 'Blocked Users',
      count: userStats.blockedUsers?.toLocaleString() || '0',
      change: -1,
      icon: <FiAlertCircle size={32} />,
      isPositive: false,
    },
  ];

  const vendorOverviewCards = [
    {
      title: 'Total Vendors',
      count: vendorStats.totalVendors?.toLocaleString() || '0',
      change: 3,
      icon: <MdStore size={32} />,
      isPositive: true,
    },
    {
      title: 'Active Vendors',
      count: vendorStats.activeVendors?.toLocaleString() || '0',
      change: 4,
      icon: <FiCheckCircle size={32} />,
      isPositive: true,
    },
    {
      title: 'Blocked Vendors',
      count: vendorStats.blockedVendors?.toLocaleString() || '0',
      change: -2,
      icon: <FiAlertCircle size={32} />,
      isPositive: false,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">
            <MdDashboard size={28} />
            Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome back, <span className="user-name">{user?.name || 'User'}</span>!
          </p>
        </div>

        <div className="dashboard-header-right">
          <div className="user-info-card">
            <FiUser className="user-info-icon" />
            <div className="user-info-text">
              <p className="user-info-label">Logged in as</p>
              <p className="user-info-email">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Overview Section */}
      <section className="dashboard-section">
        <h2 className="section-title">
          <FiUsers size={20} />
          User Overview
        </h2>
        <div className="cards-grid">
          {userOverviewCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Vendor Overview Section */}
      <section className="dashboard-section">
        <h2 className="section-title">
          <MdStore size={20} />
          Vendor Overview
        </h2>
        <div className="cards-grid">
          {vendorOverviewCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Analytics Section */}
      <section className="dashboard-section">
        <h2 className="section-title">
          <MdDashboard size={20} />
          Analytics
        </h2>
        <div className="charts-grid">
          {/* Line Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Monthly User Registration</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userOverviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#4da6ff"
                  strokeWidth={3}
                  dot={{ fill: '#4da6ff', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Monthly Vendor Registration</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendorRegistrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="vendors"
                  fill="#4da6ff"
                  radius={[8, 8, 0, 0]}
                  name="Vendors"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;