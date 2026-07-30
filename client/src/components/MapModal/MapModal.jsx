import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, X, Buildings, CurrencyEur } from "phosphor-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import "./MapModal.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapModal = ({ address, category, rent, buy, onClose }) => {
  const { t } = useTranslation();
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const modalRoot = document.getElementById("modal-root");

  // Geocode address using OpenStreetMap Nominatim
  useEffect(() => {
    const encoded = encodeURIComponent(address);
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) throw new Error("Address not found");
        setCoords({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [address]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!modalRoot) return null;

  return createPortal(
    <motion.div
      className="map-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div
        className="map-window"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <button type="button" className="map-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="map-info">
          <div className="map-info-item">
            <MapPin size={18} weight="fill" className="map-info-icon" />
            <span>{address}</span>
          </div>
          <div className="map-info-item">
            <Buildings size={18} weight="duotone" className="map-info-icon" />
            <span>{category}</span>
          </div>
          {rent && (
            <div className="map-info-item">
              <CurrencyEur
                size={18}
                weight="duotone"
                className="map-info-icon"
              />
              <span>
                {t("detail.monthlyRent")}: EUR {rent.toLocaleString()}
              </span>
            </div>
          )}
          {buy && (
            <div className="map-info-item">
              <CurrencyEur
                size={18}
                weight="duotone"
                className="map-info-icon"
              />
              <span>
                {t("detail.purchasePrice")}: EUR {buy.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="map-container-wrapper">
          {loading && <p className="map-status">{t("map.loading")}</p>}
          {error && <p className="map-status map-error">{t("map.error")}</p>}
          {coords && (
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={14}
              className="map-container"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              />

              <Marker position={[coords.lat, coords.lng]}>
                <Popup>{address}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </motion.div>
    </motion.div>,
    modalRoot,
  );
};

export default MapModal;
