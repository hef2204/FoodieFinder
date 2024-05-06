import React from 'react';
import { useUser } from './UserContext';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
  roles: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, roles }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/pages/login" state={{ from: location }} replace />;
  }

  return element;
};