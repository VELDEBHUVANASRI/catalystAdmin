import React, { useState, useEffect } from 'react';
import './Analytics.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const Analytics = () => {
  const [chartType] = useState('donut'); // Can be 'donut' or 'bar'
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: 'Total Events', value: 0, color: '#4da6ff' },
    { title: 'Total Vendors', value: 0, color: '#66b2ff' },
    { title: 'Avg Events per Vendor', value: 0, color: '#99ccff' },
  ]);
  const [eventTypeData, setEventTypeData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/analytics`);
        const result = await response.json();

        if (result.success && result.data) {
          const eventStats = result.data.eventStats || {};
          const vendorStats = result.data.vendorStats || {};

          setStats([
            { title: 'Total Events', value: eventStats.totalEvents || 0, color: '#4da6ff' },
            { title: 'Total Vendors', value: vendorStats.totalVendors || 0, color: '#66b2ff' },
            {
              title: 'Avg Events per Vendor',
              value: parseFloat(eventStats.avgEventsPerVendor || 0).toFixed(1),
              color: '#99ccff',
            },
          ]);

          // Map event type data with colors
          const colors = ['#66b2ff', '#99ccff', '#cce6ff', '#0066cc', '#004da6'];
          const eventTypes = eventStats.eventTypeData || [];
          setEventTypeData(
            eventTypes.map((item, index) => ({
              label: item.label.charAt(0).toUpperCase() + item.label.slice(1).toLowerCase(),
              value: item.value,
              color: colors[index % colors.length],
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Calculate total for percentage
  const totalEvents = eventTypeData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Generate Donut Chart SVG
  const generateDonutChart = () => {
    const size = 200;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let currentAngle = 0;

    return (
      <svg width="250" height="250" viewBox="0 0 250 250" className="donut-chart">
        <circle cx="125" cy="125" r="50" fill="#e6f3ff" />
        <text x="125" y="120" textAnchor="middle" fontSize="24" fontWeight="700" fill="#003366">
          {totalEvents}
        </text>
        <text x="125" y="140" textAnchor="middle" fontSize="12" fill="#666">
          Events
        </text>

        {eventTypeData.map((item, index) => {
          const percentage = (item.value / totalEvents) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = 125 + radius * Math.cos(startRad);
          const y1 = 125 + radius * Math.sin(startRad);
          const x2 = 125 + radius * Math.cos(endRad);
          const y2 = 125 + radius * Math.sin(endRad);

          const largeArc = angle > 180 ? 1 : 0;

          const pathData = [
            `M 125 125`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `Z`,
          ].join(' ');

          currentAngle = endAngle;

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="#fff"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="analytics-container">
      <h1 className="page-title">Analytics</h1>

      {/* Event Overview Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <span style={{ color: '#fff', fontSize: '24px' }}>📊</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <h2 className="chart-title">Most Booked Event Types</h2>

        <div className="chart-container">
          <div className="chart-visualization">
            {generateDonutChart()}
          </div>

          <div className="chart-legend">
            {eventTypeData.map((item, index) => (
              <div key={index} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="legend-text">
                  <span className="legend-label">{item.label}</span>
                  <span className="legend-value">
                    {item.value} ({((item.value / totalEvents) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;