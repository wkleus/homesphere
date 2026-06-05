import "./RealEstateCard.css";
import { useNavigate } from "react-router-dom";
import RealEstatePhoto from "./RealEstatePhoto/RealEstatePhoto";
import RealEstateCategory from "./RealEstatePhoto/RealEstateCategory/RealEstateCategory";
import RealEstateStatus from "./RealEstatePhoto/RealEstateStatus/RealEstateStatus";
import IconItem from "./RealEstatePhoto/IconItem/IconItem";
import RealEstateDetails from "./RealEstateDetails/RealEstateDetails";
import { Bed, Buildings, Lightning, Square, Heart } from "phosphor-react";
import { useFavorites } from "../../../context/FavoritesContext";

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
  const favorited = isFavorite(id);

  const handleFavorite = (e) => {
    // Prevent card click from navigating to detail page
    e.stopPropagation();
    toggleFavorite({
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
    });
  };

  return (
    <div
      className="realEstate-card"
      style={{ opacity: isAvailable ? 1 : 0.5 }}
      onClick={() => navigate(`/estate/${id}`)}
      title="View details"
    >
      <RealEstatePhoto photo={photo} address={address}>
        <RealEstateCategory category={category} />
        {!isAvailable && <RealEstateStatus />}

        {/* Favorite toggle button */}
        <button
          className={`favorite-btn ${favorited ? "favorited" : ""}`}
          onClick={handleFavorite}
          title={favorited ? "Remove from favorites" : "Save to favorites"}
        >
          <Heart size={20} weight={favorited ? "fill" : "regular"} />
        </button>

        <div className="home-details">
          <IconItem
            Icon={Bed}
            description={rooms}
            tooltip="Number of rooms"
            className="icon-rooms"
          />
          <IconItem
            Icon={Square}
            description={`${squareMeters} m²`}
            tooltip="Living area in square meters"
          />
          <IconItem
            Icon={Lightning}
            description={energyClass}
            tooltip="Energy efficiency class"
          />
          <IconItem
            Icon={Buildings}
            description={yearBuilt}
            tooltip="Year built"
          />
        </div>
      </RealEstatePhoto>
      <div>
        <RealEstateDetails description={address} />
      </div>
      <div>
        {rent && (
          <RealEstateDetails
            description={`Monthly rent: EUR ${rent}`}
            color="#4488bb"
            fontWeight="bold"
          />
        )}
        {buy && (
          <RealEstateDetails
            description={`Purchase price: EUR ${buy}`}
            color="#4488bb"
            fontWeight="bold"
          />
        )}
      </div>
    </div>
  );
};

export default RealEstateCard;
