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
        height: "70vh", // Make page scrollable
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        
        // backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // optional: smooth parallax effect
        backgroundPosition: `center ${offset * 0.4}px`, // Moves slower than scroll
        
      }}
      className="relative"
    >
      <img src="src/assets/images/fewa.png" alt="Parallax Background" className="h-[400px] w-[400px] object-cover flex justify-end items-end absolute right-[100px] top-[100px]" />
      <h1 className="text-[#ef6836] text-5xl font-bold">
        Parallax Background
      </h1>
    </div>
  );
}
