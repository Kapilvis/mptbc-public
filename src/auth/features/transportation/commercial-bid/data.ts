export interface Tender {
  tenderId: string;
  title: string;
  district: string;
  lastDate: string;
  openingDate: string;
  status: "Active" | "Closed";
  allocatedTransporterId?: number;
}

export interface Bid {
  bidId: number;
  tenderId: string;
  transporterId: number;
  rateCat1: number; // Rs/Ton
  rateCat2: number; // Rs/Ton
  rateCat3: number; // Rs/Ton
  submittedAt: string;
  status: "Draft" | "Submitted";
}

export const mockTenders: Tender[] = [
  {
    tenderId: "TBC/TRANS/IND/2026/001",
    title: "Indore Division Textbook Distribution Tender",
    district: "Indore",
    lastDate: "2026-09-30",
    openingDate: "2026-10-01",
    status: "Active",
    // allocatedTransporterId left blank — demo resets on refresh
  },
  {
    tenderId: "TBC/TRANS/BHP/2026/002",
    title: "Bhopal Division Textbook Distribution Tender",
    district: "Bhopal",
    lastDate: "2026-09-30",
    openingDate: "2026-10-01",
    status: "Active",
    allocatedTransporterId: 1, // Sharma Transport Co. — L1 for Bhopal
  },
  {
    tenderId: "TBC/TRANS/GWL/2026/003",
    title: "Gwalior Division Textbook Distribution Tender",
    district: "Gwalior",
    lastDate: "2026-09-15",
    openingDate: "2026-09-16",
    status: "Active",
    allocatedTransporterId: 2, // MP Roadlines — L1 for Gwalior
  },
];

// Pre-populate Indore Tender bid for Sharma Transport (id: 1) as "Submitted" (locked)
// and Bhopal Tender as "Draft" to demonstrate different states.
export const mockBids: Bid[] = [
  {
    bidId: 1,
    tenderId: "TBC/TRANS/IND/2026/001",
    transporterId: 1,
    rateCat1: 350,
    rateCat2: 500,
    rateCat3: 650,
    submittedAt: "2026-08-16 11:30",
    status: "Submitted",
  },
  {
    bidId: 2,
    tenderId: "TBC/TRANS/IND/2026/001",
    transporterId: 3,
    rateCat1: 330,
    rateCat2: 480,
    rateCat3: 620,
    submittedAt: "2026-08-16 12:45",
    status: "Submitted",
  },
  {
    bidId: 3,
    tenderId: "TBC/TRANS/IND/2026/001",
    transporterId: 4,
    rateCat1: 360,
    rateCat2: 510,
    rateCat3: 630,
    submittedAt: "2026-08-16 14:15",
    status: "Submitted",
  },
];
