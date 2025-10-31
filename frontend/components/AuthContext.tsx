"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  userId: number | null;
  login: (userObj: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        const id = u?.userId ?? u?.user_id ?? u?.id ?? null;
        if (id != null) {
          setUser(u);
          setUserId(Number(id));
          setIsLoggedIn(true);
          return;
        }
      }
    } catch (e) {
    }
    setIsLoggedIn(false);
    setUser(null);
    setUserId(null);
  }, []);

  const login = (userObj: any) => {
    try {
      localStorage.setItem("user", JSON.stringify(userObj));
    } catch (e) {
      // ignore
    }
    const id = userObj?.userId ?? userObj?.user_id ?? userObj?.id ?? null;
    setUser(userObj || null);
    setUserId(id == null ? null : Number(id));
    setIsLoggedIn(!!id);
  };

  const logout = () => {
    try {
      localStorage.removeItem("user");
    } catch (e) {
      // ignore
    }
    setIsLoggedIn(false);
    setUser(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, userId, login, logout }}>
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
