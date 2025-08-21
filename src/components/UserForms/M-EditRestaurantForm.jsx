import React, { useEffect, useState } from "react";
import { MapPinCheckInside } from "lucide-react";
import useUserStore from "../../Store/UseStore";
import { Loading , InlineLoadingDots } from "../Loading/Loading";

const EditRestaurantForm = ({ onSaveSuccess, onCancel }) => {
  const { restaurant: restaurantFromStore, setRestaurant } = useUserStore();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState(null);
  
  const [form, setForm] = useState({
    name: "",
    cuisineTypes: "",
    description: "",
    openHours: "",
    deliveryRadiusMeters: 0,
    isDeliveryAvailable: false,
    isOpenNow: false,
    imageCover: null,
    location: {
      address: "",
      type: "Point",
      coordinates: [], // [lng, lat]
    },
  });

  useEffect(() => {
    setLoading(true);
    if (restaurantFromStore) {
      setForm({
        name: restaurantFromStore.name || "",
        cuisineTypes: restaurantFromStore.cuisineTypes?.join(", ") || "",
        description: restaurantFromStore.description || "",
        openHours: restaurantFromStore.openHours || "",
        deliveryRadiusMeters: restaurantFromStore.deliveryRadiusMeters || 0,
        isDeliveryAvailable: !!restaurantFromStore.isDeliveryAvailable,
        isOpenNow: !!restaurantFromStore.isOpenNow,
        location: {
          address: restaurantFromStore.location?.address || "",
          type: "Point",
          coordinates: restaurantFromStore.location?.coordinates || [],
        },
        imageCover: null, // can't pre-fill files
      });
      setLoading(false);
    } else {
      setErrorMSG("Restaurant data could not be loaded.");
      setLoading(false);
    }
  }, [restaurantFromStore]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === "address") {
      setForm(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("openHours", form.openHours);
    formData.append("deliveryRadiusMeters", Number(form.deliveryRadiusMeters)); // Convert to number
    formData.append("isDeliveryAvailable", form.isDeliveryAvailable);
    formData.append("isOpenNow", form.isOpenNow);
    const cuisineTypesArray = form.cuisineTypes
      .split(",")
      .map(type => type.trim())
      .filter(type => type);
    
    // Clear existing cuisineTypes if any
    formData.delete("cuisineTypes");
    // Append each cuisine type separately
    cuisineTypesArray.forEach(type => {
      formData.append("cuisineTypes", type);
    });
    // Append location data
    formData.append("description", form.description);
    formData.append("name", form.name);

    formData.append("location[address]", form.location.address);
    formData.append("location[type]", "Point");
    if (form.location.coordinates.length === 2) {
      formData.append("location[coordinates][0]", form.location.coordinates[0]);
      formData.append("location[coordinates][1]", form.location.coordinates[1]);
    }
  
    // Properly format cuisine types as array
    
  
    if (form.imageCover) {
      formData.append("image", form.imageCover);
    }
  
    try {
      setLoading(true);
      const res = await fetch(
        `https://gebeta-delivery1.onrender.com/api/v1/restaurants/${restaurantFromStore._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
  
      // console.log("Form data:", Object.fromEntries(formData.entries())); // Debug log
  
      const result = await res.json();
      if (res.ok && result.status === "success") {
          setMessage("Restaurant updated successfully!");
        const updatedRestaurant = result.data.restaurant;
        setRestaurant(updatedRestaurant);
        onSaveSuccess && onSaveSuccess(updatedRestaurant);
      } else {
        throw new Error(result.message || "Failed to update restaurant.");
        setErrorMSG("Failed to update restaurant. try again!");
      }
    } catch (err) {
      console.error("Update error:", err);
      setErrorMSG("Failed to update restaurant. try again");
    }
    setLoading(false);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: [longitude, latitude]
          },
        }));
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrorMSG("Failed to capture location. Please ensure location services are enabled.");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-[calc(100vh-106px)] pt-1  bg-[#f4f1e9] font-noto flex justify-center motion-preset-fade motion-duration-700">
      <div className="w-fit h-fit bg-white px-6 py-2 rounded-xl mt-2 shadow-lg border-2 border-gray-200 ">
        <h2 className="text-3xl font-bold text-[#4b382a] mb-2 text-center">
          Edit Restaurant Details
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-row gap-6 justify-around">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#4b382a] mb-2">
                    Restaurant Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="cuisineTypes" className="block text-sm font-semibold text-[#4b382a] mb-2">
                    Cuisine Types <span className="text-gray-500 text-xs">(comma separated)</span>
                  </label>
                  <input
                    id="cuisineTypes"
                    name="cuisineTypes"
                    value={form.cuisineTypes}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-[#4b382a] mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 resize-y placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="openHours" className="block text-sm font-semibold text-[#4b382a] mb-2">
                    Open Hours
                  </label>
                  <input
                    type="text"
                    id="openHours"
                    pattern="^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\s-\s(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$"
                    name="openHours"
                    value={form.openHours}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryRadiusMeters" className="block text-sm font-semibold text-[#4b382a] mb-2">
                    Delivery Radius <span className="text-gray-500 text-xs">(meters)</span>
                  </label>
                  <input
                    id="deliveryRadiusMeters"
                    name="deliveryRadiusMeters"
                    value={form.deliveryRadiusMeters}
                    onChange={handleChange}
                    type="number"
                    step="10"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-[#4b382a] mb-2">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={form.location.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <label htmlFor="imageCover" className="block text-sm font-semibold text-[#4b382a] mb-2">
                    Cover Image
                  </label>
                  <input
                    id="imageCover"
                    name="imageCover"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-start mt-5">
                <button
                  type="button"
                  onClick={handleGeolocation}
                  className=" bg-blue-200 hover:bg-blue-400 active:bg-blue-200 focus:border-green-500 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200"
                >
                  <MapPinCheckInside size={20} color="green" />
                  Use Current Location
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-10">
              <div>
                <img
                  src={
                    form?.imageCover
                      ? URL.createObjectURL(form.imageCover)
                      : restaurantFromStore?.imageCover
                  }
                  alt="Restaurant cover"
                  className="border rounded-lg w-[200px] h-[200px] object-cover shadow-md"
                />
              </div>
              <div className="flex items-center w-fit h-fit space-y-2 sm:justify-around gap-2 mt-2 p-2 bg-[#f9f4ea] rounded-lg border border-[#e0cda9]">
                <label htmlFor="isOpenNow" className="flex flex-col items-center gap-3 text-[#4b382a] cursor-pointer">
                  <div
                    className="relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out mt-2"
                    style={{ backgroundColor: form.isOpenNow ? "#46c265" : "#d1d5db" }}
                  >
                    <input
                      id="isOpenNow"
                      type="checkbox"
                      name="isOpenNow"
                      checked={form.isOpenNow}
                      onChange={handleChange}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <span
                      className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ease-in-out transform ${
                        form.isOpenNow ? "translate-x-full" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="ml-2 text-xs font-medium select-none">Open Now</span>
                </label>
                <label htmlFor="isDeliveryAvailable" className="flex flex-col items-center gap-3 text-[#4b382a] cursor-pointer ">
                  <div
                    className="relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out"
                    style={{ backgroundColor: form.isDeliveryAvailable ? "#46c265" : "#d1d5db" }}
                  >
                    <input
                      id="isDeliveryAvailable"
                      type="checkbox"
                      name="isDeliveryAvailable"
                      checked={form.isDeliveryAvailable}
                      onChange={handleChange}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <span
                      className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ease-in-out transform ${
                        form.isDeliveryAvailable ? "translate-x-full" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="ml-2 text-xs font-medium select-none">Delivery Available</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-44 mt-">
            {errorMSG !== "" && (
              <p className="text-sm font-medium text-red-600">{errorMSG}</p>
            )}
            {message !== "" && (
              <p className="text-sm font-medium text-green-600">{message}</p>
            )}
            <button
              type="submit"
              className={`px-8 py-2 bg-[#894718] text-white  font-semibold rounded-lg hover:bg-[#3a2f24] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#bfa66a] ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            >
             {loading ? <InlineLoadingDots /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurantForm;