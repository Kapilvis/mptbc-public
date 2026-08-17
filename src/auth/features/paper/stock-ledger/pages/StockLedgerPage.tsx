import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card, GridPanel, InputPanel } from "shared/components/panels";
import { Button, ButtonPanel } from "shared/components/buttons";
import { DropDownList, DatePicker } from "shared/components/forms";
import { dataManager } from "../../../inventory/mockData";
import type { StockTransaction } from "../../../inventory/types";

export default function StockLedgerPage() {
  const transactions = dataManager.getTransactions();
  const stocks = dataManager.getStocks();
  const printerList = dataManager.getPrinterMasterList();
  const supplierList = dataManager.getVendorMasterList();

  // Filters State
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [gsmFilter, setGsmFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState("");
  const [printerFilter, setPrinterFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Date filter
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;

      // GSM filter
      if (gsmFilter && t.gsm.toString() !== gsmFilter) return false;

      // Paper Type filter (match by GSM since each GSM has a specific paper type in our master)
      const gsmStockObj = stocks.find((s) => s.gsm === t.gsm);
      const paperType = gsmStockObj?.paperType || "";
      if (typeFilter && paperType !== typeFilter) return false;

      // Transaction Type filter
      if (txTypeFilter && t.type !== txTypeFilter) return false;

      // Printer filter (match name in reference)
      if (
        printerFilter &&
        !t.reference.toLowerCase().includes(printerFilter.toLowerCase())
      )
        return false;

      // Supplier filter (match name in reference)
      if (
        supplierFilter &&
        !t.reference.toLowerCase().includes(supplierFilter.toLowerCase())
      )
        return false;

      return true;
    });
  }, [
    transactions,
    stocks,
    dateFrom,
    dateTo,
    gsmFilter,
    typeFilter,
    txTypeFilter,
    printerFilter,
    supplierFilter,
  ]);

  const handleResetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setGsmFilter("");
    setTypeFilter("");
    setTxTypeFilter("");
    setPrinterFilter("");
    setSupplierFilter("");
  };

  // Build Options
  const gsmOptions = useMemo(() => {
    return stocks.map((s) => ({
      text: `${s.gsm} GSM`,
      value: s.gsm.toString(),
    }));
  }, [stocks]);

  const typeOptions = [
    { text: "Text Paper", value: "Text Paper" },
    { text: "Cover Paper", value: "Cover Paper" },
  ];

  const txTypeOptions = [
    { text: "Opening Balance", value: "Opening" },
    { text: "Receipt (Stock In)", value: "Receipt" },
    { text: "Distribution (Stock Out)", value: "Distribution" },
  ];

  const printerOptions = useMemo(() => {
    return printerList.map((p) => ({
      text: p.printerName,
      value: p.printerName,
    }));
  }, [printerList]);

  const supplierOptions = useMemo(() => {
    return supplierList.map((s) => ({
      text: s.name,
      value: s.name,
    }));
  }, [supplierList]);

  return (
    <Page
      header="Detailed Stock Ledger"
      subHeader="विस्तृत स्टॉक लेजर — View and export ledger accounts containing detailed paper ledger tracking."
      showHeaderActions
    >
      {/* Filters Card */}
      <Card className="mb-4 p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-150/40">
          <div className="flex items-center gap-2">
            <i className="pi pi-filter text-indigo-600 font-bold" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Ledger Filtering Controls
            </span>
          </div>
          <ButtonPanel>
            <Button
              type="button"
              label="Reset Filters"
              icon="pi pi-refresh"
              onClick={handleResetFilters}
              className="p-button-outlined p-button-secondary p-button-sm !text-xs !py-1"
            />
          </ButtonPanel>
        </div>

        <InputPanel orientation="horizontal" className="grid-4">
          <DatePicker
            label="Date From"
            value={dateFrom}
            onChange={(val) =>
              setDateFrom(val ? val.toISOString().split("T")[0] : "")
            }
          />

          <DatePicker
            label="Date To"
            value={dateTo}
            onChange={(val) =>
              setDateTo(val ? val.toISOString().split("T")[0] : "")
            }
          />

          <DropDownList
            label="GSM / Specification"
            data={gsmOptions}
            textField="text"
            valueField="value"
            value={gsmFilter}
            onChange={(val) => setGsmFilter(val as string)}
            defaultOptionText="All GSMs"
          />

          <DropDownList
            label="Paper Type"
            data={typeOptions}
            textField="text"
            valueField="value"
            value={typeFilter}
            onChange={(val) => setTypeFilter(val as string)}
            defaultOptionText="All Types"
          />

          <DropDownList
            label="Transaction Type"
            data={txTypeOptions}
            textField="text"
            valueField="value"
            value={txTypeFilter}
            onChange={(val) => setTxTypeFilter(val as string)}
            defaultOptionText="All Types"
          />

          <DropDownList
            label="Filter by Printer"
            data={printerOptions}
            textField="text"
            valueField="value"
            value={printerFilter}
            onChange={(val) => setPrinterFilter(val as string)}
            defaultOptionText="All Printers"
          />

          <DropDownList
            label="Filter by Vendor"
            data={supplierOptions}
            textField="text"
            valueField="value"
            value={supplierFilter}
            onChange={(val) => setSupplierFilter(val as string)}
            defaultOptionText="All Vendors"
          />
        </InputPanel>
      </Card>

      {/* Grid Ledger */}
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={filteredTransactions}
          searchFields={["transactionNo", "reference"]}
          exportFilename="Stock_Ledger_Account"
          columns={[
            {
              cell: (_, option) => (
                <span className="text-xs">{option.rowIndex + 1}</span>
              ),
              width: "50px",
              align: "center",
            },
            {
              field: "date",
              header: "Date",
              cell: (row: StockTransaction) => (
                <span className="text-xs">{row.date}</span>
              ),
            },
            {
              field: "transactionNo",
              header: "Transaction Number",
              cell: (row: StockTransaction) => (
                <span className="text-xs font-bold text-indigo-950 dark:text-white">
                  {row.transactionNo}
                </span>
              ),
            },
            {
              field: "type",
              header: "Transaction Type",
              cell: (row: StockTransaction) => (
                <span className="text-xs font-semibold uppercase">
                  {row.type}
                </span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: StockTransaction) => (
                <span className="text-xs font-bold">{row.gsm} GSM</span>
              ),
            },
            {
              header: "Paper Type",
              cell: (row: StockTransaction) => {
                const spec = stocks.find((s) => s.gsm === row.gsm);
                return (
                  <span className="text-xs">
                    {spec?.paperType || "Text Paper"}
                  </span>
                );
              },
            },
            {
              field: "reference",
              header: "Reference Source",
              cell: (row: StockTransaction) => (
                <span className="text-xs text-gray-500">{row.reference}</span>
              ),
            },
            {
              header: "Quantity In (Receipt)",
              align: "right",
              cell: (row: StockTransaction) => {
                const isIn = row.quantity > 0 && row.type !== "Opening";
                return (
                  <span className="text-xs font-bold text-emerald-600">
                    {isIn ? `${row.quantity.toLocaleString()} KG` : ""}
                  </span>
                );
              },
            },
            {
              header: "Quantity Out (Issued)",
              align: "right",
              cell: (row: StockTransaction) => {
                const isOut = row.quantity < 0;
                return (
                  <span className="text-xs font-bold text-rose-600">
                    {isOut
                      ? `${Math.abs(row.quantity).toLocaleString()} KG`
                      : ""}
                  </span>
                );
              },
            },
            {
              field: "balance",
              header: "Balance Stock",
              align: "right",
              cell: (row: StockTransaction) => (
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  {row.balance.toLocaleString()} KG
                </span>
              ),
            },
            {
              header: "Remarks",
              cell: (row: StockTransaction) => (
                <span className="text-xs italic text-gray-400">
                  {row.remarks || "-"}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
