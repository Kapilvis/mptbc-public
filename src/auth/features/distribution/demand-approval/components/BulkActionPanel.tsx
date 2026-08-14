import { Button } from "shared/components/buttons";

interface BulkActionPanelProps {
  selectedIds: number[];
  totalDemand: number;
  onClear: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting?: boolean;
}

export function BulkActionPanel({
  selectedIds,
  totalDemand,
  onClear,
  onSubmit,
  isSubmitting,
}: BulkActionPanelProps) {
  if (!selectedIds.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl p-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
        <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
          Bulk Action: Selected ({selectedIds.length} Items)
        </h4>
        <button
          type="button"
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <i className="pi pi-times text-xs" />
        </button>
      </div>

      <div className="my-3 space-y-1.5 text-xs">
        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
          <span>Summary Items:</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {selectedIds.length}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
          <span>Total Demand Qty:</span>
          <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
            {totalDemand.toLocaleString()}
          </span>
        </div>
      </div>

      <Button
        label="Submit Bulk Approval"
        icon="pi pi-check-circle"
        type="button"
        className="w-full justify-center text-xs"
        onClick={onSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
