import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiMenu, FiSearch } from 'react-icons/fi';
import './TopBar.css';

const TopBar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      console.log('Search:', searchQuery);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login', { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={toggleSidebar} title="Toggle Sidebar">
          <FiMenu size={24} />
        </button>
      </div>

      <div className="topbar-center">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder={location.pathname.startsWith('/user') ? 'Search users…' : 'Search…'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;