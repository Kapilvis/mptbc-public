import Button from "shared/components/buttons/Button";
import "./CloseButton.css";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export function CloseButton({ onClick, className = "" }: CloseButtonProps) {
  return (
    <Button
      icon="times"
      size="small"
      variant="text"
      className={`close-button ${className}`}
      onClick={onClick}
      aria-label="Close"
    />
  );
}
