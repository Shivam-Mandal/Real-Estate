/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);
const STORAGE_KEY = "estate-client-auth";
const EMPTY_AUTH = { user: null, accessToken: "", refreshToken: "" };

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : EMPTY_AUTH;
    } catch {
      return EMPTY_AUTH;
    }
  });
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const initialAuthRef = useRef(auth);
  const initialRefreshTokenRef = useRef(auth.refreshToken);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      if (!initialRefreshTokenRef.current) {
        setBootstrapping(false);
        return;
      }

      try {
        let session = initialAuthRef.current;

        try {
          if (!session.accessToken) {
            throw new Error("Missing access token");
          }

          const data = await authService.me(session.accessToken);
          session = { ...session, user: data.user };
        } catch {
          const refreshData = await authService.refresh(initialRefreshTokenRef.current);
          const data = await authService.me(refreshData.accessToken);
          session = {
            user: data.user,
            accessToken: refreshData.accessToken,
            refreshToken: refreshData.refreshToken,
          };
        }

        if (!mounted) {
          return;
        }

        setAuth(session);
      } catch {
        if (mounted) {
          setAuth(EMPTY_AUTH);
        }
      } finally {
        if (mounted) {
          setBootstrapping(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await authService.login(payload);
      setAuth({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      setAuth({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (auth.refreshToken) {
        await authService.logout(auth.refreshToken);
      }
    } finally {
      setAuth(EMPTY_AUTH);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      return await authService.forgotPassword(email);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    setLoading(true);
    try {
      const data = await authService.resetPassword(token, password);
      setAuth({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    ...auth,
    loading,
    bootstrapping,
    isAuthenticated: Boolean(auth.accessToken),
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
