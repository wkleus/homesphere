import "./App.css";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import RealEstate from "./components/Main/RealEstate";
import EstateDetails from "./pages/EstateDetails/EstateDetails";
import Favorites from "./pages/Favorites/Favorites";
import { FavoritesProvider } from "./context/FavoritesContext";

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
        </Routes>
        <Footer />
      </div>
    </FavoritesProvider>
  );
}

export default App;
