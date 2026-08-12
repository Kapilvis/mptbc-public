import React, { useEffect, useRef, useState } from "react";
import "./Scrollbar.css";

interface ScrollbarProps {
  children: React.ReactNode;
  height?: number | string;
  isCollapsed?: boolean;
}

const Scrollbar: React.FC<ScrollbarProps> = ({
  children,
  height = "100vh",
  isCollapsed = false,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [thumbHeight, setThumbHeight] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dragStartY = useRef(0);
  const scrollStartY = useRef(0);

  useEffect(() => {
    const inner = innerRef.current;
    const thumb = thumbRef.current;

    if (!inner || !thumb) return;

    const updateThumb = () => {
      const { scrollHeight, clientHeight, scrollTop } = inner;

      if (scrollHeight <= clientHeight) {
        setThumbHeight(clientHeight);
        thumb.style.transform = "translateY(0)";
        return;
      }

      const calculatedHeight = (clientHeight / scrollHeight) * clientHeight;
      const clampedHeight = Math.max(calculatedHeight, 20);

      setThumbHeight(clampedHeight);

      const thumbPosition =
        (scrollTop / (scrollHeight - clientHeight)) *
        (clientHeight - clampedHeight);

      thumb.style.transform = `translateY(${thumbPosition}px)`;
    };

    inner.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    updateThumb();

    return () => {
      inner.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, [children, isCollapsed]);

  useEffect(() => {
    const inner = innerRef.current;

    if (!inner) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaY = event.clientY - dragStartY.current;
      const scrollableHeight = inner.scrollHeight - inner.clientHeight;
      const thumbMovableHeight = inner.clientHeight - thumbHeight;

      if (thumbMovableHeight <= 0) return;

      inner.scrollTop =
        scrollStartY.current + (deltaY / thumbMovableHeight) * scrollableHeight;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = "auto";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, thumbHeight]);

  const handleThumbMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const inner = innerRef.current;

    if (!inner) return;

    setIsDragging(true);
    dragStartY.current = event.clientY;
    scrollStartY.current = inner.scrollTop;
    document.body.style.userSelect = "none";
  };

  const showThumb = false;

  return (
    <div
      ref={outerRef}
      className="scrollbar-shell"
      style={{
        height: typeof height === "string" ? height : `${height}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={innerRef}
        className={`scrollbar-content ${
          isCollapsed
            ? "scrollbar-content-collapsed"
            : "scrollbar-content-expanded"
        }`}
      >
        <div
          className={`scrollbar-content-inner ${
            isCollapsed
              ? "scrollbar-content-inner-collapsed"
              : "scrollbar-content-inner-expanded"
          }`}
        >
          {children}
        </div>
      </div>

      <div
        ref={thumbRef}
        onMouseDown={handleThumbMouseDown}
        className={`scrollbar-thumb ${
          isHovered || isDragging ? "opacity-100" : "opacity-0"
        } ${showThumb ? "block" : "hidden"}`}
        style={{
          height: `${thumbHeight}px`,
          backgroundColor: isHovered || isDragging ? "#555" : "#6b6b6b",
        }}
      />
    </div>
  );
};

export default Scrollbar;
