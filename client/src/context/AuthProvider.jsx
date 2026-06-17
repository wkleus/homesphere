import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  // State to store the current authenticated user
  const [user, setUser] = useState(null);
  // Loading state to handle async auth initialization
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false); // Auth check complete
    });

    // Subscribe to auth state changes (login/logout/refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null); // Update user on any auth event
    });

    // Cleanup subscription on unmount to prevent memory leaks
    return () => subscription.unsubscribe();
  }, []);

  // Login function - throws error if authentication fails
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  // Logout function - signs out the current user
  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Provide auth context to all children components
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
