import "./App.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import RealEstate from "./components/Main/RealEstate";
import Heading from "./components/Heading/Heading";

function App() {
  return (
    <div className="homesphere-app">
      <Navbar />
      <Heading />
      <RealEstate />
      <Footer />
    </div>
  );
}

export default App;
