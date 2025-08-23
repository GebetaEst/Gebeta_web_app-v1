import { useEffect, useState, useRef} from "react";
import axios from "axios";

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState(null);
  const latestOrderIdRef = useRef(null);

  const API_URL =
    "https://gebeta-delivery1.onrender.com/api/v1/orders/restaurant/689dd0dfa804b9df25acb672/orders";

  const sortOrders = (ordersToSort) => {
    const statusPriority = {
      pending: 1,
      preparing: 2,
      cooked: 3,
      // cancelled: 4,
      delivering: 5,
    };
    
    return [...ordersToSort].sort((a, b) => {
      const statusA = a.orderStatus?.toLowerCase() || '';
      const statusB = b.orderStatus?.toLowerCase() || '';
      const priorityA = statusPriority[statusA] || 99;
      const priorityB = statusPriority[statusB] || 99;
      return priorityA - priorityB;
    });
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
        setLatestOrderId(sorted[0]?.orderId || null);
        latestOrderIdRef.current = sorted[0]?.orderId || null;
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
  
    // initial fetch
    fetchOrders();
  
    // polling
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        const sorted = sortOrders(res.data.data);
        const latestFetchedId = sorted[0]?.orderId;
  
        if (latestFetchedId && latestFetchedId !== latestOrderIdRef.current) {
          setNewOrderAlert(true);
          setLatestOrderId(latestFetchedId);
          latestOrderIdRef.current = latestFetchedId;
          setOrders(sorted);
  
          setTimeout(() => setNewOrderAlert(false), 5000);
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = async (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.orderId === id ? { ...order, orderStatus: newStatus } : order
    );
    // console.log("updatedOrders",updatedOrders);
    // console.log("id",id);
    // console.log("newStatus",newStatus);
    setOrders(updatedOrders);

    try {
      const res = await axios.patch(
        `https://gebeta-delivery1.onrender.com/api/v1/orders/${id}/status`,
        {
          orderId: id,
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("res",res);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Delivering") return "bg-green-100 text-green-700";
    if (status === "Completed") return "bg-gray-200 text-gray-700";
    return "bg-yellow-100 text-yellow-800";
  };

  const handleSortByStatus = () => {
    setOrders(prevOrders => {
      const sorted = sortOrders([...prevOrders]);
      return sorted;
    });
  };

  return (
    <div className="h-[calc(100vh-65px)] bg-[#f9f5f0] p-6 ">
      <button
        onClick={handleSortByStatus}
        className="mt-4 ml-5   bg-[#8B4513] text-white px-4 py-2 rounded-md hover:bg-[#a05c2c] transition-colors duration-200"
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

      <div className="overflow-y-auto h-[69%] w-[80%] scrollbar-hide scroll-smooth fixed p-2 ">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.orderId}
              onClick={() => toggleExpand(order.orderId)}
              className={`bg-white border border-[#e2b96c] rounded-xl shadow-md hover:shadow-lg cursor-pointer motion-preset-confetti  transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                expandedCard === order.orderId ? "p-4 pb-6" : "p-4"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#4b2e2e]">
                  {order.userName}
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
                {order.items
                  ?.map(
                    (item) => `${item.foodName}` + `  (x${item.quantity})`
                  )
                  .join(", ") || "N/A"}
                  <br/><span className="font-medium">Total Order:</span>{order.items
                  ?.map(
                    (item) => `${item.quantity}`
                  )
                  .join(", ") || "N/A"}
              </p>
              <p className="text-[#5f4637]">
                <span className="font-medium">Total:</span> {order.totalFoodPrice} ETB
              </p>
              <p className="text-sm text-[#a37c2c] italic">
                Placed on: {new Date(order.orderDate).toLocaleString()}
              </p>

              {expandedCard === order.orderId && (
                <div className="mt-4 space-y-2 border-t pt-3 border-dashed border-[#caa954] text-sm text-[#3f2c1b]">
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.phone || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Type of Order:</span>{" "}
                    {order.orderType}
                  </p>

                  <div className="mt-2">
                    <label className="block text-sm font-semibold text-[#5a3b1a] mb-1">
                      Update Status:
                    </label>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>{
                        handleStatusChange(order.orderId, e.target.value)
                        // console.log(order.orderId);}
                      }}
                      className="w-full p-2 border border-[#caa954] rounded-md bg-[#fefcf7] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* <option value="Pending">Pending</option> */}
                      <option value="Preparing">Preparing</option>
                      <option value="Cooked">Cooked</option>
                      <option value="Delivering">Delivering</option>
                      <option value="Completed">Completed</option>
                      {/* <option value="Cancelled">Cancelled</option> */}
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
