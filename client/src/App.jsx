import "./App.css";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import RealEstate from "./components/Main/RealEstate";
import EstateDetails from "./pages/EstateDetails/EstateDetails";
import Favorites from "./pages/Favorites/Favorites";
import { FavoritesProvider } from "./context/FavoritesContext";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    // FavoritesProvider wraps the entire app so all components can access favorites
    <FavoritesProvider>
      <div className="homesphere-app">
        <Navbar />
        <Routes>
          <Route path="/" element={<RealEstate />} />
          <Route path="/estate/:id" element={<EstateDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </FavoritesProvider>
  );
}

export default App;
