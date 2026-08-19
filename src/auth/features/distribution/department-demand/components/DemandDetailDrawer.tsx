import { Card } from "shared/components/panels";

interface DemandDetailDrawerProps {
  item: Distribution.DepartmentDemandItem | null;
  onClose: () => void;
}

export function DemandDetailDrawer({ item, onClose }: DemandDetailDrawerProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 dark:bg-black/40 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative h-full w-full max-w-md bg-white p-6 shadow-2xl overflow-y-auto dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Record Details: Textbooks, {item.district}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {item.titleName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <i className="pi pi-times text-base" />
          </button>
        </div>

        {/* Content Cards */}
        <div className="mt-6 space-y-6">
          {/* Card 1: TBC Dispatch Tracker */}
          <Card className="bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40">
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-3 flex items-center gap-2">
              <i className="pi pi-truck text-emerald-600 dark:text-emerald-400" />
              TBC Dispatch Tracker
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Gross Demand:
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {item.grossDemand.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Sent to Block: {item.sentToBrc.toLocaleString()}
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    ({item.sentPercent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-emerald-200/60 rounded-full overflow-hidden dark:bg-emerald-900/60">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(item.sentPercent, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm pt-1">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Block Received:
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {item.brcReceived.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Card 2: Final Distribution Status */}
          <Card className="bg-blue-50/50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
              <i className="pi pi-building text-blue-600 dark:text-blue-400" />
              Final Distribution Status ({item.block})
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Sent to School:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-200">
                  {item.sentToSchool.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm border-t border-blue-100 dark:border-blue-900/40 pt-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Distributed to Student:
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-base">
                  {item.distributedToStudent.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Additional Item Specs */}
          <Card className="border border-gray-200 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Demand Specs
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 block">Department:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.agency}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">District:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.district}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Medium:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.medium}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Class:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Class {item.classNo}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Received Date:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.receivedDate}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Current Status:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {item.status}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
