import { Link, useNavigate } from "react-router-dom";
import { ArrowDownToDot, Search } from "lucide-react"; // Import Search icon
import React, { useState } from "react"; // For input handling

const Landing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Implement your search logic here
    console.log("Searching for:", searchTerm);
    // You might navigate to a search results page
    // navigate(`/restaurants?q=${searchTerm}`);
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center font-serif-display overflow-hidden bg-[url('/src/assets/images/landing.jpg')]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-0" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6 md:px-14 md:py-8">
        <Link to="/" className="flex items-center gap-2 p-2 font-logo text-4xl text-white border-2 border-white rounded-lg hover:border-yellow-400 transition duration-300">
          Gebeታ
        </Link>
        <div className="flex gap-4 md:gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-primary px-5 py-3 rounded-full shadow-lg hover:bg-primary hover:text-white duration-300 font-bold transform-all"
          >
            Login
          </button>
          {/* <button
            onClick={() => navigate("/signup")} // Add a signup route
            className="border-2 border-white text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:bg-white hover:text-gray-900 duration-200 transform hover:scale-105"
          >
            Sign Up
          </button> */}
        </div>
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6 text-center">
        <h1 className="text-white   md:text-8xl font-bold drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] animate-fade-in mb-8">
          <span className="flex text-9xl mb-1">Craving?</span>
          <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
          Tap. Eat. Repeat.
          </span>
        </h1>

        <div className="mt-8 text-white font-semibold">
          <p className="text-lg mb-4">Discover trending restaurants and hidden gems!</p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              className="p-3 pr-10 rounded-full border border-gray-300 bg-white/90 text-gray-800 w-full max-w-sm shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="text"
              placeholder="Search by restaurant or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-500 text-white px-4 py-3 rounded-full hover:bg-yellow-600 transition duration-300"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center z-10">
        <Link to="#explore">
          <ArrowDownToDot
            color="white"
            size={50}
            className="animate-bounce"
          />
        </Link>
      </div>

    </div>
  );
};

export default Landing;