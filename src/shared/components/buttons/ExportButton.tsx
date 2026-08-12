import React from "react";
import Button from "shared/components/buttons/Button";
import "./ExportButton.css";

interface ExportButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  label?: string;
}

export function ExportButton({
  onClick,
  disabled,
  type = "button",
  label = "Export",
}: ExportButtonProps) {
  return (
    <Button
      className="export-button"
      label={label}
      icon="download"
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      type={type}
    />
  );
}
