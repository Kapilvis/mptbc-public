import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Button } from "shared/components/buttons";
import type { PrinterQualityInspection } from "../data";
import { initialInspections } from "../data";
import ViewReport from "../components/ViewReport";
import { GridPanel } from "shared/components/panels";

// Custom row Action Menu
interface ActionsMenuProps {
  item: PrinterQualityInspection;
  onView: (item: PrinterQualityInspection) => void;
  onEdit: (item: PrinterQualityInspection) => void;
  onDelete: (item: PrinterQualityInspection) => void;
}

function ActionsMenu({ item, onView, onEdit, onDelete }: ActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 160;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow < menuHeight ? rect.top - menuHeight : rect.bottom + 4;
      setMenuStyle({ top, right: window.innerWidth - rect.right });
    }
    setIsOpen((prev) => !prev);
  };

  const dropdown = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: menuStyle.top,
            right: menuStyle.right,
            zIndex: 9999,
          }}
          className="w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 text-xs"
        >
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onView(item);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-colors"
          >
            <i className="pi pi-eye text-slate-400 text-[10px]" />
            <span>View Details</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit(item);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-colors"
          >
            <i className="pi pi-pencil text-slate-400 text-[10px]" />
            <span>Edit Inspection</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onView(item);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-colors"
          >
            <i className="pi pi-print text-slate-400 text-[10px]" />
            <span>Print Report</span>
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete(item);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-700 flex items-center gap-2 transition-colors font-semibold"
          >
            <i className="pi pi-trash text-rose-500 text-[10px]" />
            <span>Delete</span>
          </button>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 focus:outline-none transition-colors border border-transparent hover:border-slate-200"
        title="Actions"
      >
        <i className="pi pi-ellipsis-v text-xs" />
      </button>
      {dropdown}
    </div>
  );
}

// Custom Status Badge
function StatusBadge({ status }: { status: string }) {
  const getBadgeClasses = (s: string) => {
    switch (s) {
      case "Passed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wider uppercase ${getBadgeClasses(
        status,
      )}`}
    >
      {status}
    </span>
  );
}

export default function List() {
  const navigate = useNavigate();
  const pageTitle = usePageTitle();
  const { confirmAction } = useConfirmDialog();

  // Load from sessionStorage if available to persist between page navigations
  const [inspections, setInspections] = useState<PrinterQualityInspection[]>(
    () => {
      try {
        const saved = sessionStorage.getItem("mptbc_inspections");
        if (saved && saved !== "undefined") {
          const parsed = JSON.parse(saved);
          // Check if parsed records are in the new parent-child model and contains the new 10-item mock records dataset
          if (
            parsed &&
            parsed.length > 0 &&
            Array.isArray(parsed[0].items) &&
            parsed.some(
              (p: PrinterQualityInspection) => p.inspectionId === "INSP-010",
            )
          ) {
            return parsed;
          }
        }
      } catch (e) {
        console.error(
          "Error parsing mptbc_inspections from sessionStorage:",
          e,
        );
      }
      return initialInspections;
    },
  );

  useEffect(() => {
    sessionStorage.setItem("mptbc_inspections", JSON.stringify(inspections));
  }, [inspections]);

  // Viewing detail report modal state
  const [viewingItem, setViewingItem] =
    useState<PrinterQualityInspection | null>(null);

  // Actions
  const handleView = (item: PrinterQualityInspection) => {
    setViewingItem(item);
  };

  const handleEdit = (item: PrinterQualityInspection) => {
    navigate(`./edit/${item.inspectionId}`);
  };

  const handleDelete = (item: PrinterQualityInspection) => {
    confirmAction({
      header: "Delete Confirmation",
      message: `Are you sure you want to delete inspection report for ${item.printerName} dated ${item.inspectionDate}?`,
      icon: "trash",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      onAccept: () => {
        setInspections((prev) =>
          prev.filter((i) => i.inspectionId !== item.inspectionId),
        );
        ToastService.success("Inspection report deleted successfully.");
      },
    });
  };

  return (
    <Page
      header={pageTitle || "Printer Quality Inspection"}
      subHeader="Record and evaluate printing quality for allotted textbook titles"
      showHeaderActions
    >
      <ConfirmDialog />

      {/* ─── GRID / DATA TABLE SECTION ──────────────────────────────────── */}
      <Card className="border border-slate-100 min-h-75">
        <GridPanel
          toolbarPlacement="page"
          toolbar={
            <Button
              label="Add"
              icon="plus"
              onClick={() => navigate("./create")}
              variant="primary"
              className="shadow-sm font-bold text-xs"
            />
          }
          data={inspections}
          columns={[
            {
              cell: (_, option) => (
                <span className="text-slate-600 font-medium">
                  {option.rowIndex + 1}
                </span>
              ),
              width: "50px",
              align: "center",
              header: "No.",
            },
            {
              field: "printerName",
              header: "Printer Name",
              sortable: true,
              width: "200px",
            },
            {
              field: "academicYear",
              header: "Academic Year",
              align: "center",
              width: "120px",
            },
            {
              field: "inspectionDate",
              header: "Inspection Date",
              align: "center",
              sortable: true,
              width: "120px",
              cell: (item: PrinterQualityInspection) => {
                const date = new Date(item.inspectionDate);
                return isNaN(date.getTime())
                  ? item.inspectionDate
                  : date.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
              },
            },
            {
              header: "Titles Inspected",
              align: "center",
              width: "130px",
              cell: (item: PrinterQualityInspection) =>
                `${item.items?.length || 0} Titles`,
            },
            {
              field: "totalScore",
              header: "Total Score",
              align: "center",
              width: "130px",
              cell: (item: PrinterQualityInspection) =>
                `${item.totalScore} / ${item.maximumScore}`,
            },
            {
              field: "percentage",
              header: "Percentage",
              align: "right",
              width: "100px",
              cell: (item: PrinterQualityInspection) => `${item.percentage}%`,
            },
            {
              field: "grade",
              header: "Grade",
              align: "center",
              width: "120px",
            },
            {
              field: "status",
              header: "Status",
              align: "center",
              width: "100px",
              cell: (item: PrinterQualityInspection) => (
                <StatusBadge status={item.status} />
              ),
            },
            {
              header: "Actions",
              align: "center",
              width: "80px",
              cell: (item: PrinterQualityInspection) => (
                <ActionsMenu
                  item={item}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* ─── DETAILED VIEW REPORT MODAL ──────────────────────────────────── */}
      {viewingItem && (
        <ViewReport
          inspection={viewingItem}
          visible={!!viewingItem}
          onHide={() => setViewingItem(null)}
        />
      )}
    </Page>
  );
}
