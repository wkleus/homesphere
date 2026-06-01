import "./App.css";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Heading from "./components/Heading/Heading";
import RealEstate from "./components/Main/RealEstate";
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
              <RealEstate />
            </>
          }
        />
        <Route path="/entry/:id" element={<EstateDetails />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
