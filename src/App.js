import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';

// Auth Pages
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard';
import VendorRequest from './pages/Vendor/VendorRequest';
import VendorCreate from './pages/Vendor/VendorCreate';
import VendorRequestDetails from './pages/Vendor/VendorRequestDetails';
import VendorDetails from './pages/Vendor/VendorDetails';
import VendorDetailsAccepted from './pages/Vendor/VendorDetailsAccepted';
import VendorDetailsRejected from './pages/Vendor/VendorDetailsRejected';

// Service Pages
import Service from './pages/Service/Service';
import ServiceCreate from './pages/Service/ServiceCreate';
import ServiceAcceptedDetails from './pages/Service/ServiceAcceptedDetails';
import ServiceRejectedDetails from './pages/Service/ServiceRejectedDetails';
import ServicePendingDetails from './pages/Service/ServicePendingDetails';

// User Pages
import ActiveUsersPage from './pages/User/ActiveUsersPage';
import ActiveUserDetailsPage from './pages/User/ActiveUserDetailsPage';
import UserRegistrationPage from './pages/User/UserRegistrationPage';

// Finance Pages
import Finance from './pages/Finance/Finance';

// Analytics Pages
import Analytics from './pages/Analytics/Analytics';

// Messaging Pages
import VendorMessaging from './pages/Messaging/VendorMessaging';
import UserMessaging from './pages/Messaging/UserMessaging';

// Tickets Pages
import Tickets from './pages/Tickets/Tickets';
import VendorTickets from './pages/Tickets/VendorTickets';
import UserTickets from './pages/Tickets/UserTickets';

// Placeholder UI removed; use specific pages for stubs when needed

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/request"
          element={
            <ProtectedRoute>
              <Layout>
                <VendorRequest />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/create"
          element={
            <ProtectedRoute>
              <Layout>
                <VendorCreate />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/request-details"
          element={
            <ProtectedRoute>
              <Layout>
                <VendorRequestDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/details"
          element={
            <ProtectedRoute>
              <Layout>
                <VendorDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/details/approved/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <VendorDetailsAccepted />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/details/rejected/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <VendorDetailsRejected />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/services"
          element={
            <ProtectedRoute>
              <Layout>
                <Service />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/service/create"
          element={
            <ProtectedRoute>
              <Layout>
                <ServiceCreate />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/service/accepted-details/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ServiceAcceptedDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/service/rejected-details/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ServiceRejectedDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/service/pending-details/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ServicePendingDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <Layout>
                <ActiveUsersPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/details/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ActiveUserDetailsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        

        <Route
          path="/user/create"
          element={
            <ProtectedRoute>
              <Layout>
                <UserRegistrationPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <Layout>
                <Finance />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/messaging/vendor"
          element={
            <ProtectedRoute>
              <Layout>
                <VendorMessaging />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/messaging/user"
          element={
            <ProtectedRoute>
              <Layout>
                <UserMessaging />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Layout>
                <Tickets />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/vendor"
          element={
            <ProtectedRoute>
              <Layout>
                <VendorTickets />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/user"
          element={
            <ProtectedRoute>
              <Layout>
                <UserTickets />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;