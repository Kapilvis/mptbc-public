import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

export default function CreateDistribution({ onSave }: { onSave: () => void }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNoParam = searchParams.get("orderNo") || "";

  // Load datasets
  const orders = dataManager.getOrders();
  const stocks = dataManager.getStocks();
  const distributions = dataManager.getDistributions();

  // Active / Approved Printer Orders that still have pending quantity
  const pendingOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        (o.status === "Approved" ||
          o.status === "Partially Supplied" ||
          o.status === "Pending") &&
        o.pendingQty > 0,
    );
  }, [orders]);

  const orderOptions = useMemo(() => {
    return pendingOrders.map((o) => ({
      value: o.orderNo,
      text: `${o.orderNo} — ${o.printer} (${o.gsm} GSM, ${o.pendingQty} KG Pending)`,
    }));
  }, [pendingOrders]);

  // Form State
  const [selectedOrderNo, setSelectedOrderNo] = useState("");
  const [issueQty, setIssueQty] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [dispatchDate, setDispatchDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [remarks, setRemarks] = useState("");

  // Pre-fill if orderNoParam is provided
  useEffect(() => {
    if (orderNoParam) {
      const matched = orders.find((o) => o.orderNo === orderNoParam);
      if (matched && matched.pendingQty > 0) {
        setSelectedOrderNo(orderNoParam);
      }
    }
  }, [orderNoParam, orders]);

  // Auto-load details based on selected order
  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.orderNo === selectedOrderNo);
  }, [selectedOrderNo, orders]);

  const selectedGsmStock = useMemo(() => {
    if (!selectedOrder) return null;
    return stocks.find((s) => s.gsm === selectedOrder.gsm);
  }, [selectedOrder, stocks]);

  const availableStock = selectedGsmStock?.availableQuantity || 0;

  // Auto-generate Challan and Distribution numbers on order selection
  useEffect(() => {
    if (selectedOrderNo) {
      const codeSuffix = Date.now().toString().slice(-4);
      setChallanNo(`CHL-${selectedOrderNo}-${codeSuffix}`);
    } else {
      setChallanNo("");
    }
  }, [selectedOrderNo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedOrder ||
      !issueQty ||
      !vehicleNo ||
      !challanNo ||
      !dispatchDate
    ) {
      ToastService.error("Please fill all required fields");
      return;
    }

    const qtyToIssue = parseFloat(issueQty);
    if (isNaN(qtyToIssue) || qtyToIssue <= 0) {
      ToastService.error("Issue quantity must be a positive number");
      return;
    }

    // Critical Validation 1: Issue Qty <= Available GSM Stock
    if (qtyToIssue > availableStock) {
      ToastService.error("Insufficient stock available for selected GSM.");
      return;
    }

    // Critical Validation 2: Issue Qty <= Pending Order Quantity
    if (qtyToIssue > selectedOrder.pendingQty) {
      ToastService.error(
        "Issue quantity cannot exceed pending order quantity.",
      );
      return;
    }

    const newDistNo = `DIS-${String(distributions.length + 1).padStart(3, "0")}`;

    const newDistribution = {
      distributionNo: newDistNo,
      distributionDate: dispatchDate,
      printer: selectedOrder.printer,
      orderNo: selectedOrder.orderNo,
      gsm: selectedOrder.gsm,
      paperType: selectedOrder.paperType,
      availableStockAtIssue: availableStock,
      approvedQty: selectedOrder.approvedQty,
      previouslySupplied: selectedOrder.suppliedQty,
      pendingQty: selectedOrder.pendingQty,
      issueQuantity: qtyToIssue,
      vehicleNo,
      driverName,
      challanNo,
      dispatchDate,
      remarks,
    };

    try {
      dataManager.addDistribution(newDistribution);

      ToastService.success(
        `Paper stock of ${qtyToIssue} KG dispatched to ${selectedOrder.printer} successfully!`,
      );

      // Call onSave which closes the overlay panel
      onSave();

      // If preselected orderNoParam is present, redirect back to order details
      if (orderNoParam) {
        navigate(`/printing/orders/details/${orderNoParam}`);
      }
    } catch {
      ToastService.error("Failed to issue paper");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputPanel orientation="horizontal">
        <DropDownList
          label="Approved Printer Order"
          required
          data={orderOptions}
          textField="text"
          valueField="value"
          value={selectedOrderNo}
          onChange={(val) => setSelectedOrderNo(val as string)}
          defaultOptionText="Select Order"
        />

        <NumberBox
          label="Issue Quantity (KG)"
          required
          value={issueQty ? parseFloat(issueQty) : undefined}
          onChange={(val) =>
            setIssueQty(val !== undefined && val !== null ? String(val) : "")
          }
          disabled={!selectedOrderNo}
          min={1}
        />

        <TextBox
          label="Vehicle Number"
          required
          value={vehicleNo}
          onChange={(val) => setVehicleNo(val)}
          placeholder="e.g. MP04HA5544"
        />

        <TextBox
          label="Driver Name"
          value={driverName}
          onChange={(val) => setDriverName(val)}
          placeholder="Driver Full Name"
        />

        <TextBox
          label="Challan Number"
          required
          value={challanNo}
          onChange={(val) => setChallanNo(val)}
        />

        <DatePicker
          label="Dispatch Date"
          required
          value={dispatchDate}
          onChange={(val) =>
            setDispatchDate(val ? val.toISOString().split("T")[0] : "")
          }
        />
      </InputPanel>

      {selectedOrder && (
        <div className="px-5 py-3 mx-5 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30 text-xs flex flex-col gap-2 shadow-sm">
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 pb-1.5 border-b border-emerald-100/30 dark:border-emerald-900/20 uppercase tracking-wider">
            Order & Depot Stock Context
          </div>
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-emerald-100/20 dark:border-emerald-900/10">
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                Printer / Press
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {selectedOrder.printer}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                Paper Specification
              </span>
              <span className="font-extrabold text-indigo-650">
                {selectedOrder.gsm} GSM ({selectedOrder.paperType})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1 border-b border-emerald-100/20 dark:border-emerald-900/10 pb-2">
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                Approved Order Qty
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {selectedOrder.approvedQty.toLocaleString()} KG
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                Previously Supplied
              </span>
              <span className="font-bold text-emerald-600">
                {selectedOrder.suppliedQty.toLocaleString()} KG
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                Pending Qty to Supply
              </span>
              <span className="font-extrabold text-rose-600">
                {selectedOrder.pendingQty.toLocaleString()} KG
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">
                Available Depot Stock
              </span>
              <span
                className={`font-extrabold ${availableStock <= 0 ? "text-rose-600" : "text-emerald-600"}`}
              >
                {availableStock.toLocaleString()} KG
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="px-5">
        <TextArea
          label="Remarks"
          value={remarks}
          onChange={(val) => setRemarks(val)}
          placeholder="Allocation remarks..."
          rows={2}
        />
      </div>

      <ButtonPanel>
        <Button
          type="submit"
          label="Dispatch & Reduce Stock"
          icon="pi pi-send"
          disabled={!selectedOrderNo || availableStock <= 0}
        />
      </ButtonPanel>
    </form>
  );
}
