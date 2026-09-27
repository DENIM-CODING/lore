import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import DiscoverPage from "@/pages/DiscoverPage";
import LibraryPage from "@/pages/LibraryPage";
import BookPage from "@/pages/BookPage";
import StatsPage from "@/pages/StatsPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/discover" element={<DiscoverPage />} />

        <Route path="/library" element={<LibraryPage />} />

        <Route path="/book/:id" element={<BookPage />} />

        <Route path="/stats" element={<StatsPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;