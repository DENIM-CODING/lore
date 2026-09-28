import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import AuthPage from "@/pages/AuthPage";
import LandingPage from "@/pages/LandingPage";
import DiscoverPage from "@/pages/DiscoverPage";
import LibraryPage from "@/pages/LibraryPage";
import BookPage from "@/pages/BookPage";
import StatsPage from "@/pages/StatsPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

function AppContent() {
  const location = useLocation();

  const isAuthPage = location.pathname === "/auth";

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route
          path="/discover"
          element={<DiscoverPage />}
        />

        <Route
          path="/book/google/:externalId"
          element={<BookPage />}
        />

        <Route
          path="/book/:id"
          element={<BookPage />}
        />

        <Route
          path="/auth"
          element={<AuthPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/library"
            element={<LibraryPage />}
          />

          <Route
            path="/stats"
            element={<StatsPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;