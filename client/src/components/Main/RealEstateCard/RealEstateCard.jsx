import "./RealEstateCard.css";
import { useNavigate } from "react-router-dom";
import RealEstatePhoto from "./RealEstatePhoto/RealEstatePhoto";
import RealEstateCategory from "./RealEstatePhoto/RealEstateCategory/RealEstateCategory";
import RealEstateStatus from "./RealEstatePhoto/RealEstateStatus/RealEstateStatus";
import IconItem from "./RealEstatePhoto/IconItem/IconItem";
import RealEstateDetails from "./RealEstateDetails/RealEstateDetails";
import { Bed, Buildings, Lightning, Square, Heart } from "phosphor-react";
import { useFavorites } from "../../../context/FavoritesContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// card glides up + fades in once it scrolls into view
const cardVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const RealEstateCard = ({
  id,
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
}) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t } = useTranslation();
  const favorited = isFavorite(id);

  const entryLabels = {
    id,
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
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(entryLabels);
  };

  const handleCardKeyDown = (e) => {
    // allow keyboard users (Enter/Space) to open the details page,
    // same as a native <button>/<a> would
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/estate/${id}`);
    }
  };

  return (
    <div
      className="realEstate-card"
      style={{ opacity: isAvailable ? 1 : 0.5 }}
      onClick={() => navigate(`/estate/${id}`)}
      title="View details"
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
      aria-label={`${address} – ${t("card.viewDetails")}`}
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{ y: -6 }}
      >
        <RealEstatePhoto photo={photo} address={address}>
          <RealEstateCategory category={category} />
          {!isAvailable && <RealEstateStatus />}

          <button
            className={`favorite-btn ${favorited ? "favorited" : ""}`}
            onClick={handleFavorite}
            aria-label={
              favorited ? t("card.removeFavorite") : t("card.addFavorite")
            }
            aria-pressed={favorited}
            title={favorited ? t("card.removeFavorite") : t("card.addFavorite")}
          >
            <Heart size={20} weight={favorited ? "fill" : "regular"} />
          </button>

          <div className="home-details">
            <IconItem
              Icon={Bed}
              description={rooms}
              tooltip={t("card.rooms")}
              className="icon-rooms"
            />
            <IconItem
              Icon={Square}
              description={`${squareMeters} m²`}
              tooltip={t("card.area")}
            />
            <IconItem
              Icon={Lightning}
              description={energyClass}
              tooltip={t("card.energy")}
            />
            <IconItem
              Icon={Buildings}
              description={yearBuilt}
              tooltip={t("card.yearBuilt")}
            />
          </div>
        </RealEstatePhoto>

        <div>
          <RealEstateDetails description={address} />
        </div>
        <div>
          {rent && (
            <RealEstateDetails
              description={`${t("card.monthlyRent")}: EUR ${rent}`}
              color="#4488bb"
              fontWeight="bold"
            />
          )}
          {buy && (
            <RealEstateDetails
              description={`${t("card.purchasePrice")}: EUR ${buy}`}
              color="#4488bb"
              fontWeight="bold"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RealEstateCard;
