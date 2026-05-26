import "./App.css";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Heading from "./components/Heading/Heading";
import RealEstate from "./components/Main/RealEstate";
import entries from "./content/entries";
// import RealEstateDetails from "./components/Main/RealEstateCard/RealEstateDetails/RealEstateDetails";
import EstateDetails from "./pages/EstateDetails/EstateDetails";

function App() {
  return (
    <div className="homesphere-app">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Heading />
              <RealEstate entries={entries} />
            </>
          }
        />
        <Route
          path="/property/:id"
          element={<EstateDetails entries={entries} />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
