/**
 * README: IMPORTANT NOTE ABOUT `isNew` FLAG
 *
 * The `isNew` flag below is used strictly for frontend visualization to label metrics
 * that are currently pending backend API integration.
 *
 * ACTION REQUIRED BY DEVELOPERS:
 * As the backend endpoints are completed and real data is wired up, you must:
 * 1. Remove the `isNew: true` flag from the respective object below (or in real state).
 * 2. Connect the field to the live API response.
 * Do not leave `isNew: true` in production once the data is actually flowing.
 */

export const mockDashboardData = {
  lastUpdated: new Date().toISOString(),
  academicYear: "2026-2027",

  // 1. Demand Received
  demand: {
    totalDemand: "4,50,000",
    demandApproved: "3,90,000",
    openingStockDepot: "30,500",
    underApproval: { value: "60,000", isNew: true },
    actualRequirement: "3,59,500",
    lastYearComparison: { value: "+5.39%", isNew: true },
    departments: {
      rsk: { value: "20,00,000", isNew: true },
      dpi: { value: "15,00,000", isNew: true },
      openMarket: { value: "8,00,000", isNew: true },
      special: { value: "2,00,000", isNew: true },
    },
    bookTypes: {
      hindi: { value: "30,00,000", isNew: true },
      english: { value: "15,00,000", isNew: true },
    },
    last3YearsTrend: { value: [4200000, 4400000, 4500000], isNew: true },
    departmentsModal: [
      { department: "RSK", demand: "1,80,000" },
      { department: "DPI", demand: "1,50,000" },
      { department: "Open Market", demand: "80,000" },
      { department: "Special", demand: "40,000" },
    ],
    classesModal: [
      { classGroup: "1–5", demand: "1,20,000" },
      { classGroup: "6–8", demand: "95,000" },
      { classGroup: "9–10", demand: "85,000" },
      { classGroup: "11–12", demand: "1,50,000" },
    ],
    detailedClassesModal: [
      {
        className: "Class 1",
        demand: "25,000",
        approved: "25,000",
        pending: "0",
      },
      {
        className: "Class 2",
        demand: "22,000",
        approved: "20,000",
        pending: "2,000",
      },
      {
        className: "Class 3",
        demand: "24,000",
        approved: "24,000",
        pending: "0",
      },
      {
        className: "Class 4",
        demand: "23,000",
        approved: "21,000",
        pending: "2,000",
      },
      {
        className: "Class 5",
        demand: "26,000",
        approved: "26,000",
        pending: "0",
      },
      {
        className: "Class 6",
        demand: "30,000",
        approved: "28,000",
        pending: "2,000",
      },
      {
        className: "Class 7",
        demand: "32,000",
        approved: "30,000",
        pending: "2,000",
      },
      {
        className: "Class 8",
        demand: "33,000",
        approved: "31,000",
        pending: "2,000",
      },
      {
        className: "Class 9",
        demand: "40,000",
        approved: "38,000",
        pending: "2,000",
      },
      {
        className: "Class 10",
        demand: "45,000",
        approved: "42,000",
        pending: "3,000",
      },
      {
        className: "Class 11",
        demand: "70,000",
        approved: "65,000",
        pending: "5,000",
      },
      {
        className: "Class 12",
        demand: "80,000",
        approved: "75,000",
        pending: "5,000",
      },
    ],
    streamsModal: [
      { stream: "Science", demand: "60,000" },
      { stream: "Commerce", demand: "45,000" },
      { stream: "Arts", demand: "45,000" },
    ],
    gsmModal: [
      { gsm: "60 GSM", demand: "1,20,000" },
      { gsm: "70 GSM", demand: "2,25,000" },
      { gsm: "80 GSM", demand: "1,05,000" },
    ],
    bookTypesModal: [
      { bookType: "PathyaPhustak", demand: "3,51,000", share: "78%" },
      { bookType: "FLN", demand: "67,500", share: "15%" },
      { bookType: "AddGrade", demand: "31,500", share: "7%" },
    ],
    mediumsModal: [
      { medium: "Hindi Medium", demand: "2,79,000", share: "62%" },
      { medium: "English Medium", demand: "1,48,500", share: "33%" },
      { medium: "Sanskrit / Urdu Medium", demand: "22,500", share: "5%" },
    ],
  },

  // 2. Paper Analysis
  paperAnalysis: {
    totalRequiredMt: "3,767 / 3,90,000",
    availableStockMt: "602 / 62,350",
    needToPurchaseMt: "52 / 5,20,000",
    openingStockMt: { value: "60 / 30,500", isNew: true },
    actualRequirementMt: { value: "3,707 / 3,59,500", isNew: true },
    receivedPaperMt: { value: "3,707 / 3,27,650", isNew: true },
    returnStockMt: { value: "10 / 1,000", isNew: true },
    workOrdersPending: { value: "2 Pending", isNew: true },
    gsmModal: [
      {
        gsm: "60 GSM",
        totalRequired: "1,200 MT",
        openingStock: "20 MT",
        receivedStock: "1,180 MT",
        returnStock: "3 MT",
        availableStock: "200 MT",
        needToPurchase: "20 MT",
      },
      {
        gsm: "70 GSM",
        totalRequired: "1,500 MT",
        openingStock: "25 MT",
        receivedStock: "1,475 MT",
        returnStock: "4 MT",
        availableStock: "250 MT",
        needToPurchase: "15 MT",
      },
      {
        gsm: "80 GSM",
        totalRequired: "1,067 MT",
        openingStock: "15 MT",
        receivedStock: "1,052 MT",
        returnStock: "3 MT",
        availableStock: "152 MT",
        needToPurchase: "17 MT",
      },
    ],
  },

  // 3. Printer Profile
  printerProfile: {
    totalCapacity: "6,00,000 Books",
    currentCapacity: "3,59,500 Books",
    capacityUtilization: 59.92,
    totalPrinters: 52,
    maxCapacityPrinters: [
      {
        id: "PRN-001",
        name: "Alpha Print Co",
        capacity: "50k",
        approvedBooks: "50,000 Books",
      },
      {
        id: "PRN-002",
        name: "Beta Press",
        capacity: "40k",
        approvedBooks: "40,000 Books",
      },
      {
        id: "PRN-001",
        name: "ABC Printing Press",
        capacity: "1,40,000 Books",
        approvedBooks: "90,000 Books",
      },
      {
        id: "PRN-000128",
        name: "Gwalior Text Offset Printers",
        capacity: "1,20,000 Books",
        approvedBooks: "60,000 Books",
      },
      {
        id: "PRN-000130",
        name: "National Offset & Packagers",
        capacity: "1,00,000 Books",
        approvedBooks: "20,000 Books",
      },
    ],
  },

  // 4. Central Paper Depot
  centralDepot: {
    openingStock: "60 MT",
    receivedThisYear: "3,707 MT",
    dispatchedToPrinter: "3,165 MT",
    closingStock: "602 MT",
    gsmBreakdown: [
      { type: "60 GSM", stock: "200" },
      { type: "70 GSM", stock: "250" },
      { type: "80 GSM", stock: "152" },
    ],
  },

  // 5. Printing Progress
  printingProgress: {
    totalPrinters: "52 Nos.",
    totalBooksTarget: "3,59,500 Books",
    dispatchCount: "1,80,500 Books",
    pending: "1,79,000 Books",
    totalInspections: "35 No.",
    qaPassed: "33 No.",
    totalTransporter: "7 No.",
    // Modal data
    detailedProgress: [
      {
        id: "1",
        printerName: "ABC Printing Press",
        workOrder: "ORD-2026-001",
        sampleDate: "2026-08-18",
        inspectionDate: "2026-08-22",
        inspectionBy: "Rajesh Sharma",
        qaDate: "2026-08-25",
        qaBy: "Priya Verma",
        dispatchBooks: "90,000",
        receivedBooks: "90,000",
        noOfTransporter: "2",
      },
      {
        id: "2",
        printerName: "Shree Offset Press",
        workOrder: "ORD-2026-002",
        sampleDate: "2026-08-18",
        inspectionDate: "2026-08-23",
        inspectionBy: "Anil Kumar",
        qaDate: "2026-08-26",
        qaBy: "Sunita Patel",
        dispatchBooks: "1,00,000",
        receivedBooks: "1,00,000",
        noOfTransporter: "3",
      },
      {
        id: "3",
        printerName: "Narmada Printing Press",
        workOrder: "ORD-2026-005",
        sampleDate: "2026-08-19",
        inspectionDate: "2026-08-24",
        inspectionBy: "Mohan Das",
        qaDate: "",
        qaBy: "",
        dispatchBooks: "1,20,000",
        receivedBooks: "0",
        noOfTransporter: "0",
      },
    ],
  },

  // 6. Distribution from Depot (District Depot → Block)
  distribution: {
    received: "1,80,500",
    delivered: "1,50,000",
    pending: "20,000",
    inTransit: { value: "10,500", isNew: true },
  },

  // 7. Bill & Payment
  billAndPayment: {
    paper: {
      totalWorkOrders: 15,
      billsReceived: 12,
      paymentReleased: "₹85 Cr",
      paymentInProcess: "₹10 Cr",
      pending30Days: "₹6 Cr",
      pending60Days: "₹4 Cr",
      // Modal data
      details: [
        {
          orderNo: "PO-001",
          vendorName: "National Paper Mills",
          date: "2026-07-15",
          amount: "₹20 Cr",
          received: "₹15 Cr",
          pending: "₹5 Cr",
          status: "Partial",
        },
        {
          orderNo: "PO-002",
          vendorName: "Shree Papers",
          date: "2026-07-20",
          amount: "₹10 Cr",
          received: "₹10 Cr",
          pending: "₹0",
          status: "Paid",
        },
      ],
    },
    printer: {
      totalWorkOrders: 45,
      billsReceived: 38,
      paymentReleased: "₹40 Cr",
      paymentInProcess: "₹12 Cr",
      pending30Days: "₹8 Cr",
      pending60Days: "₹4 Cr",
      // Modal data
      details: [
        {
          orderNo: "PR-101",
          vendorName: "Alpha Print Co",
          date: "2026-08-01",
          amount: "₹2 Cr",
          received: "₹1 Cr",
          pending: "₹1 Cr",
          status: "Partial",
        },
        {
          orderNo: "PR-102",
          vendorName: "Beta Press",
          date: "2026-08-05",
          amount: "₹1.5 Cr",
          received: "₹0",
          pending: "₹1.5 Cr",
          status: "In Process",
        },
      ],
    },
    others: {
      totalWorkOrders: 10,
      billsReceived: 8,
      paymentReleased: "₹15 Cr",
      paymentInProcess: "₹3 Cr",
      pending30Days: "₹2 Cr",
      pending60Days: "₹1 Cr",
      details: [
        {
          orderNo: "OTH-001",
          vendorName: "Logistics & Transport Co",
          date: "2026-08-10",
          amount: "₹10 Cr",
          received: "₹8 Cr",
          pending: "₹2 Cr",
          status: "Partial",
        },
        {
          orderNo: "OTH-002",
          vendorName: "IT Services Ltd",
          date: "2026-08-12",
          amount: "₹5 Cr",
          received: "₹5 Cr",
          pending: "₹0",
          status: "Paid",
        },
      ],
    },
  },

  // 8. Grievance
  grievance: {
    totalNumber: 156,
    resolved: 140,
    pending: 12,
    overdue: 4,
  },

  // 9. Finance
  finance: {
    totalBudget: "₹500 Cr",
    budgetUtilized: "₹320 Cr",
    remainingBudget: "₹180 Cr",
    utilizationPercent: 64,
  },

  // 10. HRMS
  hrms: {
    totalEmployees: 85,
    presentEmployees: 78,
    onLeave: 7,
    attendanceRate: 91.8,
    permanent: 30,
    samvida: 20,
    contractual: 15,
    outsource: 20,
  },

  // 11. Legal
  legal: {
    totalCases: 28,
    pendingCases: 15,
    upcomingHearings: 4,
    highPriority: 2,
  },

  // Consolidated Alerts
  alerts: [
    {
      id: "A1",
      type: "warning",
      module: "Grievance",
      message: "4 grievances are overdue beyond SLA.",
      time: "1 hour ago",
    },
    {
      id: "A2",
      type: "critical",
      module: "Legal",
      message: "High priority hearing for Case #421 next week.",
      time: "2 hours ago",
    },
    {
      id: "A3",
      type: "info",
      module: "HRMS",
      message: "Overall attendance dipped below 90% in Zone 3.",
      time: "4 hours ago",
    },
    {
      id: "A4",
      type: "warning",
      module: "Finance",
      message: "Budget utilization for Logistics approaching 90%.",
      time: "1 day ago",
    },
    {
      id: "A5",
      type: "critical",
      module: "Demand",
      message: "2 districts yet to submit final demand.",
      time: "2 days ago",
    },
  ],
};
