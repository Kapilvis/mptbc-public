export const depotRegistrationUrls = {
  root: "/mptbc/depot-registration",
  add: "/mptbc/depot-registration/add",
  edit: (id: string | number) => `/mptbc/depot-registration/${id}/edit`,
  view: (id: string | number) => `/mptbc/depot-registration/${id}/view`,
};
