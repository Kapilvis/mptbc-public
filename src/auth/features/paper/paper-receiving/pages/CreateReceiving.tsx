import React, { useState, useMemo } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import {
  TextBox,
  NumberBox,
  DropDownList,
  DatePicker,
  TextArea,
} from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { ToastService } from "services";
import { dataManager } from "../../../inventory/mockData";

export default function CreateReceiving({ onSave }: { onSave: () => void }) {
  // Masters
  const gsms = dataManager.getGsmMasterList();
  const vendors = dataManager.getVendorMasterList();
  const receipts = dataManager.getReceipts();

  // Map options
  const vendorOptions = useMemo(() => {
    return vendors.map((v) => ({
      value: v.name,
      text: v.name,
    }));
  }, [vendors]);

  const gsmOptions = useMemo(() => {
    return gsms.map((g) => ({
      value: g.gsmId.toString(),
      text: `${g.gsm} GSM (Reel: ${g.reelWidth}mm, Cutoff: ${g.cutoff}mm)`,
    }));
  }, [gsms]);

  // Form State
  const [supplier, setSupplier] = useState("");
  const [gsmId, setGsmId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [receiptDate, setReceiptDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  // Derived properties from selected GSM
  const selectedGsmItem = useMemo(() => {
    return gsms.find((g) => g.gsmId.toString() === gsmId);
  }, [gsmId, gsms]);

  const paperType = selectedGsmItem
    ? selectedGsmItem.gsm === 80
      ? "Cover Paper"
      : "Text Paper"
    : "";
  const reelWidth = selectedGsmItem?.reelWidth || 0;
  const cutoff = selectedGsmItem?.cutoff || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !supplier ||
      !gsmId ||
      !quantity ||
      !vehicleNo ||
      !challanNo ||
      !invoiceNo
    ) {
      ToastService.error("Please fill all required fields");
      return;
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      ToastService.error("Quantity must be a positive number");
      return;
    }

    const matchedGsm = selectedGsmItem;
    if (!matchedGsm) {
      ToastService.error("Invalid GSM selection");
      return;
    }

    const newReceiptNo = `GRN-${String(receipts.length + 1).padStart(3, "0")}`;

    const newReceipt = {
      receiptNo: newReceiptNo,
      receiptDate,
      supplier,
      gsm: matchedGsm.gsm,
      paperType,
      reelWidth,
      cutoff,
      quantity: qtyNum,
      vehicleNo,
      challanNo,
      invoiceNo,
      remarks,
    };

    try {
      dataManager.addReceipt(newReceipt);

      ToastService.success(
        `Paper stock of ${qtyNum} MT added for ${matchedGsm.gsm} GSM successfully!`,
      );

      // Call onSave which closes the overlay
      onSave();
    } catch {
      ToastService.error("Failed to record paper receipt");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputPanel orientation="horizontal">
        <DatePicker
          label="Receipt Date"
          required
          value={receiptDate}
          onChange={(val) =>
            setReceiptDate(val ? val.toISOString().split("T")[0] : "")
          }
        />

        <DropDownList
          label="Paper Vendor"
          required
          data={vendorOptions}
          textField="text"
          valueField="value"
          value={supplier}
          onChange={(val) => setSupplier(val as string)}
          defaultOptionText="Select Paper Vendor"
        />

        <DropDownList
          label="GSM Specifications"
          required
          data={gsmOptions}
          textField="text"
          valueField="value"
          value={gsmId}
          onChange={(val) => setGsmId(val as string)}
          defaultOptionText="Select GSM"
        />

        <NumberBox
          label="Received Quantity (MT)"
          required
          value={quantity ? parseFloat(quantity) : undefined}
          onChange={(val) =>
            setQuantity(val !== undefined && val !== null ? String(val) : "")
          }
          min={1}
        />

        <TextBox
          label="Vehicle Number"
          required
          value={vehicleNo}
          onChange={(val) => setVehicleNo(val)}
          placeholder="e.g. MP04HA1122"
        />

        <TextBox
          label="Challan Number"
          required
          value={challanNo}
          onChange={(val) => setChallanNo(val)}
        />

        <TextBox
          label="Invoice Number"
          required
          value={invoiceNo}
          onChange={(val) => setInvoiceNo(val)}
        />
      </InputPanel>

      {selectedGsmItem && (
        <div className="px-5 py-3 mx-5 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30 text-xs flex flex-col gap-2 shadow-sm">
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 pb-1.5 border-b border-emerald-100/30 dark:border-emerald-900/20 uppercase tracking-wider">
            Reel Specifications
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                Paper Type
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {paperType}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                Reel Width
              </span>
              <span className="font-bold text-emerald-650">{reelWidth} mm</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                Cutoff size
              </span>
              <span className="font-bold text-emerald-650">{cutoff} mm</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-5">
        <TextArea
          label="Remarks / Notes"
          value={remarks}
          onChange={(val) => setRemarks(val)}
          placeholder="Additional receipt notes..."
          rows={2}
        />
      </div>

      <ButtonPanel>
        <Button type="submit" label="Save & Record Receipt" icon="pi pi-save" />
      </ButtonPanel>
    </form>
  );
}
