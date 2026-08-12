declare namespace Menu {
  interface MenuItem {
    label: string;
    icon?: string;
    path?: string;
    children?: MenuItem[];
    expanded?: boolean;
    isActive?: boolean;
    section?: string;
    feature?: Permission.Feature;
    action?: Permission.Action;
  }
}
