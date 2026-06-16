import "./Navbar.css";
import {
  EnvelopeOpen,
  PhoneCall,
  Buildings,
  Heart,
  AddressBook,
  User,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧" },
  { code: "de", flag: "🇩🇪" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { t, i18n } = useTranslation();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

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

      <div className="nav-items">
        {/* Full contact info – visible on large screens */}
        <div className="nav-contact-item nav-contact-full">
          <div className="nav-contact-icon">
            <EnvelopeOpen weight="regular" size={14} />
          </div>
          <div className="nav-contact-text">
            <span className="nav-contact-label">{t("nav.email")}</span>
            <span className="nav-contact-value">example@example.com</span>
          </div>
          <div className="nav-divider" />
        </div>

        <div className="nav-contact-item nav-contact-full">
          <div className="nav-contact-icon">
            <PhoneCall weight="regular" size={14} />
          </div>
          <div className="nav-contact-text">
            <span className="nav-contact-label">{t("nav.phone")}</span>
            <span className="nav-contact-value">(+49) 030 XXXX XXXX</span>
          </div>
          <div className="nav-divider" />
        </div>

        {/* Contact icon – visible on small screens only */}
        <button
          className="nav-contact-icon-btn nav-contact-small"
          onClick={() => navigate("/contact")}
          title={t("nav.contact")}
        >
          <AddressBook size={22} weight="regular" />
        </button>

        {/* Login icon link */}
        <button
          className="nav-login-icon-btn"
          onClick={() => navigate("/login")}
          // title={t("nav.favorites")}
        >
          <User size={18} />
        </button>

        {/* Favorites link with count badge */}
        <button
          className="nav-favorites-btn"
          onClick={() => navigate("/favorites")}
          title={t("nav.favorites")}
        >
          <Heart size={18} weight={favorites.length > 0 ? "fill" : "regular"} />
          {favorites.length > 0 && (
            <span className="nav-favorites-count">{favorites.length}</span>
          )}
        </button>

        <div className="nav-divider" />

        {/* Language switcher */}
        <div className="nav-lang-switcher">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`nav-lang-btn ${i18n.language === lang.code ? "active" : ""}`}
              onClick={() => changeLanguage(lang.code)}
              title={lang.code.toUpperCase()}
            >
              {lang.flag}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
