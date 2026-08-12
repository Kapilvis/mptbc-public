import { UserManager, type User } from "oidc-client-ts";
import { useEffect, useRef, useState } from "react";

export const useAuth = (userManager: UserManager) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Handle redirect callback after login
      if (window.location.search.includes("code=")) {
        try {
          const user = await userManager.signinRedirectCallback();
          setUser(user);
          setAuthenticated(true);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } catch (err) {
          console.error("Callback error:", err);
          setAuthenticated(false);
        }
        return;
      }

      // Check for existing session
      try {
        const user = await userManager.getUser();
        if (user && !user.expired) {
          setUser(user);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch {
        setAuthenticated(false);
      }
    };

    if (!mounted.current) {
      checkAuth();
      mounted.current = true;
    }
  }, [userManager]);

  return { authenticated, user };
};
