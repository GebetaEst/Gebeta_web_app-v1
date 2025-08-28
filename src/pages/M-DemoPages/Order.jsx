import { useEffect, useState, useRef } from "react";
import { RefreshCcw, ChevronDown } from "lucide-react";
import axios from "axios";
import useUserStore from "../../Store/UseStore";
import {Loading , InlineLoadingDots} from "../../components/Loading/Loading";
import { addSuccessNotification, addErrorNotification } from "../../utils/notifications";

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedCards, setExpandedCards] = useState([]); // ✅ multiple expanded cards
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryCode, setDeliveryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  
  // Get notification state from global store
  const { newOrderAlert, latestOrderId, setNewOrderAlert } = useUserStore();
  
  const API_URL =
    "https://gebeta-delivery1.onrender.com/api/v1/orders/restaurant/689dd0dfa804b9df25acb672/orders";

  const sortOrders = (ordersToSort) => {
    const statusPriority = {
      pending: 1,
      preparing: 2,
      cooked: 3,
      delivering: 5,
    };

    return [...ordersToSort].sort((a, b) => {
      const statusA = a.orderStatus?.toLowerCase() || "";
      const statusB = b.orderStatus?.toLowerCase() || "";
      const priorityA = statusPriority[statusA] || 99;
      const priorityB = statusPriority[statusB] || 99;
      return priorityA - priorityB;
    });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const sorted = sortOrders(res.data.data);
        console.log(sorted);
        setOrders(sorted);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }finally{
      }
    };

    // initial fetch
    fetchOrders();

    // Refresh orders every 5 seconds (but don't duplicate the polling logic)
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [refresh]);

  const toggleExpand = (id) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.orderId === id ? { ...order, orderStatus: newStatus } : order
    );
    setOrders(updatedOrders);

    try {
      await axios.patch(
        `https://gebeta-delivery1.onrender.com/api/v1/orders/${id}/status`,
        {
          orderId: id,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Delivering") return "bg-green-100 text-green-700";
    if (status === "Completed") return "bg-gray-200 text-gray-700";
    return "bg-yellow-100 text-yellow-800";
  };

  const handelVerify = async (orderId , deliveryCode) => {
    // console.log(orderId, deliveryCode);
    setLoading(true);
    try{
      const res = await axios.post(`https://gebeta-delivery1.onrender.com/api/v1/orders/verify-restaurant-pickup`,{
        order_id: orderId,
        deliveryVerificationCode: deliveryCode,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(res);
      addSuccessNotification("Order Verified", "Delivery verification completed successfully");
    } catch (err) {
      console.error("Failed to verify order", err);
      addErrorNotification("Verification Failed", "Unable to verify delivery code");
    }finally{
      setLoading(false);
    }
  };
  
  return (
    <>
    <div className="h-[calc(100vh-65px)] bg-[#f9f5f0] p-6 ">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by order code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-4 ml-5 px-4 py-2 border border-[#caa954] rounded-md bg-[#fefcf7] focus:outline-none focus:ring-2 focus:ring-[#d4af37] w-64"
        />
      </div>
      <h1 className="text-3xl font-bold text-center text-[#8B4513] mb-6">
        Orders Dashboard
      </h1>

      { <div className="overflow-y-auto h-[69%] w-[80%] scrollbar-hide scroll-smooth fixed p-2 ">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
          {filteredOrders
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .map((order) => (
              <div
                key={order.orderId}
                className={`bg-white border border-[#e2b96c] rounded-xl shadow-md hover:shadow-lg cursor-pointer motion-preset-confetti transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  expandedCards.includes(order.orderId) ? "p-4 pb-6" : "p-4"
                }`}
              >
                <div onClick={() => toggleExpand(order.orderId)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-[#4b2e2e]">
                        {order.userName}
                      </h2>
                      <h2 className="text-sm font-medium text-[#8b4513c8]">
                        #{order.orderCode}
                      </h2>
                    </div>
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
                    <br />
                    <span className="font-medium">Total Order:</span>
                    {order.items
                      ?.reduce((total, item) => total + item.quantity, 0) || "N/A"}
                  </p>
                  <p className="text-[#5f4637]">
                    <span className="font-medium">Total:</span>{" "}
                    {order.totalFoodPrice} ETB
                  </p>
                  <p className="text-sm text-[#a37c2c] italic">
                    Placed on: {new Date(order.orderDate).toLocaleString()}
                  </p>
                  <div className={`flex justify-self-end`}>
                    <ChevronDown
                      className={`w-4 h-4 transition-all duration-300 ${
                        expandedCards.includes(order.orderId)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedCards.includes(order.orderId) && (
                  <div className="mt-4 space-y-2 border-t pt-3 border-dashed border-[#caa954] text-sm text-[#3f2c1b] transform-all duration-900">
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
                        onChange={(e) =>
                          handleStatusChange(order.orderId, e.target.value)
                        }
                        className="w-full p-2 border border-[#caa954] rounded-md bg-[#fefcf7] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        {/* <option value="Delivering">Delivering</option> */}
                        <option value="Cooked">Cooked</option>
                        {/* <option value="Completed">Completed</option> */}
                      </select>
                      <div className="flex gap-3 p-2 px-0">
                        <input
                        onChange={(e)=>{setDeliveryCode(e.target.value)}}
                          type="text"
                          placeholder="Enter Delivery Code"
                          className="w-full p-2 border border-[#caa954] rounded-md bg-[#fefcf7] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                        />
                        <button
                        onClick={(e)=>{handelVerify(order.orderCode, deliveryCode); console.log(order.orderId)}}
                        className={`py-2 px-2 bg-[#8b4513c8] text-white rounded-md hover:bg-[#a05c2c] transition-colors duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                          {loading ? <InlineLoadingDots /> : "Verify"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>}
    </div>
    </>
  );
};

export default ManagerOrders;
