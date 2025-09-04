import { useState, useEffect } from "react";

// Hook that returns viewport info (width, height, scrollX, scrollY)
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      });
    };

    const handleScroll = () => {
      setViewport((prev) => ({
        ...prev,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      }));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return viewport;
}
