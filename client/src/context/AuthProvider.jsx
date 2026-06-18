import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  // State to store the current authenticated user
  const [user, setUser] = useState(null);
  // State for Supabase access token
  const [supabaseToken, setSupabaseToken] = useState(null);
  // Loading state to handle async auth initialization
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const { user } = session;
        setUser({
          ...user,
          name: user.user_metadata?.name || null,
        });
        setSupabaseToken(session.access_token); // store token
      } else {
        setUser(null);
        setSupabaseToken(null); // Reset token
      }
      setLoading(false);
    });

    // Subscribe to auth state changes (login/logout/refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { user } = session;
        setUser({
          ...user,
          name: user.user_metadata?.name || null,
        });
        setSupabaseToken(session.access_token); // save token
      } else {
        setUser(null);
        setSupabaseToken(null); // Reset token
      }
    });

    // Cleanup subscription on unmount to prevent memory leaks
    return () => subscription.unsubscribe();
  }, []);

  // Login function - throws error if authentication fails
  const login = async (email, password, name) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) throw error;
  };

  // Logout function - signs out the current user and navigates to the login page
  const logout = async () => {
    await supabase.auth.signOut();
    setSupabaseToken(null); // Delete token on logout
    navigate("/login");
  };

  // Provide auth context to all children components
  return (
    // Provide supabaseToken in the context
    <AuthContext.Provider
      value={{ user, supabaseToken, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
