import "./Navbar.css";
import { EnvelopeOpen, PhoneCall, Buildings, Heart } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/")}>
        <div className="nav-logo-box">
          <Buildings weight="fill" className="nav-logo-icon" />
        </div>
        <span className="nav-brand-name">
          Home<strong>Sphere</strong>
        </span>
      </div>

      <div className="nav-contacts">
        <div className="nav-contact-item">
          <div className="nav-contact-icon">
            <EnvelopeOpen weight="regular" size={14} />
          </div>
          <div className="nav-contact-text">
            <span className="nav-contact-label">Email</span>
            <span className="nav-contact-value">example@example.com</span>
          </div>
        </div>

        <div className="nav-divider" />

        <div className="nav-contact-item">
          <div className="nav-contact-icon">
            <PhoneCall weight="regular" size={14} />
          </div>
          <div className="nav-contact-text">
            <span className="nav-contact-label">Phone</span>
            <span className="nav-contact-value">(+49) 030 XXXX XXXX</span>
          </div>
        </div>

        <div className="nav-divider" />

        {/* Favorites link with count badge */}
        <button
          className="nav-favorites-btn"
          onClick={() => navigate("/favorites")}
        >
          <Heart size={18} weight={favorites.length > 0 ? "fill" : "regular"} />
          {favorites.length > 0 && (
            <span className="nav-favorites-count">{favorites.length}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
