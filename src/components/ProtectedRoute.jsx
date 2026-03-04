import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../lib/localStorage';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await auth.getSession();
      setSession(session);

      if (session) {
        setRole(session.user.role || 'user');
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setRole(null);
      } else {
        checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />; // Redirect unauthorized users to Home
  }

  return children;
};

export default ProtectedRoute;
