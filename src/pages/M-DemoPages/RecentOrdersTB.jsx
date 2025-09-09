import { useEffect, useState } from "react";
import Card from "../../components/Cards/Cards";
import useUserStore from "../../Store/UseStore";

const RecentOrdersTB = () => {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  
  // Get orders from the store which updates in real-time
  const storeOrders = useUserStore((state) => state.orders);
  const role = JSON.parse(sessionStorage.getItem("user-data"))?.state?.user?.role;
  console.log(role);

  useEffect(() => {
    // Get initial orders from session storage
    try {
      const userData = sessionStorage.getItem("user-data");
      if (userData) {
        const parsedData = JSON.parse(userData);
        const ordersFromSession = parsedData.state?.orders || [];
        setOrders(ordersFromSession);
      }
    } catch (error) {
      console.error("Error loading orders from session storage:", error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Update orders whenever store orders change
  useEffect(() => {
    if (storeOrders && storeOrders.length > 0) {
      setOrders(storeOrders);
      setOrdersLoading(false);
    }
  }, [storeOrders]);

  // Filter orders to exclude delivering and completed statuses
  const filteredOrders = orders.filter(order => {
    const statusLower = order.orderStatus?.toLowerCase();
    return statusLower !== "delivering" && statusLower !== "completed" && statusLower !== "delivered";
  });

  // Get recent orders (last 5 orders)
  const recentOrders = filteredOrders
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);

  // Count new orders (pending status)
  const newOrdersCount = filteredOrders.filter(order => 
    order.orderStatus?.toLowerCase() === "pending"
  ).length;

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-700";
    if (statusLower === "delivered" ) return "bg-green-100 text-green-700";
    if (statusLower === "preparing") return "bg-blue-100 text-blue-700";
    if (status === "Canceled") return "bg-red-100 text-red-700";
    if (status === "Cooked") return "bg-green-100 text-green-700";

    return "bg-green-100 text-green-700";
  };

  const getTotalQuantity = (items) => {
    return items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
  };

  const getMainFoodItem = (items) => {
    if (!items || items.length === 0) return "N/A";
    const firstItem = items[0];
    return `${firstItem.foodName}${items.length > 1 ? ` +${items.length - 1} more` : ''}`;
  };

  return (
    <>
      <Card>
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <p className="text-sm text-placeholderText">
          you have <span className="text-primary font-semibold">{newOrdersCount}</span> new
          orders
        </p>
        {role === "Admin" ? (
          <div className="text-center py-4">
            <p className="text-placeholderText">Admin view - orders managed centrally</p>
          </div>
        ) : (
          <>
            {ordersLoading ? (
              <div className="text-center py-4">
                <p className="text-placeholderText">Loading orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-placeholderText">No recent orders</p>
              </div>
            ) : (
              recentOrders.map((order, index) => (
                <Card
                  key={order.orderId || index}
                  className="px- py-2 border-b border-gray flex items-center justify-between gap-5"
                >
                  <div className="motion-preset-bounce motion-duration-300 text-left flex gap-2 px-1">
                    <div>
                      <div className="p-6 max-w-[50px] border-gray border rounded-full bg-cardBackground motion-preset-bounce motion-duration-300"></div>
                    </div>
                    <div>
                      <p>{order.userName || "Unknown User"}</p>
                      <p className="text-sm text-placeholderText">
                        x{getTotalQuantity(order.items)}&nbsp;{getMainFoodItem(order.items)}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <span
                      className={`font-semibold text-xs flex place-self-end text-[#333] p-1 px-2 rounded-full ml-8 motion-preset-bounce ${getStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>
                    <p className="font-noto font-normal pr-1 text-end text-sm">
                      {order.totalFoodPrice || 0} ETB
                    </p>
                  </div>
                </Card>
              ))
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default RecentOrdersTB;
