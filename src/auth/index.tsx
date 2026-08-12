import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { useAuth } from "./AuthProvider";
import ValidationErrorModal from "./components/ValidationErrorModal";
import Features from "./features";
import { useEventSubscriber } from "./hooks/subscriber";
import AppLayout from "./layout";

export default function AuthorizedApp() {
  const toast = useRef<Toast>(null);
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  useEventSubscriber();

  useEffect(() => {
    ToastService.setToastRef(toast);
  }, []);

  // Still loading the token from storage, don't render anything yet
  if (authenticated === null) return null;

  // Token not found or expired, send the user back to login
  if (authenticated === false) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Toast ref={toast} />
      <AppLayout>
        <Features />
      </AppLayout>
      <ValidationErrorModal />
    </>
  );
}
