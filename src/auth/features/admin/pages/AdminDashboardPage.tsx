import React from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { AdminKpiBanner } from "../components/AdminKpiBanner";
import { AdminSupplyChainTracker } from "../components/AdminSupplyChainTracker";
import { AdminActionCenter } from "../components/AdminActionCenter";
import { AdminAnalyticsGrid } from "../components/AdminAnalyticsGrid";
import { AdminModuleQuickJump } from "../components/AdminModuleQuickJump";
import { AdminActivityTrail } from "../components/AdminActivityTrail";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";

export const AdminDashboardPage: React.FC = () => {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = React.useState("2026-2027");

  return (
    <Page
      header={pageTitle || "Admin Dashboard"}
      subHeader="Unified executive command center synthesizing paper procurement, central stock, press printing, district depot operations, and state textbook distribution."
      showHeaderActions
    >
      {/* Academic Year Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        subtitle={`Operational statistics for session ${academicYear}.`}
      />

      <div className="space-y-2">
        {/* 1. 5-Pillar Summary KPI Banner */}
        <AdminKpiBanner academicYear={academicYear} />

        {/* 2. End-to-End Supply Chain Lifecycle Tracker */}
        <AdminSupplyChainTracker />

        {/* 3 & 4. Zone Progress Chart & Fulfillment Mix Donut */}
        <AdminAnalyticsGrid />

        {/* 5. System Executive Action Center (Consolidated Alerts) */}
        <AdminActionCenter />

        {/* 6. Sub-Dashboard Operational Summaries (5 Quick Jump Cards) */}
        <AdminModuleQuickJump />

        {/* 7. Unified Cross-Module Audit & Activity Trail */}
        <AdminActivityTrail />
      </div>
    </Page>
  );
};

export default AdminDashboardPage;
