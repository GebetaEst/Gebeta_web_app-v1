import React, { useEffect, useState } from "react";
import { Trash, RefreshCcw ,CirclePlus ,X } from "lucide-react";
import { Loading } from "../../components/Loading/Loading";
import PopupCard from "../../components/Cards/PopupCard";
import AddRestaurantsForm from "../../components/UserForms/A-AddRestaurantsForm";

const ACustomers = () => {
  const [restaurants, setRestaurants] = useState([]); // Renamed for clarity
  const [loading, setLoading] = useState(true); // Added for initial fetch
  const [expandedRestaurant, setExpandedRestaurant] = useState(null);
  const [showAddRes, setShowAddRes] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [statusDropdownId, setStatusDropdownId] = useState(null); // State to manage which status dropdown is open

  // Fetch all restaurants on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://gebeta-delivery1.onrender.com/api/v1/restaurants",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        console.log(data);
        if (res.ok && data.status === "success") {
          // Check res.ok for HTTP success
          setRestaurants(data.data.restaurants);
          console.log();
        } else {
          throw new Error(data.message || "Failed to load restaurants.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [refetch]);

  const toggleExpand = (id) => {
    setExpandedRestaurant((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `https://gebeta-delivery1.onrender.com/api/v1/restaurants/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ active: newStatus === "Active" }),
        }
      );
      setRefetch(!refetch);
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setRestaurants((prev) =>
          prev.map((restaurant) =>
            restaurant._id === id
              ? { ...restaurant, active: newStatus === "Active" }
              : restaurant
          )
        );
        setStatusDropdownId(null);
      } else {
        throw new Error(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Status update failed:", error);
      alert(`Failed to update status: ${error.message}`); // User feedback
    }
  };

  // Handle restaurant deletion
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://gebeta-delivery1.onrender.com/api/v1/restaurants/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        // Check for successful HTTP status (200-299)
        setRestaurants((prev) =>
          prev.filter((restaurant) => restaurant._id !== id)
        );
        if (expandedRestaurant === id) {
          // Close expanded row if deleted
          setExpandedRestaurant(null);
        }
        alert("Restaurant deleted successfully!"); // User feedback
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete restaurant.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Failed to delete restaurant: ${err.message}`); // User feedback
    }
  };

  // Filter restaurants based on search input
  const filteredRestaurants = Array.isArray(restaurants)
    ? restaurants.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="p-6 min-h-[calc(100vh-70px)] bg-[#f4f1e9] font-sans">
      <h1 className="text-3xl font-bold text-[#4b382a] mb-4">
        Restaurant Management
      </h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search restaurants..."
        className="mb-4 p-2 w-full sm:w-1/2 border border-[#bfa66a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bfa66a]"
      />
      <button
        className="bg-[#e0cda9] p-2 rounded transition-all duration-500 mx-6 translate-y-1"
        onClick={() => {
          setRefetch(!refetch);
        }}
      >
        <span
          className={`flex justify-center items-center  ${
            loading && "animate-spin transition duration-1500"
          }`}
        >
          <RefreshCcw size={24} color="#4b382a" />
        </span>
      </button>
      <button
        className="bg-[#e0cda9] p-2 rounded transition-all duration-500 mx-6 translate-y-1 "
        onClick={() => {setShowAddRes(true)}}
      >
        <span className={`flex text-[#4b382a] font-semibold`}>
        <CirclePlus strokeWidth={1.3} color="#4b382a"/> &nbsp; Add Restaurant
        </span>
      </button>
      {showAddRes && (
        <PopupCard>
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-[#4b382a] border-b">Add Restaurant</h1>
          <button onClick={() => setShowAddRes(false)}>
            <X size={24} color="red" />
          </button>
          </div>
          <AddRestaurantsForm />
        </PopupCard>
      )}
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-600 text-lg">
          Error: {error}. Please try again.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-md overflow-hidden shadow-md">
            <thead className="bg-[#e0cda9] text-[#4b382a] sticky top-0">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Restaurant Name</th>
                <th className="p-3 text-left">Cuisine</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-center">Status</th>{" "}
                {/* Centered for button */}
                <th className="p-3 text-center">Actions</th>{" "}
                {/* Centered for buttons */}
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-600">
                    No restaurants found.
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((restaurant, index) => (
                  <React.Fragment key={restaurant._id}>
                    {" "}
                    {/* Key applies here */}
                    <tr
                      className="border-b hover:bg-[#f9f4ea] cursor-pointer"
                      onClick={() => toggleExpand(restaurant._id)}
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium">{restaurant.name}</td>
                      <td className="p-3 text-gray-700">
                        {restaurant.cuisineTypes?.join(", ") || "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">
                        {restaurant.location?.address || "N/A"}
                      </td>
                      <td
                        className="p-3 relative text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setStatusDropdownId(
                              statusDropdownId === restaurant._id
                                ? null
                                : restaurant._id
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors w-24 mx-auto
                            ${
                              restaurant.active
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                        >
                          {restaurant.active ? "Active" : "Inactive"}
                          <svg
                            className="w-3 h-3 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {statusDropdownId === restaurant._id && (
                          <div className="absolute z-10 mt-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded shadow-lg w-28">
                            <button
                              onClick={() =>
                                handleStatusChange(restaurant._id, "Active")
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                            >
                              Active
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(restaurant._id, "Inactive")
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                            >
                              Inactive
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="p-3 space-x-2 text-center">
                        {/* <button
                          className="inline-flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:shadow-lg hover:bg-blue-200 duration-300 transform hover:scale-105"
                          title="Edit Restaurant"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row expansion
                            alert(`Edit ${restaurant.name}`); // Placeholder for edit logic
                          }}
                        >
                          <Pencil strokeWidth={1.5} size={18} />
                        </button> */}
                        <button
                          className="inline-flex items-center justify-center bg-red-100 text-red-700 px-3 py-1 rounded-md hover:shadow-lg hover:bg-red-200 duration-300 transform hover:scale-105"
                          title="Delete Restaurant"
                          onClick={(e) => handleDelete(e, restaurant._id)}
                        >
                          <Trash strokeWidth={1.5} size={18} />
                        </button>
                      </td>
                    </tr>
                    {expandedRestaurant === restaurant._id && (
                      <tr className="bg-[#f6efe0] text-sm">
                        <td colSpan="6" className="p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 px-4">
                            <p>
                              <span className="font-semibold text-[#4b382a]">
                                Description:
                              </span>{" "}
                              {restaurant.shortDescription || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold text-[#4b382a]">
                                Rating:
                              </span>{" "}
                              {restaurant.ratingAverage
                                ? `${restaurant.ratingAverage.toFixed(1)} (${
                                    restaurant.ratingQuantity
                                  } votes)`
                                : "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold text-[#4b382a]">
                                Delivery Radius:
                              </span>{" "}
                              {restaurant.deliveryRadiusMeters
                                ? `${restaurant.deliveryRadiusMeters} meters`
                                : "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold text-[#4b382a]">
                                License:
                              </span>{" "}
                              {restaurant.license || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold text-[#4b382a]">
                                Open Hours:
                              </span>{" "}
                              {restaurant.openHours || "N/A"}
                            </p>
                            <p>
                              <span className="font-semibold text-[#4b382a]">
                                Delivery Available:
                              </span>{" "}
                              {typeof restaurant.isDeliveryAvailable ===
                              "boolean"
                                ? restaurant.isDeliveryAvailable
                                  ? "Yes"
                                  : "No"
                                : "N/A"}
                            </p>
                            {restaurant.managerId &&
                            typeof restaurant.managerId === "object" ? (
                              <>
                                <p>
                                  <span className="font-semibold text-[#4b382a]">
                                    Manager Name:
                                  </span>{" "}
                                  {`${restaurant.managerId.firstName || ""} ${
                                    restaurant.managerId.lastName || ""
                                  }`.trim() || "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold text-[#4b382a]">
                                    Manager Email:
                                  </span>{" "}
                                  {restaurant.managerId.email || "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold text-[#4b382a]">
                                    Manager Phone:
                                  </span>{" "}
                                  {restaurant.managerId.phone || "N/A"}
                                </p>
                              </>
                            ) : (
                              <p className="font-semibold text-gray-500">
                                Manager Details: N/A
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ACustomers;
