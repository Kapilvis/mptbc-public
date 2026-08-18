import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { dataManager } from "../../../inventory/mockData";
import { getPrinterMockDetails } from "auth/features/printing/printer-registration/data";
import { OrderStatusBadge } from "./PrinterOrdersList";

export default function PrinterOrderDetailsPage() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();

  const order = useMemo(() => {
    return dataManager.getOrders().find((o) => o.orderNo === orderNo);
  }, [orderNo]);

  // Load printer master details dynamically using code
  const printerDetails = useMemo(() => {
    if (!order) return null;
    return getPrinterMockDetails(order.printerCode);
  }, [order]);

  // Load distribution history for this order
  const orderDistributions = useMemo(() => {
    if (!orderNo) return [];
    return dataManager.getDistributions().filter((d) => d.orderNo === orderNo);
  }, [orderNo]);

  if (!order) {
    return (
      <Page
        header="Order Not Found"
        subHeader="Error finding printer order details."
      >
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">
            The order number {orderNo} does not exist.
          </p>
          <Button
            label="Back to Orders"
            icon="arrow-left"
            onClick={() => navigate("/printing/orders/list")}
          />
        </Card>
      </Page>
    );
  }

  return (
    <Page
      header={`Order Details: ${order.orderNo}`}
      subHeader="आदेश विवरण — View printer requirements, printer information, and distribution history."
      showHeaderActions
    >
      <div className="mb-4">
        <Button
          label="Back to Orders"
          icon="arrow-left"
          onClick={() => navigate("/printing/orders/list")}
          className="p-button-secondary p-button-outlined p-button-sm mr-2"
        />
        {order.pendingQty > 0 && (
          <Button
            label="Issue Paper for this Order"
            icon="send"
            onClick={() =>
              navigate(`/distribution/new?orderNo=${order.orderNo}`)
            }
            className="p-button-success p-button-sm"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Printer Details Card */}
        <Card className="lg:col-span-1 p-5">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 pb-2 mb-3 flex items-center gap-2">
            <i className="pi pi-print text-blue-600" />
            Printer Information
          </h3>
          <div className="flex flex-col gap-3 text-xs">
            <div>
              <span className="text-gray-400 block uppercase text-[10px]">
                Printer Name
              </span>
              <span className="font-bold text-gray-800 dark:text-white">
                {order.printer}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block uppercase text-[10px]">
                Printer Code
              </span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {order.printerCode}
              </span>
            </div>
            {printerDetails && (
              <>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px]">
                    Address
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {printerDetails.addressLine1},{" "}
                    {printerDetails.addressLine2 &&
                      `${printerDetails.addressLine2}, `}
                    {printerDetails.city}, {printerDetails.district},{" "}
                    {printerDetails.state} - {printerDetails.pinCode}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px]">
                    Contact Person
                  </span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {printerDetails.authPersonName} (
                    {printerDetails.designation})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px]">
                    Mobile Number
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    {printerDetails.mobileNo}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px]">
                    Email Address
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 underline truncate block">
                    {printerDetails.email}
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Order Details Card */}
        <Card className="lg:col-span-2 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 pb-2 mb-3 flex items-center gap-2">
              <i className="pi pi-file text-indigo-600" />
              Order Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-4">
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">
                  Order Number
                </span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {order.orderNo}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">
                  Order Date
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {order.orderDate}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">
                  Required By Date
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {order.requiredByDate}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">
                  Order Status
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/50 dark:bg-gray-800/25 p-3 rounded-lg border border-gray-100 dark:border-gray-800 text-xs mb-4">
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">
                  Class / Medium
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {order.classLevel || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">
                  Subject
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {order.subject || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">
                  Book Title / Print Job
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300 truncate block max-w-xs">
                  {order.bookTitle || "N/A"}
                </span>
              </div>
            </div>

            {order.remarks && (
              <div className="text-xs mb-4">
                <span className="text-gray-400 block uppercase text-[10px]">
                  Order Remarks
                </span>
                <p className="italic text-gray-600 dark:text-gray-400">
                  {order.remarks}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex items-center justify-between text-xs text-gray-500">
            <span>
              Allocated and calculated values are measured in Metric Tonnes
              (MT).
            </span>
            <span>
              Priority:{" "}
              <span className="font-bold text-rose-600 uppercase">
                {order.priority}
              </span>
            </span>
          </div>
        </Card>
      </div>

      {/* Paper Requirement Table */}
      <Card className="mb-6">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <i className="pi pi-check-square text-emerald-600" />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            Order Paper Requirement
          </span>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/40 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-center">GSM</th>
                <th className="px-4 py-3">Paper Type</th>
                <th className="px-4 py-3 text-right">Required Quantity</th>
                <th className="px-4 py-3 text-right">Approved Quantity</th>
                <th className="px-4 py-3 text-right text-emerald-600">
                  Supplied Quantity
                </th>
                <th className="px-4 py-3 text-right text-rose-600">
                  Pending Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-center font-bold">
                  {order.gsm} GSM
                </td>
                <td className="px-4 py-3 font-semibold">{order.paperType}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {order.requiredQty.toLocaleString()} MT
                </td>
                <td className="px-4 py-3 text-right font-bold text-blue-700 dark:text-blue-400">
                  {order.approvedQty.toLocaleString()} MT
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600">
                  {order.suppliedQty.toLocaleString()} MT
                </td>
                <td className="px-4 py-3 text-right font-extrabold text-rose-600">
                  {order.pendingQty.toLocaleString()} MT
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Distribution History */}
      <Card>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="pi pi-history text-purple-650" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Paper Distribution History
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Total Shipments: {orderDistributions.length}
          </span>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/40 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-center">Challan / Dist No</th>
                <th className="px-4 py-3">Dispatch Date</th>
                <th className="px-4 py-3 text-center">GSM</th>
                <th className="px-4 py-3 text-right">Quantity Issued</th>
                <th className="px-4 py-3">Vehicle Number</th>
                <th className="px-4 py-3">Driver Name</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {orderDistributions.map((dist, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50/50"
                >
                  <td className="px-4 py-3 text-center font-bold text-indigo-950 dark:text-white">
                    {dist.challanNo}
                  </td>
                  <td className="px-4 py-3">{dist.dispatchDate}</td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {dist.gsm} GSM
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">
                    {dist.issueQuantity.toLocaleString()} MT
                  </td>
                  <td className="px-4 py-3 font-semibold">{dist.vehicleNo}</td>
                  <td className="px-4 py-3">{dist.driverName || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 uppercase">
                      {dist.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orderDistributions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-400 italic"
                  >
                    No distributions recorded for this order yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Page>
  );
}
