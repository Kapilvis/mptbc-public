import { useSyncExternalStore } from "react";

const getInitialAuthState = (): User.AuthState => {
  const isAuth =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("isAuthenticated") === "true";
  return isAuth ? "signed-in" : "sign-in-required";
};

const getInitialUser = (): User.UserInfo | undefined => {
  const isAuth =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("isAuthenticated") === "true";
  if (!isAuth) return undefined;
  const userId = localStorage.getItem("userId") || "";
  const roleName = localStorage.getItem("roleName") || "";
  return {
    userName: userId,
    fullName: userId,
    roles: [roleName],
  };
};

let state: User.UserInfoState = {
  authState: getInitialAuthState(),
  user: getInitialUser(),
  changeStateToSignedIn(user: User.UserInfo) {
    state = { ...state, authState: "signed-in", user };
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userId", user.userName);
      localStorage.setItem("roleName", user.roles?.[0] || "");
    }
    emitChange();
  },
  changeStateToSignOut() {
    state = { ...state, authState: "sign-in-required", user: undefined };
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("roleName");
    }
    emitChange();
  },
  changeStateToSignInRequired() {
    state = { ...state, authState: "sign-in-required", user: undefined };
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("roleName");
    }
    emitChange();
  },
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useUserInfoStore<T = User.UserInfoState>(
  selector?: (s: User.UserInfoState) => T,
): T {
  const currentStore = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
  return selector ? selector(currentStore) : (currentStore as unknown as T);
}

export function useUserInfoUser() {
  return useUserInfoStore((store) => store.user);
}

export function useChangeStateToSignInRequired() {
  return useUserInfoStore((store) => store.changeStateToSignInRequired);
}
