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

function App() {
  const location = useLocation(); // Get current location for animations

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
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>

          <Footer />
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
