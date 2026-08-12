import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export interface ConfirmDialogOptions {
  message: string;
  header?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  onAccept?: () => void | Promise<void>;
  onReject?: () => void;
  showToast?: boolean;
  acceptToastMessage?: string;
  rejectToastMessage?: string;
}

export interface ConfirmDialogWithResultOptions<T = unknown> {
  message: string;
  header?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  showToast?: boolean;

  onAccept?: () => T | Promise<T>;
  onReject?: () => void;
}

export interface UseConfirmDialogReturn {
  confirmAction: (options: ConfirmDialogOptions) => void;
  confirmActionWithResult: <T>(
    options: ConfirmDialogWithResultOptions<T>,
  ) => Promise<T | undefined>;
  toastRef: React.RefObject<Toast | null>;
}

export function useConfirmDialog(): UseConfirmDialogReturn {
  const toastRef = useRef<Toast>(null);

  const confirmAction = ({
    message,
    header = "Confirmation",
    icon = "exclamation-triangle",
    acceptLabel = "Confirm",
    rejectLabel = "Cancel",
    onAccept,
    onReject,
    showToast = true,
    acceptToastMessage = "Action confirmed successfully",
    rejectToastMessage = "Action cancelled",
  }: ConfirmDialogOptions) => {
    confirmDialog({
      group: "headless-confirm",
      message,
      header,
      icon: `pi pi-${icon}`,
      defaultFocus: "accept",
      acceptLabel,
      rejectLabel,
      accept: async () => {
        try {
          if (onAccept) {
            await onAccept();
          }
          if (showToast && toastRef.current) {
            toastRef.current.show({
              severity: "success",
              summary: "Success",
              detail: acceptToastMessage,
              life: 3000,
            });
          }
        } catch {
          if (showToast && toastRef.current) {
            toastRef.current.show({
              severity: "error",
              summary: "Error",
              detail: "An error occurred while processing your request",
              life: 3000,
            });
          }
        }
      },
      reject: () => {
        if (onReject) {
          onReject();
        }
        if (showToast && toastRef.current) {
          toastRef.current.show({
            severity: "warn",
            summary: "Cancelled",
            detail: rejectToastMessage,
            life: 3000,
          });
        }
      },
    });
  };

  const confirmActionWithResult = <T>(
    options: ConfirmDialogWithResultOptions<T>,
  ): Promise<T | undefined> => {
    return new Promise((resolve) => {
      confirmDialog({
        group: "headless-confirm",
        message: options.message,
        header: options.header ?? "Confirmation",
        icon: `pi pi-${options.icon ?? "exclamation-triangle"}`,
        acceptLabel: options.acceptLabel ?? "Confirm",
        rejectLabel: options.rejectLabel ?? "Cancel",

        accept: async () => {
          try {
            const result = options.onAccept
              ? await options.onAccept()
              : undefined;
            resolve(result);
          } catch {
            resolve(undefined);
          }
        },

        reject: () => {
          options.onReject?.();
          resolve(undefined);
        },
      });
    });
  };

  return { confirmAction, confirmActionWithResult, toastRef };
}
