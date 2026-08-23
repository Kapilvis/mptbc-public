/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import Page from "shared/components/panels/Page";

import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";

import {
  DemandKpiCard,
  PaperAnalysisKpiCard,
  PrinterProfileKpiCard,
  CentralDepotKpiCard,
  PrintingProgressKpiCard,
  DistributionKpiCard,
  BillAndPaymentKpiCard,
  GrievanceKpiCard,
  FinanceKpiCard,
  HrmsKpiCard,
  LegalKpiCard,
} from "../components/kpi-cards/DashboardKpiCards";
import { PrintingProgressModal } from "../components/modals/PrintingProgressModal";
import { BillPaymentPaperModal } from "../components/modals/BillPaymentPaperModal";
import { BillPaymentPrinterModal } from "../components/modals/BillPaymentPrinterModal";
import { PrinterProfileModal } from "../components/modals/PrinterProfileModal";
import { mockDashboardData } from "../data/mockKpiData";

export const AdminDashboardPage: React.FC = () => {
  const [academicYear, setAcademicYear] = React.useState("2026-2027");

  // Modal states
  const [isPrintingProgressOpen, setPrintingProgressOpen] = useState(false);
  const [isBillPaperOpen, setBillPaperOpen] = useState(false);
  const [isBillPrinterOpen, setBillPrinterOpen] = useState(false);
  const [isPrinterProfileOpen, setPrinterProfileOpen] = useState(false);

  // Format last updated date
  const lastUpdated = new Date(mockDashboardData.lastUpdated).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <Page>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-[26px] font-bold text-slate-800 leading-tight mb-1">Progress At A Glance</h1>
        </div>
        <div className="text-[12px] font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
          Last updated: <span className="text-slate-800">{lastUpdated}</span>
        </div>
      </div>

      {/* Academic Year Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        subtitle=""
      />

      <div className="space-y-4">


        {/* 11 KPI Modules Grid (12-column layout) */}
        <div className="grid grid-cols-12 gap-4">

          {/* Row 1 */}
          <div className="col-span-12 xl:col-span-9">
            <DemandKpiCard />
          </div>
          <div className="col-span-12 xl:col-span-3">
            <PaperAnalysisKpiCard />
          </div>

          {/* Row 2 */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <PrinterProfileKpiCard
              onOpenModal={() => setPrinterProfileOpen(true)}
            />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <CentralDepotKpiCard />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <PrintingProgressKpiCard
              onOpenModal={() => setPrintingProgressOpen(true)}
            />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <DistributionKpiCard />
          </div>

          {/* Row 3 */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <BillAndPaymentKpiCard
              onOpenPaperModal={() => setBillPaperOpen(true)}
              onOpenPrinterModal={() => setBillPrinterOpen(true)}
            />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-2">
            <GrievanceKpiCard />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-2">
            <FinanceKpiCard />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-2">
            <HrmsKpiCard />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <LegalKpiCard />
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrintingProgressModal
        visible={isPrintingProgressOpen}
        onHide={() => setPrintingProgressOpen(false)}
      />
      <BillPaymentPaperModal
        visible={isBillPaperOpen}
        onHide={() => setBillPaperOpen(false)}
      />
      <BillPaymentPrinterModal
        visible={isBillPrinterOpen}
        onHide={() => setBillPrinterOpen(false)}
      />
      <PrinterProfileModal
        visible={isPrinterProfileOpen}
        onHide={() => setPrinterProfileOpen(false)}
      />
    </Page>
  );
};

export default AdminDashboardPage;
