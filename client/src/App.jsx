import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import RealEstate from "./components/Main/RealEstate";
import EstateDetails from "./pages/EstateDetails/EstateDetails";
import Favorites from "./pages/Favorites/Favorites";
import { FavoritesProvider } from "./context/FavoritesContext";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NotFound from "./pages/NotFound/NotFound";
import { useState } from "react";
import AIAgentChat from "./components/AIAgent/AIAgentChat";
import { House, X } from "lucide-react"; //

function App() {
  const location = useLocation(); // Get current location for animations
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    // AuthProvider wraps everything to provide auth state globally
    <AuthProvider>
      {/* FavoritesProvider wraps all components for favorites access */}
      <FavoritesProvider>
        <div className="homesphere-app">
          <Navbar />

          {/* AnimatePresence enables exit animations for route transitions */}
          <AnimatePresence mode="wait" initial={false}>
            {/* Routes with location key enable page transition animations */}
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<RealEstate />} />
              <Route path="/estate/:id" element={<EstateDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all: any unmatched path renders the 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>

          <Footer />

          {/* AI Chat Button – completely hidden when chat is open */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="ai-chat-toggle"
              aria-label="Open AI assistant"
              aria-expanded={false}
            >
              {/* Avatar with pulsating ring */}
              <div className="ai-chat-toggle__avatar-wrapper">
                <div className="ai-chat-toggle__ring" />
                <div className="ai-chat-toggle__avatar">
                  <House size={28} color="white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Label */}
              <span className="ai-chat-toggle__label">House‑hunting?</span>
            </button>
          )}

          {/* AI Chat Component */}
          <AIAgentChat
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
