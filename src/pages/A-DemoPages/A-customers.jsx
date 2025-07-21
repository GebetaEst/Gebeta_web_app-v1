import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const ACustomers = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const demoRestaurants = [
    {
      id: 1,
      name: "Yod Abyssinia Restaurant",
      location: "Addis Ababa, Bole",
      phone: "0912345678",
      email: "contact@yod.com",
      joinedAt: "2024-01-15",
      status: "Active",
      manager: "Abebe Bekele",
      license: "LIC-123-ET",
      branches: 3,
    },
    {
      id: 2,
      name: "Kategna Traditional Cuisine",
      location: "Addis Ababa, Sar Bet",
      phone: "0923456789",
      email: "info@kategna.com",
      joinedAt: "2024-03-22",
      status: "Pending",
      manager: "Selam Wondimu",
      license: "LIC-456-ET",
      branches: 1,
    },
    {
      id: 3,
      name: "Five Loaves Restaurant",
      location: "Addis Ababa, Piassa",
      phone: "0934567890",
      email: "five@loaves.com",
      joinedAt: "2023-11-10",
      status: "Suspended",
      manager: "Yared Asmamaw",
      license: "LIC-789-ET",
      branches: 2,
    },
    {
      id: 4,
      name: "Shemma Kitfo Bet",
      location: "Addis Ababa, 22 Mazoria",
      phone: "0945678901",
      email: "shemma@kitfo.com",
      joinedAt: "2024-05-05",
      status: "Active",
      manager: "Meseret Tadesse",
      license: "LIC-321-ET",
      branches: 4,
    },
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("https://your-api-url.com/restaurants", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRestaurants(res.data.restaurants);
      } catch (error) {
        console.error("Using demo data due to error.");
        setRestaurants(demoRestaurants);
      }
    };

    fetchRestaurants();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Active") return "text-green-700 bg-green-100";
    if (status === "Suspended") return "text-red-700 bg-red-100";
    return "text-yellow-800 bg-yellow-100";
  };

  const filteredRestaurants = restaurants.filter((rest) =>
    [rest.name, rest.location, rest.email].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-[#f4f8f5] p-6">
      <h1 className="text-3xl font-bold text-[#2e5e3f] text-center mb-4">
         Restaurant Customers
      </h1>

      {/* 🔍 Search Input */}
      <div className="mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by name, location or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-[#c9dbc9] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#88b27a] bg-white"
        />
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto rounded-xl border border-[#d6e4ce] shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-[#cfe3d7] text-[#2e4a36] text-sm">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Restaurant Name</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-[#3c4c3f]">
            {filteredRestaurants.map((rest, index) => (
              <React.Fragment key={rest.id}>
                <tr
                  onClick={() =>
                    setExpandedRow((prev) => (prev === rest.id ? null : rest.id))
                  }
                  className="border-b border-[#e6f0e8] hover:bg-[#f7faf8] transition cursor-pointer"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{rest.name}</td>
                  <td className="px-4 py-3">{rest.location}</td>
                  <td className="px-4 py-3">{rest.email}</td>
                  <td className="px-4 py-3">{rest.joinedAt}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        rest.status
                      )}`}
                    >
                      {rest.status}
                    </span>
                  </td>
                </tr>

                {/* Expanded Row */}
                {expandedRow === rest.id && (
                  <tr className="bg-[#f9fdf9] border-b border-[#dfeede]">
                    <td colSpan="6" className="px-6 py-4 text-[#2e4a36]">
                      <div className="grid gap-2 sm:grid-cols-2 text-sm">
                        <p>
                          <span className="font-semibold">📞 Phone:</span>{" "}
                          {rest.phone}
                        </p>
                        <p>
                          <span className="font-semibold">👤 Manager:</span>{" "}
                          {rest.manager}
                        </p>
                        <p>
                          <span className="font-semibold">🏢 Branches:</span>{" "}
                          {rest.branches}
                        </p>
                        <p>
                          <span className="font-semibold">📄 License:</span>{" "}
                          {rest.license}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {filteredRestaurants.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-[#999]">
                  No restaurants match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ACustomers;
