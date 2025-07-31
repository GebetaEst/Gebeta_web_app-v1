import { useEffect, useState } from "react";
import axios from "axios";

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState(null);

  const API_URL =
    "https://gebeta-delivery1.onrender.com/api/v1/orders/restaurant/686fbe00a431a431154ec99b/orders";

  const sortOrders = (orders) => {
    const statusPriority = {
      preparing: 1,
      cooked: 2,
      cancelled: 3,
      delivering: 4,
    };
    return [...orders].sort(
      (a, b) =>
        (statusPriority[a.orderStatus] || 99) -
        (statusPriority[b.orderStatus] || 99)
    );
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const sorted = sortOrders(res.data.data);
        setOrders(sorted);
        console.log(sorted);
        setLatestOrderId(sorted[0]?.id);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const sorted = sortOrders(res.data.data);
        const latestFetchedId = sorted[0]?.id;

        if (latestFetchedId && latestFetchedId !== latestOrderId) {
          setNewOrderAlert(true);
          setLatestOrderId(latestFetchedId);
          setOrders(sorted);

          setTimeout(() => setNewOrderAlert(false), 5000);
        }
        // console.log("interval", interval);

      } catch (error) {
        console.error("Polling error", error);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [latestOrderId]);

  const toggleExpand = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = async (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order._id === id ? { ...order, orderStatus: newStatus } : order
    );
    setOrders(updatedOrders);

    try {
      const res = await axios.patch(
        `https://gebeta-delivery1.onrender.com/api/v1/orders/${id}/status`,
        { newStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("res",res);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Delivering") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-800";
  };

  const handleSortByStatus = () => {
    const sortedOrders = sortOrders([...orders]);
    setOrders(sortedOrders);
  };

  return (
    <div className="min-h-[89vh] bg-[#f9f5f0] p-6">
      <button
        onClick={handleSortByStatus}
        className="mt-4 bg-[#8B4513] text-white px-4 py-2 rounded-md hover:bg-[#a05c2c] transition-colors duration-200"
      >
        Sort Orders by Status
      </button>

      {newOrderAlert && (
        <div className="fixed top-20 right-6 bg-[#8b4513c4] text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce-in motion-preset-confetti ">
          🚨 New order received!
        </div>
      )}

      <h1 className="text-3xl font-bold text-center text-[#8B4513] mb-6">
        Orders Dashboard
      </h1>

      <div className="overflow-y-auto h-[69%] w-[80%] scrollbar-hide scroll-smooth fixed p-2">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => toggleExpand(order._id)}
              className={`bg-white border border-[#e2b96c] rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                expandedCard === order._id ? "p-4 pb-6" : "p-4"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#4b2e2e]">
                  {order.userId?.firstName} {order.userId?.lastName}
                </h2>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <p className="text-[#5f4637] mt-2">
                <span className="font-medium">Order:</span>{" "}
                {order.orderItems
                  ?.map(
                    (item) => `${item.foodId.foodName} x${item.quantity}`
                  )
                  .join(", ") || "N/A"}
              </p>
              <p className="text-[#5f4637]">
                <span className="font-medium">Total:</span> {order.totalPrice} ETB
              </p>
              <p className="text-sm text-[#a37c2c] italic">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>

              {expandedCard === order._id && (
                <div className="mt-4 space-y-2 border-t pt-3 border-dashed border-[#caa954] text-sm text-[#3f2c1b]">
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.userId?.phone || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Type of Order:</span>{" "}
                    {order.typeOfOrder}
                  </p>

                  <div className="mt-2">
                    <label className="block text-sm font-semibold text-[#5a3b1a] mb-1">
                      Update Status:
                    </label>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>{
                        handleStatusChange(order._id, e.target.value)
                        console.log(order._id);}
                      }
                      className="w-full p-2 border border-[#caa954] rounded-md bg-[#fefcf7] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* <option value="Pending">Pending</option> */}
                      <option value="Preparing">Preparing</option>
                      <option value="Cooked">Cooked</option>
                      <option value="Delivering">Delivering</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
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
