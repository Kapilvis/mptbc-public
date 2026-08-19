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
    label: t("routes.home"),
    icon: "pi pi-home",
    path: "/home",
    permissionKey: "dashboard",
  },
  {
    label: t("routes.dashboard"),
    icon: "pi pi-th-large",
    path: "",
    permissionKey: "dashboard",
  },
  {
    label: t("routes.profile"),
    icon: "pi pi-user",
    path: "/profile",
    permissionKey: "profile",
  },
  {
    label: t("routes.master-title"),
    icon: "pi pi-database",
    section: t("routes.configuration"),
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
    section: "Configuration",
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
    section: "Configuration",
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
  /* ─── 1. DISTRIBUTION SECTION ─── */
  {
    label: t("routes.distribution-section"),
    icon: "pi pi-truck",
    section: t("routes.modules"),
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
        label: t("routes.distribution.printer-demand-mapping"),
        path: "/distribution/printer-demand-mapping",
        permissionKey: "distribution-section/printer-demand-mapping",
      },
      {
        label: t("routes.paper-distribution"),
        path: "/distribution/new",
        permissionKey: "paper-distribution",
      },
      // {
      //   label: t("routes.distribution-history"),
      //   path: "/distribution/history",
      //   permissionKey: "distribution-history",
      // },
    ],
  },

  /* ─── 2. CONTENT MANAGEMENT ─── */
  {
    label: t("routes.content-management"),
    icon: "pi pi-book",
    children: [
      {
        label: t("routes.title-received"),
        path: "/distribution/title-received",
        feature: "@distribution/title-received",
        action: "read",
        permissionKey: "title-section/title-received",
      },
      {
        label: t("routes.title-approval"),
        path: "/distribution/title-approval",
        feature: "@distribution/title-approval",
        action: "read",
        permissionKey: "title-section/title-approval",
      },
      {
        label: t("routes.approved-title-list"),
        path: masterUrls.title.root,
        feature: "@master/title",
        action: "read",
        permissionKey: "title-section/title-master",
      },
    ],
  },

  /* ─── 3. PAPER SECTION ─── */
  {
    label: t("routes.paper-section"),
    icon: "pi pi-copy",
    permissionKey: "paper-section",
    children: [
      {
        label: t("routes.paper-section-dashboard"),
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
        label: t("routes.gsm-wise-paper-demand-report"),
        path: "/paper/gsm-demand-report",
        feature: "@paper/gsm-demand-report",
        action: "read",
        permissionKey: "paper-section/gsm-demand-report",
      },
      {
        label: t("routes.paper-tender"),
        path: "/paper/paper-tender-raise",
        feature: "@paper/paper-tender-raise",
        action: "read",
        permissionKey: "paper-section/paper-tender",
      },
      {
        label: t("routes.paper-vendor-profile"),
        path: "/paper/paper-vendor-profile",
        feature: "@paper/paper-vendor-profile",
        action: "read",
        permissionKey: "paper-section/paper-vendor-profile",
      },
      {
        label: t("routes.paper-vendor-order-details"),
        path: "/paper/paper-order-allocation",
        feature: "@paper/paper-order-allocation",
        action: "read",
      },
      {
        label: t("routes.paper-stock"),
        path: "/paper/stock/main",
        permissionKey: "paper-stock",
      },
      {
        label: t("routes.stock-transactions"),
        path: "/paper/stock/transactions",
        permissionKey: "stock-transactions",
      },
      {
        label: t("routes.stock-ledger"),
        path: "/paper/stock/ledger",
        permissionKey: "stock-ledger",
      },
      {
        label: t("routes.paper-supply-dispatch"),
        path: "/paper/paper-supply-dispatch",
        feature: "@paper/paper-supply-dispatch",
        action: "read",
        permissionKey: "paper-section/paper-order-allocation",
      },
    ],
  },

  /* ─── 4. PRINTER SECTION ─── */
  {
    label: t("routes.printer-section"),
    icon: "pi pi-print",
    children: [
      {
        label: t("routes.printing.dashboard"),
        path: "/printing/dashboard",
        permissionKey: "printer-section/dashboard",
      },
      {
        label: t("routes.printing.printer-registration"),
        path: "/printing/printer-registration",
        permissionKey: "printer-section/printer-registration",
      },
      {
        label: t("routes.printer-orders"),
        path: "/printing/orders/list",
        permissionKey: "printer-orders",
      },
      // {
      //   label: t("routes.pending-orders"),
      //   path: "/printing/orders/pending",
      //   permissionKey: "pending-printer-orders",
      // },
      {
        label: t("routes.quality-inspection"),
        path: "/printing/quality-inspection",
        permissionKey: "printer-section/quality-inspection",
      },
    ],
  },

  /* ─── 5. DEPOT ─── */
  {
    label: t("routes.depot-section"),
    icon: "pi pi-home",
    children: [
      {
        label: t("routes.depot.central-depot-dashboard"),
        path: "/inventory/dashboard",
        permissionKey: "depot-section/central-depot-dashboard",
      },
      {
        label: t("routes.depot-registration"),
        path: "/mptbc/depot-registration",
        permissionKey: "depot-section/depot-registration",
      },
      {
        label: t("routes.printer-section"),
        children: [
          {
            label: t("routes.challan-received"),
            path: "/district-depot/printer/challan-received",
            permissionKey: "district-depot/challan-received",
          },
          {
            label: t("routes.printer-assigned-demand"),
            path: "/district-depot/printer/assigned-demand",
            permissionKey: "district-depot/printer-assigned-demand",
          },
        ],
      },
      {
        label: t("routes.distribution-till-block"),
        path: "/district-depot/dispatch/history",
        permissionKey: "district-depot/dispatch-history",
      },
    ],
  },

  /* ─── 6. TRANSPORTATION ─── */
  {
    label: t("routes.transportation"),
    icon: "pi pi-truck",
    permissionKey: "transportation",
    children: [
      {
        label: t("routes.tender-details"),
        path: "/transport/tender-details",
        permissionKey: "transport/tender-details",
      },
      {
        label: t("routes.work-order-allocation"),
        path: "/transport/work-order",
        permissionKey: "transport/work-order",
      },
      {
        label: t("routes.loading-dispatch"),
        path: "/transport/dispatch",
        permissionKey: "transport/dispatch",
      },
      {
        label: t("routes.live-delivery-tracking"),
        path: "/transport/tracking",
        permissionKey: "transport/tracking",
      },
      {
        label: t("routes.pod-submission"),
        path: "/transport/pod",
        permissionKey: "transport/pod",
      },
      {
        label: t("routes.transportation-analytics"),
        path: "/transport/reports",
        permissionKey: "transport/reports",
      },
    ],
  },

  /* ─── 7. REPORTS ─── */
  {
    label: t("routes.reports.reports"),
    icon: "pi pi-chart-bar",
    permissionKey: "reports",
    children: [
      {
        label: t("routes.block-wise-textbook-distribution-report"),
        path: "/reports/depot-block-title-supply",
        permissionKey: "reports/depot-block-title-supply",
      },
      {
        label: t("routes.depot-wise-textbook-supply-report"),
        path: "/reports/depot-wise-district-textbook-supply-status",
        permissionKey: "reports/depot-supply-status",
      },
      {
        label: t("routes.reports.agency-wise-demand"),
        path: "/reports/agency-wise-demand",
        permissionKey: "reports/agency-demand",
      },
      {
        label: t("routes.gsm-wise-stock-report"),
        path: "/reports/gsm-stock",
        permissionKey: "gsm-stock-report",
      },
      {
        label: t("routes.printer-wise-order-report"),
        path: "/reports/printer-orders",
        permissionKey: "printer-order-report",
      },
      {
        label: t("routes.printer-wise-supply-report"),
        path: "/reports/printer-supply",
        permissionKey: "printer-supply-report",
      },
      {
        label: t("routes.paper-distribution-report"),
        path: "/reports/distributions",
        permissionKey: "paper-distribution-report",
      },
    ],
  },

  /* ─── MISC / STANDALONE ─── */
  /* ─── DISTRICT DEPOT specific mock menus ─── */

  /* ─── PRINTER specific mock menus ─── */
  /* {
    label: "Tender",
    icon: "pi pi-file",
    path: "/tender",
    permissionKey: "tender",
  }, */
  /* {
    label: "Paper Receiving",
    icon: "pi pi-download",
    path: "/paper-receiving",
    permissionKey: "paper-receiving",
  }, */
  {
    label: t("routes.paper-receiving"),
    icon: "pi pi-download",
    path: "/paper/stock/receiving",
    permissionKey: "central-paper-receiving",
  },
  /* {
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
  }, */

  /* ─── PAPER VENDOR specific mock menus ─── */
  /* {
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
  }, */

  /* ─── DISTRIBUTION SECTION specific mock menus ─── */
  /* {
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
  }, */
  /* {
    label: "Distribution Tracking",
    icon: "pi pi-map",
    path: "/distribution-tracking",
    permissionKey: "distribution-tracking",
  }, */
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
        if (
          item.label === "Dashboard" ||
          item.label === t("routes.dashboard")
        ) {
          let dashboardPath = "";
          if (role === "CENTRAL_DEPOT") {
            dashboardPath = "/inventory/dashboard";
          } else if (role === "DISTRICT_DEPOT") {
            dashboardPath = "/district-depot/dashboard";
          } else if (role === "PRINTER") {
            dashboardPath = "/printing/dashboard";
          } else if (role === "DISTRIBUTION_SECTION") {
            dashboardPath = "/distribution/dashboard";
          } else if (role === "PAPER_VENDOR") {
            dashboardPath = "/paper/dashboard";
          } else if (role === "TBC_HEAD_OFFICE" || !role) {
            dashboardPath = "/admin/dashboard";
          }
          return { ...item, path: dashboardPath };
        }

        // For DISTRIBUTION_SECTION role, remove the duplicate child item under "Distribution Section" group so it doesn't double open
        if (
          role === "DISTRIBUTION_SECTION" &&
          (item.label === "Distribution Section" ||
            item.label === t("routes.distribution-section")) &&
          item.children
        ) {
          return {
            ...item,
            children: item.children.filter(
              (child) => child.path !== "/distribution/dashboard",
            ),
          };
        }

        // For PAPER_VENDOR role, remove the duplicate child item under "Paper Section" group so it doesn't double open
        if (
          role === "PAPER_VENDOR" &&
          (item.label === "Paper Section" ||
            item.label === t("routes.paper-section")) &&
          item.children
        ) {
          return {
            ...item,
            children: item.children.filter(
              (child) => child.path !== "/paper/dashboard",
            ),
          };
        }

        return item;
      })
      .filter((item) => {
        if (
          (item.label === "Dashboard" ||
            item.label === t("routes.dashboard")) &&
          !item.path
        ) {
          return false;
        }
        return true;
      });

    return mapped;
  }, [authenticated, user, permissions, t]);
}
