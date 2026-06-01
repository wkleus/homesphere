import "./RealEstateDetails.css";

const RealEstateDetails = ({
  description,
  color = "#355",
  fontWeight = "400",
}) => {
  const colorLayout = { color, fontWeight };
  return (
    <p style={colorLayout} className="details">
      {description}
    </p>
  );
};

export default RealEstateDetails;
