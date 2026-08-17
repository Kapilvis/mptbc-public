import { UserManager } from "oidc-client-ts";
import React, { createContext, useContext, useMemo, useState } from "react";
import { AUTH_CONFIG } from "../config/auth";
import type { CustomUser } from "./authTypes";

type PermissionMap = Record<string, string[]>;

interface AuthContextType {
  authenticated: boolean | null;
  user: CustomUser | null;
  userManager: UserManager;
  permissions: PermissionMap;
  login: (userId: string, role: string, roleName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userManager = useMemo(() => new UserManager(AUTH_CONFIG), []);

  const [authenticated, setAuthenticated] = useState<boolean | null>(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [user, setUser] = useState<CustomUser | null>(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuth) return null;
    const userId = localStorage.getItem("userId") || "";
    const role = localStorage.getItem("role") || "";
    const roleName = localStorage.getItem("roleName") || "";
    return {
      profile: {
        iss: AUTH_CONFIG.authority,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        aud: AUTH_CONFIG.client_id,
        sub: userId,
        name: userId,
        oi_au_id: "mock",
        oi_tkn_id: "mock",
        email: `${userId.toLowerCase().replace(/\s+/g, "")}@mptbc.gov.in`,
        role: [roleName],
      },
      role,
    };
  });

  const [permissions] = useState<PermissionMap>({ "*": ["read", "write"] });

  const login = (userId: string, role: string, roleName: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("roleName", roleName);

    setAuthenticated(true);
    setUser({
      profile: {
        iss: AUTH_CONFIG.authority,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        aud: AUTH_CONFIG.client_id,
        sub: userId,
        name: userId,
        oi_au_id: "mock",
        oi_tkn_id: "mock",
        email: `${userId.toLowerCase().replace(/\s+/g, "")}@mptbc.gov.in`,
        role: [roleName],
      },
      role,
    });
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("roleName");

    setAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        userManager,
        permissions,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
