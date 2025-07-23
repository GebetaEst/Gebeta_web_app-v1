import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserId } from "../../contexts/userIdContext";
import {Loading , InlineLoadingDots} from "../Loading/Loading";

const EditUser = () => {
  const navigate = useNavigate();
  const { getId } = useUserId();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMg, setErrorMg] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `https://gebeta-delivery1.onrender.com/api/v1/users/${getId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await res.json();
        setFormData({
          firstName: result.data.user.firstName || "",
          lastName: result.data.user.lastName || "",
          email: result.data.user.email || "",
          phone: result.data.user.phone || "",
        });
      } catch (err) {
        setErrorMg("Failed to load user info");
      }
    };

    if (getId) fetchUser();
  }, [getId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMg("");
    setSuccess("");

    try {
      const sanitizedPhone =
    formData.phone.startsWith("0")
      ? formData.phone.slice(1)
      : formData.phone;
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      form.append("phone", sanitizedPhone);
      if (profilePicture) {
        form.append("profilePicture", profilePicture);
      }

      const res = await fetch(
        `https://gebeta-delivery1.onrender.com/api/v1/users/${getId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: form,
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      setSuccess("User updated successfully!");
    } catch (err) {
      setErrorMg("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" p- bg-[#f4f1e9] w-[400px] rounded ">
      <h1 className="text-2xl font-semibold mb-4 border-b pb-2">Edit User</h1>
      <div className="space-y-4">
        {["firstName", "lastName", "email", "phone"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        ))}

        
      </div>

      {errorMg && <p className="text-red-500 mt-2">{errorMg}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}

      <button
        onClick={handleSubmit}
        className="mt-4 bg-primary text-white px-6 py-2 rounded hover:bg-opacity-80"
        disabled={loading}
      >
        {loading ? <InlineLoadingDots /> : "Update"}
      </button>
    </div>
  );
};

export default EditUser;
