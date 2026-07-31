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

// Number of listings shown per page
const PAGE_SIZE = 9;

const RealEstate = () => {
  const { data: entries, loading, error } = useFetch(ENTRIES_URL);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDeal, setActiveDeal] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const [minRooms, setMinRooms] = useState("");
  const [maxRooms, setMaxRooms] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Translated labels for display only
  const CATEGORIES = CATEGORY_KEYS.map((key) =>
    key === "All" ? t("filter.all") : key,
  );
  const DEAL_TYPES = DEAL_KEYS.map((key) => t(`filter.${key.toLowerCase()}`));

  const available = entries
    ? entries.filter((e) => e.isAvailable).length
    : null;

  // True when at least one rooms bound is set (for the badge on the toggle)
  const hasRoomsFilter = minRooms !== "" || maxRooms !== "";

  // Filter always compares against English keys, not translated strings
  const filtered = (entries || []).filter((entry) => {
    const categoryMatch =
      activeCategory === "All" || entry.category === activeCategory;
    const dealMatch =
      activeDeal === "All" ||
      (activeDeal === "Rent" && entry.rent) ||
      (activeDeal === "Buy" && entry.buy);

    const roomsMatch =
      (minRooms === "" || entry.rooms >= Number(minRooms)) &&
      (maxRooms === "" || entry.rooms <= Number(maxRooms));
    return categoryMatch && dealMatch && roomsMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Clamp in case a filter change leaves currentPage beyond the new total
  // (e.g. user was on page 3, then filters down to only 1 page of results)
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // Changing a filter always jumps back to page 1, so users don't land on
  // a now out-of-range or confusingly-numbered page
  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    setCurrentPage(1);
  };
  const handleDealChange = (key) => {
    setActiveDeal(key);
    setCurrentPage(1);
  };
  const handleMinRoomsChange = (value) => {
    setMinRooms(value);
    setCurrentPage(1);
  };
  const handleMaxRoomsChange = (value) => {
    setMaxRooms(value);
    setCurrentPage(1);
  };
  const resetRoomsFilter = () => {
    setMinRooms("");
    setMaxRooms("");
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll the listings back into view so the user isn't left staring
    // at the (now stale) scroll position from the previous page
    document
      .querySelector(".realEstate")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                  onClick={() => handleCategoryChange(CATEGORY_KEYS[i])}
                  aria-pressed={activeCategory === CATEGORY_KEYS[i]}
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
                  onClick={() => handleDealChange(DEAL_KEYS[i])}
                  aria-pressed={activeDeal === DEAL_KEYS[i]}
                >
                  {deal}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`filter-advanced-toggle ${showAdvanced ? "open" : ""} ${hasRoomsFilter ? "has-active" : ""}`}
            onClick={() => setShowAdvanced((prev) => !prev)}
            aria-expanded={showAdvanced}
          >
            {t("filter.moreFilters")}
            {hasRoomsFilter && <span className="filter-badge">1</span>}
            <span className="filter-chevron" aria-hidden="true">
              {showAdvanced ? "▴" : "▾"}
            </span>
          </button>

          <span className="filter-count">
            {t("filter.found", { count: filtered.length })}
          </span>
        </div>

        {showAdvanced && (
          <div className="filter-advanced">
            <div className="filter-group">
              <span className="filter-label">{t("filter.rooms")}</span>
              <div className="filter-range">
                <input
                  type="number"
                  className="filter-input"
                  min="1"
                  max="50"
                  placeholder={t("filter.min")}
                  value={minRooms}
                  onChange={(e) => handleMinRoomsChange(e.target.value)}
                  aria-label={t("filter.minRooms")}
                />
                <span className="filter-range-sep">–</span>
                <input
                  type="number"
                  className="filter-input"
                  min="1"
                  max="50"
                  placeholder={t("filter.max")}
                  value={maxRooms}
                  onChange={(e) => handleMaxRoomsChange(e.target.value)}
                  aria-label={t("filter.maxRooms")}
                />

                {hasRoomsFilter && (
                  <button
                    type="button"
                    className="filter-reset"
                    onClick={resetRoomsFilter}
                  >
                    {t("filter.reset")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="realEstate">
          {paginated.length > 0 ? (
            paginated.map((entry) => (
              <RealEstateCard key={entry.id} {...entry} />
            ))
          ) : (
            <p className="no-results">{t("noResults")}</p>
          )}
        </div>

        {totalPages > 1 && (
          <nav className="pagination" aria-label={t("pagination.label")}>
            <button
              className="pagination-btn"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              aria-label={t("pagination.previous")}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${page === safePage ? "active" : ""}`}
                onClick={() => goToPage(page)}
                aria-current={page === safePage ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label={t("pagination.next")}
            >
              ›
            </button>
          </nav>
        )}
      </main>
    </>
  );
};

export default RealEstate;
