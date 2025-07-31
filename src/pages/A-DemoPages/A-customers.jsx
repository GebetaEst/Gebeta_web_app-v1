import React, { useEffect, useState } from "react";
import { Trash, RefreshCcw, CirclePlus, X } from "lucide-react";
import AddRestaurantsForm from "../../components/UserForms/A-AddRestaurantsForm";
import PopupCard from "../../components/Cards/PopupCard";
import {Loading} from "../../components/Loading/Loading";

const ACustomers = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRestaurant, setExpandedRestaurant] = useState(null);
  const [showAddRes, setShowAddRes] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [statusDropdownId, setStatusDropdownId] = useState(null);

  // State for custom modal dialogs
  const [alertInfo, setAlertInfo] = useState({ show: false, message: "" });
  const [confirmDeleteInfo, setConfirmDeleteInfo] = useState({ show: false, id: null });

  // Fetch all restaurants on component mount or refetch
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://gebeta-delivery1.onrender.com/api/v1/restaurants",
          {
            headers: {
              // Using a placeholder token for demonstration as localStorage is not ideal in some environments
              // Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        const data = await res.json();
        // console.log(data)
        if (res.ok && data.status === "success") {
          setRestaurants(data.data.restaurants || []); // Ensure restaurants is always an array
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

  // Toggles the expanded view for a restaurant row
  const toggleExpand = (id) => {
    setExpandedRestaurant((prev) => (prev === id ? null : id));
  };

  // Handles changing the active status of a restaurant
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
      const data = await res.json();
      console.log(data)
      if (res.ok && data.status === "success") {
        setRestaurants((prev) =>
          prev.map((restaurant) =>
            restaurant._id === id
              ? { ...restaurant, active: newStatus === "Active" }
              : restaurant
          )
        );
        setStatusDropdownId(null); // Close dropdown on success
      } else {
        throw new Error(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Status update failed:", error);
      // Use custom alert modal for user feedback
      setAlertInfo({ show: true, message: `Failed to update status: ${error.message}` });
    }
  };

  // Initiates the delete process by showing the confirmation modal
  const handleDelete = (e, id) => {
    e.stopPropagation();
    setConfirmDeleteInfo({ show: true, id: id });
  };

  // Performs the actual deletion after user confirmation
  const confirmDeleteAction = async () => {
    if (!confirmDeleteInfo.id) return;
    const id = confirmDeleteInfo.id;

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
     console.log(res)
      if (res.ok) {
        setRestaurants((prev) =>
          prev.filter((restaurant) => restaurant._id !== id)
        );
        if (expandedRestaurant === id) {
          setExpandedRestaurant(null);
        }
        // Use custom alert modal for user feedback
        setAlertInfo({ show: true, message: "Restaurant deleted successfully!" });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete restaurant.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      // Use custom alert modal for user feedback
      setAlertInfo({ show: true, message: `Failed to delete restaurant: ${err.message}` });
    } finally {
      // Hide the confirmation modal
      setConfirmDeleteInfo({ show: false, id: null });
    }
  };

  // Filter restaurants based on search input
  const filteredRestaurants = Array.isArray(restaurants)
    ? restaurants.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

  return (
    <div className="p-6 min-h-[calc(100vh-70px)] bg-[#f4f1e9] font-sans">
      {/* Custom Alert Modal */}
      {alertInfo.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center w-11/12 max-w-sm">
            <p className="mb-4 text-lg text-[#4b382a]">{alertInfo.message}</p>
            <button
              onClick={() => setAlertInfo({ show: false, message: '' })}
              className="bg-[#4b382a] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmDeleteInfo.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center w-11/12 max-w-sm">
            <p className="mb-6 text-lg text-[#4b382a]">Are you sure you want to delete this restaurant?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeleteInfo({ show: false, id: null })}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-[#4b382a] mb-4">
        Restaurant Management
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants..."
          className="p-2 flex-grow sm:flex-grow-0 sm:w-1/2 border border-[#bfa66a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bfa66a]"
        />
        <button
          className="bg-[#e0cda9] p-2 rounded-md transition-transform duration-500 hover:scale-110"
          onClick={() => setRefetch(!refetch)}
          title="Refresh Data"
        >
          <span
            className={`flex justify-center items-center ${
              loading ? "animate-spin" : ""
            }`}
          >
            <RefreshCcw size={24} color="#4b382a" />
          </span>
        </button>
        <button
          className="bg-[#e0cda9] p-2 rounded-md transition-transform duration-500 active:-rotate-6 transform-all flex items-center"
          onClick={() => setShowAddRes(true)}
        >
          <span className="flex items-center text-[#4b382a] font-semibold">
            <CirclePlus strokeWidth={1.5} color="#4b382a" className="mr-2" />
            Add Restaurant
          </span>
        </button>
      </div>

      {showAddRes && (
        <PopupCard>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#4b382a] border-b-2 border-[#e0cda9]">Add Restaurant</h1>
            <button onClick={() => setShowAddRes(false)} className="text-red-500 hover:text-red-700">
              <X size={28} />
            </button>
          </div>
          <AddRestaurantsForm />
        </PopupCard>
      )}

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-600 text-lg bg-red-100 p-4 rounded-md">
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
                <th className="p-3 text-center">Delivery</th>
                <th className="p-3 text-center">Status</th>
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

                      <td className="p-3 space-x-2 text-center">
                        <p>{restaurant.isDeliveryAvailable ? "Available" : "Not Available"}</p>
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
                    </tr>
                    {expandedRestaurant === restaurant._id && (
                      <tr className="bg-[#f6efe0] text-sm">
                        <td colSpan="6" className="p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 px-4">
                            <p>
                              <span className="font-semibold text-[#4b382a]">
                                Description:
                              </span>{" "}
                              {restaurant.description || "N/A"}
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
                                Created At:
                              </span>{" "}
                              {formatDate(restaurant.createdAt)}
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
