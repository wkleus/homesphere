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
  MapTrifold,
} from "phosphor-react";
import "./EstateDetails.css";
import useFetch from "../../hooks/useFetch";
import { ENTRY_URL } from "../../config/api";
import ContactForm from "../../components/ContactForm/ContactForm";
import MortgageCalculator from "../../components/MortgageCalculator/MortgageCalculator";
import MapModal from "../../components/MapModal/MapModal";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

/* Create or update <meta> tag by property name (e.g. og:title). */
function setMetaTag(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

const EstateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch single property by ID from the backend
  const { data: entry, loading, error } = useFetch(ENTRY_URL(id));

  // Controls visibility of the contact form modal
  const [showModal, setShowModal] = useState(false);

  // Controls visibility of the map modal
  const [showMap, setShowMap] = useState(false);

  // Dynamic document title + meta description for SEO
  useEffect(() => {
    const prevTitle = document.title;

    if (entry) {
      const price = entry.buy
        ? `€${entry.buy.toLocaleString()}`
        : entry.rent
          ? `€${entry.rent.toLocaleString()}/mo`
          : "";
      const titleParts = [entry.address, price, "HomeSphere"].filter(Boolean);
      const pageTitle = titleParts.join(" · ");
      document.title = pageTitle;

      const description = [
        entry.category,
        entry.rooms && `${entry.rooms} rooms`,
        entry.squareMeters && `${entry.squareMeters} m²`,
        entry.energyClass && `Energy ${entry.energyClass}`,
      ]
        .filter(Boolean)
        .join(" · ");

      const descContent = description
        ? `${description}. ${entry.address}`
        : `Property listing: ${entry.address}`;

      // Standard meta description
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", descContent);

      // OpenGraph meta tags
      setMetaTag("og:type", "website");
      setMetaTag("og:title", pageTitle);
      setMetaTag("og:description", descContent);

      // Absolute URL required for social previews (relative paths are ignored)
      const imageUrl = entry.photo.startsWith("http")
        ? entry.photo
        : `${window.location.origin}${entry.photo}`;
      setMetaTag("og:image", imageUrl);

      setMetaTag("og:url", window.location.href);
    }

    // Restore default title when leaving the detail page
    return () => {
      document.title = prevTitle || "HomeSphere";
    };
  }, [entry]);

  if (loading)
    return <p className="status-msg detail-loading">{t("loading")}</p>;
  if (error || !entry)
    return (
      <div className="detail-not-found">
        <p>{t("detail.notFound")}</p>
        <button onClick={() => navigate("/")}>{t("detail.back")}</button>
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
    <motion.div
      className="detail-page"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <button className="detail-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} weight="bold" /> {t("detail.back")}
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
            {isAvailable ? t("detail.available") : t("detail.unavailable")}
          </span>
          <span className="detail-category">{category}</span>
        </div>

        <div className="detail-content">
          <h1 className="detail-address">
            <MapPin size={20} weight="fill" /> {address}
            {/* Map link next to address */}
            <button
              type="button"
              className="detail-map-link"
              onClick={() => setShowMap(true)}
              title={t("map.show")}
            >
              <MapTrifold size={18} weight="duotone" />
              {t("map.show")}
            </button>
          </h1>

          <div className="detail-price-row">
            {rent && (
              <div className="detail-price rent">
                <span className="price-label">{t("detail.monthlyRent")}</span>
                <span className="price-value">EUR {rent.toLocaleString()}</span>
              </div>
            )}
            {buy && (
              <div className="detail-price buy">
                <span className="price-label">{t("detail.purchasePrice")}</span>
                <span className="price-value">EUR {buy.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="detail-stats">
            <div className="detail-stat">
              <Bed size={28} weight="duotone" />
              <span className="stat-value">{rooms}</span>
              <span className="stat-label">{t("detail.rooms")}</span>
            </div>
            <div className="detail-stat">
              <Square size={28} weight="duotone" />
              <span className="stat-value">{squareMeters} m²</span>
              <span className="stat-label">{t("detail.area")}</span>
            </div>
            <div className="detail-stat">
              <Lightning size={28} weight="duotone" />
              <span className="stat-value">{energyClass}</span>
              <span className="stat-label">{t("detail.energy")}</span>
            </div>
            <div className="detail-stat">
              <Buildings size={28} weight="duotone" />
              <span className="stat-value">{yearBuilt}</span>
              <span className="stat-label">{t("detail.yearBuilt")}</span>
            </div>
            <div className="detail-stat">
              <Tag size={28} weight="duotone" />
              <span className="stat-value">{category}</span>
              <span className="stat-label">{t("detail.type")}</span>
            </div>
          </div>

          {/* Mortgage Calculator – only for properties available for purchase */}
          {buy && <MortgageCalculator price={buy} />}

          {/* Opens the contact form modal */}
          <button
            className="detail-contact-btn"
            onClick={() => setShowModal(true)}
          >
            {t("detail.contact")}
          </button>
        </div>
      </div>

      {/* Contact form modal */}
      {showModal && (
        <ContactForm address={address} onClose={() => setShowModal(false)} />
      )}

      {/* Map modal — wrapped in AnimatePresence so MapModal's exit
          animation (fade + scale out) plays instead of vanishing instantly */}
      <AnimatePresence>
        {showMap && (
          <MapModal
            address={address}
            category={category}
            rent={rent}
            buy={buy}
            onClose={() => setShowMap(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EstateDetails;
