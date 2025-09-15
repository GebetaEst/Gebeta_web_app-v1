import React, { useState ,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDownToDot, Search, Star } from "lucide-react";
import { useViewport } from "../components/VPLocation/ViewPort";
import {ParallaxBackground} from "../components/VPLocation/OffsetView";



// This is the main Landing page component for your food delivery app.
const Landing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Handles the search form submission.
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (searchTerm.trim()) {
      // Navigates to a search results page with the query parameter.
      navigate(`/restaurants?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  const { width, height, scrollX, scrollY } = useViewport();
  console.log(
  //   // "width", width, 
  //   // "height", height, 
  //   // "scrollX", scrollX, 
    "scrollY", scrollY
  );

  return (
    // The main container with a full-screen background image and a dark overlay.
    <div className="relative min-h-screen bg-cover font-sans text-gray-900 bg-parallax bg-no-repeat bg-center ">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/70 to-black/50 z-0" />

      {/* Header section with branding and navigation buttons. */}
      <header >
        <nav className={`flex justify-between items-center px-6 md:px-8 md:py-1 w-full top-0 left-0  mt-0 rounded-b-3xl fixed z-50  ${scrollY >= 101.20816040039062 ? " bg-black/10 backdrop-blur-sm " : ""}`}>

          <Link to="/" className=" flex items-center gap-2 p-2 font-logo text-3xl md:text-2xl text-white border-2 border-white rounded-lg hover:border-yellow-400 transition-colors duration-300 transform hover:scale-105">
            Gebeታ
          </Link>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-white z-30 text-gray-900 px-5 py-2 md:px-6 md:py-3 rounded-full shadow-lg font-semibold transition-all duration-300 hover:bg-yellow-400 hover:text-white cursor-pointer"
            >
              Login
            </button>
            {/* <button
            onClick={() => navigate("/signup")}
            className="border-2 border-white text-white font-semibold px-5 py-2 md:px-6 md:py-3 rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:text-gray-900 transform hover:scale-105"
            >
            Sign Up
            </button> */}
          </div>
        </nav>
      </header>

      {/* Main hero section with a compelling headline and search bar. */}
      <section className="relative z-10 flex flex-col items-center justify-center h-[630px]">
        <h1 className="text-white text-4xl md:text-7xl font-bold tracking-tight drop-shadow-xl animate-fade-in-down mb-6">
          <span className="block mb-2 md:mb-4 text-start">Craving?</span>
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Tap. Eat. Repeat.
          </span>
        </h1>

        <p className="text-white text-lg md:text-xl font-medium mb-8 drop-shadow-lg">
          Discover your next favorite meal from trending restaurants and hidden gems near you.
        </p>

        {/* The search bar component, refactored into a form for better accessibility. */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full max-w-xl p-2 rounded-full bg-white/20 backdrop-blur-sm shadow-2xl">
          <div className="relative w-full">
            <label htmlFor="search-input" className="sr-only">Search by restaurant or cuisine</label>
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

      {/* "Scroll to Explore" arrow. */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <Link to="#explore" aria-label="Explore restaurants">
          <ArrowDownToDot
            color="white"
            size={50}
            className="animate-bounce"
          />
        </Link>
      </div>

      {/* This new section is a placeholder to show the "explore" part of the page. */}
      <section id="explore" className={` py-20  bg-[#f4f1e9] backdrop-blur-md rounded-t-3xl h-[700px]  `}>
      <div className="max-w-6xl mx-auto overflow-x-hidden overflow-y-hidden">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Featured Restaurants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
            {/* Placeholder cards for featured restaurants */}
            <div className={` bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 scroll-hidden ${scrollY >= 399.6614074707031 ? "motion-scale-in-[0.37] motion-translate-x-in-[-69%] motion-translate-y-in-[-57%] motion-opacity-in-[0%] motion-duration-[0.87s]/opacity" : "hidden"} ${scrollY >= 402 ? "scale-105 transition-all duration-300" : ""}`}>
              <img src="https://placehold.co/600x400/FFF/000?text=Restaurant+1" alt="Placeholder for Restaurant 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Gourmet Grills</h3>
                <p className="text-gray-600 mb-4">A modern twist on classic comfort food.</p>
                <div className="flex items-center text-yellow-500">
                  <Star size={16} fill="currentColor" stroke="none" />
                  <span className="ml-1 font-semibold text-gray-800">4.8</span>
                  <span className="text-sm text-gray-500 ml-2">(2,500 ratings)</span>
                </div>
              </div>
            </div>

            <div className={` bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-800 ${scrollY >=  399.6614074707031 ? "motion-scale-in-[0.29] motion-translate-x-in-[0%] motion-translate-y-in-[-36%]" : "hidden"} ${scrollY >= 402 ? "scale-105 transition-all duration-300" : ""}`}>
              <img src="https://placehold.co/600x400/FFF/000?text=Restaurant+2" alt="Placeholder for Restaurant 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Spicy Spoon</h3>
                <p className="text-gray-600 mb-4">Authentic and fiery international cuisine.</p>
                <div className="flex items-center text-yellow-500">
                  <Star size={16} fill="currentColor" stroke="none" />
                  <span className="ml-1 font-semibold text-gray-800">4.5</span>
                  <span className="text-sm text-gray-500 ml-2">(1,800 ratings)</span>
                </div>
              </div>
            </div>

            <div className={` bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 ${scrollY >= 399.6614074707031 ? "motion-scale-in-[0.37] motion-translate-x-in-[69%] motion-translate-y-in-[-55%] motion-opacity-in-[0%] motion-duration-[0.87s]/opacity" : "hidden"} ${scrollY >= 402 ? "scale-105" : ""}`}>
              <img src="https://placehold.co/600x400/FFF/000?text=Restaurant+3" alt="Placeholder for Restaurant 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">The Vegan Corner</h3>
                <p className="text-gray-600 mb-4">Fresh, plant-based meals crafted with care.</p>
                <div className="flex items-center text-yellow-500">
                  <Star size={16} fill="currentColor" stroke="none" />
                  <span className="ml-1 font-semibold text-gray-800">4.9</span>
                  <span className="text-sm text-gray-500 ml-2">(3,100 ratings)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        <div className="h-[]">
        <ParallaxBackground backgroundImage="src/assets/images/p.png" />

        </div>
       {/* <div className="relative">
       <img src="src/assets/images/fewa.png" alt="Parallax Background" className="hover:z-50 h-[450px] w-[450px] object-cover flex justify-end items-end absolute transition-all duration-500  blur-[3px] hover:blur-0 right-[100px] top-[30px]" />
      <h1 className="absolute transition-all lg:right-[140px] lg:top-[150px] bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent text-4xl font-bold duration-300 drop-shadow-lg" >
        Owr bast restaurant 
      </h1>
      <ul className="absolute p-5 mt-6 transition-all lg:right-[140px] lg:top-[190px] bg-gradient-to-r text-white bg-clip-text text-transparent text-xl font-bold duration-300 drop-shadow-lg">
        <li>Premium Quality Ingredients</li>
        <li>Authentic Traditional Recipes</li>
        <li>Outstanding Customer Service</li>
      </ul>
      </div> */}
      <div className="relative">
      <img src="src/assets/images/fewa.png" alt="Parallax Background" className="hover:-z-50 h-[450px] w-[450px] object-cover flex justify-end items-end  transition-all duration-500  blur-[3px] hover:blur-0 right-[100px] top-[30px]" />
      <h1 className=" absolute transition-all lg:left-[80px] lg:top-[150px] bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent text-4xl font-bold duration-300 drop-shadow-lg" >
        Owr bast restaurant 
      </h1>
      <ul className=" absolute p-5 mt-6 transition-all lg:left-[80px] lg:top-[190px] bg-gradient-to-r text-white bg-clip-text text-transparent text-xl font-bold duration-300 drop-shadow-lg">
        <li>Premium Quality Ingredients</li>
        <li>Authentic Traditional Recipes</li>
        <li>Outstanding Customer Service</li>
      </ul>
      </div>u
      <div className="h-[]">
        <ParallaxBackground backgroundImage="src/assets/images/p.png" />

        </div>
      

      {/* Optional: Add a simple footer */}
      {/* <footer className="relative z-10 text-center py-8 bg-gray-900 text-white">
        <p>&copy; 2025 Gebeታ. All rights reserved.</p>
      </footer> */}
      

    </div>
  );
};

export default Landing;

