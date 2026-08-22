import React from "react";
import { useNavigate } from "react-router-dom";
import { SUB_PORTAL_SUMMARIES } from "../data/adminDashboardData";

export const AdminModuleQuickJump: React.FC = () => {
  const navigate = useNavigate();

  const portalThemes: Record<
    string,
    { bgColor: string; borderColor: string; btnHoverBg: string }
  > = {
    "paper-vendor": {
      bgColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      btnHoverBg: "#059669",
    },
    "central-depot": {
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      btnHoverBg: "#d97706",
    },
    "printer-section": {
      bgColor: "#eff6ff",
      borderColor: "#bfdbfe",
      btnHoverBg: "#2563eb",
    },
    "district-depot": {
      bgColor: "#f5f3ff",
      borderColor: "#ddd6fe",
      btnHoverBg: "#7c3aed",
    },
    distribution: {
      bgColor: "#f0f9ff",
      borderColor: "#bae6fd",
      btnHoverBg: "#0284c7",
    },
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            Sub-Dashboard Operational Summaries
          </h3>
        </div>
      </div>

      {/* Grid of 5 Sub-Portal Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {SUB_PORTAL_SUMMARIES.map((portal) => {
          const theme = portalThemes[portal.id] || portalThemes["paper-vendor"];

          return (
            <div
              key={portal.id}
              className="flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              style={{
                backgroundColor: theme.bgColor,
                border: `1.5px solid ${theme.borderColor}`,
              }}
            >
              <div>
                {/* Top Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                    {portal.subtitle}
                  </span>
                  <span
                    className="rounded-lg border px-2 py-0.5 text-[10.5px] font-extrabold shadow-2xs"
                    style={{
                      borderColor: `${portal.accentColor}40`,
                      color: portal.accentColor,
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {portal.badge}
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-900 mb-2">
                  {portal.title}
                </h4>

                {/* Stats List */}
                <div className="space-y-1.5 border-t border-slate-200/60 pt-2">
                  {portal.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-600 font-medium">
                        {stat.label}
                      </span>
                      <span
                        className={`font-bold ${
                          stat.isDanger
                            ? "text-rose-700"
                            : stat.isHighlight
                              ? "text-slate-950 font-black"
                              : "text-slate-800"
                        }`}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jump Button */}
              <button
                type="button"
                onClick={() => navigate(portal.route)}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-bold text-slate-800 transition-all duration-200 hover:text-white shadow-2xs hover:shadow-md"
                style={{
                  color: portal.accentColor,
                  borderColor: portal.accentColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.btnHoverBg;
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.color = portal.accentColor;
                }}
              >
                <span>View Details</span>
                <i
                  className="pi pi-external-link text-[11px]"
                  aria-hidden="true"
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminModuleQuickJump;
