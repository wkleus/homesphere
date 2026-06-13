import { useState } from "react";
import "./RealEstate.css";
import RealEstateCard from "./RealEstateCard/RealEstateCard";
import useFetch from "../../hooks/useFetch";
import { ENTRIES_URL } from "../../config/api";
import Heading from "../Heading/Heading";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useTranslation } from "react-i18next";

// Fixed English keys for state – never change on language switch
const CATEGORY_KEYS = [
  "All",
  "Apartment",
  "Chalet",
  "Residence",
  "Studio",
  "Townhouse",
];
const DEAL_KEYS = ["All", "Rent", "Buy"];

const RealEstate = () => {
  const { data: entries, loading, error } = useFetch(ENTRIES_URL);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDeal, setActiveDeal] = useState("All");
  const { t } = useTranslation();

  // Translated labels for display only
  const CATEGORIES = CATEGORY_KEYS.map((key) =>
    key === "All" ? t("filter.all") : key,
  );
  const DEAL_TYPES = DEAL_KEYS.map((key) => t(`filter.${key.toLowerCase()}`));

  const available = entries
    ? entries.filter((e) => e.isAvailable).length
    : null;

  // Filter always compares against English keys, not translated strings
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
        <LoadingSpinner />
      </>
    );

  if (error)
    return (
      <>
        <Heading available={null} />
        <p className="status-msg">{t("error", { message: error })}</p>
      </>
    );

  return (
    <>
      <Heading available={available} />
      <main>
        <div className="filter-bar">
          <div className="filter-group">
            <span className="filter-label">{t("filter.category")}</span>
            <div className="filter-buttons">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={CATEGORY_KEYS[i]}
                  className={`filter-btn ${activeCategory === CATEGORY_KEYS[i] ? "active" : ""}`}
                  onClick={() => setActiveCategory(CATEGORY_KEYS[i])}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">{t("filter.type")}</span>
            <div className="filter-buttons">
              {DEAL_TYPES.map((deal, i) => (
                <button
                  key={DEAL_KEYS[i]}
                  className={`filter-btn ${activeDeal === DEAL_KEYS[i] ? "active" : ""}`}
                  onClick={() => setActiveDeal(DEAL_KEYS[i])}
                >
                  {deal}
                </button>
              ))}
            </div>
          </div>
          <span className="filter-count">
            {t("filter.found", { count: filtered.length })}
          </span>
        </div>

        <div className="realEstate">
          {filtered.length > 0 ? (
            filtered.map((entry) => (
              <RealEstateCard key={entry.id} {...entry} />
            ))
          ) : (
            <p className="no-results">{t("noResults")}</p>
          )}
        </div>
      </main>
    </>
  );
};

export default RealEstate;
