import { createContext, useContext, useState, useCallback } from "react";
import { loginRequest } from "../services/api";

const AuthContext = createContext(null);

function decodeFakeJWT(token) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(() => {
    const t = getStoredToken();
    return t ? decodeFakeJWT(t) : null;
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async ({ email, password, remember }) => {
    setLoading(true);
    setError(null);
    try {
      const { token: newToken, user: newUser } = await loginRequest(email, password);
      const store = remember ? localStorage : sessionStorage;
      store.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      return true;
    } catch (err) {
      setError(
        err.code === "INVALID_CREDENTIALS"
          ? "Invalid email or password."
          : "Unable to sign in. Please check your connection and try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
    error,
    loading,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
