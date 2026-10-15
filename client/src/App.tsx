import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { ReadingSessionProvider } from "@/context/ReadingSessionContext";
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
import { ReadingSessionNavigationLock } from "@/components/reading/ReadingSessionNavigationLock";

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <>
      {!isAuthPage && <Navbar />}

      <ReadingSessionNavigationLock />

      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/discover",
        element: <DiscoverPage />,
      },
      {
        path: "/book/google/:externalId",
        element: <BookPage />,
      },
      {
        path: "/book/:id",
        element: <BookPage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/library",
            element: <LibraryPage />,
          },
          {
            path: "/stats",
            element: <StatsPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <ReadingSessionProvider>
        <RouterProvider router={router} />
      </ReadingSessionProvider>
    </AuthProvider>
  );
}

export default App;