import React, { useEffect, useState } from "react";

const EditRestaurantForm = ({ restaurantId, onSaveSuccess, onCancel }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    cuisineTypes: "",
    shortDescription: "",
    openHours: "",
    deliveryRadiusMeters: "",
    isDeliveryAvailable: false,
    isOpenNow: false,
    license: "",
    address: "",
    imageCover: "",
    active: true,
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId) {
        setRestaurant(null);
        setForm({
          name: "", cuisineTypes: "", shortDescription: "", openHours: "",
          deliveryRadiusMeters: "", isDeliveryAvailable: false, isOpenNow: false,
          license: "", address: "", imageCover: "", active: true,
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://gebeta-delivery1.onrender.com/api/v1/restaurants/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.status === "success") {
          const r = data.data.restaurant;
          setRestaurant(r);
          setForm({
            name: r.name || "",
            cuisineTypes: r.cuisineTypes?.join(", ") || "",
            shortDescription: r.shortDescription || "",
            openHours: r.openHours || "",
            deliveryRadiusMeters: r.deliveryRadiusMeters || "",
            isDeliveryAvailable: r.isDeliveryAvailable ?? false,
            isOpenNow: r.isOpenNow ?? false,
            license: r.license || "",
            address: r.location?.address || "",
            imageCover: r.imageCover || "",
            active: r.active ?? true,
          });
        } else {
          throw new Error(data.message || "Failed to load restaurant data.");
        }
      } catch (err) {
        console.error("Failed to fetch restaurant:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurant) {
      alert("No restaurant data to update.");
      return;
    }

    const payload = {
      ...form,
      cuisineTypes: form.cuisineTypes
        .split(",")
        .map((type) => type.trim().toUpperCase())
        .filter((type) => type),
      location: {
        type: "Point",
        coordinates: restaurant.location?.coordinates || [0, 0],
        address: form.address,
      },
      deliveryRadiusMeters: Number(form.deliveryRadiusMeters),
    };

    try {
      const res = await fetch(`https://gebeta-delivery1.onrender.com/api/v1/restaurants/${restaurant._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok && result.status === "success") {
        alert("Restaurant updated successfully!");
        onSaveSuccess && onSaveSuccess(result.data.restaurant);
      } else {
        throw new Error(result.message || "Failed to update restaurant.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert(`Failed to update restaurant: ${err.message}`);
    }
  };

  if (loading) return <p className="p-6 text-center text-[#4b382a] text-lg">Loading restaurant data...</p>;
  if (error) return <p className="p-6 text-center text-red-600 text-lg">Error: {error}</p>;
  if (!restaurant && restaurantId) return <p className="p-6 text-center text-gray-600 text-lg">Restaurant not found.</p>;

  return (
    <div className="min-h-[calc(100vh-110px)] pt-2 bg-[#f4f1e9] font-noto flex p- justify-center motion-preset-fade motion-duration-700">
      <div className="max-w-4xl w-full h-fit  bg-white p-4 rounded-xl shadow-lg border border-gray-200 overflow-auto ">
        <h2 className="text-3xl font-bold text-[#4b382a] mb-8 text-center ">Edit Restaurant Details</h2>

        <form onSubmit={handleSubmit} className="">
            <div className="flex gap-6 justify-around ">


            <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#4b382a] mb-2">Restaurant Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="cuisineTypes" className="block text-sm font-semibold text-[#4b382a] mb-2">Cuisine Types <span className="text-gray-500 text-xs">(comma separated)</span></label>
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
            <label htmlFor="shortDescription" className="block text-sm font-semibold text-[#4b382a] mb-2">Short Description</label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 resize-y placeholder-gray-400"
            />
          </div>

          {/* Section 2: Operational Details (Hours, Radius, License, Address) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="openHours" className="block text-sm font-semibold text-[#4b382a] mb-2">Open Hours</label>
              <input
              type="time"
                id="openHours"
                name="openHours"
                value={form.openHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
                />
            </div>
            <div>
              <label htmlFor="deliveryRadiusMeters" className="block text-sm font-semibold text-[#4b382a] mb-2">Delivery Radius <span className="text-gray-500 text-xs">(meters)</span></label>
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
              <label htmlFor="license" className="block text-sm font-semibold text-[#4b382a] mb-2">Business License</label>
              <input
                id="license"
                name="license"
                value={form.license}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-[#4b382a] mb-2">Address</label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
                />
            </div>
          </div>

          {/* Section 3: Media */}
          <div>
            <label htmlFor="imageCover" className="block text-sm font-semibold text-[#4b382a] m-2">Cover Image</label>
            <input
              id="imageCover"
              name="imageCover"
              value={form.imageCover}
              onChange={handleChange}
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa66a] focus:border-transparent transition duration-200 placeholder-gray-400"
              />
          </div>

          </div>

          {/* Section 4: Status Toggles */}
          <div className="flex flex-col w-fit h-fit space-y-14 sm:justify-around gap-2 mt-2 p-2 bg-[#f9f4ea] rounded-lg border border-[#e0cda9]">
            
            {/* <label htmlFor="active" className="flex flex-col items-center gap-3 text-[#4b382a] cursor-pointer ">
              <div className="relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out"
                   style={{ backgroundColor: form.active ? '#4b382a' : '#d1d5db' }}>
                <input
                  id="active"
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="absolute opacity-0 w-0 h-0" 
                  />
                <span className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ease-in-out transform ${form.active ? 'translate-x-full' : 'translate-x-0'}`} />
              </div>
              <span className="text-xs font-medium select-none ">Restaurant Active</span>
            </label> */}

            {/* Toggle Switch for Open Now */}
            <label htmlFor="isOpenNow" className="flex flex-col items-center gap-3 text-[#4b382a] cursor-pointer">
              <div className="relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out"
                   style={{ backgroundColor: form.isOpenNow ? '#46c265' : '#d1d5db' }}>
                <input
                  id="isOpenNow"
                  type="checkbox"
                  name="isOpenNow"
                  checked={form.isOpenNow}
                  onChange={handleChange}
                  className="absolute opacity-0 w-0 h-0"
                />
                <span className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ease-in-out transform ${form.isOpenNow ? 'translate-x-full' : 'translate-x-0'}`} />
              </div>
              <span className="ml-2 text-xs font-medium select-none">Open Now</span>
            </label>

            {/* Toggle Switch for Delivery Available */}
            <label htmlFor="isDeliveryAvailable" className="flex flex-col items-center gap-3 text-[#4b382a] cursor-pointer">
              <div className="relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out"
                   style={{ backgroundColor: form.isDeliveryAvailable ? '#46c265' : '#d1d5db' }}>
                <input
                  id="isDeliveryAvailable"
                  type="checkbox"
                  name="isDeliveryAvailable"
                  checked={form.isDeliveryAvailable}
                  onChange={handleChange}
                  className="absolute opacity-0 w-0 h-0"
                />
                <span className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ease-in-out transform ${form.isDeliveryAvailable ? 'translate-x-full' : 'translate-x-0'}`} />
              </div>
              <span className="ml-2 text-xs font-medium select-none">Delivery Available</span>
            </label>
          </div>

                  </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-8 py-2 bg-[#894718] text-white font-semibold rounded-lg hover:bg-[#3a2f24] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#bfa66a] absolute -translate-y-16"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurantForm;