import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("medicare_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("medicare_token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("medicare_token");
      if (storedToken) {
        try {
          const res = await api.get("/auth/me");
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem("medicare_user", JSON.stringify(res.data.user));
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("medicare_token", res.data.token);
        localStorage.setItem("medicare_user", JSON.stringify(res.data.user));
        toast.success(`Welcome back, ${res.data.user.name}`);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("medicare_token", res.data.token);
        localStorage.setItem("medicare_user", JSON.stringify(res.data.user));
        toast.success("Account created successfully");
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const switchDemoRole = async (roleName) => {
    try {
      const res = await api.post("/auth/demo-login", { role: roleName });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("medicare_token", res.data.token);
        localStorage.setItem("medicare_user", JSON.stringify(res.data.user));
        toast.success(`Switched role to ${roleName.replace("_", " ").toUpperCase()}`);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      toast.error("Failed to switch demo account");
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("medicare_token");
    localStorage.removeItem("medicare_user");
    toast.success("Signed out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        role: user?.role || "guest",
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
