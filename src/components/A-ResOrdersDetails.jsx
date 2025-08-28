import{useState,useEffect} from "react";
import { Loading } from "./Loading/Loading";

const AResOrders = ({ restaurantId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `https://gebeta-delivery1.onrender.com/api/v1/orders/restaurant/${restaurantId}/orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const data = await res.json();
                if (res.ok && data.status === "success") {
                    setOrders(data.data || []);
                } else {
                    throw new Error(data.message || "Failed to load orders");
                }
            } catch (err) {
                console.error("Fetch orders error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchOrders();
        }
    }, [restaurantId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatPrice = (price) => {
        return `$${price?.toFixed(2) || '0.00'}`;
    };

    if (loading) {
        return (
            <div className="p-6 bg-[#f4f1e9] min-h-screen">
                <Loading/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-[#f4f1e9] min-h-screen">
                <div className="text-red-600 text-center">Error: {error}</div>
            </div>
        );
    }

    return ( 
        <>
        <div className="p-6 bg-[#f4f1e9] min-h-screen">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-[#4b382a]">Restaurant Orders</h1>
                    <p className="text-gray-600">Total Orders: {orders.length}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md overflow-hidden shadow-md">
                        <thead className="bg-[#e0cda9] text-[#4b382a] sticky top-0">
                            <tr>
                                <th className="p-3 text-left">#</th>
                                <th className="p-3 text-left">Order Code</th>
                                <th className="p-3 text-left">Customer</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Items</th>
                                <th className="p-3 text-left">Total Price</th>
                                <th className="p-3 text-left">Order Type</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="p-4 text-center text-gray-600">
                                        No orders found for this restaurant.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order, index) => (
                                    <tr key={order.orderId} className={`border-b hover:bg-[#f9f4ea] ${index % 2 === 1 ? 'bg-[#f8f5f0]' : 'bg-white'}`}>
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3 font-medium">#{order.orderCode}</td>
                                        <td className="p-3">{order.userName || 'N/A'}</td>
                                        <td className="p-3">{order.phone || 'N/A'}</td>
                                        <td className="p-3">
                                            <div className="max-w-xs">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="text-sm">
                                                        {item.foodName} (x{item.quantity}) - {formatPrice(item.price)}
                                                    </div>
                                                )) || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-3 font-medium">{formatPrice(order.totalFoodPrice)}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold
                                                ${order.orderType === 'Delivery' ? 'bg-blue-100 text-blue-700' :
                                                  order.orderType === 'Pickup' ? 'bg-purple-100 text-purple-700' :
                                                  order.orderType === 'Dine In' ? 'bg-green-100 text-green-700' :
                                                  'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.orderType || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold
                                                ${order.orderStatus === 'Delivered' ? 'bg-gray-100 text-gray-700' :
                                                  order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                  order.orderStatus === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                                                  order.orderStatus === 'Cooked' ? 'bg-green-100 text-green-700' :
                                                  order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                  'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.orderStatus || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="p-3" title={new Date(order.orderDate).toLocaleString()}>{formatDate(order.orderDate)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
     );
}
 
export default AResOrders;