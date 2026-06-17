import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// To access auth context for a clean API
const useAuth = () => {
  const context = useContext(AuthContext);
  // Throw error if used outside of AuthProvider
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default useAuth;
