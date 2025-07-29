import React, { useEffect, useState } from "react";
import { MapPinCheckInside } from "lucide-react";
import useUserStore from "../../Store/UseStore";

const EditRestaurantForm = ({ onSaveSuccess, onCancel }) => {
  // 1. Centralized state management from the Zustand store
  const { restaurant: restaurantFromStore, setRestaurant } = useUserStore();
  
  // 2. Local component state for loading, errors, and form data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates1, setCoordinates] = useState([]);
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
      coordinates: coordinates1,
      type: "Point",
    }, 
    // To store [longitude, latitude]
  });

  // 3. Effect to populate the form when the component mounts or restaurant data changes
  useEffect(() => {
    // Use the restaurant data from the store, not sessionStorage
    if (restaurantFromStore) {
      setForm({
        name: restaurantFromStore.name || "",
        cuisineTypes: restaurantFromStore.cuisineTypes?.join(", ") || "",
        description: restaurantFromStore.description || "",
        openHours: restaurantFromStore.openHours || "",
        deliveryRadiusMeters: restaurantFromStore.deliveryRadiusMeters || 0,
        // Ensure boolean values are correctly handled
        isDeliveryAvailable: !!restaurantFromStore.isDeliveryAvailable,
        isOpenNow: !!restaurantFromStore.isOpenNow,
        address: restaurantFromStore.location?.address || "",
        coordinates: restaurantFromStore.location?.coordinates || [],
        imageCover: null, // File input cannot be pre-filled for security reasons
      });
      setLoading(false);
    } else {
      // Handle the case where no restaurant data is available
      setError("Restaurant data could not be loaded.");
      setLoading(false);
    }
  }, [restaurantFromStore]); // This effect runs when restaurant data changes

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 4. Use the restaurantId prop instead of a hardcoded ID
    // if (!restaurantId) {
    //   alert("Error: No restaurant ID provided.");
    //   return;
    // }

    // 5. Use FormData to support file uploads along with other data
    const formData = new FormData();

    // Append all form fields. The backend must be able to parse multipart/form-data.
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("openHours", form.openHours);
    formData.append("deliveryRadiusMeters", form.deliveryRadiusMeters);
    formData.append("isDeliveryAvailable", form.isDeliveryAvailable);
    formData.append("isOpenNow", form.isOpenNow);
    
    // Handle location data
    formData.append("address", form.address);
    if (form.coordinates && form.coordinates.length === 2) {
      // Send coordinates for the backend to reconstruct the GeoJSON Point
      formData.append("longitude", form.coordinates[0]);
      formData.append("latitude", form.coordinates[1]);
    }

    // Handle cuisineTypes array by appending each type
    form.cuisineTypes
      .split(",")
      .map((type) => type.trim())
      .filter((type) => type)
      .forEach((type) => {
        formData.append("cuisineTypes", type);
      });
      
    // Only append the image if a new one was selected
    if (form.imageCover) {
      formData.append("imageCover", form.imageCover);
    }

    try {

      const res = await fetch(
        `https://gebeta-delivery1.onrender.com/api/v1/restaurants/${restaurantFromStore._id}`,
        {
          method: "PATCH",
          headers: {
            // Do NOT set 'Content-Type'. The browser sets it automatically with the correct boundary for FormData.
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData, // Send the FormData object
        }
      );

      const result = await res.json();
      if (res.ok && result.status === "success") {
        alert("Restaurant updated successfully!");
        const updatedRestaurant = result.data.restaurant;
        // Update the global store
        setRestaurant(updatedRestaurant); 
        // Notify parent component
        onSaveSuccess && onSaveSuccess(updatedRestaurant);
      } else {
        throw new Error(result.message || "Failed to update restaurant.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert(`Failed to update restaurant: ${err.message}`);
    }
  };
  
  const handleGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([longitude, latitude]);
        // alert("Location captured! Click 'Save Changes' to apply.");
      },
      
    );
    console.log("Location captured!" , coordinates1);
  };
  // 6. Improved loading, error, and "not found" states
  if (loading) {
    return (
      <p className="p-6 text-center text-gray-600 text-lg h-[calc(100vh-110px)]">
        Loading restaurant data...
      </p>
    );
  }

  if (error || !restaurantFromStore) {
    return (
      <p className="p-6 text-center text-red-600 text-lg h-[calc(100vh-110px)]">
        {error || "Restaurant not found."}
      </p>
    );
  }


  return (
    <div className="min-h-[calc(100vh-110px)] pt-2 bg-[#f4f1e9] font-noto flex justify-center motion-preset-fade motion-duration-700">
      <div className="w-fit h-fit bg-white px-6 py-2 rounded-xl shadow-lg border border-gray-200 overflow-auto ">
        <h2 className="text-3xl font-bold text-[#4b382a] mb-8 text-center ">
          Edit Restaurant Details
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-row gap-12 justify-around">
            <div>
              {/* Form fields remain the same */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#4b382a] mb-2">Restaurant Name</label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"/>
                </div>
                <div>
                  <label htmlFor="cuisineTypes" className="block text-sm font-semibold text-[#4b382a] mb-2">Cuisine Types <span className="text-gray-500 text-xs">(comma separated)</span></label>
                  <input id="cuisineTypes" name="cuisineTypes" value={form.cuisineTypes} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-[#4b382a] mb-2">Description</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 resize-y placeholder-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="openHours" className="block text-sm font-semibold text-[#4b382a] mb-2">Open Hours</label>
                  <input type="text" id="openHours" name="openHours" value={form.openHours} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"/>
                </div>
                <div>
                  <label htmlFor="deliveryRadiusMeters" className="block text-sm font-semibold text-[#4b382a] mb-2">Delivery Radius <span className="text-gray-500 text-xs">(meters)</span></label>
                  <input id="deliveryRadiusMeters" name="deliveryRadiusMeters" value={form.deliveryRadiusMeters} onChange={handleChange} type="number" step="10" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"/>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-[#4b382a] mb-2">Address</label>
                  <input id="address" name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400" />
                </div>
                <div className="flex flex-col  justify-center">
                  <label htmlFor="imageCover" className="block text-sm font-semibold text-[#4b382a] m-">Cover Image</label>
                  <input id="imageCover" name="imageCover" type="file" accept="image/*" onChange={handleChange} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400" />
                </div>
              </div>

              <div className="flex items-center justify-start mt-5">
                <div>
                  <button type="button" onClick={handleGeolocation}
                    className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200">
                    <MapPinCheckInside size={20} />
                    Use Current Location
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-10">
              <div className="">
                {/* 8. Display image from the store and handle potential new image preview */}
                <img src={form.imageCover ? URL.createObjectURL(form.imageCover) : restaurantFromStore.imageCover} alt="Restaurant cover" className="border rounded-lg w-[200px] h-[200px] object-cover shadow-md" />
              </div>
              {/* Toggles and buttons remain the same */}
              <div className="flex flex- w-fit h-fit space-y- sm:justify-around gap-2 mt-2 p-2 bg-[#f9f4ea] rounded-lg border border-[#e0cda9]">
                <label htmlFor="isOpenNow" className="flex flex-col items-center gap-3 text-[#4b382a] cursor-pointer">
                  <div className="relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out" style={{ backgroundColor: form.isOpenNow ? "#46c265" : "#d1d5db" }}>
                    <input id="isOpenNow" type="checkbox" name="isOpenNow" checked={form.isOpenNow} onChange={handleChange} className="absolute opacity-0 w-0 h-0" />
                    <span className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ease-in-out transform ${form.isOpenNow ? "translate-x-full" : "translate-x-0"}`}/>
                  </div>
                  <span className="ml-2 text-xs font-medium select-none">Open Now</span>
                </label>
                <label htmlFor="isDeliveryAvailable" className="flex flex-col items-center gap-3 text-[#4b382a] cursor-pointer">
                  <div className="relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out" style={{ backgroundColor: form.isDeliveryAvailable ? "#46c265" : "#d1d5db" }}>
                    <input id="isDeliveryAvailable" type="checkbox" name="isDeliveryAvailable" checked={form.isDeliveryAvailable} onChange={handleChange} className="absolute opacity-0 w-0 h-0"/>
                    <span className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ease-in-out transform ${ form.isDeliveryAvailable ? "translate-x-full" : "translate-x-0" }`}/>
                  </div>
                  <span className="ml-2 text-xs font-medium select-none">Delivery Available</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            {onCancel && (
              <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
                Cancel
              </button>
            )}
            <button type="submit" className="px-8 py-2 bg-[#894718] text-white font-semibold rounded-lg hover:bg-[#3a2f24] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#bfa66a]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurantForm;