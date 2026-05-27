import "./App.css";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Heading from "./components/Heading/Heading";
import RealEstate from "./components/Main/RealEstate";
import EstateDetails from "./pages/EstateDetails/EstateDetails";
// import entries from "./content/entries";

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
              <RealEstate />
            </>
          }
        />
        <Route
          path="/property/:id"
          // element={<EstateDetails entries={entries} />}
          element={<EstateDetails />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
