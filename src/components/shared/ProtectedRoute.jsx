import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading… 🌿</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile && profile.role !== role)
    return <Navigate to={`/${profile.role}`} replace />;

  return children;
}