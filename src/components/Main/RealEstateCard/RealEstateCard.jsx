import "./RealEstateCard.css";
// import RealEstate from "./../RealEstate";
import RealEstatePhoto from "./RealEstatePhoto/RealEstatePhoto";
import RealEstateCategory from "./RealEstatePhoto/RealEstateCategory/RealEstateCategory";
import RealEstateStatus from "./RealEstatePhoto/RealEstateStatus/RealEstateStatus";
import IconItem from "./RealEstatePhoto/IconItem/IconItem";
import { Bed, Buildings, Lightning, Square } from "phosphor-react";

const RealEstateCard = ({
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
  return (
    <div className="realEstate-card" style={{ opacity: isAvailable ? 1 : 0.6 }}>
      <RealEstatePhoto photo={photo}>
        <RealEstateCategory category={category} />
        {!isAvailable && <RealEstateStatus />}
        <div className="home-details">
          <IconItem Icon={Bed} description={rooms} tooltip="Number of rooms" />
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
      <div>RealEstate Card Entries</div>
    </div>
  );
};

export default RealEstateCard;
