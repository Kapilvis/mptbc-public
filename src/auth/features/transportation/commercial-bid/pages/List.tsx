import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import { DropDownList as SelectBox } from "shared/components/forms";
import { Button } from "shared/components/buttons";
import { Loader } from "shared/components/progress";
import LockOverlay from "../components/LockOverlay";
import {
  useTendersQuery,
  useBidsQuery,
  useTransporterQualificationQuery,
} from "../queries";
import { useTransportersQuery } from "../../../master/transporter-registration/queries";
import type { Tender } from "../data";

interface ListProps {
  currentTransporterId: number;
  setCurrentTransporterId: (id: number) => void;
}

export default function List({
  currentTransporterId,
  setCurrentTransporterId,
}: ListProps) {
  const navigate = useNavigate();

  // Query all mock transporters to populate our testing switcher
  const { data: transporters = [], isLoading: loadingTransporters } =
    useTransportersQuery();
  const { data: tenders = [], isLoading: loadingTenders } = useTendersQuery();
  const { data: bids = [], isLoading: loadingBids } =
    useBidsQuery(currentTransporterId);

  // Live Technical Qualification Check Query
  const { data: qualReport, isLoading: loadingQual } =
    useTransporterQualificationQuery(
      currentTransporterId,
      !!currentTransporterId,
    );

  const activeTransporter = transporters.find(
    (t) => t.transporterId === currentTransporterId,
  );

  const getBidStatus = (tenderId: string) => {
    const bid = bids.find((b) => b.tenderId === tenderId);
    if (!bid)
      return {
        label: "Not Quoted",
        className: "bg-slate-50 text-slate-600 border-slate-200",
      };
    return {
      label: bid.status === "Submitted" ? "Submitted & Locked" : "Draft",
      className:
        bid.status === "Submitted"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200",
    };
  };

  const hasSubmitted = (tenderId: string) => {
    return bids.some(
      (b) => b.tenderId === tenderId && b.status === "Submitted",
    );
  };

  if (loadingTransporters || loadingTenders || loadingBids || loadingQual) {
    return <Loader />;
  }

  return (
    <Page
      header="Commercial Bid Submission"
      subHeader="View active tenders and submit commercial bid rates."
      showHeaderActions
    >
      <Card title="Testing Transporter Switcher">
        <div className="w-72">
          <SelectBox
            label="Select Bidder Role"
            name="currentTransporterId"
            value={currentTransporterId}
            onChange={(val) => setCurrentTransporterId(Number(val))}
            data={transporters}
            optionValue="transporterId"
            textField="transporterName"
          />
        </div>
      </Card>

      {qualReport && !qualReport.isQualified ? (
        <LockOverlay
          report={qualReport}
          transporterName={
            activeTransporter?.transporterName ||
            `Transporter #${currentTransporterId}`
          }
        />
      ) : (
        <Card>
          <GridPanel
            toolbarPlacement="page"
            data={tenders}
            searchFields={["tenderId", "district", "title"]}
            columns={[
              {
                cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                width: "60px",
                align: "center",
                header: "S.No.",
              },
              { field: "tenderId", header: "Tender Ref No.", sortable: true },
              { field: "title", header: "Title", sortable: true },
              { field: "district", header: "Target District", sortable: true },
              {
                field: "lastDate",
                header: "Submission Deadline",
                sortable: true,
              },
              {
                cell: (item: Tender) => {
                  const status = getBidStatus(item.tenderId);
                  return (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${status.className}`}
                    >
                      {status.label}
                    </span>
                  );
                },
                header: "Your Bid Status",
                sortable: true,
              },
              {
                cell: (item: Tender) => {
                  const submitted = hasSubmitted(item.tenderId);
                  return (
                    <Button
                      label={submitted ? "View Quote" : "Place Quote"}
                      icon={submitted ? "eye" : "pencil"}
                      onClick={() =>
                        navigate(`./bid/${encodeURIComponent(item.tenderId)}`)
                      }
                      variant={submitted ? "outlined" : "primary"}
                      size="small"
                    />
                  );
                },
                header: "Actions",
                align: "center",
              },
            ]}
            renderContent={(item: Tender) => {
              const status = getBidStatus(item.tenderId);
              const submitted = hasSubmitted(item.tenderId);
              return (
                <Mosaic.Card
                  title={item.title}
                  subTitle={[
                    `Tender ID: ${item.tenderId}`,
                    `District: ${item.district}`,
                    `Deadline: ${item.lastDate}`,
                  ]}
                >
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${status.className}`}
                    >
                      {status.label}
                    </span>
                    <Button
                      label={submitted ? "View Quote" : "Place Quote"}
                      icon={submitted ? "eye" : "pencil"}
                      onClick={() =>
                        navigate(`./bid/${encodeURIComponent(item.tenderId)}`)
                      }
                      variant={submitted ? "outlined" : "primary"}
                      size="small"
                    />
                  </div>
                </Mosaic.Card>
              );
            }}
          />
        </Card>
      )}
    </Page>
  );
}
