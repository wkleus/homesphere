import "./RealEstatePhoto.css";

const RealEstatePhoto = ({ photo, address, children }) => {
  return (
    <div className="realEstate-photo">
      <img
        src={photo}
        alt={`Immobilie: ${address}`}
        className="realEstate-img"
      />
      {children}
    </div>
  );
};

export default RealEstatePhoto;
