import { useState, useEffect } from "react";
import "./Heading.css";

const API_URL = "https://6a16f2541b90031f81b1c58f.mockapi.io/api/v1/properties";

const Heading = () => {
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const count = data.filter((e) => e.isAvailable).length;
        setAvailable(count);
      })
      .catch(() => setAvailable(null));
  }, []);

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
