// import "./RealEstate.css";
// import RealEstateCard from "./RealEstateCard/RealEstateCard";

// const RealEstate = ({ entries }) => {
//   return (
//     <main className="realEstate">
//       {entries.map((entry) => (
//         <RealEstateCard key={entry.id} {...entry} />
//       ))}
//     </main>
//   );
// };

// export default RealEstate;

// -----------------------

import { useState } from "react";
import "./RealEstate.css";
import RealEstateCard from "./RealEstateCard/RealEstateCard";

const CATEGORIES = [
  "All",
  "Apartment",
  "Chalet",
  "Residence",
  "Studio",
  "Townhouse",
];
const DEAL_TYPES = ["All", "Rent", "Buy"];

const RealEstate = ({ entries }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDeal, setActiveDeal] = useState("All");

  const filtered = entries.filter((entry) => {
    const categoryMatch =
      activeCategory === "All" || entry.category === activeCategory;
    const dealMatch =
      activeDeal === "All" ||
      (activeDeal === "Rent" && entry.rent) ||
      (activeDeal === "Buy" && entry.buy);
    return categoryMatch && dealMatch;
  });

  return (
    <main>
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Category</span>
          <div className="filter-buttons">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Type</span>
          <div className="filter-buttons">
            {DEAL_TYPES.map((deal) => (
              <button
                key={deal}
                className={`filter-btn ${activeDeal === deal ? "active" : ""}`}
                onClick={() => setActiveDeal(deal)}
              >
                {deal}
              </button>
            ))}
          </div>
        </div>

        <span className="filter-count">{filtered.length} properties found</span>
      </div>

      <div className="realEstate">
        {filtered.length > 0 ? (
          filtered.map((entry) => <RealEstateCard key={entry.id} {...entry} />)
        ) : (
          <p className="no-results">No properties match your filters.</p>
        )}
      </div>
    </main>
  );
};

export default RealEstate;
