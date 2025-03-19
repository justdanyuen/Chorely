import { Navigate } from "react-router";

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

export function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
    if (!isAuthenticated) {
        console.warn("🔒 Access denied - Redirecting to login");
        return <Navigate to="/login" replace />;
    }
    return children;
}