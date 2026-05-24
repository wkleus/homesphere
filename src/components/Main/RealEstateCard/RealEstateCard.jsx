import "./RealEstateCard.css";
// import RealEstate from "./../RealEstate";
import RealEstatePhoto from "./RealEstatePhoto/RealEstatePhoto";

const RealEstateCard = ({
  address,
  isAvailable,
  energyClass,
  rent,
  photo,
  rooms,
  squareMeters,
  category,
  yearBuilt,
}) => {
  return (
    <div className="realEstate-card" style={{ opacity: isAvailable ? 1 : 0.5 }}>
      <RealEstatePhoto photo={photo}>entry details</RealEstatePhoto>
      <div>RealEstate Card Entries</div>
    </div>
  );
};

export default RealEstateCard;
