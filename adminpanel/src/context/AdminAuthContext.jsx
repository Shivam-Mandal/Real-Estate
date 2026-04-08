/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { adminApi } from "../api/adminApi";

const AdminAuthContext = createContext(null);
const STORAGE_KEY = "estate-admin-auth";
const EMPTY_AUTH = { user: null, accessToken: "", refreshToken: "" };

export const AdminAuthProvider = ({ children }) => {
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

          const { data } = await adminApi.me(session.accessToken);
          session = { ...session, user: data.user };
        } catch {
          const { data: refreshData } = await adminApi.refresh(initialRefreshTokenRef.current);
          const { data } = await adminApi.me(refreshData.accessToken);
          session = {
            user: data.user,
            accessToken: refreshData.accessToken,
            refreshToken: refreshData.refreshToken,
          };
        }

        if (session.user.role !== "admin") {
          throw new Error("Admin access required");
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
      const { data } = await adminApi.login(payload);
      if (data.user.role !== "admin") {
        throw new Error("Admin access required");
      }
      setAuth({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (auth.refreshToken) {
        await adminApi.logout(auth.refreshToken);
      }
    } finally {
      setAuth(EMPTY_AUTH);
    }
  };

  const value = {
    ...auth,
    loading,
    bootstrapping,
    isAuthenticated: Boolean(auth.accessToken),
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
