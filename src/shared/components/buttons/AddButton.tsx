import React from "react";
import { Button } from "shared/components/buttons";
import "./AddButton.css";

interface AddButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  label?: string;
}

export function AddButton({
  onClick,
  disabled,
  type = "button",
  label = "Add",
}: AddButtonProps) {
  return (
    <Button
      className="add-button"
      label={label}
      icon="plus"
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      type={type}
    />
  );
}
