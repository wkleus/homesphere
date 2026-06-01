import "./Heading.css";
import useFetch from "../../hooks/useFetch";
import { ENTRIES_URL } from "../../config/api";

const Heading = () => {
  const { data } = useFetch(ENTRIES_URL);
  const available = data ? data.filter((e) => e.isAvailable).length : null;

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
        <span className="heading-badge">
          {available !== null ? `${available} properties available` : ""}
        </span>
      </div>
    </div>
  );
};

export default Heading;
