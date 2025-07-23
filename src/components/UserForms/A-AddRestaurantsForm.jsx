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
    isOpenNow: false,
    openHours: "",
    shortDescription: "",
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
      const res = await fetch(
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
            location: {
              address: formData.locationAddress,
              description: formData.locationDescription,
              type: "Point",
              coordinates: [
                parseFloat(formData.longitude),
                parseFloat(formData.latitude),
              ],
            },
            cuisineTypes: formData.cuisineTypes.split(",").map((c) => c.trim()),
            deliveryRadiusMeters: parseInt(formData.deliveryRadiusMeters),
            imageCover: formData.imageCover,
            isDeliveryAvailable: formData.isDeliveryAvailable,
            isOpenNow: formData.isOpenNow,
            openHours: formData.openHours,
            shortDescription: formData.shortDescription,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
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
          isOpenNow: false,
          openHours: "",
          shortDescription: "",
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
      <form onSubmit={handleSubmit} className="">
        {/* Basic Info */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

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

        {/* Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {" "}
            Address
          </label>
          <input
            name="locationAddress"
            value={formData.locationAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

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

          <div className="space-y-2">
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
          <div className="space-y-2 ">
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

        {/* Delivery and Cuisine */}

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="inline-flex items-center space-x-2 text-amber-800">
            <input
              type="checkbox"
              name="isDeliveryAvailable"
              checked={formData.isDeliveryAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
            <span>Delivery Available</span>
          </label>
          
        </div>
              </div>

        {/* Open Hours, Image, Description */}
        

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Image Cover (filename or URL)
          </label>
          <input
            name="imageCover"
            value={formData.imageCover}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Short Description
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py- border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-fit flex  justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
