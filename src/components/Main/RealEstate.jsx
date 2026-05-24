import "./RealEstate.css";
import RealEstateCard from "./RealEstateCard/RealEstateCard";

const RealEstate = ({ entries }) => {
  return (
    <main className="realEstate">
      {entries.map((entry) => (
        <RealEstateCard key={entry.id} {...entry} />
      ))}
    </main>
  );
};

export default RealEstate;
