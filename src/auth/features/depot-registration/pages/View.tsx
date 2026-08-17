import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { useDepotRegistrationQuery } from "../data";

export default function View() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const { data: details, isLoading } = useDepotRegistrationQuery(Number(id));

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="outlined"
      onClick={() => navigate("/mptbc/depot-registration")}
      className="font-bold text-xs border-slate-300 hover:bg-slate-50"
    />
  );

  return (
    <Page
      header="Depot Profile Details"
      subHeader="Read-only view of government warehouse registry configuration."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}

      {isLoading ? (
        <Card className="p-12 border border-slate-100 flex items-center justify-center">
          <i className="pi pi-spin pi-spinner text-3xl text-indigo-600" />
          <span className="ml-3 text-sm text-slate-500 font-semibold">
            Loading depot details...
          </span>
        </Card>
      ) : details ? (
        <div className="space-y-6">
          {/* Header Card with Basic Info & Status */}
          <Card className="p-6 border border-slate-100 shadow-sm bg-gradient-to-r from-slate-50 to-indigo-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  Depot Registration ID: #{details.depotRegistrationId}
                </span>
                <h2 className="font-bold text-lg text-slate-800 mt-1">
                  {details.dptName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    details.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                      : "bg-rose-50 text-rose-700 border-rose-200/80"
                  }`}
                >
                  {details.isActive ? "Active" : "Inactive"}
                </span>
                <Button
                  label="Edit Profile"
                  icon="pencil"
                  variant="primary"
                  onClick={() =>
                    navigate(
                      `/mptbc/depot-registration/${details.depotRegistrationId}/edit`,
                    )
                  }
                  className="font-bold text-xs shadow-xs"
                />
              </div>
            </div>
          </Card>

          {/* Detailed Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Depot Information Card */}
            <Card className="p-5 border border-slate-100 shadow-xs">
              <div className="border-l-4 border-indigo-600 pl-3 mb-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Depot Information
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">DPT Name</span>
                  <span className="font-bold text-slate-800">
                    {details.dptName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">
                    Parent Depot
                  </span>
                  <span className="font-bold text-slate-800">
                    {details.depotName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Sub DPT</span>
                  <span className="font-bold text-slate-800">
                    {details.subDepotName || (
                      <span className="text-slate-300 font-normal">N/A</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">District</span>
                  <span className="font-bold text-slate-800">
                    {details.districtName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">Depot Type</span>
                  <span className="font-bold text-slate-800">
                    {details.type === "SubDepot" ? "Sub Depot" : details.type}
                  </span>
                </div>
              </div>
            </Card>

            {/* 2. Contact Information Card */}
            <Card className="p-5 border border-slate-100 shadow-xs">
              <div className="border-l-4 border-indigo-600 pl-3 mb-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contact & Incharge Information
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">
                    Incharge Name
                  </span>
                  <span className="font-bold text-slate-800">
                    {details.incharge}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">
                    Mobile Number
                  </span>
                  <span className="font-bold text-slate-800">
                    {details.mobile}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">
                    Email Address
                  </span>
                  <span className="font-bold text-slate-800 break-all">
                    {details.email || (
                      <span className="text-slate-300 font-normal">—</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Created On</span>
                  <span className="font-bold text-slate-800">
                    {details.createdOn
                      ? new Date(details.createdOn).toLocaleString()
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">
                    Last Modified On
                  </span>
                  <span className="font-bold text-slate-800">
                    {details.modifiedOn
                      ? new Date(details.modifiedOn).toLocaleString()
                      : "—"}
                  </span>
                </div>
              </div>
            </Card>

            {/* 3. Address details Card */}
            <Card className="p-5 border border-slate-100 shadow-xs md:col-span-2">
              <div className="border-l-4 border-indigo-600 pl-3 mb-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Address Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block mb-1">
                    Full Address
                  </span>
                  <p className="font-semibold text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {details.address}
                  </p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
                  <span className="text-slate-400 block mb-1">PIN Code</span>
                  <span className="font-mono font-bold text-base text-slate-800 tracking-wider">
                    {details.pin}
                  </span>
                </div>
              </div>
            </Card>

            {/* 4. Storage & Capacity Card */}
            <Card className="p-5 border border-slate-100 shadow-xs md:col-span-2">
              <div className="border-l-4 border-indigo-600 pl-3 mb-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Storage & Capacity
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block mb-0.5">
                      Storage Capacity
                    </span>
                    <span className="text-slate-500 font-normal">
                      (Books count / Metric Tonnes)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-base text-indigo-600">
                    {details.capacity ? details.capacity.toLocaleString() : "0"}
                  </span>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block mb-0.5">
                      Storage Rooms
                    </span>
                    <span className="text-slate-500 font-normal">
                      (Number of Godowns)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-base text-indigo-600">
                    {details.godowns !== undefined && details.godowns !== null
                      ? details.godowns
                      : "0"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center text-slate-400 font-medium">
          Depot Profile details not found.
        </Card>
      )}
    </Page>
  );
}
