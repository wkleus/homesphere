import "./RealEstateCard.css";
import RealEstatePhoto from "./RealEstatePhoto/RealEstatePhoto";
import RealEstateCategory from "./RealEstatePhoto/RealEstateCategory/RealEstateCategory";
import RealEstateStatus from "./RealEstatePhoto/RealEstateStatus/RealEstateStatus";
import IconItem from "./RealEstatePhoto/IconItem/IconItem";
import RealEstateDetails from "./RealEstateDetails/RealEstateDetails";
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
    <div className="realEstate-card" style={{ opacity: isAvailable ? 1 : 0.5 }}>
      <RealEstatePhoto photo={photo} address={address}>
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
