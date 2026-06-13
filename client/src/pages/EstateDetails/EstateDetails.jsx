import { useState } from "react";
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
import useFetch from "../../hooks/useFetch";
import { ENTRY_URL } from "../../config/api";
import ContactForm from "../../components/ContactForm/ContactForm";
import { useTranslation } from "react-i18next";

const EstateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch single property by ID from the backend
  const { data: entry, loading, error } = useFetch(ENTRY_URL(id));

  // Controls visibility of the contact form modal
  const [showModal, setShowModal] = useState(false);

  if (loading) return <p className="status-msg">{t("loading")}</p>;
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
    <div className="detail-page">
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

          {/* Opens the contact form modal */}
          <button
            className="detail-contact-btn"
            onClick={() => setShowModal(true)}
          >
            {t("detail.contact")}
          </button>
        </div>
      </div>

      {/* Pass address so the email subject references the correct property */}
      {showModal && (
        <ContactForm address={address} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default EstateDetails;
