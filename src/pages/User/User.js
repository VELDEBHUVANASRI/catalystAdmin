import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple redirect component for the /user route.
const User = () => {
  return <Navigate to="/user/active" replace />;
};

export default User;
