import { useLocation } from "react-router-dom";

export default function MockModulePage() {
  const location = useLocation();
  const title = location.pathname.split("/").filter(Boolean).pop() || "Module";
  const formattedTitle =
    title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, " ");

  return (
    <div className="flex h-112.5 flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="mx-auto h-16 w-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
        <i
          className="pi pi-cog text-3xl animate-spin"
          style={{ animationDuration: "4s" }}
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {formattedTitle} Module
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
        This is a mock implementation of the **{formattedTitle}** module for
        demo and evaluation purposes.
      </p>
    </div>
  );
}
