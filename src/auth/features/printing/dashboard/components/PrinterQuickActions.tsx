import { useNavigate } from "react-router-dom";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { printerQuickActions } from "../printerDashboard.mock";

export default function PrinterQuickActions() {
  const navigate = useNavigate();
  const actions = printerQuickActions;

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs">
      <div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-1">
          <i className="pi pi-bolt text-[#4F8F70]" />
          Quick Actions
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Fast-access links to complete key printer transactions and report logs
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {actions.map((act, idx) => (
          <Button
            key={idx}
            label={act.label}
            icon={act.icon}
            onClick={() => navigate(act.path)}
            className="p-button-outlined w-full justify-start text-xs text-left py-2 font-bold hover:bg-[#E8F4EC]/40 hover:border-[#4F8F70]/50"
          />
        ))}
      </div>
    </Card>
  );
}
