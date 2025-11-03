import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDownToDot, Search, Star } from "lucide-react";
import { useViewport } from "../components/VPLocation/ViewPort";
import { ParallaxBackground } from "../components/VPLocation/OffsetView";
import WaveDivider from "../components/VPLocation/WaveDivider";

// Constants for scroll thresholds (abstracted from hardcoded values)
const NAV_SCROLL_THRESHOLD = 100;
const CARDS_SCROLL_THRESHOLD = 400;
const CARDS_APPEARANCE_THRESHOLD = 400;

// Animation configurations for restaurant cards
const CARD_ANIMATIONS = [
  {
    scale: 0.37,
    translateX: -69,
    translateY: -57,
    opacity: 0,
    duration: "0.87s",
  },
  {
    scale: 0.29,
    translateX: 0,
    translateY: -36,
  },
  {
    scale: 0.37,
    translateX: 69,
    translateY: -55,
    opacity: 0,
    duration: "0.87s",
  },
];

// Main Landing page component
const Landing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [rotate, setRotate] = useState(45);
  const { width, height, scrollY } = useViewport(); // Removed unused scrollX

  // Rotation effect: Increment angle every 5 seconds
  useEffect(() => {
    let currentAngle = 45;
    const interval = setInterval(() => {
      currentAngle += 90;
      setRotate(currentAngle);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/restaurants?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Generate animation classes for cards
  const getCardClasses = (index) => {
    const anim = CARD_ANIMATIONS[index];
    const baseClasses = `
      m-2 group px-10 py-5
      bg-white/10 rounded-lg
      flex flex-col items-center justify-center gap-2
      relative overflow-hidden cursor-pointer
      shadow-lg z-20
      after:absolute after:h-full after:w-full after:inset-0 after:rounded-lg
      after:bg-[#f5dbb3] after:-z-20
      after:-translate-y-full after:transition-all after:duration-500
      after:hover:translate-y-0
      transition-all duration-300 hover:duration-300
      [&_p]:delay-200 [&_p]:transition-all
    `;
    const conditionalClasses = scrollY >= CARDS_APPEARANCE_THRESHOLD
      ? `motion-scale-in-[${anim.scale}] motion-translate-x-in-[${anim.translateX}%] motion-translate-y-in-[${anim.translateY}%] ${
          anim.opacity !== undefined ? `motion-opacity-in-[${anim.opacity}]` : ""
        } ${anim.duration ? `motion-duration-[${anim.duration}]/opacity` : ""}`
      : "hidden";
    const scaleClasses = scrollY >= CARDS_SCROLL_THRESHOLD
      ? "scale-105 transition-all duration-300"
      : "";
    return `${baseClasses} ${conditionalClasses} ${scaleClasses}`.trim();
  };

  // Restaurant card data
  const restaurants = [
    {
      image: "https://placehold.co/600x400/FFF/000?text=Restaurant+1",
      name: "Gourmet Grills",
      description: "A modern twist on classic comfort food.",
      rating: 4.8,
      reviews: "2,500 ratings",
      index: 0,
    },
    {
      image: "https://placehold.co/600x400/FFF/000?text=Restaurant+2",
      name: "Spicy Spoon",
      description: "Authentic and fiery international cuisine.",
      rating: 4.5,
      reviews: "1,800 ratings",
      index: 1,
    },
    {
      image: "https://placehold.co/600x400/FFF/000?text=Restaurant+3",
      name: "The Vegan Corner",
      description: "Fresh, plant-based meals crafted with care.",
      rating: 4.9,
      reviews: "3,100 ratings",
      index: 2,
    },
  ];

  // Image sources for rotating section (reused to avoid duplication)
  const foodImages = [
    "https://res.cloudinary.com/drinuph9d/image/upload/v1761891464/food_images/food_1761891463855_Cheese_Burger.png",
    "https://res.cloudinary.com/drinuph9d/image/upload/v1761912096/food_images/food_1761912094928_food_2.png",
    "https://res.cloudinary.com/drinuph9d/image/upload/v1761913788/food_images/food_1761913787869_food_3.png",
    "https://res.cloudinary.com/drinuph9d/image/upload/v1761914500/food_images/food_1761914499863_food_3.png",
  ];

  return (
    <div className="relative min-h-screen bg-cover font-sans text-gray-900 bg-landing">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/20 z-0" />

      {/* Fixed Header */}
      <header>
        <nav className={`flex justify-between items-center px-6 md:px-8 md:py-1 w-full top-0 left-0 mt-0 rounded-b-3xl fixed z-50 ${
          scrollY >= NAV_SCROLL_THRESHOLD ? "bg-black/10 backdrop-blur-sm" : ""
        }`}>
          <Link
            to="/"
            className="flex items-center gap-2 p-2 font-logo text-3xl md:text-2xl text-white border-2 border-white rounded-lg hover:border-yellow-400 transition-colors duration-300 transform hover:scale-105"
          >
            <img
              src="https://res.cloudinary.com/drinuph9d/image/upload/v1761897257/food_images/food_1761897256388_logo.png"
              alt="Logo"
              className="w-10 h-10 object-cover rounded"
            />
            Gebeታ
          </Link>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-white z-30 text-gray-900 px-5 py-2 md:px-6 md:py-3 rounded-full shadow-lg font-semibold transition-all duration-300 hover:bg-yellow-400 hover:text-white cursor-pointer"
            >
              Login
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center h-[630px]">
        <h1 className="text-white text-4xl md:text-7xl font-bold tracking-tight drop-shadow-xl animate-fade-in-down mb-6">
          <span className="block mb-2 md:mb-4 text-start ">Craving?</span>
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Tap. Eat. Repeat.
          </span>
        </h1>
        <p className="text-white text-lg md:text-xl font-medium mb-8 drop-shadow-lg">
          Discover your next favorite meal from trending restaurants and hidden gems near you.
        </p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full max-w-xl p-2 rounded-full bg-white/20 backdrop-blur-sm shadow-2xl">
          <div className="relative w-full">
            <label htmlFor="search-input" className="sr-only">
              Search by restaurant or cuisine
            </label>
            <input
              id="search-input"
              className="p-3 pl-12 rounded-full border border-gray-300 bg-white/95 text-gray-800 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
              type="text"
              placeholder="Search for 'pizza', 'sushi', or a restaurant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-8 py-3 rounded-full hover:bg-yellow-600 transition-colors duration-300 font-bold w-full sm:w-auto transform hover:scale-105"
          >
            Search
          </button>
        </form>
      </section>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <Link to="#explore" aria-label="Explore restaurants">
          <ArrowDownToDot color="white" size={50} className="animate-bounce" />
        </Link>
      </div>

      <WaveDivider />

      {/* Explore Section */}
      <section id="explore" className="relative py-20 pb-48 bg-[#f4f1e9] backdrop-blur-lg rounded-t-xl min-h-[700px]">
        <div className="max-w-6xl mx-auto overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Featured Restaurants
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 ${scrollY >= CARDS_APPEARANCE_THRESHOLD ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
            {restaurants.map((restaurant) => (
              <div key={restaurant.name} className={getCardClasses(restaurant.index)}>
                <img
                  src={restaurant.image}
                  alt={`Placeholder for ${restaurant.name}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-4">{restaurant.description}</p>
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} fill="currentColor" stroke="none" />
                    <span className="ml-1 font-semibold text-gray-800">{restaurant.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">({restaurant.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <ParallaxBackground backgroundImage="src/assets/images/p.png" />

      {/* Rotating Images Container */}
      <div className={`md:w-[${width}px] overflow-hidden border-2 h-[800px] relative bg-cover bg-center`}>
        {/* First Rotating Wheel */}
        <div
          className="z-0 border-separate border-2 border-black p-5 m-5 gap-44 flex flex-col origin-center transition-transform duration-700 bg-[#333] absolute md:-left-[595px] md:-top-[55px] rounded-full"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <div className="flex justify-between gap-x-44">
            <img
              src={foodImages[0]}
              alt="Food Image 1"
              className="rotate-180 h-[300px] w-[300px] object-cover transition-all duration-530 m-3"
            />
            <img
              src={foodImages[1]}
              alt="Food Image 2"
              className="rotate-180 h-[300px] w-[300px] object-cover transition-all duration-530 m-3"
            />
          </div>
          <div className="flex justify-between gap-44">
            <img
              src={foodImages[2]}
              alt="Food Image 3"
              className="rotate-180 h-[300px] w-[300px] object-cover transition-all duration-530 m-3"
            />
            <img
              src={foodImages[3]}
              alt="Food Image 4"
              className="rotate-180 h-[300px] w-[300px] object-cover transition-all duration-530 m-3"
            />
          </div>
        </div>

        {/* Second Rotating Wheel (reversed order for effect) */}
        <div
          className="z-0 border-separate border-2 border-black p-5 m-5 gap-44 flex flex-col origin-center transition-transform duration-700 bg-[#333] absolute md:-right-[595px] md:-top-[55px] rounded-full"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <div className="flex justify-between gap-44">
            <img
              src={foodImages[3]}
              alt="Food Image 4"
              className="rotate-180 h-[300px] w-[300px] object-cover transition-all duration-530 m-3"
            />
            <img
              src={foodImages[2]}
              alt="Food Image 3"
              className="rotate-180 h-[300px] w-[300px] object-cover transition-all duration-530 m-3"
            />
          </div>
          <div className="flex justify-between gap-x-44">
            <img
              src={foodImages[1]}
              alt="Food Image 2"
              className="rotate-180 h-[300px] w-[300px] object-cover transition-all duration-530 m-3"
            />
            <img
              src={foodImages[0]}
              alt="Food Image 1"
              className="rotate-180 h-[300px] w-[300px] object-cover transition-all duration-530 m-3"
            />
          </div>
        </div>
      </div>
      <ParallaxBackground backgroundImage="src/assets/images/p.png" />

      {/* Duplicate Parallax removed; only one needed */}
    </div>
  );
};

export default Landing;