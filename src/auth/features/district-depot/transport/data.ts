// ─── Transport Orders ─────────────────────────────────────────────────────────
export interface TransportOrderItem {
  id: number;
  orderNo: string;
  orderDate: string;
  vendorName: string;
  depotCode: string;
  routeFrom: string;
  routeTo: string;
  vehicleNo: string;
  qtyTon: number;
  payableAmount: number;
  status: "Assigned" | "In Transit" | "Completed";
}

export const transportOrderData: TransportOrderItem[] = [
  {
    id: 1,
    orderNo: "TRP/2026/001",
    orderDate: "16 Aug 2026",
    vendorName: "Shree Ji Transports",
    depotCode: "BPL",
    routeFrom: "Bhopal Depot",
    routeTo: "Huzur",
    vehicleNo: "MP04GA4120",
    qtyTon: 4.5,
    payableAmount: 5400,
    status: "Completed",
  },
  {
    id: 2,
    orderNo: "TRP/2026/002",
    orderDate: "16 Aug 2026",
    vendorName: "Narmada Logistics",
    depotCode: "BPL",
    routeFrom: "Bhopal Depot",
    routeTo: "Bairasiya",
    vehicleNo: "MP04GA4157",
    qtyTon: 3.2,
    payableAmount: 3840,
    status: "In Transit",
  },
  {
    id: 3,
    orderNo: "TRP/2026/003",
    orderDate: "15 Aug 2026",
    vendorName: "Malwa Express Cargo",
    depotCode: "IND",
    routeFrom: "Indore Depot",
    routeTo: "Sanver Block",
    vehicleNo: "MP09CD3311",
    qtyTon: 5.8,
    payableAmount: 8700,
    status: "Completed",
  },
];

// ─── Vehicle Management ───────────────────────────────────────────────────────
export interface VehicleItem {
  id: number;
  vehicleNo: string;
  type: string;
  makeModel: string;
  regDate: string;
  driverName: string;
  depotCode: string;
  insuranceCo: string;
  policyNo: string;
  insuranceValidTo: string;
  fitnessValidTo: string;
  pucValidTo: string;
  status: "Active" | "Maintenance" | "Inactive";
}

export const vehicleData: VehicleItem[] = [
  {
    id: 1,
    vehicleNo: "MP04GA4120",
    type: "Truck (6-Wheeler)",
    makeModel: "Tata LPT 1109",
    regDate: "12 May 2020",
    driverName: "Ramesh Singh",
    depotCode: "BPL",
    insuranceCo: "New India Assurance",
    policyNo: "NIA-8839201",
    insuranceValidTo: "10 May 2027",
    fitnessValidTo: "12 May 2027",
    pucValidTo: "15 Nov 2026",
    status: "Active",
  },
  {
    id: 2,
    vehicleNo: "MP04GA4157",
    type: "Mini Truck",
    makeModel: "Mahindra Bolero Pickup",
    regDate: "05 Aug 2021",
    driverName: "Mohan Lal",
    depotCode: "BPL",
    insuranceCo: "Oriental Insurance",
    policyNo: "OIC-445928",
    insuranceValidTo: "01 Aug 2027",
    fitnessValidTo: "04 Aug 2027",
    pucValidTo: "10 Oct 2026",
    status: "Active",
  },
  {
    id: 3,
    vehicleNo: "MP09CD3311",
    type: "Truck (10-Wheeler)",
    makeModel: "Ashok Leyland 1618",
    regDate: "22 Jan 2019",
    driverName: "Dinesh Kumar",
    depotCode: "IND",
    insuranceCo: "United India Insurance",
    policyNo: "UII-774921",
    insuranceValidTo: "20 Jan 2027",
    fitnessValidTo: "20 Jan 2027",
    pucValidTo: "25 Dec 2026",
    status: "Maintenance",
  },
];

// ─── Fuel Log ─────────────────────────────────────────────────────────────────
export interface FuelLogItem {
  id: number;
  vehicleNo: string;
  date: string;
  depotCode: string;
  fuelType: "Diesel" | "Petrol" | "CNG";
  qtyLitre: number;
  ratePerLitre: number;
  totalAmount: number;
  meterReading: number;
  fuelStation: string;
  billNo: string;
  grantHead: string;
}

export const fuelLogData: FuelLogItem[] = [
  {
    id: 1,
    vehicleNo: "MP04GA4120",
    date: "16 Aug 2026",
    depotCode: "BPL",
    fuelType: "Diesel",
    qtyLitre: 45,
    ratePerLitre: 94.5,
    totalAmount: 4252.5,
    meterReading: 125400,
    fuelStation: "HPCL, Govindpura",
    billNo: "HP-8832",
    grantHead: "Transport Allocation",
  },
  {
    id: 2,
    vehicleNo: "MP04GA4157",
    date: "15 Aug 2026",
    depotCode: "BPL",
    fuelType: "Diesel",
    qtyLitre: 30,
    ratePerLitre: 94.5,
    totalAmount: 2835.0,
    meterReading: 85200,
    fuelStation: "IOCL, Kolar",
    billNo: "IO-9102",
    grantHead: "Transport Allocation",
  },
  {
    id: 3,
    vehicleNo: "MP09CD3311",
    date: "14 Aug 2026",
    depotCode: "IND",
    fuelType: "Diesel",
    qtyLitre: 80,
    ratePerLitre: 94.8,
    totalAmount: 7584.0,
    meterReading: 210500,
    fuelStation: "BPCL, Sanver Road",
    billNo: "BP-4412",
    grantHead: "Transport Allocation",
  },
];

export const vendorList = [
  { id: "V1", text: "Shree Ji Transports" },
  { id: "V2", text: "Narmada Logistics" },
  { id: "V3", text: "Malwa Express Cargo" },
  { id: "V4", text: "Vindhya Roadways" },
];
