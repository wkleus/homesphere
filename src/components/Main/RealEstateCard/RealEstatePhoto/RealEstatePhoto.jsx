import "./RealEstatePhoto.css";

const RealEstatePhoto = ({ photo, children }) => {
  return (
    <div
      className="realEstate-photo"
      style={{ backgroundImage: `url(${photo})` }}
    >
      {/* <img src={photo} alt="Real Estate" width={400} /> */}
      {children}
    </div>
  );
};

export default RealEstatePhoto;
