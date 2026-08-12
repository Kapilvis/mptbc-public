import { OverlayPanel } from "primereact/overlaypanel";
import React from "react";
import { CloseButton } from "shared/components/buttons/CloseButton";
import type { ViewState } from "./types";

interface GridPanelOverlayProps<T> {
  op: React.RefObject<OverlayPanel | null>;
  view: ViewState;
  selectedItem: T | null;
  onClose: () => void;
  CreateForm?: React.ComponentType<{ onSave: () => void }>;
  EditForm?: React.ComponentType<{
    data: T;
    onSave: () => void;
  }>;
}

export function GridPanelOverlay<T>({
  op,
  view,
  selectedItem,
  onClose,
  CreateForm,
  EditForm,
}: GridPanelOverlayProps<T>) {
  return (
    <OverlayPanel
      ref={op}
      onHide={() => {
        onClose();
      }}
      dismissable={false}
      showCloseIcon={false}
      className="mosaic-overlay"
    >
      <div className="mosaic-overlay-inner">
        <div className="mosaic-overlay-close-btn-wrapper">
          <CloseButton onClick={onClose} />
        </div>

        {view === "ADD" && CreateForm && (
          <>
            <h1 className="mosaic-overlay-heading">{`Add Details`}</h1>
            <CreateForm onSave={onClose} />
          </>
        )}

        {view === "EDIT" && EditForm && selectedItem && (
          <>
            <h1 className="mosaic-overlay-heading">{`Edit Details`}</h1>
            <EditForm data={selectedItem} onSave={onClose} />
          </>
        )}
      </div>
    </OverlayPanel>
  );
}
