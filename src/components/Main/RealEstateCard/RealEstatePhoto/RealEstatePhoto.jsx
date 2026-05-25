import "./RealEstatePhoto.css";

const RealEstatePhoto = ({ photo, children }) => {
  return (
    <div
      className="realEstate-photo"
      style={{ backgroundImage: `url(${photo})` }}
    >
      {children}
    </div>
  );
};

export default RealEstatePhoto;
