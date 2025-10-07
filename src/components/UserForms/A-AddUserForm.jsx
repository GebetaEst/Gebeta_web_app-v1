import { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const InlineLoadingDots = () => <span className="inline-block text-white">. . .</span>;

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    role: "Customer",
    deliveryMethod: "Car",
    fcnId: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isPhotoSaved, setIsPhotoSaved] = useState(false);

  const webcamRef = useRef(null);

  const roles = [
    { value: "Customer", label: "Customer" },
    { value: "Manager", label: "Manager" },
    { value: "Delivery_Person", label: "Delivery Person" },
  ];

  const vehicleTypes = [
    { value: "Car", label: "Car" },
    { value: "Motor", label: "Motor" },
    { value: "Bicycle", label: "Bicycle" },
  ];

  // --- SAVE PHOTO FUNCTION ---
  const savePhoto = async () => {
    if (!profilePicture) {
      setError("No photo to save. Please capture a photo first.");
      return;
    }

    setLoading(true); // Indicate saving process
    setError(null); // Clear previous errors

    try {
      // Convert base64 to blob for better handling
      const response = await fetch(profilePicture);
      const blob = await response.blob();

      // Create a file from the blob
      const fileName = `profile_${formData.firstName || 'user'}_${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Save to localStorage for persistence
      localStorage.setItem('tempProfilePicture', profilePicture);
      localStorage.setItem('tempProfilePictureTimestamp', Date.now().toString());

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Optional: Upload to server (uncomment and configure as needed)
      /*
      const formData = new FormData();
      formData.append('profilePicture', file);
      const uploadResponse = await axios.post(
        'https://gebeta-delivery1.onrender.com/api/v1/upload', // Replace with your upload endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // Assuming the server returns the URL of the uploaded image
      const uploadedImageUrl = uploadResponse.data.imageUrl;
      setProfilePicture(uploadedImageUrl); // Update state with server URL if needed
      */

      // Mark as saved
      setIsPhotoSaved(true);
      alert("📸 Photo saved successfully and downloaded!");
    } catch (error) {
      console.error('Error saving photo:', error);
      setError("Failed to save photo. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // --- CAPTURE PHOTO FUNCTION ---
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setProfilePicture(imageSrc);
      setIsCameraActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      setError("All required fields are needed");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError(null);
    setLoading(true);

    const sanitizedPhone = formData.phone.startsWith("0")
      ? formData.phone.slice(1)
      : formData.phone;

    const payload = {
      ...formData,
      phone: sanitizedPhone,
      profilePicture,
    };

    try {
      const response = await axios.post(
        "https://gebeta-delivery1.onrender.com/api/v1/users",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        alert("✅ User added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          password: "",
          passwordConfirm: "",
          role: "Customer",
          deliveryMethod: "Car",
          fcnId: "",
        });
        setProfilePicture(null);
        localStorage.removeItem('tempProfilePicture');
        localStorage.removeItem('tempProfilePictureTimestamp');
        setIsPhotoSaved(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* FULL-SCREEN CAMERA VIEW USING react-webcam */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90 rounded-lg">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            screenshotFormat="image/png"
            className="w-full max-w-md rounded-xl border-4 border-[#deb770] shadow-lg"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user",
            }}
          />
          <div className="flex gap-4 mt-6">
            <button
              onClick={capture}
              className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
            >
              Capture
            </button>
            <button
              onClick={() => setIsCameraActive(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="">
        <div className="flex">
          <div>
            {/* Role Selection */}
            <div className="">
              <label className="block font-semibold text-gray-700 mb-1">Role</label>
              <div className="flex gap-0 rounded-lg overflow-hidden shadow-sm mb-1">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    className={`flex-1 px-4 py-3 border border-[#f0d5b9] text-sm font-medium transition-all duration-200 ${
                      formData.role === role.value
                        ? "bg-[#deb770] text-white font-semibold shadow-inner"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setFormData({ ...formData, role: role.value })}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full p-2 border border-[#f0d5b9] rounded-lg focus:ring-2 focus:ring-[#deb770] focus:border-transparent transition-all"
                  placeholder="Enter first name"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full p-2 border border-[#f0d5b9] rounded-lg focus:ring-2 focus:ring-[#deb770] focus:border-transparent transition-all"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Phone and FCN ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-2 border border-[#f0d5b9] rounded-lg focus:ring-2 focus:ring-[#deb770] focus:border-transparent transition-all"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">FCN ID</label>
                <input
                  type="text"
                  value={formData.fcnId}
                  onChange={(e) =>
                    setFormData({ ...formData, fcnId: e.target.value })
                  }
                  className="w-full p-2 border border-[#f0d5b9] rounded-lg focus:ring-2 focus:ring-[#deb770] focus:border-transparent transition-all"
                  placeholder="Enter FCN ID"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-2 border border-[#f0d5b9] rounded-lg focus:ring-2 focus:ring-[#deb770] focus:border-transparent transition-all"
                  placeholder="Enter password (min 8 characters)"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">Confirm Password *</label>
                <input
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) =>
                    setFormData({ ...formData, passwordConfirm: e.target.value })
                  }
                  className="w-full p-2 border border-[#f0d5b9] rounded-lg focus:ring-2 focus:ring-[#deb770] focus:border-transparent transition-all"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Type - Only show for Delivery Person */}
          {formData.role === "Delivery_Person" && (
            <div className="m-6 motion-preset-blur-right">
              <label className="block font-medium text-gray-700 mb-3">Vehicle Type</label>
              <div className="flex gap-0 rounded-lg overflow-hidden shadow-sm my-5">
                {vehicleTypes.map((vehicle) => (
                  <button
                    key={vehicle.value}
                    type="button"
                    className={`flex-1 px-4 py-3 border border-[#f0d5b9] text-sm font-medium transition-all duration-200 ${
                      formData.deliveryMethod === vehicle.value
                        ? "bg-[#deb770] text-white font-semibold shadow-inner"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setFormData({ ...formData, deliveryMethod: vehicle.value })}
                  >
                    {vehicle.label}
                  </button>
                ))}
              </div>
              <div className="mb-0">
                <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-[#f0d5b9] shadow-sm">
                  <label className="mb-2 font-semibold text-gray-700 text-center">
                    Profile Picture
                  </label>
                  {profilePicture ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-[#deb770] shadow-lg"
                      />
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={savePhoto}
                          className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors shadow-sm"
                        >
                          Save Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePicture(null);
                            setIsCameraActive(true);
                          }}
                          className="px-4 py-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          Retake Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCameraActive(true)}
                      className="px-6 py-3 text-sm bg-[#e0cda9] text-gray-800 rounded-lg hover:bg-[#deb770] font-medium transition-colors shadow-sm"
                    >
                      📷 Take Photo
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className={`flex justify-self-end bg-[#deb770] text-white py-2 px-6 rounded-lg font-semibold text-lg shadow-lg hover:bg-[#d4a853] transition-all duration-200 ${
              loading ? "cursor-not-allowed opacity-75" : "hover:shadow-xl"
            }`}
            disabled={loading}
          >
            {loading ? <InlineLoadingDots /> : "Add User"}
          </button>
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;