import { useNavigate } from "react-router-dom";
import { Heart } from "phosphor-react";
import { useFavorites } from "../../context/FavoritesContext";
import RealEstateCard from "../../components/Main/RealEstateCard/RealEstateCard";
import "./Favorites.css";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1 className="favorites-title">
          <Heart size={36} /> {t("favorites.title")}
        </h1>
        <p className="favorites-count">
          {favorites.length === 0
            ? t("favorites.none")
            : t("favorites.saved", { count: favorites.length })}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <Heart size={64} weight="thin" className="empty-icon" />
          <p>{t("favorites.empty")}</p>
          <button onClick={() => navigate("/")}>{t("favorites.browse")}</button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((entry) => (
            <RealEstateCard key={entry.id} {...entry} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
