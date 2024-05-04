import React from 'react';
import { useUser } from './UserContext';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  path: string;
  element: React.ReactElement;
  roles: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ path, element, roles }) => {
  const { user } = useUser();

  console.log('PrivateRoute', user, roles);
  console



  return (
    <Route 
      path={path} 
    >
      {user && roles.includes(user.role) 
        ? element 
        : <Navigate to="/pages/login" state={{ from: path }} />
      }
    </Route>
  );
};