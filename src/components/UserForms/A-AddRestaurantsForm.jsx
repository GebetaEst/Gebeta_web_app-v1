import { useState } from "react";

const AddRestaurantsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    license: "",
    locationAddress: "",
    locationDescription: "",
    latitude: "",
    longitude: "",
    cuisineTypes: "",
    deliveryRadiusMeters: "",
    imageCover: "",
    isDeliveryAvailable: false,
    isOpenNow: true,
    openHours: "",
    description: "",
    manager: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
  
    try {
      const response = await fetch(
        "https://gebeta-delivery1.onrender.com/api/v1/restaurants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            license: formData.license,
            manager: formData.manager,
            cuisineTypes: formData.cuisineTypes
              .split(",")
              .map((cuisine) => cuisine.trim()),
            deliveryRadiusMeters: parseInt(formData.deliveryRadiusMeters),
            openHours: formData.openHours,
            description: formData.description,
            isDeliveryAvailable: formData.isDeliveryAvailable,
            isOpenNow: formData.isOpenNow
          }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("✅ Restaurant added successfully!");
        setFormData({
          name: "",
          license: "",
          locationAddress: "",
          locationDescription: "",
          latitude: "",
          longitude: "",
          cuisineTypes: "",
          deliveryRadiusMeters: "",
          imageCover: "",
          isDeliveryAvailable: false,
          isOpenNow: true,
          openHours: "",
          description: "",
          manager: "",
        });
      } else {
        setMessage(`❌ ${data.message || "Something went wrong."}`);
      }
    } catch (error) {
      setMessage("❌ Error submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Basic Info */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Restaurant Name
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div className="flex gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          License Number
        </label>
        <input
          name="license"
          value={formData.license}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* Assign a Manager */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Assign a Manager
        </label>
        <input
          name="manager"
          value={formData.manager}
          onChange={handleChange}
          placeholder="Id of the manager"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div>
      </div>

      {/* Location */}
      {/* <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          name="locationAddress"
          value={formData.locationAddress}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Cuisine Types (comma-separated)
          </label>
          <input
            name="cuisineTypes"
            value={formData.cuisineTypes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div className="space-y-2 ">
          <label className="block text-sm font-medium text-gray-700">
            Delivery Radius (meters)
          </label>
          <input
            type="number"
            name="deliveryRadiusMeters"
            value={formData.deliveryRadiusMeters}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Open Hours
            </label>
            <input
              name="openHours"
              value={formData.openHours}
              onChange={handleChange}
              placeholder="e.g. 8:00 AM - 10:00 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Switches */}
        {/* Toggle Switches */}
        <div className="flex flex-col gap-6 mt-4  items-center justify-center">
          {/* Delivery Available Switch */}
          <div className="flex items-center space-x-3 justify-between ">
            <span className="text-sm text-gray-700">Delivery Available</span>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  isDeliveryAvailable: !prev.isDeliveryAvailable,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isDeliveryAvailable ? "bg-amber-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isDeliveryAvailable
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Open Now Switch */}
          {/* <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700">Open Now</span>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  isOpenNow: !prev.isOpenNow,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isOpenNow ? "bg-amber-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isOpenNow ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div> */}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Short Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-fit flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Add Restaurant"}
      </button>

      {/* Message */}
      {message && (
        <p
          className={`mt-3 text-sm font-medium ${
            message.includes("✅") ? "text-green-700" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  </>
  );
};

export default AddRestaurantsForm;
