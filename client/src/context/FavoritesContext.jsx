import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

// Load initial favorites from localStorage
const loadFavorites = () => {
  try {
    const stored = localStorage.getItem("homesphere-favorites");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(loadFavorites);

  // Persist favorites to localStorage on every change
  useEffect(() => {
    localStorage.setItem("homesphere-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (entry) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === entry.id)
        ? prev.filter((f) => f.id !== entry.id)
        : [...prev, entry],
    );
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook for easy access to favorites context
// export const useFavorites = () => useContext(FavoritesContext);
// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
