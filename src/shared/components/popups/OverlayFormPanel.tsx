import { OverlayPanel } from "primereact/overlaypanel";
import { forwardRef, type ReactNode, useImperativeHandle, useRef } from "react";
import { CloseButton } from "shared/components/buttons/CloseButton";

export interface OverlayFormPanelHandle {
  toggle: (e: React.MouseEvent) => void;
  hide: () => void;
}

interface OverlayFormPanelProps {
  children: ReactNode;
  onHide?: () => void;
  dismissable?: boolean;
  className?: string;
}

const OverlayFormPanel = forwardRef<
  OverlayFormPanelHandle,
  OverlayFormPanelProps
>(({ children, onHide, dismissable = false, className = "" }, ref) => {
  const opRef = useRef<OverlayPanel>(null);

  useImperativeHandle(ref, () => ({
    toggle: (e: React.MouseEvent) => opRef.current?.toggle(e),
    hide: () => opRef.current?.hide(),
  }));

  return (
    <OverlayPanel
      ref={opRef}
      onHide={onHide}
      dismissable={dismissable}
      showCloseIcon={false}
      className={`mosaic-overlay ${className}`}
    >
      <div className="mosaic-overlay-inner">
        <div className="mosaic-overlay-close-btn-wrapper">
          <CloseButton onClick={() => opRef.current?.hide()} />
        </div>
        {children}
      </div>
    </OverlayPanel>
  );
});

OverlayFormPanel.displayName = "OverlayFormPanel";

export default OverlayFormPanel;
