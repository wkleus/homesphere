import { useState } from "react";
import "./RealEstate.css";
import RealEstateCard from "./RealEstateCard/RealEstateCard";
import useFetch from "../../hooks/useFetch";
import { ENTRIES_URL } from "../../config/api";
import Heading from "../Heading/Heading";

const CATEGORIES = [
  "All",
  "Apartment",
  "Chalet",
  "Residence",
  "Studio",
  "Townhouse",
];
const DEAL_TYPES = ["All", "Rent", "Buy"];

const RealEstate = () => {
  const { data: entries, loading, error } = useFetch(ENTRIES_URL);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDeal, setActiveDeal] = useState("All");

  const available = entries
    ? entries.filter((e) => e.isAvailable).length
    : null;

  const filtered = (entries || []).filter((entry) => {
    const categoryMatch =
      activeCategory === "All" || entry.category === activeCategory;
    const dealMatch =
      activeDeal === "All" ||
      (activeDeal === "Rent" && entry.rent) ||
      (activeDeal === "Buy" && entry.buy);
    return categoryMatch && dealMatch;
  });

  if (loading)
    return (
      <>
        <Heading available={null} />
        <p className="status-msg">Loading entries...</p>
      </>
    );

  if (error)
    return (
      <>
        <Heading available={null} />
        <p className="status-msg">Error: {error}</p>
      </>
    );

  return (
    <>
      <Heading available={available} />
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
          <span className="filter-count">{filtered.length} entries found</span>
        </div>

        <div className="realEstate">
          {filtered.length > 0 ? (
            filtered.map((entry) => (
              <RealEstateCard key={entry.id} {...entry} />
            ))
          ) : (
            <p className="no-results">No properties match your filters.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default RealEstate;
