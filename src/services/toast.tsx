import type { Toast } from "primereact/toast";
import type { RefObject } from "react";

let toastRef: RefObject<Toast | null>;

function setToastRef(ref: RefObject<Toast | null>) {
  toastRef = ref;
}

function success(message: string, title?: string) {
  toastRef?.current?.show({
    severity: "success",
    summary: title,
    detail: message,
  });
}

function error(message: string | string[], title?: string) {
  if (!toastRef || !toastRef.current) {
    return;
  }

  if (!Array.isArray(message)) {
    toastRef.current.show({
      severity: "error",
      summary: title,
      detail: message,
    });
    return;
  }

  toastRef.current.show({
    severity: "error",
    summary: title,
    content: () => (
      <div>
        {message.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    ),
  });
}

function warning(message: string, title?: string) {
  toastRef?.current?.show({
    severity: "warn",
    summary: title,
    detail: message,
  });
}

const ToastService = { setToastRef, success, error, warning };
export default ToastService;
