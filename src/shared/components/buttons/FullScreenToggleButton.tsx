import { useEffect, useState } from "react";
import "./FullScreenToggleButton.css";

export const FullScreenToggleButton: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <button
      onClick={toggleFullScreen}
      title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
      className="fullscreen-toggle-btn"
    >
      <i className={`pi ${isFullScreen ? "pi-times" : "pi-expand"} text-lg`} />
    </button>
  );
};
