import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Protege rutas de admin.
 * Si no está logueado → /login
 * Si está logueado pero no es admin → /
 */
export function RequireAdmin({ children }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role !== "admin" && user?.role !== "superadmin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
