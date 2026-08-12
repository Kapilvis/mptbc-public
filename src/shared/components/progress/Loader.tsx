import "./Loader.css";

interface LoaderProps {
  type?: "full" | "relative" | "inline";
  blur?: boolean;
}

export default function Loader({ type = "full", blur = false }: LoaderProps) {
  const isFull = type === "full";
  const isRelative = type === "relative";

  // Determine sizing mathematically
  const size = isFull ? 72 : isRelative ? 36 : 20;

  return (
    <div
      className={`
        loader-container 
        loader-${type} 
        ${blur ? "loader-blur" : ""}
      `}
    >
      <div className="loader-content">
        <div
          className="loader-ring-wrapper"
          style={{ width: size, height: size }}
        >
          {/* Outer glowing orbital ring */}
          <div className="loader-ring-outer" />

          {/* Inner counter-rotating orbital ring */}
          <div className="loader-ring-inner" />

          {/* Central pulsing core */}
          <div className="loader-core" />
        </div>

        {isFull && <span className="loader-text">Loading Portal...</span>}
      </div>
    </div>
  );
}
