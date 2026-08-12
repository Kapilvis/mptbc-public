import { UserManager, type User } from "oidc-client-ts";
import React, { createContext, useContext, useMemo, useState } from "react";
import { AUTH_CONFIG } from "../config/auth";

type PermissionMap = Record<string, string[]>;

interface AuthContextType {
  authenticated: boolean | null;
  user: User | null;
  userManager: UserManager;
  permissions: PermissionMap;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser = {
  profile: {
    name: "System Administrator",
    preferred_username: "admin@mptbc.gov.in",
    role: ["Main Administrator"],
    iat: Math.floor(Date.now() / 1000),
  },
  access_token: "mock-token",
} as unknown as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userManager = useMemo(() => new UserManager(AUTH_CONFIG), []);
  const [authenticated, setAuthenticated] = useState<boolean | null>(true);
  const [user] = useState<User | null>(mockUser);
  const [permissions] = useState<PermissionMap>({ "*": ["read", "write"] });

  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);

  return (
    <AuthContext.Provider
      value={{ authenticated, user, userManager, permissions, login, logout }}
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
