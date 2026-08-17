import { useState } from "react";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { Loader } from "shared/components/progress";
import { Button } from "shared/components/buttons";
import {
  useTransportersEvaluationQuery,
  useVehiclesEvaluationQuery,
} from "../queries";
import EvaluationModal from "../components/EvaluationModal";

export default function List() {
  const [selectedTransporter, setSelectedTransporter] =
    useState<Transportation.TransporterRegistration | null>(null);

  const { data: transporters = [], isLoading: loadingTransporters } =
    useTransportersEvaluationQuery();
  const { data: vehicles = [], isLoading: loadingVehicles } =
    useVehiclesEvaluationQuery();

  if (loadingTransporters || loadingVehicles) {
    return <Loader />;
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Qualified":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "NotQualified":
        return "bg-rose-50 text-rose-600 border border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Qualified":
        return "Qualified";
      case "NotQualified":
        return "Disqualified";
      default:
        return "Pending Review";
    }
  };

  return (
    <Page
      header="Technical Bid Evaluation"
      subHeader="Review transporter profile documents, financial indicators, and fleet expiration statuses to approve or reject technical bidding eligibility."
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={transporters}
          searchFields={["registrationNo", "transporterName", "firmName"]}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "60px",
              align: "center",
              header: "S.No.",
            },
            {
              cell: (item: Transportation.TransporterRegistration) => (
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-800">
                    {item.transporterName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Reg No: {item.registrationNo}
                  </span>
                </div>
              ),
              header: "Transporter / Registration",
            },
            {
              field: "transporterType",
              header: "Transporter Type",
              width: "160px",
            },
            {
              cell: (item: Transportation.TransporterRegistration) => (
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-slate-700">
                    {item.ownerName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Mo: {item.mobile}
                  </span>
                </div>
              ),
              header: "Owner Contact",
            },
            {
              cell: (item: Transportation.TransporterRegistration) => (
                <span
                  className={`text-[11px] font-semibold ${
                    item.caCertificate ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {item.caCertificate ? "Uploaded" : "Not Found"}
                </span>
              ),
              header: "CA Certificate",
              width: "140px",
            },
            {
              cell: (item: Transportation.TransporterRegistration) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusClass(
                    item.technicalStatus,
                  )}`}
                >
                  {getStatusLabel(item.technicalStatus)}
                </span>
              ),
              header: "Evaluation Status",
              width: "160px",
            },
            {
              cell: (item: Transportation.TransporterRegistration) => (
                <Button
                  label="Evaluate"
                  icon="file-edit"
                  onClick={() => setSelectedTransporter(item)}
                  variant="outlined"
                />
              ),
              header: "Action",
              width: "130px",
              align: "center",
            },
          ]}
        />
      </Card>

      {selectedTransporter && (
        <EvaluationModal
          transporter={selectedTransporter}
          vehicles={vehicles}
          visible={!!selectedTransporter}
          onHide={() => setSelectedTransporter(null)}
        />
      )}
    </Page>
  );
}
