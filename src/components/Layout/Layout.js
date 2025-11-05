import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-wrapper">
        <TopBar toggleSidebar={toggleSidebar} />
        <main className="main-content" onClick={closeSidebar}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;