import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { Card, GridPanel } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { Button } from "shared/components/buttons";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import { usePageTitle } from "shared/hooks/usePageTitle";

import {
  initialPrinterRegistrationListData,
  getPrinterMockDetails,
} from "../data";

import "./List.css";

// Floating custom Actions Menu component to handle row operations neatly
interface ActionsMenuProps {
  item: Printer.ListItem;
  onView: (item: Printer.ListItem) => void;
  onEdit: (item: Printer.ListItem) => void;
  onDelete: (item: Printer.ListItem) => void;
}

function ActionsMenu({ item, onView, onEdit, onDelete }: ActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 focus:outline-none transition-colors border border-transparent hover:border-slate-200"
        title="Actions"
      >
        <i className="pi pi-ellipsis-v text-sm" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-sm">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onView(item);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 text-slate-700 flex items-center gap-2 transition-colors"
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
            className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 text-slate-700 flex items-center gap-2 transition-colors"
          >
            <i className="pi pi-pencil text-slate-400 text-[10px]" />
            <span>Edit</span>
          </button>
          <div className="border-t border-slate-100 my-1"></div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete(item);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-rose-100 text-rose-700 flex items-center gap-2 transition-colors font-semibold"
          >
            <i className="pi pi-trash text-rose-500 text-[10px]" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Custom Status Badge renderer
interface StatusBadgeProps {
  status: Printer.ListItem["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeClasses = (s: StatusBadgeProps["status"]) => {
    switch (s) {
      case "Draft":
        return "bg-slate-50 text-slate-600 border-slate-200/80";
      case "Pending":
        return "bg-amber-50/60 text-amber-700 border-amber-200/60";
      case "Verified":
        return "bg-blue-50/60 text-blue-700 border-blue-200/60";
      case "Approved":
        return "bg-emerald-50/60 text-emerald-700 border-emerald-200/60";
      case "Rejected":
        return "bg-rose-50/60 text-rose-700 border-rose-200/60";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${getBadgeClasses(
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

  // State Management
  const [printers, setPrinters] = useState<Printer.ListItem[]>(
    initialPrinterRegistrationListData,
  );
  const [viewingItem, setViewingItem] = useState<Printer.ListItem | null>(null);

  // Client side filtering logic
  const filteredPrinters = useMemo(() => {
    return printers;
  }, [printers]);

  // Operations actions handlers
  const handleView = (item: Printer.ListItem) => {
    setViewingItem(item);
  };

  const handleEdit = (item: Printer.ListItem) => {
    navigate(`./edit/${item.printerCode}`);
  };

  const handleDelete = (item: Printer.ListItem) => {
    confirmAction({
      message: `Are you sure you want to delete the printer registration for ${item.printerName} (${item.printerCode})?`,
      header: "Delete Confirmation",
      icon: "trash",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      onAccept: async () => {
        setPrinters((prev) =>
          prev.filter((p) => p.printerCode !== item.printerCode),
        );
        ToastService.success("Printer registration deleted successfully.");
      },
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <Page
      header={pageTitle || "Printer Registration"}
      subHeader="Manage textbook printing press registration profiles, technical capability verification, and empanelments."
      showHeaderActions
    >
      <ConfirmDialog />

      <div className="printer-registration-list-page">
        {/* Top filter toolbar section */}

        <Card>
          <GridPanel
            toolbarPlacement="page"
            data={filteredPrinters}
            loading={false}
            searchBox={false}
            toolbar={
              <Button
                label="Add"
                icon="plus"
                onClick={() => navigate("./create")}
                variant="primary"
                className="shadow-sm font-bold text-sm"
              />
            }
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-slate-600 font-medium">
                    {option.rowIndex + 1}
                  </span>
                ),
                width: "60px",
                align: "center",
                header: "S.No.",
              },
              {
                field: "printerCode",
                header: "Printer Code",
                align: "left",
                width: "120px",
              },
              {
                field: "printerName",
                header: "Printer/Press Name",
                sortable: true,
              },
              { field: "firmRegistrationNo", header: "Firm Reg No." },
              {
                field: "category",
                header: "Printer Category",
                align: "left",
              },
              {
                field: "district",
                header: "District",
                align: "left",
                sortable: true,
              },
              { field: "authorizedPerson", header: "Authorized Person" },
              { field: "mobile", header: "Mobile Number", align: "center" },
              {
                field: "totalMachines",
                header: "Total Machines",
                align: "center",
                width: "110px",
              },
              {
                field: "createdDate",
                header: "Created Date",
                align: "center",
                sortable: true,
                cell: (item: Printer.ListItem) => formatDate(item.createdDate),
              },
              {
                header: "Actions",
                align: "center",
                width: "80px",
                cell: (item: Printer.ListItem) => (
                  <ActionsMenu
                    item={item}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ),
              },
            ]}
            renderContent={(item: Printer.ListItem) => (
              <div className="flex flex-col p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative h-full">
                {/* Actions top right */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <ActionsMenu
                    item={item}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>

                {/* Printer Code Subheader */}
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-500 mb-1">
                  {item.printerCode}
                </span>

                {/* Press Name */}
                <h3 className="font-bold text-sm text-slate-800 line-clamp-1 mb-4 pr-16">
                  {item.printerName}
                </h3>

                {/* Specifications List */}
                <div className="w-full space-y-2 text-left text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">District</span>
                    <span className="font-semibold text-slate-800">
                      {item.district}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">
                      Representative
                    </span>
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {item.authorizedPerson}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Mobile</span>
                    <span className="font-semibold text-slate-800">
                      {item.mobile}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">
                      Total Machines
                    </span>
                    <span className="font-semibold text-slate-800">
                      {item.totalMachines} units
                    </span>
                  </div>
                </div>
              </div>
            )}
          />
        </Card>
      </div>

      {viewingItem &&
        (() => {
          const details = getPrinterMockDetails(undefined, viewingItem);
          return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-999 p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                      {details.printerType} • {viewingItem.printerCode}
                    </span>
                    <h2 className="font-bold text-base text-slate-800 mt-0.5">
                      {details.printerName}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewingItem(null)}
                    className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <i className="pi pi-times text-sm" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Section 1: Firm Profile & Contacts */}
                  <div>
                    <div className="border-l-4 border-green-600 pl-2 mb-3">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Firm & Authorized Representative Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          Registration No.
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.firmRegistrationNo}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          GSTIN Number
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.gstinNo}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          PAN Number
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.panNo}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          Firm Owner
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.ownerName}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          Authorized Signatory
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.authPersonName}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          Designation
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.designation}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          Mobile Number
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.mobileNo}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          Email Address
                        </span>
                        <span className="font-semibold text-slate-800 break-all">
                          {details.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Address Geography */}
                  <div>
                    <div className="border-l-4 border-green-600 pl-2 mb-3">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Registered Address & Geography
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="col-span-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          Address Line 1
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.addressLine1}
                        </span>
                      </div>
                      <div className="col-span-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          Address Line 2
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.addressLine2 || "—"}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          State
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.state}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          District
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.district}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          City / Town
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.city}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block mb-0.5">
                          PIN Code
                        </span>
                        <span className="font-semibold text-slate-800">
                          {details.pinCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Machine Lists */}
                  <div>
                    <div className="border-l-4 border-green-600 pl-2 mb-3">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Machine & Equipment Infrastructure
                      </h3>
                    </div>
                    <div className="border border-slate-100 rounded-xl overflow-hidden text-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <th className="p-3">S.No.</th>
                            <th className="p-3">Machine Type</th>
                            <th className="p-3">Specs (Size / Cutoff)</th>
                            <th className="p-3">Year / Age</th>
                            <th className="p-3">Color Config</th>
                            <th className="p-3 text-right">SID Capacity</th>
                            <th className="p-3">CPC / Automatic</th>
                            <th className="p-3">Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          {details.machines.map((mach, i) => (
                            <tr
                              key={mach.id}
                              className="border-b border-slate-100 hover:bg-slate-50/50 text-slate-700"
                            >
                              <td className="p-3 font-semibold text-slate-400">
                                {i + 1}
                              </td>
                              <td className="p-3 font-medium">
                                {mach.machineType === "sheetfed"
                                  ? "Sheetfed Offset"
                                  : "Web Offset"}
                              </td>
                              <td className="p-3 font-mono">
                                {mach.machineType === "sheetfed"
                                  ? mach.size
                                  : mach.cutoff}
                              </td>
                              <td className="p-3">
                                {mach.yearOfManufacture} ({mach.ageOfMachine}{" "}
                                yrs)
                              </td>
                              <td className="p-3 capitalize">
                                {mach.colorConfiguration}
                              </td>
                              <td className="p-3 text-right font-medium">
                                {mach.sidCapacity120Days.toLocaleString()}
                              </td>
                              <td className="p-3 capitalize">
                                {mach.cpcAutomatic || "—"}
                              </td>
                              <td className="p-3 text-slate-500 italic">
                                {mach.remark || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <Button
                    type="button"
                    label="Close Details"
                    variant="outlined"
                    onClick={() => setViewingItem(null)}
                    className="font-bold text-sm"
                  />
                </div>
              </div>
            </div>
          );
        })()}
    </Page>
  );
}
