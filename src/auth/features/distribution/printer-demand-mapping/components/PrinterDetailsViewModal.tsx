import { useMemo } from "react";
import { Modal } from "shared/components/popups";
import { printerDemandMappingMock } from "../printerDemandMapping.mock";
import { formatDate } from "shared/utils/dateUtils";

interface Props {
  visible: boolean;
  onHide: () => void;
  orderNo: string;
}

export default function PrinterDetailsViewModal({
  visible,
  onHide,
  orderNo,
}: Props) {
  const { order, printerCapacity } = useMemo(() => {
    if (!orderNo) return { order: null, printerCapacity: null };
    return printerDemandMappingMock.getOrderDetails(orderNo);
  }, [orderNo, visible]);

  const capacityPercent = useMemo(() => {
    if (!printerCapacity || printerCapacity.approvedCapacity === 0) return 0;
    return Math.min(
      100,
      Math.round(
        (printerCapacity.currentAllocated / printerCapacity.approvedCapacity) *
          100,
      ),
    );
  }, [printerCapacity]);

  const capacityWidthClass = useMemo(() => {
    if (capacityPercent <= 0) return "w-0";
    if (capacityPercent >= 100) return "w-full";
    const rounded = Math.round(capacityPercent / 10) * 10;
    switch (rounded) {
      case 10:
        return "w-[10%]";
      case 20:
        return "w-[20%]";
      case 30:
        return "w-[30%]";
      case 40:
        return "w-[40%]";
      case 50:
        return "w-[50%]";
      case 60:
        return "w-[60%]";
      case 70:
        return "w-[70%]";
      case 80:
        return "w-[80%]";
      case 90:
        return "w-[90%]";
      default:
        return "w-0";
    }
  }, [capacityPercent]);

  if (!order || !printerCapacity) return null;

  const totalAllocated = order.allocations.reduce(
    (sum, a) => sum + a.allocatedQty,
    0,
  );

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      header="Order Details"
      size="medium"
    >
      <div className="flex flex-col gap-4 text-xs">
        {/* Order Information */}
        <div className="p-4 bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-950/20 rounded-xl">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-3">
            <i className="pi pi-file text-emerald-700 mr-1.5" />
            {order.orderNo}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold tracking-wide block">
                Printer Tender Number
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100 block mt-0.5">
                {order.tenderNo}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold tracking-wide block">
                Printer Name
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100 block mt-0.5">
                {order.printerName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold tracking-wide block">
                Delivery Depot
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100 block mt-0.5">
                {order.deliveryDepot}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 uppercase font-bold tracking-wide block">
                Expected Delivery Date
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100 block mt-0.5">
                {formatDate(order.expectedDeliveryDate).replace(/\//g, "-") ||
                  order.expectedDeliveryDate ||
                  "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Capacity KPI Cards */}
        <div className="border border-gray-150/40 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/40 px-4 py-2 border-b border-gray-150/40 dark:border-gray-850 font-bold text-gray-800 dark:text-gray-250">
            Printer Capacity Summary
          </div>

          <div className="p-4 flex flex-col gap-4 bg-white dark:bg-gray-900">
            {/* Visual Capacity Bar */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">
                <span>Capacity Utilized</span>
                <span className="text-emerald-700 font-extrabold">
                  {capacityPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`bg-emerald-600 h-full rounded-full transition-all duration-500 ${capacityWidthClass}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 divide-x divide-gray-150/40 dark:divide-gray-800">
              <div className="flex flex-col gap-0.5 text-center">
                <span className="text-[9px] text-gray-600 dark:text-gray-400 block font-bold uppercase tracking-wide">
                  Total Capacity
                </span>
                <span className="font-extrabold text-sm text-gray-950 dark:text-white block">
                  {printerCapacity.approvedCapacity.toLocaleString()}
                </span>
                <span className="text-[8px] text-gray-500 dark:text-gray-400 block font-bold">
                  Books
                </span>
              </div>

              <div className="flex flex-col gap-0.5 text-center pl-2">
                <span className="text-[9px] text-gray-600 dark:text-gray-400 block font-bold uppercase tracking-wide">
                  Total Work Allocated
                </span>
                <span className="font-extrabold text-sm text-amber-700 dark:text-amber-400 block">
                  {printerCapacity.currentAllocated.toLocaleString()}
                </span>
                <span className="text-[8px] text-amber-600 dark:text-amber-500 block font-bold">
                  Books
                </span>
              </div>

              <div className="flex flex-col gap-0.5 text-center pl-2">
                <span className="text-[9px] text-gray-600 dark:text-gray-400 block font-bold uppercase tracking-wide">
                  Available Capacity
                </span>
                <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-450 block">
                  {printerCapacity.availableCapacity.toLocaleString()}
                </span>
                <span className="text-[8px] text-emerald-600 dark:text-emerald-500 block font-bold">
                  Books
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Allocation Details */}
        <div className="border border-gray-150/40 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/40 px-4 py-2 border-b border-gray-150/40 dark:border-gray-850 font-bold text-gray-800 dark:text-gray-250">
            Book Allocation Details
          </div>

          <div className="overflow-x-auto bg-white dark:bg-gray-900">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[9px] font-bold border-b border-gray-150/40 dark:border-gray-700/60">
                  <th className="px-3 py-2 w-12 text-center">S.No</th>
                  <th className="px-3 py-2 text-left">Book Name</th>
                  <th className="px-3 py-2 text-right w-28">Approved</th>
                  <th className="px-3 py-2 text-right w-28">Opening Stock</th>
                  <th className="px-3 py-2 text-right w-32">Work Allocation</th>
                </tr>
              </thead>
              <tbody>
                {order.allocations.map((alloc, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100/40 dark:border-gray-800 hover:bg-gray-50/20"
                  >
                    <td className="px-3 py-2 text-center font-bold text-gray-800 dark:text-gray-200">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-200">
                      {alloc.bookName}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-blue-700 dark:text-blue-400">
                      {(
                        alloc.approvedDemandQty ?? alloc.allocatedQty
                      ).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-amber-700 dark:text-amber-400">
                      {(alloc.openingStock ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-purple-700 dark:text-purple-400">
                      {alloc.allocatedQty.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-purple-50/30 dark:bg-purple-950/10 border-t-2 border-purple-200 dark:border-purple-900">
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2 font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
                    Total
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-blue-700 dark:text-blue-400">
                    {order.allocations
                      .reduce(
                        (sum, a) =>
                          sum + (a.approvedDemandQty ?? a.allocatedQty),
                        0,
                      )
                      .toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-amber-700 dark:text-amber-400">
                    {order.allocations
                      .reduce((sum, a) => sum + (a.openingStock ?? 0), 0)
                      .toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right font-extrabold text-purple-700 dark:text-purple-400">
                    {totalAllocated.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
