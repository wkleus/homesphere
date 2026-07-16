import "./RealEstatePhoto.css";
import { useState } from "react";
import { motion } from "framer-motion";

const RealEstatePhoto = ({ photo, address, children }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="realEstate-photo">
      <motion.img
        src={photo}
        alt={`Immobilie: ${address}`}
        className="realEstate-img"
        // images outside the viewport are lazy-loaded
        loading="lazy"
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      {children}
    </div>
  );
};

export default RealEstatePhoto;
