import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function Callback() {
  const navigate = useNavigate();
  const { authenticated } = useAuth();

  useEffect(() => {
    if (authenticated) {
      navigate("/home");
    } else if (authenticated === false) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md p-10 space-y-8 bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] dark:shadow-none border border-gray-100 dark:border-white/5 text-center">
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-[3px] border-primary/10 dark:border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 rounded-full m-1 shadow-sm">
            <i className="pi pi-shield text-3xl text-primary" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Securing Your Session
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
            Please wait while we securely authenticate your account...
          </p>
        </div>
      </div>
    </div>
  );
}
