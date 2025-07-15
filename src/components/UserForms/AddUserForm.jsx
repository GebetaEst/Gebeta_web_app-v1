import { useState } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    role: "Customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      setError("All fields are required");
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

    // Sanitize phone number
    const sanitizedPhone = formData.phone.startsWith("0")
      ? formData.phone.slice(1)
      : formData.phone;

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: sanitizedPhone,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      role: formData.role,
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
      console.log(payload);

      if (response.data) {
        alert("✅ User added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          passwordConfirm: "",
          role: "Customer",
        });
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="font-noto">
      <div className="flex gap-4">
        <div className="flex flex-col">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            className="w-full p-2 border border-gray rounded-lg h-[35px]"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value.trim() })
            }
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            className="w-full p-2 border border-gray rounded-lg h-[35px]"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value.trim() })
            }
            required
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="flex flex-col">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border border-gray rounded-lg h-[35px]"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value.trim() })
            }
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="w-full p-2 border border-gray rounded-lg h-[35px]"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value.trim() })
            }
            required
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="flex flex-col">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border border-gray rounded-lg h-[35px]"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value.trim() })
            }
            required
            minLength={6}
          />
        </div>

        <div className="flex flex-col">
          <label>Confirm Password</label>
          <input
            type="password"
            name="passwordConfirm"
            className="w-full p-2 border border-gray rounded-lg h-[35px]"
            value={formData.passwordConfirm}
            onChange={(e) =>
              setFormData({
                ...formData,
                passwordConfirm: e.target.value.trim(),
              })
            }
            required
            minLength={6}
          />
        </div>
      </div>

      <div className="flex mt-6">
        <label className="mr-2 self-center">Role:</label>
        <select
          name="role"
          className="w-fit p-2 border border-gray rounded-lg"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        >
          <option value="Customer">Customer</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
      </div>

      <div className="flex justify-end mt-6 items-center gap-[100px]">
        {loading && <Loading />}
        {error && <p className="text-red-500 mt-2 mr-4">{error}</p>}

        <div>
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-lg hover:bg-white hover:text-primary border border-gray transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddUserForm;
