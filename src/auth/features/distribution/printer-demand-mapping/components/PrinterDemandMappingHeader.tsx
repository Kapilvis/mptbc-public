import { Link } from "react-router-dom";

export default function PrinterDemandMappingHeader() {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs text-gray-500">
        <li className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
          <i className="pi pi-home text-[10px]" />
          <Link to="/home">Home</Link>
        </li>
        <li>
          <i className="pi pi-chevron-right text-[8px] text-gray-400" />
        </li>
        <li className="hover:text-emerald-700 transition-colors">
          <Link to="/distribution/dashboard">Distribution</Link>
        </li>
        <li>
          <i className="pi pi-chevron-right text-[8px] text-gray-400" />
        </li>
        <li className="text-gray-900 font-medium">Printer Work Allocation</li>
      </ol>
    </nav>
  );
}
