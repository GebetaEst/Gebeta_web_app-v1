import { useState, useEffect } from "react";
import UseHttp from "../../services/UseHttp";
import Loading from "../Loading/Loading";
import  useStore  from "../../Store/UseStore";
import { useUserProfile } from "../../contexts/UserProfileContext";

const ProfileEditForm = () => {
  const { userProfile, setUserProfile } = useUserProfile();
  const { patch, loading } = UseHttp();
  const { setUser } = useStore();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    restaurantName: "",
    restaurantAddress: "",
    profileImage: "",
  });

  // Load from sessionStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user-data")).state?.user;
    // console.log(JSON.parse(sessionStorage.getItem("user-data")).state.user)

    if (storedUser) {
      setFormData({
        // username: storedUser.username || "",
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        // restaurantName: storedUser.restaurantName || "",
        // restaurantAddress: storedUser.restaurantAddress || "",
        profileImage: storedUser.profilePicture || "",
      });
    }
  }, []);

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await patch("https://gebeta-delivery1.onrender.com/api/v1/users/updateMe", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response?.data?.user) {
        const updatedUser = response.data.user;

        // Update Zustand
        setUser(updatedUser);

        // Update sessionStorage
        sessionStorage.setItem("user-data", JSON.stringify({ user: updatedUser }));

        alert("Profile updated successfully!");
        setUserProfile(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong while updating the profile.");
    }
  };

  return (
    <div className="flex">
      {/* Profile Image & Upload */}
      <div className="flex flex-col gap-2 p-2">
        <div className="p-10 bg-[url('/src/assets/images/restaurant.jpg')] bg-cover bg-center h-[200px] w-[230px] rounded-xl" />
        <input
          className="border border-gray rounded-lg p-1 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-white hover:file:text-primary file:border-gray w-[230px]"
          type="file"
          name="profileImage"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              profileImage: e.target.files[0], // optional: handle FormData for images
            }))
          }
        />
      </div>

      {/* Text Fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm justify-center p-5 w-full">
        <div>
          <label className="block text-l font-medium text-primary">Username</label>
          <input
            name="username"
            type="text"
            className="w-full border-[0.5px] border-gray p-2 rounded-lg"
            value={formData?.username}
            onChange={handleChange}
            
          />
        </div>

        <div className="flex gap-10">
          <div>
            <label className="block text-sm font-medium text-primary">First Name</label>
            <input
              name="firstName"
              type="text"
              className="w-full border-[0.5px] border-gray p-2 rounded-lg"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary">Last Name</label>
            <input
              name="lastName"
              type="text"
              className="w-full border-[0.5px] border-gray p-2 rounded-lg"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border-[0.5px] border-gray p-2 rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-10">
          <div>
            <label className="block text-sm font-medium text-primary">Restaurant Name</label>
            <input
              name="restaurantName"
              type="text"
              className="w-full border-[0.5px] border-gray p-2 rounded-lg"
              value={formData.restaurantName}
              onChange={handleChange}
              
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary">Restaurant Address</label>
            <input
              name="restaurantAddress"
              type="text"
              className="w-full border-[0.5px] border-gray p-2 rounded-lg"
              value={formData.restaurantAddress}
              onChange={handleChange}
              
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary">Phone Number</label>
            <input
              name="phone"
              type="text"
              className="w-full border-[0.5px] border-gray p-2 rounded-lg"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end items-center gap-10 mt-4">
          {loading && <Loading />}
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-white hover:text-primary border border-gray transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
