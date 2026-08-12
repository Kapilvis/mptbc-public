import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function Login() {
  const { authenticated, login } = useAuth();

  useEffect(() => {
    if (authenticated === false) {
      login(); // Immediately redirect to auth server if not authenticated
    }
  }, [authenticated, login]);

  if (authenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md p-10 space-y-8 bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] dark:shadow-none border border-gray-100 dark:border-white/5">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner rotate-3 transition-transform hover:rotate-0 duration-300">
            <i className="pi pi-lock text-4xl text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Authentication
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {authenticated === null
              ? "Checking your session status..."
              : "Redirecting you to the secure login server..."}
          </p>
        </div>

        {authenticated === false && (
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={login}
              className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary-600! focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <i className="pi pi-sign-in text-lg" />
              Continue to Login
            </button>
          </div>
        )}

        {authenticated === null && (
          <div className="flex justify-center mt-10">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-[3px] border-gray-200 dark:border-gray-700"></div>
              <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
