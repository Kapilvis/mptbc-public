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
    label: "Profile",
    icon: "pi pi-user",
    path: "/profile",
    permissionKey: "profile",
  },
  {
    label: "Master",
    icon: "pi pi-database",
    section: "Configuration",
    permissionKey: "master",
    children: [
      {
        label: t("routes.master.office.office"),
        children: [
          {
            label: t("routes.master.office.office-level"),
            path: masterUrls.officeLevel.root,
            feature: "@master/office-level",
            action: "write",
          },
          {
            label: t("routes.master.office.office-type"),
            path: masterUrls.officeType.root,
            feature: "@master/office-type",
            action: "write",
          },
          {
            label: t("routes.master.office.office-registration"),
            path: masterUrls.office.root,
            feature: "@master/office",
            action: "write",
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
          },
          {
            label: t("routes.master.location.division"),
            path: masterUrls.division.root,
            feature: "@master/division",
            action: "write",
          },
          {
            label: t("routes.master.location.district"),
            path: masterUrls.district.root,
            feature: "@master/district",
            action: "write",
          },
          {
            label: t("routes.master.location.block"),
            path: masterUrls.block.root,
            feature: "@master/block",
            action: "write",
          },
          {
            label: t("routes.master.location.depot"),
            path: masterUrls.depot.root,
            feature: "@master/depot",
            action: "write",
          },
          {
            label: t("routes.master.location.sub-depot"),
            path: masterUrls.subDepot.root,
            feature: "@master/sub-depot",
            action: "write",
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
          },
          {
            label: t("routes.master.hrManagement.religion"),
            path: masterUrls.religion.root,
            feature: "@master/religion",
            action: "write",
          },
          {
            label: t("routes.master.hrManagement.blood-group"),
            path: masterUrls.bloodGroup.root,
            feature: "@master/blood-group",
            action: "write",
          },
          {
            label: t("routes.master.hrManagement.nationality"),
            path: masterUrls.nationality.root,
            feature: "@master/nationality",
            action: "write",
          },
          {
            label: t("routes.master.hrManagement.designation"),
            path: masterUrls.designation.root,
            feature: "@master/designation",
            action: "write",
          },
          {
            label: t("routes.master.hrManagement.designation-type"),
            path: masterUrls.designationType.root,
            feature: "@master/designation-type",
            action: "write",
          },
          {
            label: t("routes.master.hrManagement.qualification"),
            path: masterUrls.qualification.root,
            feature: "@master/qualification",
            action: "write",
          },
          {
            label: t("routes.master.hrManagement.qualification-type"),
            path: masterUrls.qualificationType.root,
            feature: "@master/qualification-type",
            action: "write",
          },
          {
            label: t("routes.master.hrManagement.qualification-subject"),
            path: masterUrls.qualificationSubject.root,
            feature: "@master/qualification-subject",
            action: "write",
          },
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
          },
          {
            label: t("routes.master.curriculum.book-type"),
            path: masterUrls.bookType.root,
            feature: "@master/book-type",
            action: "write",
          },
          {
            label: t("routes.master.curriculum.medium"),
            path: masterUrls.medium.root,
            feature: "@master/medium",
            action: "write",
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
          },
        ],
      },
    ],
  },
  {
    label: t("routes.master.userManagement.user-management"),
    icon: "pi pi-users",
    permissionKey: "user-management",
    children: [
      {
        label: t("routes.master.userManagement.user-registration"),
        path: userManagementUrls.user.root,
        feature: "@user-management/users",
        action: "write",
      },
      {
        label: t("routes.master.userManagement.role-management"),
        path: userManagementUrls.userRole.root,
        feature: "@user-management/roles",
        action: "write",
      },
      {
        label: t("routes.master.userManagement.user-assignment"),
        path: userManagementUrls.userAssignment.root,
        feature: "@user-management/user-assignment",
        action: "write",
      },
      {
        label: t("routes.master.userManagement.role-permissions"),
        path: userManagementUrls.rolePermissions.root,
        feature: "@user-management/role-permissions",
        action: "write",
      },
    ],
  },
  {
    label: t("routes.master.hrms.hrms"),
    icon: "pi pi-id-card",
    permissionKey: "hrms",
    children: [
      {
        label: t("routes.master.hrms.employee-details"),
        path: hrmsUrls.employeeDetails.root,
        feature: "@hrms/employee-details",
        action: "write",
      },
    ],
  },
  {
    label: "Title Section",
    icon: "pi pi-book",
    children: [
      {
        label: "Title Received (RSK / CPI)",
        path: "/distribution/title-received",
        feature: "@distribution/title-received",
        action: "read",
      },
      {
        label: "Title Approval",
        path: "/distribution/title-approval",
        feature: "@distribution/title-approval",
        action: "read",
      },
      {
        label: "Title Master",
        path: masterUrls.title.root,
        feature: "@master/title",
        action: "read",
      },
    ],
  },
  {
    label: "Printer Section",
    // label: t("routes.printing.printing"),
    icon: "pi pi-print",
    permissionKey: "printer-section",
    children: [
      {
        label: t("routes.printing.printer-registration"),
        path: "/printing/printer-registration",
      },
    ],
  },
  {
    label: "Depot Section",
    icon: "pi pi-home",
    permissionKey: "depot-section",
    children: [
      {
        label: "Depot Registration",
        path: "/mptbc/depot-registration",
      },
    ],
  },
  {
    label: "District Depot",
    icon: "pi pi-building",
    permissionKey: "district-depot-section",
    children: [
      {
        label: "Dashboard",
        path: "/district-depot/dashboard",
      },
      {
        label: "Printer Section",
        children: [
          {
            label: "Printer Assigned Demand",
            path: "/district-depot/printer/assigned-demand",
          },
          {
            label: "Challan Received",
            path: "/district-depot/printer/challan-received",
          },
        ],
      },
      {
        label: "Distribution till Block",
        children: [
          {
            label: "Challan to Block",
            path: "/district-depot/dispatch/challan-to-block",
          },
          {
            label: "Dispatch History",
            path: "/district-depot/dispatch/history",
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
      },
      {
        label: "Vehicle Management",
        path: "/district-depot/transport/vehicles",
      },
      {
        label: "Fuel Log",
        path: "/district-depot/transport/fuel-log",
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
      },
      {
        label: t("routes.distribution.dashboard"),
        path: "/distribution/dashboard",
        feature: "@distribution/dashboard",
        action: "read",
      },
      {
        label: t("routes.distribution.demand-approval"),
        path: "/distribution/demand-approval",
        feature: "@distribution/demand-approval",
        action: "read",
      },
    ],
  },
  {
    label: t("routes.paper-section"),
    icon: "pi pi-copy",
    permissionKey: "paper-section",
    children: [
      {
        label: t("routes.book-paper-requirement"),
        path: bookPaperRequirementUrls.root,
        feature: "@master/book-paper-requirement",
        action: "write",
      },
      {
        label: "GSM Wise Paper Demand Report",
        path: "/paper/gsm-demand-report",
        feature: "@paper/gsm-demand-report",
        action: "read",
      },
    ],
  },
  {
    label: t("routes.reports.reports"),
    icon: "pi pi-chart-bar",
    permissionKey: "reports",
    children: [
      {
        label: t("routes.reports.depot-wise-district-textbook-supply-status"),
        path: "/reports/depot-wise-district-textbook-supply-status",
      },
      {
        label: t("routes.reports.agency-wise-demand"),
        path: "/reports/agency-wise-demand",
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
  {
    label: "Transport",
    icon: "pi pi-car",
    path: "/transport",
    permissionKey: "transport",
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
    path: "/paper-receiving",
    permissionKey: "paper-receiving",
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
];

export function useMenu() {
  const { authenticated, user, permissions } = useAuth();
  const { t } = useTranslation();

  return useMemo(() => {
    if (!authenticated) return [];

    const role = user?.role || "";
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
    return filterMenu(menuConfig);
  }, [authenticated, user, permissions, t]);
}
