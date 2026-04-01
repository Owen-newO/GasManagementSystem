import { createContext, useContext, useState, useEffect } from "react";
import { validateToken } from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "frs_auth_token";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    role: null,       // "station" | "resident" | "admin" | null
    isAuthenticated: false,
  });
  // True while restoring session from localStorage on first load
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const payload = validateToken(token);
      if (payload) {
        setAuth({ user: payload.user, role: payload.role, isAuthenticated: true });
      } else {
        // Token expired — clean up
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  /**
   * Call after a successful login API response.
   * Persists the token and sets auth state.
   */
  const login = (user, role, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    setAuth({ user, role, isAuthenticated: true });
  };

  /**
   * Clears all auth state and removes the persisted token.
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuth({ user: null, role: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
