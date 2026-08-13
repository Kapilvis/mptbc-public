import { masterUrls } from "auth/features/master/urls";
import { userManagementUrls } from "auth/features/user-management/urls";
import { hrmsUrls } from "auth/features/hrms/urls";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider";
import { hasPermission } from "../shared/utils/permissionCheck";

// export const menuConfig: Menu.MenuItem[] = [
export const getMenuConfig = (t: (key: string) => string): Menu.MenuItem[] => [
  {
    label: "Home",
    icon: "pi pi-home",
    path: "/home",
  },
  {
    label: "Profile",
    icon: "pi pi-user",
    path: "/profile",
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
            label: t("routes.master.location.project"),
            path: masterUrls.project.root,
            feature: "@master/project",
            action: "write",
          },
          {
            label: t("routes.master.location.sector"),
            path: masterUrls.sector.root,
            feature: "@master/sector",
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
          {
            label: t("routes.master.curriculum.gsm"),
            path: masterUrls.gsm.root,
            feature: "@master/gsm",
            action: "write",
          },
          {
            label: t("routes.master.curriculum.title"),
            path: masterUrls.title.root,
            feature: "@master/title",
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
    label: "Printer Section",
    icon: "pi pi-print",
    children: [
      {
        label: "Printer Registration",
        path: "/printing/printer-registration",
      },
    ],
  },
];

export function useMenu() {
  const { authenticated, permissions } = useAuth();
  const { t } = useTranslation();

  return useMemo(() => {
    if (!authenticated) return [];

    const filterMenu = (items: Menu.MenuItem[]): Menu.MenuItem[] => {
      return (
        items
          .filter((item) => {
            // If the item requires a permission, check it
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

    //   return filterMenu(menuConfig);
    // }, [authenticated, permissions]);
    const menuConfig = getMenuConfig(t);
    return filterMenu(menuConfig);
  }, [authenticated, permissions, t]);
}
