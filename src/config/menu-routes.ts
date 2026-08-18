import { masterUrls } from "auth/features/master/urls";
import { userManagementUrls } from "auth/features/user-management/urls";
import { hrmsUrls } from "auth/features/hrms/urls";
import { bookPaperRequirementUrls } from "auth/features/book-paper-requirement/urls";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider";
import { hasPermission } from "../shared/utils/permissionCheck";
import { ROLE_PERMISSIONS } from "../auth/rolePermissions";

// export const menuConfig: Menu.MenuItem[] = [
export const getMenuConfig = (t: (key: string) => string): Menu.MenuItem[] => [
  {
    label: "Home",
    icon: "pi pi-home",
    path: "/home",
    permissionKey: "dashboard",
  },
  {
    label: "Dashboard",
    icon: "pi pi-th-large",
    path: "",
    permissionKey: "dashboard",
  },
  {
    label: "Profile",
    icon: "pi pi-user",
    path: "/profile",
    permissionKey: "profile",
  },
  {
    label: "Master",
    icon: "pi pi-database",
    section: "Configuration",
    children: [
      {
        label: t("routes.master.office.office"),
        children: [
          {
            label: t("routes.master.office.office-level"),
            path: masterUrls.officeLevel.root,
            feature: "@master/office-level",
            action: "write",
            permissionKey: "master/office-level",
          },
          {
            label: t("routes.master.office.office-type"),
            path: masterUrls.officeType.root,
            feature: "@master/office-type",
            action: "write",
            permissionKey: "master/office-type",
          },
          {
            label: t("routes.master.office.office-registration"),
            path: masterUrls.office.root,
            feature: "@master/office",
            action: "write",
            permissionKey: "master/office",
          },
        ],
      },
      {
        label: t("routes.master.location.location"),
        children: [
          {
            label: t("routes.master.location.state"),
            path: masterUrls.state.root,
            feature: "@master/state",
            action: "write",
            permissionKey: "master/state",
          },
          {
            label: t("routes.master.location.division"),
            path: masterUrls.division.root,
            feature: "@master/division",
            action: "write",
            permissionKey: "master/division",
          },
          {
            label: t("routes.master.location.district"),
            path: masterUrls.district.root,
            feature: "@master/district",
            action: "write",
            permissionKey: "master/district",
          },
          {
            label: t("routes.master.location.block"),
            path: masterUrls.block.root,
            feature: "@master/block",
            action: "write",
            permissionKey: "master/block",
          },
          {
            label: t("routes.master.location.depot"),
            path: masterUrls.depot.root,
            feature: "@master/depot",
            action: "write",
            permissionKey: "master/depot",
          },
          {
            label: t("routes.master.location.sub-depot"),
            path: masterUrls.subDepot.root,
            feature: "@master/sub-depot",
            action: "write",
            permissionKey: "master/sub-depot",
          },
        ],
      },
      {
        label: t("routes.master.hrManagement.hr-management"),
        children: [
          {
            label: t("routes.master.hrManagement.caste"),
            path: masterUrls.caste.root,
            feature: "@master/caste",
            action: "write",
            permissionKey: "master/caste",
          },
          {
            label: t("routes.master.hrManagement.religion"),
            path: masterUrls.religion.root,
            feature: "@master/religion",
            action: "write",
            permissionKey: "master/religion",
          },
          {
            label: t("routes.master.hrManagement.blood-group"),
            path: masterUrls.bloodGroup.root,
            feature: "@master/blood-group",
            action: "write",
            permissionKey: "master/blood-group",
          },
          // {
          //   label: t("routes.master.hrManagement.nationality"),
          //   path: masterUrls.nationality.root,
          //   feature: "@master/nationality",
          //   action: "write",
          //   permissionKey: "master/nationality",
          // },
          {
            label: t("routes.master.hrManagement.designation"),
            path: masterUrls.designation.root,
            feature: "@master/designation",
            action: "write",
            permissionKey: "master/designation",
          },
          {
            label: t("routes.master.hrManagement.designation-type"),
            path: masterUrls.designationType.root,
            feature: "@master/designation-type",
            action: "write",
            permissionKey: "master/designation-type",
          },
          {
            label: t("routes.master.hrManagement.qualification"),
            path: masterUrls.qualification.root,
            feature: "@master/qualification",
            action: "write",
            permissionKey: "master/qualification",
          },
          // {
          //   label: t("routes.master.hrManagement.qualification-type"),
          //   path: masterUrls.qualificationType.root,
          //   feature: "@master/qualification-type",
          //   action: "write",
          //   permissionKey: "master/qualification-type",
          // },
          // {
          //   label: t("routes.master.hrManagement.qualification-subject"),
          //   path: masterUrls.qualificationSubject.root,
          //   feature: "@master/qualification-subject",
          //   action: "write",
          //   permissionKey: "master/qualification-subject",
          // },
        ],
      },
      {
        label: t("routes.master.curriculum.curriculum"),
        children: [
          {
            label: t("routes.master.curriculum.class"),
            path: masterUrls.class.root,
            feature: "@master/class",
            action: "write",
            permissionKey: "master/class",
          },
          {
            label: t("routes.master.curriculum.book-type"),
            path: masterUrls.bookType.root,
            feature: "@master/book-type",
            action: "write",
            permissionKey: "master/book-type",
          },
          {
            label: t("routes.master.curriculum.medium"),
            path: masterUrls.medium.root,
            feature: "@master/medium",
            action: "write",
            permissionKey: "master/medium",
          },
        ],
      },
      {
        label: t("routes.master.paper.paper"),
        children: [
          {
            label: t("routes.master.paper.gsm"),
            path: masterUrls.gsm.root,
            feature: "@master/gsm",
            action: "write",
            permissionKey: "master/gsm",
          },
        ],
      },
      {
        label: t("routes.master.transportation"),
        children: [
          {
            label: t("routes.master.transporter-registration"),
            path: masterUrls.transporterRegistration.root,
            feature: "@master/transporter-registration",
            action: "write",
          },
          {
            label: t("routes.master.vehicle-master"),
            path: masterUrls.vehicleMaster.root,
            feature: "@master/vehicle-master",
            action: "write",
          },
        ],
      },
    ],
  },
  {
    label: t("routes.master.userManagement.user-management"),
    icon: "pi pi-users",
    children: [
      {
        label: t("routes.master.userManagement.user-registration"),
        path: userManagementUrls.user.root,
        feature: "@user-management/users",
        action: "write",
        permissionKey: "user-management/user",
      },
      {
        label: t("routes.master.userManagement.role-management"),
        path: userManagementUrls.userRole.root,
        feature: "@user-management/roles",
        action: "write",
        permissionKey: "user-management/role",
      },
      {
        label: t("routes.master.userManagement.user-assignment"),
        path: userManagementUrls.userAssignment.root,
        feature: "@user-management/user-assignment",
        action: "write",
        permissionKey: "user-management/user-assignment",
      },
      {
        label: t("routes.master.userManagement.role-permissions"),
        path: userManagementUrls.rolePermissions.root,
        feature: "@user-management/role-permissions",
        action: "write",
        permissionKey: "user-management/role-permissions",
      },
    ],
  },
  {
    label: t("routes.master.hrms.hrms"),
    icon: "pi pi-id-card",
    children: [
      {
        label: t("routes.master.hrms.employee-details"),
        path: hrmsUrls.employeeDetails.root,
        feature: "@hrms/employee-details",
        action: "write",
        permissionKey: "hrms/employee-details",
      },
    ],
  },
  {
    label: "Content Management",
    icon: "pi pi-book",
    children: [
      {
        label: "Title Received (RSK / CPI)",
        path: "/distribution/title-received",
        feature: "@distribution/title-received",
        action: "read",
        permissionKey: "title-section/title-received",
      },
      {
        label: "Title Approval",
        path: "/distribution/title-approval",
        feature: "@distribution/title-approval",
        action: "read",
        permissionKey: "title-section/title-approval",
      },
      {
        label: "Approved Title List",
        path: masterUrls.title.root,
        feature: "@master/title",
        action: "read",
        permissionKey: "title-section/title-master",
      },
    ],
  },
  {
    label: "Printer Section",
    // label: t("routes.printing.printing"),
    icon: "pi pi-print",
    children: [
      {
        label: t("routes.printing.printer-registration"),
        path: "/printing/printer-registration",
        permissionKey: "printer-section/printer-registration",
      },
      {
        label: "Printer Orders",
        path: "/printing/orders/list",
        permissionKey: "printer-orders",
      },
      {
        label: "Pending Orders",
        path: "/printing/orders/pending",
        permissionKey: "pending-printer-orders",
      },
      {
        label: "Quality Inspection",
        path: "/printing/quality-inspection",
        permissionKey: "printer-section/quality-inspection",
      },
    ],
  },
  {
    label: "Depot Section",
    icon: "pi pi-home",
    children: [
      {
        label: "Depot Registration",
        path: "/mptbc/depot-registration",
        permissionKey: "depot-section/depot-registration",
      },
    ],
  },
  {
    label: "District Depot",
    icon: "pi pi-building",
    children: [
      {
        label: "Printer Section",
        children: [
          {
            label: "Printer Assigned Demand",
            path: "/district-depot/printer/assigned-demand",
            permissionKey: "district-depot/printer-assigned-demand",
          },
          {
            label: "Challan Received",
            path: "/district-depot/printer/challan-received",
            permissionKey: "district-depot/challan-received",
          },
        ],
      },
      {
        label: "Distribution till Block",
        children: [
          {
            label: "Challan to Block",
            path: "/district-depot/dispatch/challan-to-block",
            permissionKey: "district-depot/challan-to-block",
          },
          {
            label: "Dispatch History",
            path: "/district-depot/dispatch/history",
            permissionKey: "district-depot/dispatch-history",
          },
        ],
      },
    ],
  },

  {
    label: "Depot Transport Section",
    icon: "pi pi-car",
    permissionKey: "depot-transport",
    children: [
      {
        label: "Transport Orders",
        path: "/district-depot/transport/orders",
        permissionKey: "depot-transport/transport-orders",
      },
      {
        label: "Vehicle Management",
        path: "/district-depot/transport/vehicles",
        permissionKey: "depot-transport/vehicle-management",
      },
      {
        label: "Fuel Log",
        path: "/district-depot/transport/fuel-log",
        permissionKey: "depot-transport/fuel-log",
      },
    ],
  },
  {
    label: "Distribution Section",
    icon: "pi pi-truck",
    permissionKey: "distribution-section",
    children: [
      {
        label: t("routes.distribution.department-demand"),
        path: "/distribution/department-demand",
        feature: "@distribution/department-demand",
        action: "read",
        permissionKey: "distribution-section/department-demand",
      },
      {
        label: t("routes.distribution.dashboard"),
        path: "/distribution/dashboard",
        feature: "@distribution/dashboard",
        action: "read",
        permissionKey: "distribution-section/dashboard",
      },
      {
        label: t("routes.distribution.demand-approval"),
        path: "/distribution/demand-approval",
        feature: "@distribution/demand-approval",
        action: "read",
        permissionKey: "distribution-section/demand-approval",
      },
      {
        label: "Paper Distribution",
        path: "/distribution/new",
        permissionKey: "paper-distribution",
      },
      {
        label: "Distribution History",
        path: "/distribution/history",
        permissionKey: "distribution-history",
      },
    ],
  },
  {
    label: t("routes.paper-section"),
    icon: "pi pi-copy",
    permissionKey: "paper-section",
    children: [
      {
        label: "Paper Section Dashboard",
        path: "/paper/dashboard",
        feature: "@paper/dashboard",
        action: "read",
        permissionKey: "paper-section",
      },
      {
        label: t("routes.book-paper-requirement"),
        path: bookPaperRequirementUrls.root,
        feature: "@master/book-paper-requirement",
        action: "write",
        permissionKey: "paper-section/book-paper-requirement",
      },
      {
        label: "GSM Wise Paper Demand Report",
        path: "/paper/gsm-demand-report",
        feature: "@paper/gsm-demand-report",
        action: "read",
        permissionKey: "paper-section/gsm-demand-report",
      },
      {
        label: "Paper Tender",
        path: "/paper/paper-tender-raise",
        feature: "@paper/paper-tender-raise",
        action: "read",
        permissionKey: "paper-section/paper-tender",
      },
      {
        label: "Paper Vendor Profile",
        path: "/paper/paper-vendor-profile",
        feature: "@paper/paper-vendor-profile",
        action: "read",
        permissionKey: "paper-section/paper-vendor-profile",
      },
      {
        label: "Paper Vendor Order Details",
        path: "/paper/paper-order-allocation",
        feature: "@paper/paper-order-allocation",
        action: "read",
      },
      {
        label: "Paper Stock",
        path: "/paper/stock/main",
        permissionKey: "paper-stock",
      },
      {
        label: "Stock Transactions",
        path: "/paper/stock/transactions",
        permissionKey: "stock-transactions",
      },
      {
        label: "Stock Ledger",
        path: "/paper/stock/ledger",
        permissionKey: "stock-ledger",
      },

      {
        label: "Paper Supply & Dispatch",
        path: "/paper/paper-supply-dispatch",
        feature: "@paper/paper-supply-dispatch",
        action: "read",
        permissionKey: "paper-section/paper-order-allocation",
      },
    ],
  },
  {
    label: t("routes.reports.reports"),
    icon: "pi pi-chart-bar",
    permissionKey: "reports",
    children: [
      {
        label: "Depot Wise Textbook Supply Report",
        // label: t("routes.reports.depot-wise-district-textbook-supply-status"),
        path: "/reports/depot-wise-district-textbook-supply-status",
        permissionKey: "reports/depot-supply-status",
      },
      {
        // label: "Department Wise Demand Report",
        label: t("routes.reports.agency-wise-demand"),
        path: "/reports/agency-wise-demand",
        permissionKey: "reports/agency-demand",
      },
      {
        label: "GSM-wise Stock Report",
        path: "/reports/gsm-stock",
        permissionKey: "gsm-stock-report",
      },
      {
        label: "Printer-wise Order Report",
        path: "/reports/printer-orders",
        permissionKey: "printer-order-report",
      },
      {
        label: "Printer-wise Supply Report",
        path: "/reports/printer-supply",
        permissionKey: "printer-supply-report",
      },
      {
        label: "Paper Distribution Report",
        path: "/reports/distributions",
        permissionKey: "paper-distribution-report",
      },
    ],
  },

  /* ─── DISTRICT DEPOT specific mock menus ─── */
  {
    label: "Assigned Demand",
    icon: "pi pi-file-edit",
    path: "/assigned-demand",
    permissionKey: "assigned-demand",
  },

  /* ─── PRINTER specific mock menus ─── */
  {
    label: "Tender",
    icon: "pi pi-file",
    path: "/tender",
    permissionKey: "tender",
  },

  {
    label: "Paper Receiving",
    icon: "pi pi-download",
    path: "/paper/stock/receiving",
    permissionKey: "central-paper-receiving",
  },
  {
    label: "Title Master",
    icon: "pi pi-bookmark",
    path: "/title-master",
    permissionKey: "title-master",
  },
  {
    label: "GSM Master",
    icon: "pi pi-sliders-h",
    path: "/gsm-master",
    permissionKey: "gsm-master",
  },
  {
    label: "Supply Section",
    icon: "pi pi-send",
    path: "/supply-section",
    permissionKey: "supply-section",
  },
  {
    label: "Payment",
    icon: "pi pi-wallet",
    path: "/payment",
    permissionKey: "payment",
  },

  /* ─── PAPER VENDOR specific mock menus ─── */
  {
    label: "Paper Supply",
    icon: "pi pi-upload",
    path: "/paper-supply",
    permissionKey: "paper-supply",
  },
  {
    label: "Paper Orders",
    icon: "pi pi-shopping-cart",
    path: "/paper-orders",
    permissionKey: "paper-orders",
  },

  /* ─── DISTRIBUTION SECTION specific mock menus ─── */
  {
    label: "Demand",
    icon: "pi pi-envelope",
    path: "/demand",
    permissionKey: "demand",
  },
  {
    label: "Allocation",
    icon: "pi pi-share-alt",
    path: "/allocation",
    permissionKey: "allocation",
  },
  {
    label: "Distribution",
    icon: "pi pi-map-marker",
    path: "/distribution-page",
    permissionKey: "distribution",
  },
  {
    label: "Dispatch",
    icon: "pi pi-directions",
    path: "/dispatch",
    permissionKey: "dispatch",
  },
  {
    label: "Distribution Tracking",
    icon: "pi pi-map",
    path: "/distribution-tracking",
    permissionKey: "distribution-tracking",
  },

  /* ─── TRANSPORTATION SECTION ─── */
  {
    label: "Transportation",
    icon: "pi pi-truck",
    permissionKey: "transportation",
    children: [
      {
        label: "Tender Details",
        path: "/transport/tender-details",
        permissionKey: "transport/tender-details",
      },
      {
        label: "Work Order & Allocation",
        path: "/transport/work-order",
        permissionKey: "transport/work-order",
      },
      {
        label: "Loading & Dispatch",
        path: "/transport/dispatch",
        permissionKey: "transport/dispatch",
      },
      {
        label: "Live Delivery Tracking",
        path: "/transport/tracking",
        permissionKey: "transport/tracking",
      },
      {
        label: "POD Submission",
        path: "/transport/pod",
        permissionKey: "transport/pod",
      },
      /*
      {
        label: "Billing Engine",
        path: "/transport/billing",
        permissionKey: "transport/billing",
      },
      {
        label: "Payment Disbursement",
        path: "/transport/disbursement",
        permissionKey: "transport/disbursement",
      },
      */
      {
        label: "Transportation Analytics",
        path: "/transport/reports",
        permissionKey: "transport/reports",
      },
    ],
  },
];

export function useMenu() {
  const { authenticated, user, permissions } = useAuth();
  const { t } = useTranslation();

  return useMemo(() => {
    if (!authenticated) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getNormalizedRole = (u: any): string => {
      if (!u) return "";
      const r =
        u.role ||
        (Array.isArray(u.profile?.role)
          ? u.profile.role[0]
          : u.profile?.role) ||
        "";
      return r.toUpperCase();
    };
    const role = getNormalizedRole(user);
    const allowedPermissions = ROLE_PERMISSIONS[role] || [];

    const filterMenu = (items: Menu.MenuItem[]): Menu.MenuItem[] => {
      return (
        items
          .filter((item) => {
            // First check dynamic role-wise permissionKey
            if (item.permissionKey) {
              const isAllowed = allowedPermissions.includes(item.permissionKey);
              if (!isAllowed) return false;
            }
            // If the item requires a specific action/feature permission (existing OIDC checks)
            if (item.feature && item.action) {
              return hasPermission(permissions, item.feature, item.action);
            }
            return true; // No permission required
          })
          .map((item) => {
            // Recursively filter children
            if (item.children) {
              return { ...item, children: filterMenu(item.children) };
            }
            return item;
          })
          // Remove empty parent items (e.g., Master menu if all children are hidden)
          .filter((item) => {
            if (item.children) {
              return item.children.length > 0;
            }
            return true;
          })
      );
    };

    const menuConfig = getMenuConfig(t);
    const filtered = filterMenu(menuConfig);

    const mapped = filtered
      .map((item) => {
        if (item.label === "Dashboard") {
          let dashboardPath = "";
          if (role === "CENTRAL_DEPOT") {
            dashboardPath = "/inventory/dashboard";
          } else if (role === "DISTRICT_DEPOT") {
            dashboardPath = "/district-depot/dashboard";
          } else if (role === "PRINTER") {
            dashboardPath = "/printing/dashboard";
          }
          return { ...item, path: dashboardPath };
        }
        return item;
      })
      .filter((item) => {
        if (item.label === "Dashboard" && !item.path) {
          return false;
        }
        return true;
      });

    let hasSectionAssigned = false;
    return mapped.map((item) => {
      if (
        !hasSectionAssigned &&
        item.label !== "Home" &&
        item.label !== "Dashboard" &&
        item.label !== "Profile"
      ) {
        hasSectionAssigned = true;
        return { ...item, section: "Configuration" };
      }
      return item;
    });
  }, [authenticated, user, permissions, t]);
}
