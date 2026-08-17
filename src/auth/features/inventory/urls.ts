export const centralDepotUrls = {
  root: "/inventory",
  dashboard: "/inventory/dashboard",
  stock: {
    root: "/inventory/stock",
    main: "/inventory/stock/main",
    gsmWise: "/inventory/stock/gsm-wise",
    receiving: "/inventory/stock/receiving",
    transactions: "/inventory/stock/transactions",
    ledger: "/inventory/stock/ledger",
  },
  orders: {
    root: "/inventory/orders",
    list: "/inventory/orders/list",
    pending: "/inventory/orders/pending",
    printerSupply: "/inventory/orders/printer-supply",
    details: (orderNo: string) => `/inventory/orders/details/${orderNo}`,
    detailsPattern: "/orders/details/:orderNo",
  },
  distribution: {
    root: "/inventory/distribution",
    new: "/inventory/distribution/new",
    history: "/inventory/distribution/history",
    dispatch: "/inventory/distribution/dispatch",
  },
  reports: {
    root: "/inventory/reports",
    gsmStock: "/inventory/reports/gsm-stock",
    printerOrders: "/inventory/reports/printer-orders",
    printerSupply: "/inventory/reports/printer-supply",
    distributions: "/inventory/reports/distributions",
  },
};
