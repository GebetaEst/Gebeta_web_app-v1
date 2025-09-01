import React, { useEffect, useState } from "react";
import { Trash, RefreshCcw, CirclePlus, X } from "lucide-react";
import AddRestaurantsForm from "../../components/UserForms/A-AddRestaurantsForm";
import PopupCard from "../../components/Cards/PopupCard";
import { Loading } from "../../components/Loading/Loading";
import AResOrders from "../../components/A-ResOrdersDetails"
const ACustomers = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRestaurant, setExpandedRestaurant] = useState(null);
  const [showAddRes, setShowAddRes] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [statusDropdownId, setStatusDropdownId] = useState(null);
  const [managerInputs, setManagerInputs] = useState({});
  const [showOrders, setShowOrders] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);
  // State for custom modal dialogs
  const [alertInfo, setAlertInfo] = useState({ show: false, message: "" });
  const [confirmDeleteInfo, setConfirmDeleteInfo] = useState({
    show: false,
    id: null,
  });

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
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        console.log(data)
        if (res.ok && data.status === "success") {
          setRestaurants(data.data.restaurants || []);
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
      setAlertInfo({
        show: true,
        message: `Failed to update status: ${error.message}`,
      });
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

  const handleManagerInputChange = (id, value) => {
    setManagerInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAssignManager = (id) => {
    const phone = managerInputs[id] || "";
    if (!phone) {
      setAlertInfo({ show: true, message: "Please enter a phone number" });
      return;
    }

    const assignManager = async () => {
      try {
        const res = await fetch(
          `https://gebeta-delivery1.onrender.com/api/v1/restaurants/assign-manager`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              phone:phone,
              restaurantId:id,
            }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          setAlertInfo({
            show: true,
            message: "",
          });
          setTimeout(() => {
            setAlertInfo({ show: false, message: "" });
          }, 3000);
          setRefetch((prev) => !prev);
          setManagerInputs((prev) => ({ ...prev, [id]: "" }));
        } else {
          throw new Error(data.message || "Failed to assign manager");
        }
      } catch (err) {
        console.error("Assign manager error:", err);
        setAlertInfo({
          show: true,
          message: `Failed to assign manager: ${err.message}`,
        });
      }
    };
    assignManager();
  };

  const handelShowOrders = (restaurantId , restaurantName) => {
    setShowOrders(prev => !prev);
    setRestaurantId(restaurantId);
    setRestaurantName(restaurantName);
  }

  return (
    <>
    {showOrders && (
      <PopupCard>
        <div className="w-[1200px]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#4b382a] border-b-2 border-[#e0cda9]">
            Restaurant Orders
          </h1>
          <button
            onClick={() => setShowOrders(false)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={28} />
          </button>
        </div>
        <div className="max-h-[75vh]">
          <AResOrders restaurantId={restaurantId} restaurantName={restaurantName}/>
        </div>
        </div>
      </PopupCard>
    )}
    <div className="p-6 h-[calc(100vh-65px)] bg-[#f4f1e9] font-sans overflow-y-auto">
      <h1 className="text-3xl font-bold text-[#4b382a] mb-4 pl-6">
        List of Management
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
            <h1 className="text-2xl font-bold text-[#4b382a] border-b-2 border-[#e0cda9]">
              Add Restaurant
            </h1>
            <button
              onClick={() => setShowAddRes(false)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={28} />
            </button>
          </div>
          <AddRestaurantsForm />
        </PopupCard>
      )}

      {alertInfo.show && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs flex items-center justify-center absolute top-28 right-10 motion-preset-confetti motion-duration-700">
            <p className="text-green-600 text-lg">successfully assigned manager</p>
           
            
          </div>
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
                        <p>
                          {restaurant.isDeliveryAvailable
                            ? "Available"
                            : "Not Available"}
                        </p>
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
                            <div>
                              
                            <button className="bg-[#e0cda9] border-[#b88c69] border text-[#4b382a] p-2  rounded-md mt-1 cursor-pointer" 
                            onClick={() => handelShowOrders(restaurant._id , restaurant.name)}>
                              See Orders details
                              </button>
                            </div>
                            {restaurant.managerId &&
                            typeof restaurant.managerId === "object" ? (
                              <>
                                <div className="relative group">
                                  <p className="cursor-pointer">
                                    <span className="font-semibold text-[#4b382a]">
                                      Manager Name:
                                    </span>{" "}
                                    {`${restaurant.managerId.firstName || ""} ${
                                      restaurant.managerId.lastName || ""
                                    }`.trim() || "N/A"}
                                  </p>
                                  
                                  {/* Hover tooltip with manager details - positioned to the right */}
                                  <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white border border-[#e0cda9] rounded-lg shadow-lg p-3 bottom-14 left-100 ml-2 min-w-[200px]">
                                    <div className="space-y-1 text-xs">
                                      <p><span className="font-semibold">Full Name:</span> {`${restaurant.managerId.firstName || ""} ${restaurant.managerId.lastName || ""}`.trim() || "N/A"}</p>
                                      <p><span className="font-semibold">Email:</span> {restaurant.managerId.email || "N/A"}</p>
                                      <p><span className="font-semibold">Phone:</span> {restaurant.managerId.phone || "N/A"}</p>
                                      <p><span className="font-semibold">ID:</span> {restaurant.managerId._id || "N/A"}</p>
                                      <p><span className="font-semibold">Role:</span> {restaurant.managerId.role || "N/A"}</p>
                                      <p><span className="font-semibold">Verified:</span> {restaurant.managerId.isPhoneVerified ? <span className="text-green-500">✓</span> : <span className="text-red-500">✗</span>}</p>
                                      {restaurant.managerId.createdAt && (
                                        <p><span className="font-semibold">Joined:</span> {new Date(restaurant.managerId.createdAt).toLocaleDateString()}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                              </>
                            ) : (
                              <div className=" ">
                                <p className="font-semibold text-gray-500 mb-2">
                                  Manager Details: N/A
                                </p>
                              </div>
                            )}
                            <div>
                              <label className="font-semibold text-[#4b382a]">
                                Reassign Manager
                              </label>
                              <div className="flex gap-2">
                                <input
                                  className="w-[150px] border border-[#e0cda9] rounded-md p-1 mt-1"
                                  value={managerInputs[restaurant._id] || ""}
                                  onChange={(e) =>
                                    handleManagerInputChange(
                                      restaurant._id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="+251..."
                                />
                                <button
                                  className="bg-[#e0cda9] border-[#b88c69] border text-[#4b382a] px-2 py-1 rounded-md mt-1 cursor-pointer"
                                  onClick={() =>
                                    handleAssignManager(restaurant._id)
                                  }
                                >
                                  Assign
                                </button>
                              </div>
                            </div>
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
    </>
  );
};

export default ACustomers;