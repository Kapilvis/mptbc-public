import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-112.5 flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
        <i className="pi pi-lock text-3xl" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Access Denied
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm mb-6">
        You do not have permission to access this page.
      </p>
      <Link
        to="/home"
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
        style={{ backgroundColor: "var(--mptbc-green-primary, #008a45)" }}
      >
        <i className="pi pi-arrow-left" />
        Back to Home
      </Link>
    </div>
  );
}
