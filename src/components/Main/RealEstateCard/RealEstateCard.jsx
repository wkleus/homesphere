import "./RealEstateCard.css";
// import RealEstate from "./../RealEstate";
import RealEstatePhoto from "./RealEstatePhoto/RealEstatePhoto";
import RealEstateCategory from "./RealEstatePhoto/RealEstateCategory/RealEstateCategory";
import RealEstateStatus from "./RealEstatePhoto/RealEstateStatus/RealEstateStatus";

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
      <RealEstatePhoto photo={photo}>
        <RealEstateCategory category={category} />
        {!isAvailable && <RealEstateStatus />}
      </RealEstatePhoto>
      <div>RealEstate Card Entries</div>
    </div>
  );
};

export default RealEstateCard;
