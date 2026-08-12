import "./Card.css";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  centerTitle?: boolean;
}

export default function Card({
  title,
  children,
  className = "",
  onClose,
  centerTitle = false,
}: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title ? (
        <h3 className={`card-title ${centerTitle ? "text-center" : ""}`}>
          {title}
        </h3>
      ) : undefined}
      {onClose && (
        <button className="card-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
}
