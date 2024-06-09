import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ element, requiredRole }: { element: JSX.Element; requiredRole?: string }) => {
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (requiredRole && user.role !== requiredRole) {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } else {
        setIsAuthorized(false);
      }
    }
  }, [user, loading, requiredRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/pages/login" />;
  }

  return element;
};

export default ProtectedRoute;
