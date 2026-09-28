import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
        <div className="flex items-center gap-3 text-sm text-white/40">
          <div className="size-4 animate-spin rounded-full border-2 border-white/10 border-t-[#c4a46a]" />
          Loading your library...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{
            from:
                location.pathname +
                location.search +
                location.hash,
        }}
      />
    );
  }

  return <Outlet />;
}