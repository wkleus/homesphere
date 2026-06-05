import { useNavigate } from "react-router-dom";
import { Heart } from "phosphor-react";
import { useFavorites } from "../../context/FavoritesContext";
import RealEstateCard from "../../components/Main/RealEstateCard/RealEstateCard";
import "./Favorites.css";

const Favorites = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1 className="favorites-title">
          <Heart size={36} /> Saved Properties
        </h1>
        <p className="favorites-count">
          {favorites.length === 0
            ? "No saved properties yet"
            : `${favorites.length} ${favorites.length === 1 ? "property" : "properties"} saved`}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <Heart size={64} weight="thin" className="empty-icon" />
          <p>You haven't saved any properties yet.</p>
          <button onClick={() => navigate("/")}>Browse Properties</button>
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
