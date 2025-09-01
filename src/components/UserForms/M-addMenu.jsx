import { useState } from "react";

const AddMenu = ({ menuId }) => {
  const [formData, setFormData] = useState({
    foodName: "",
    price: "",
    // categoryId: "",
    menuId: menuId,
    ingredients: "",
    instructions: "",
    cookingTimeMinutes: "",
    imageCover: "",
    isFeatured: false,
    status: "Available",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
        setFormData((prev) => ({
          ...prev,
          [name]: file, // store file instead of just string
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.foodName || !formData.price || !formData.menuId) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Use FormData for file upload
      const payload = new FormData();
      payload.append("foodName", formData.foodName);
      payload.append("price", parseFloat(formData.price));
      payload.append("categoryId", formData.categoryId);
      payload.append("menuId", formData.menuId);
      if (formData.ingredients) payload.append("ingredients", formData.ingredients);
      if (formData.instructions) payload.append("instructions", formData.instructions);
      if (formData.cookingTimeMinutes)
        payload.append("cookingTimeMinutes", parseInt(formData.cookingTimeMinutes));
      if (formData.imageCover) payload.append("imageCover", formData.imageCover);
      payload.append("isFeatured", formData.isFeatured);
      payload.append("status", formData.status);

      const response = await fetch("https://gebeta-delivery1.onrender.com/api/v1/foods", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: payload,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Food item added successfully!");
        setFormData({
          foodName: "",
          price: "",
          categoryId: "",
          menuId: menuId,
          ingredients: "",
          instructions: "",
          cookingTimeMinutes: "",
          imageCover: "",
          isFeatured: false,
          status: "Available",
        });
        setImagePreview("");
      } else {
        alert(data.message || "Failed to add food item");
      }
    } catch (error) {
      console.error("Error adding food item:", error);
      alert("Error adding food item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-4 w-[500px]">
        <form onSubmit={handleSubmit} className="space-y-2 font-noto w-full">
          <div>
            <label className="block text-sm font-medium text-[#4b382a] mb-1">
              Food Name *
            </label>
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b382a]"
              required
            />
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#4b382a] mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b382a]"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-[#4b382a] mb-1">
                Cooking Time (minutes)
              </label>
              <input
                type="number"
                name="cookingTimeMinutes"
                value={formData.cookingTimeMinutes}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b382a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4b382a] mb-1">
              Ingredients
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b382a]"
              placeholder="List ingredients (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4b382a] mb-1">
              Image Cover
            </label>
            <input
              type="file"
              accept="image/*"
              name="imageCover"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b382a]"
            />
          </div>

          <div className="flex flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#4b382a] mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b382a]"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div className="flex items-center pb-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                    formData.isFeatured ? "bg-[#4b382a]" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                      formData.isFeatured ? "translate-x-5" : "translate-x-0"
                    } mt-0.5 ml-0.5`}
                  ></div>
                </div>
                <span className="ml-3 text-sm text-[#4b382a]">Featured Item</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#905618] text-white py-2 px-4 rounded-md hover:bg-[#3d2e22] focus:outline-none focus:ring-2 focus:ring-[#4b382a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Food Item"}
          </button>
        </form>

        <div className="border-gray-300 rounded-md pt-8 w-[240px]">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Food Preview"
              className="border-2 object- h-[170px] w-[200px] rounded-md shadow-md"
            />
          ) : (
            <div className="h-[170px] w-[170px] border-2 rounded-md flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddMenu;
