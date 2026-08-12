import { useEffect } from "react";
import ReactModal from "react-modal";
import { Card } from "../panels";
import "./Modal.css";

type ModalSize = "small" | "medium" | "large";

interface ModalProps extends React.PropsWithChildren {
  header?: string;
  onHide: () => void;
  size?: ModalSize;
  visible?: boolean;
}

export default function Modal({ size = "medium", ...props }: ModalProps) {
  useEffect(() => {
    return () => {
      document.body.classList.remove("ReactModal__Body--open");
    };
  }, []);

  return (
    <ReactModal
      className={`modal-content ${size}`}
      isOpen={props.visible ?? false}
      onRequestClose={props.onHide}
      shouldCloseOnOverlayClick={false}
      overlayClassName="modal-overlay"
      shouldCloseOnEsc
    >
      <Card className="modal-card" title={props.header} onClose={props.onHide}>
        {props.children}
      </Card>
    </ReactModal>
  );
}
