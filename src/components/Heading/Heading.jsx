import "./Heading.css";
import entries from "../../content/entries";

const Heading = () => {
  const available = entries.filter((e) => e.isAvailable).length;

  return (
    <div className="heading">
      <p className="heading-eyebrow">Premium Real Estate</p>
      <h1 className="heading-title">
        Rent or Buy
        <br />
        <em>Your Perfect Home</em>
      </h1>
      <p className="heading-sub">
        Discover handpicked properties across Europe — from city studios to
        alpine chalets.
      </p>
      <div className="heading-line">
        <span className="heading-badge">{available} properties available</span>
      </div>
    </div>
  );
};

export default Heading;
