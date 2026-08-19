import Modal from "shared/components/popups/Modal";
import { Button } from "shared/components/buttons";
import {
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Truck,
  UserCheck,
} from "lucide-react";
import { ToastService } from "services";

interface PodReceiptModalProps {
  visible: boolean;
  onHide: () => void;
  dispatch:
    | (Transportation.Dispatch & {
        district?: string;
        block?: string;
        transporterName?: string;
      })
    | null;
}

export default function PodReceiptModal({
  visible,
  onHide,
  dispatch,
}: PodReceiptModalProps) {
  if (!dispatch) return null;

  // Format date to Indian IST format (DD/MM/YYYY)
  const formatISTDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePrint = () => {
    window.print();
    ToastService.success(`Printing Receipt for Vehicle ${dispatch.truckNo}`);
  };

  const weightMT = (dispatch.bundlesLoaded * 0.04).toFixed(2);
  const formattedDispatchDate = formatISTDate(dispatch.dispatchDate);
  const formattedDeliveryDate = formatISTDate(
    dispatch.actualDeliveryDate || dispatch.dispatchDate,
  );

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      header="Signed Delivery Receipt (Challan)"
      size="large"
    >
      <div className="bg-white p-6 border border-slate-200 rounded-2xl flex flex-col gap-5 text-slate-800 shadow-xs">
        {/* Official Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
              Madhya Pradesh Textbook Corporation, Bhopal
            </span>
            <span className="text-lg font-black text-slate-900 mt-0.5">
              Official Delivery Receipt & Signed Challan
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              Proof of Delivery Acknowledgement Record
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={12} /> POD Verified
            </span>
            <span className="text-[11px] text-slate-400 font-bold mt-1">
              Doc Ref: POD-{dispatch.truckNo.replace(/[^a-zA-Z0-9]/g, "")}
            </span>
          </div>
        </div>

        {/* Dispatch & Vehicle Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Vehicle Number
            </span>
            <span className="text-xs font-black text-slate-900 flex items-center gap-1 mt-0.5">
              <Truck size={13} className="text-sky-600" /> {dispatch.truckNo}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Challan Number
            </span>
            <span className="text-xs font-black text-slate-900 mt-0.5 block">
              CH-{(dispatch.dispatchId || "1024").toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Dispatch Date
            </span>
            <span className="text-xs font-bold text-slate-700 mt-0.5 block">
              {formattedDispatchDate}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Delivery Date
            </span>
            <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
              {formattedDeliveryDate}
            </span>
          </div>
        </div>

        {/* Consignment & Transporter Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl p-3.5 flex flex-col gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Transporter & Routing
            </span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Agency:</span>
              <span className="font-bold text-slate-800">
                {dispatch.transporterName || "Authorized Transporter"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Destination:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin size={12} className="text-rose-500" />{" "}
                {dispatch.district} - {dispatch.block}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Driver:</span>
              <span className="font-bold text-slate-800">
                {dispatch.driverName || "Assigned Driver"} (
                {dispatch.driverMobile || "N/A"})
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-3.5 flex flex-col gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Quantity & Load Verified
            </span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">
                Bundles Received:
              </span>
              <span className="font-black text-emerald-700">
                {dispatch.bundlesLoaded} Bundles
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Metric Weight:</span>
              <span className="font-bold text-slate-800">
                {weightMT} Metric Tons
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">
                Condition Status:
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Intact / Full Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Receiving Officer & Official Physical Seal Stamp Box */}
        <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-emerald-700 shadow-xs">
              <UserCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase text-emerald-900 tracking-wider">
                Acknowledged & Received By
              </span>
              <span className="text-sm font-black text-slate-900">
                Block Resource Coordinator (BRC)
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Destination Office: {dispatch.district}, Madhya Pradesh
              </span>
            </div>
          </div>

          {/* Simulated Official Seal */}
          <div className="border-2 border-emerald-600 rounded-xl px-4 py-2 text-center bg-white shadow-xs rotate-[-2deg]">
            <span className="text-[9px] font-black text-emerald-800 uppercase block tracking-widest">
              ★ M.P. TEXTBOOK CORP ★
            </span>
            <span className="text-xs font-black text-emerald-700 block uppercase">
              DELIVERED & VERIFIED
            </span>
            <span className="text-[10px] font-bold text-slate-600 block mt-0.5">
              {formattedDeliveryDate}
            </span>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-2">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-600" /> Digitally
            Authenticated & Recorded
          </span>
          <div className="flex gap-2">
            <Button
              label="Close"
              variant="outlined"
              size="small"
              onClick={onHide}
            />
            <Button
              label="Print Receipt"
              icon="pi pi-print"
              size="small"
              onClick={handlePrint}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
