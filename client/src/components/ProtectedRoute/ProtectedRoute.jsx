import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Protect routes from unauthorized access
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) return <p className="status-msg">Loading...</p>;

  // Redirect to login if no user is authenticated
  // 'replace' prevents user from going back to the protected page
  if (!user) return <Navigate to="/login" replace />;

  // Render children if user is authenticated
  return children;
};

export default ProtectedRoute;
