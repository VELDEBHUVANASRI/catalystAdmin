import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import {
  MdDashboard,
  MdStore,
  MdPeople,
  MdAttachMoney,
  MdAnalytics,
  MdMessage,
  MdExpandMore,
  MdExpandLess,
  MdConfirmationNumber,
} from 'react-icons/md';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const isActive = (path) => location.pathname === path;

  const toggleExpand = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: <MdDashboard size={20} />,
      path: '/dashboard',
      submenu: null,
    },
    {
      label: 'Vendor',
      icon: <MdStore size={20} />,
      submenu: [
        { label: 'Vendor Request', path: '/vendor/request' },
        { label: 'Vendor Details', path: '/vendor/details' },
        { label: 'Create Vendor', path: '/vendor/create' },
        { label: 'Services', path: '/vendor/services' },
      ],
    },
    {
      label: 'User',
      icon: <MdPeople size={20} />,
      submenu: [
        { label: 'User Details', path: '/user' },
        { label: 'Active Users', path: '/user/active' },
        { label: 'Create User', path: '/user/create' },
      ],
    },
    {
      label: 'Finance',
      icon: <MdAttachMoney size={20} />,
      path: '/finance',
      submenu: null,
    },
    {
      label: 'Analytics',
      icon: <MdAnalytics size={20} />,
      path: '/analytics',
      submenu: null,
    },
    {
      label: 'Messaging',
      icon: <MdMessage size={20} />,
      submenu: [
        { label: 'Vendor Message', path: '/messaging/vendor' },
        { label: 'User Message', path: '/messaging/user' },
      ],
    },
    {
      label: 'Tickets',
      icon: <MdConfirmationNumber size={20} />,
      submenu: [
        { label: 'Vendor Tickets', path: '/tickets/vendor' },
        { label: 'User Tickets', path: '/tickets/user' },
      ],
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">Event Manager</h1>
          <button className="close-btn" onClick={toggleSidebar}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <>
                  <button
                    className={`nav-item ${expandedMenu === item.label ? 'expanded' : ''}`}
                    onClick={() => toggleExpand(item.label)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-chevron">
                      {expandedMenu === item.label ? (
                        <MdExpandLess size={20} />
                      ) : (
                        <MdExpandMore size={20} />
                      )}
                    </span>
                  </button>
                  {expandedMenu === item.label && (
                    <div className="submenu">
                      {item.submenu.map((subitem, subindex) => (
                        <button
                          key={subindex}
                          className={`submenu-item ${
                            isActive(subitem.path) ? 'active' : ''
                          }`}
                          onClick={() => {
                            navigate(subitem.path);
                            toggleSidebar();
                          }}
                        >
                          <span className="submenu-bullet"></span>
                          {subitem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    toggleSidebar();
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;