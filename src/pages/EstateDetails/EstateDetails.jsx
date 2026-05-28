// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Bed,
//   Buildings,
//   Lightning,
//   Square,
//   MapPin,
//   ArrowLeft,
//   Tag,
// } from "phosphor-react";
// import "./EstateDetails.css";

// const EstateDetails = ({ entries }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const entry = entries.find((e) => e.id === Number(id));

//   if (!entry) {
//     return (
//       <div className="detail-not-found">
//         <p>Property not found.</p>
//         <button onClick={() => navigate("/")}>← Back to listings</button>
//       </div>
//     );
//   }

//   const {
//     address,
//     isAvailable,
//     energyClass,
//     rent,
//     buy,
//     photo,
//     rooms,
//     squareMeters,
//     category,
//     yearBuilt,
//   } = entry;

//   return (
//     <div className="detail-page">
//       <button className="detail-back-btn" onClick={() => navigate(-1)}>
//         <ArrowLeft size={18} weight="bold" /> Back to listings
//       </button>

//       <div className="detail-card">
//         <div className="detail-photo-wrapper">
//           <img
//             src={photo}
//             alt={`Property: ${address}`}
//             className="detail-photo"
//           />
//           <span
//             className={`detail-availability ${isAvailable ? "available" : "unavailable"}`}
//           >
//             {isAvailable ? "Available" : "Not Available"}
//           </span>
//           <span className="detail-category">{category}</span>
//         </div>

//         <div className="detail-content">
//           <h1 className="detail-address">
//             <MapPin size={20} weight="fill" /> {address}
//           </h1>

//           <div className="detail-price-row">
//             {rent && (
//               <div className="detail-price rent">
//                 <span className="price-label">Monthly Rent</span>
//                 <span className="price-value">EUR {rent.toLocaleString()}</span>
//               </div>
//             )}
//             {buy && (
//               <div className="detail-price buy">
//                 <span className="price-label">Purchase Price</span>
//                 <span className="price-value">EUR {buy.toLocaleString()}</span>
//               </div>
//             )}
//           </div>

//           <div className="detail-stats">
//             <div className="detail-stat">
//               <Bed size={28} weight="duotone" />
//               <span className="stat-value">{rooms}</span>
//               <span className="stat-label">Rooms</span>
//             </div>
//             <div className="detail-stat">
//               <Square size={28} weight="duotone" />
//               <span className="stat-value">{squareMeters} m²</span>
//               <span className="stat-label">Living Area</span>
//             </div>
//             <div className="detail-stat">
//               <Lightning size={28} weight="duotone" />
//               <span className="stat-value">{energyClass}</span>
//               <span className="stat-label">Energy Class</span>
//             </div>
//             <div className="detail-stat">
//               <Buildings size={28} weight="duotone" />
//               <span className="stat-value">{yearBuilt}</span>
//               <span className="stat-label">Year Built</span>
//             </div>
//             <div className="detail-stat">
//               <Tag size={28} weight="duotone" />
//               <span className="stat-value">{category}</span>
//               <span className="stat-label">Type</span>
//             </div>
//           </div>

//           <button className="detail-contact-btn">Contact Agent</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EstateDetails;

// -------------------------------

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bed,
  Buildings,
  Lightning,
  Square,
  MapPin,
  ArrowLeft,
  Tag,
} from "phosphor-react";
import "./EstateDetails.css";

const API_URL = "https://6a16f2541b90031f81b1c58f.mockapi.io/api/v1/properties";

const EstateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Property not found");
        return res.json();
      })
      .then((data) => {
        setEntry(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="status-msg">Loading property...</p>;
  if (error || !entry)
    return (
      <div className="detail-not-found">
        <p>Property not found.</p>
        <button onClick={() => navigate("/")}>← Back to listings</button>
      </div>
    );

  const {
    address,
    isAvailable,
    energyClass,
    rent,
    buy,
    photo,
    rooms,
    squareMeters,
    category,
    yearBuilt,
  } = entry;

  return (
    <div className="detail-page">
      <button className="detail-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} weight="bold" /> Back to listings
      </button>

      <div className="detail-card">
        <div className="detail-photo-wrapper">
          <img
            src={photo}
            alt={`Property: ${address}`}
            className="detail-photo"
          />
          <span
            className={`detail-availability ${isAvailable ? "available" : "unavailable"}`}
          >
            {isAvailable ? "Available" : "Not Available"}
          </span>
          <span className="detail-category">{category}</span>
        </div>

        <div className="detail-content">
          <h1 className="detail-address">
            <MapPin size={20} weight="fill" /> {address}
          </h1>

          <div className="detail-price-row">
            {rent && (
              <div className="detail-price rent">
                <span className="price-label">Monthly Rent</span>
                <span className="price-value">EUR {rent.toLocaleString()}</span>
              </div>
            )}
            {buy && (
              <div className="detail-price buy">
                <span className="price-label">Purchase Price</span>
                <span className="price-value">EUR {buy.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="detail-stats">
            <div className="detail-stat">
              <Bed size={28} weight="duotone" />
              <span className="stat-value">{rooms}</span>
              <span className="stat-label">Rooms</span>
            </div>
            <div className="detail-stat">
              <Square size={28} weight="duotone" />
              <span className="stat-value">{squareMeters} m²</span>
              <span className="stat-label">Living Area</span>
            </div>
            <div className="detail-stat">
              <Lightning size={28} weight="duotone" />
              <span className="stat-value">{energyClass}</span>
              <span className="stat-label">Energy Class</span>
            </div>
            <div className="detail-stat">
              <Buildings size={28} weight="duotone" />
              <span className="stat-value">{yearBuilt}</span>
              <span className="stat-label">Year Built</span>
            </div>
            <div className="detail-stat">
              <Tag size={28} weight="duotone" />
              <span className="stat-value">{category}</span>
              <span className="stat-label">Type</span>
            </div>
          </div>

          <button className="detail-contact-btn">Contact Agent</button>
        </div>
      </div>
    </div>
  );
};

export default EstateDetails;
