import React from "react";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import "./layout.css";

interface AppLayoutProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<AppLayoutProps> = ({ children }) => {
  const { isExpanded, isMobileOpen } = useSidebar();

  return (
    <div className="layout-wrapper">
      <AppSidebar />
      <Backdrop />

      {/* Main Content Wrapper - Now a floating card */}
      <div
        className={`layout-main-content ${isExpanded ? "layout-main-content-expanded" : "layout-main-content-collapsed"} ${isMobileOpen ? "layout-main-content-mobile-open" : ""}`}
      >
        <AppHeader />

        <main className="layout-page-content">{children}</main>

        <AppFooter />
      </div>
    </div>
  );
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
