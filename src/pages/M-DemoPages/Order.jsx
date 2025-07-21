import { useEffect, useState } from "react";
import axios from "axios";

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState(null);

  const demoOrders = [
    {
      id: 1,
      customerName: "Abebe Bekele",
      status: "Delivered",
      foodItems: ["Injera Firfir", "Tibs"],
      total: "230 ETB",
      address: "Addis Ababa, Bole",
      phone: "0912345678",
      createdAt: "2025-07-20 14:30",
    },
    {
      id: 2,
      customerName: "Selam Tesfaye",
      status: "Pending",
      foodItems: ["Shiro", "Doro Wat"],
      total: "180 ETB",
      address: "Addis Ababa, Piassa",
      phone: "0923456789",
      createdAt: "2025-07-21 09:45",
    },
    {
      id: 3,
      customerName: "Yared Asmamaw",
      status: "Pending",
      foodItems: ["Misir Wot", "Tikel Gomen"],
      total: "150 ETB",
      address: "Addis Ababa, Megenagna",
      phone: "0934567890",
      createdAt: "2025-07-22 12:15",
    },
    {
      id: 4,
      customerName: "Temesgen Atnafu",
      status: "Delivered",
      foodItems: ["Kik Alitcha", "Gomen Be Sega"],
      total: "200 ETB",
      address: "Addis Ababa, Bole",
      phone: "0912345678",
      createdAt: "2025-07-23 08:00",
    },
    {
      id: 5,
      customerName: "Eskender Haile",
      status: "Cancelled",
      foodItems: ["Dulet", "Kebab"],
      total: "250 ETB",
      address: "Addis Ababa, Kazanchis",
      phone: "0923456789",
      createdAt: "2025-07-24 14:30",
    },
    {
      id: 6,
      customerName: "Meron Mekonnen",
      status: "Pending",
      foodItems: ["Tibs", "Misir Wot"],
      total: "230 ETB",
      address: "Addis Ababa, Hayahulet",
      phone: "0934567890",
      createdAt: "2025-07-25 10:45",
    },
    {
      id: 7,
      customerName: "Abebe Bekele",
      status: "Delivered",
      foodItems: ["Kik Alitcha", "Doro Wat"],
      total: "280 ETB",
      address: "Addis Ababa, Bole",
      phone: "0912345678",
      createdAt: "2025-07-26 14:00",
    },
    {
      id: 8,
      customerName: "Selam Tesfaye",
      status: "Pending",
      foodItems: ["Gomen Be Sega", "Tikel Gomen"],
      total: "240 ETB",
      address: "Addis Ababa, Piassa",
      phone: "0923456789",
      createdAt: "2025-07-27 12:30",
    },
    {
      id: 9,
      customerName: "Yared Asmamaw",
      status: "Cancelled",
      foodItems: ["Shiro", "Kebab"],
      total: "210 ETB",
      address: "Addis Ababa, Megenagna",
      phone: "0934567890",
      createdAt: "2025-07-28 15:15",
    },
    {
      id: 10,
      customerName: "Eskender Haile",
      status: "Delivered",
      foodItems: ["Misir Wot", "Dulet"],
      total: "270 ETB",
      address: "Addis Ababa, Kazanchis",
      phone: "0923456789",
      createdAt: "2025-07-29 11:00",
    },
  ];

  const sortOrders = (orders) => {
    const statusPriority = {
      Pending: 1,
      Processing: 2,
      Cancelled: 3,
      Delivered: 4,
    };
    return [...orders].sort(
      (a, b) =>
        (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99)
    );
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://your-api-url.com/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(sortOrders(res.data.orders));
      } catch (error) {
        console.error("Failed to fetch orders. Using demo data.");
        setOrders(sortOrders(demoOrders));
      }
    };
    fetchOrders();
  }, []);
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get("https://your-api-url.com/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const sorted = sortOrders(res.data.orders);
        const latestFetchedId = sorted[0]?.id;

        if (latestFetchedId && latestFetchedId !== latestOrderId) {
          setNewOrderAlert(true);
          setLatestOrderId(latestFetchedId);
          setOrders(sorted);

          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setNewOrderAlert(false);
          }, 5000);
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [latestOrderId]);

  const toggleExpand = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    // Optionally send PATCH request to API
    // axios.patch(`https://your-api-url.com/orders/${id}`, { status: newStatus }, {
    //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    // }).catch((err) => console.error("Failed to update status", err));
  };

  const getStatusColor = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="min-h-[89vh] bg-[#f9f5f0] p-6 ">
      <button
        onClick={() => setOrders(sortOrders(orders))}
        className="mt-4 bg-[#8B4513] text-white px-4 py-2 rounded-md hover:bg-[#a05c2c]"
      >
        Sort Orders by Status
      </button>
      {newOrderAlert && (
        <div className="fixed top-20 right-6 bg-[#8b4513c4] text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce-in">
          🚨 New order received!
        </div>
      )}

      <h1 className="text-3xl font-bold text-center text-[#8B4513] mb-6">
        Orders Dashboard
      </h1>
      <div className="overflow-y-auto h-[69%] w-[80%] scrollbar-hide scroll-smooth border-primary  fixed p-2">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => toggleExpand(order.id)}
              className={`bg-white border border-[#e2b96c] rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden flex flex-col justify-between motion-preset-slide-up  ${
                expandedCard === order.id ? "p-4 pb-6" : "p-4"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#4b2e2e]">
                  {order.customerName}
                </h2>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-[#5f4637] mt-2">
                <span className="font-medium">Order:</span>{" "}
                {order.foodItems.join(", ")}
              </p>
              <p className="text-[#5f4637]">
                <span className="font-medium">Total:</span> {order.total}
              </p>
              <p className="text-sm text-[#a37c2c] italic">
                Placed on: {order.createdAt}
              </p>

              {expandedCard === order.id && (
                <div className="mt-4 border-t pt-3 border-dashed border-[#caa954] text-sm text-[#3f2c1b]">
                  <p>
                    <span className="font-medium">Phone:</span> {order.phone}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {order.address}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Items:</span>{" "}
                    {order.foodItems.map((item, idx) => (
                      <span key={idx} className="inline-block mr-2">
                        {idx === 0 ? "🍽️" : ""} {item}
                      </span>
                    ))}
                  </p>

                  <div className="mt-2">
                    <label className="block text-sm font-semibold text-[#5a3b1a] mb-1">
                      Update Status:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="w-full p-2 border border-[#caa954] rounded-md bg-[#fefcf7] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                      onClick={(e) => e.stopPropagation()} // Prevent dropdown from collapsing card
                    >
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerOrders;
