import { useState, useEffect } from "react";

export function ParallaxBackground({ backgroundImage }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        height: "15vh", // Make page scrollable
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "contain",
        
        // backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // optional: smooth parallax effect
        backgroundPosition: `center ${offset * 0.4}px`, // Moves slower than scroll
        
      }}
      className="relative"
    >
      
      {/* <h1 className="text-[#ef6836] text-5xl font-bold">
        Parallax Background
      </h1> */}
    </div>
  );
}
