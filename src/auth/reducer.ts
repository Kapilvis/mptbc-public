import { useSyncExternalStore } from "react";

let state: User.UserInfoState = {
  authState: "sign-in-required",
  user: undefined,
  changeStateToSignedIn(user: User.UserInfo) {
    state = { ...state, authState: "signed-in", user };
    emitChange();
  },
  changeStateToSignOut() {
    state = { ...state, authState: "sign-in-required", user: undefined };
    emitChange();
  },
  changeStateToSignInRequired() {
    state = { ...state, authState: "sign-in-required", user: undefined };
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
