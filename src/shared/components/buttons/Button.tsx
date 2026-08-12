import { Button as PrimeButton } from "primereact/button";
import "./Button.css";

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "outlined"
  | "text";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  type?: ButtonType;
  icon?: string;
  label?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  size?: ButtonSize;
  isActive?: boolean;
  tooltip?: string;
}

const CLASS_BASE = "p-button p-component";

export default function Button({
  label,
  icon,
  onClick,
  isLoading,
  className,
  variant,
  type = "button",
  disabled = false,
  size = "medium",
  isActive,
  tooltip,
}: React.PropsWithChildren<ButtonProps>) {
  // Determine final variant
  const cssVariant: ButtonVariant =
    isActive !== undefined
      ? isActive
        ? "success"
        : "danger"
      : type === "submit" && !variant
        ? "primary"
        : (variant ?? "outlined"); // default to outlined for button/reset

  // Determine size
  const computedSize: ButtonSize = size;

  // Conditional style: outlined buttons with type=button or reset should have width auto
  const isAutoWidth =
    cssVariant === "outlined" && (type === "button" || type === "reset");
  const classNameFull =
    `${CLASS_BASE} button-variant-${cssVariant} button-size-${computedSize} ${disabled ? "button-disabled" : ""} ${isAutoWidth ? "button-width-auto" : ""} ${className || ""}`.trim();

  // Ripple effect
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    const button = e.currentTarget;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - rippleSize / 2;
    const y = e.clientY - rect.top - rippleSize / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${rippleSize}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <PrimeButton
      type={type}
      className={classNameFull}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      icon={icon ? `pi pi-${icon}` : undefined}
      label={label}
      loading={isLoading}
      disabled={disabled}
      tooltip={tooltip}
    />
  );
}
