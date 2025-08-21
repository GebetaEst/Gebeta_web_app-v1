import { useState } from "react";
import { Users, Phone, ShoppingCart, DollarSign } from "lucide-react";

const Customers = () => {
    const [customers] = useState([
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            phone: "+1 (555) 123-4567",
            totalOrders: 12,
            totalSpent: 1250.75,
            feedback: "Great service! Always satisfied with my orders."
        },
        {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            phone: "+1 (555) 987-6543",
            totalOrders: 8,
            totalSpent: 890.50,
            feedback: "Good quality products, fast delivery."
        },
        {
            id: 3,
            firstName: "Mike",
            lastName: "Johnson",
            phone: "+1 (555) 456-7890",
            totalOrders: 15,
            totalSpent: 2100.25,
            feedback: "Excellent customer support and product variety."
        },
        {
            id: 4,
            firstName: "Sarah",
            lastName: "Williams",
            phone: "+1 (555) 321-9876",
            totalOrders: 6,
            totalSpent: 675.00,
            feedback: "Very pleased with the shopping experience."
        },
        {
            id: 5,
            firstName: "David",
            lastName: "Brown",
            phone: "+1 (555) 654-3210",
            totalOrders: 20,
            totalSpent: 3200.80,
            feedback: "Outstanding service! Highly recommended."
        }
    ]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    const restaurantInfo = JSON.parse(sessionStorage.getItem("user-data"));
    const restaurantName = restaurantInfo.state.restaurant.name;
    // console.log(restaurantName);

    return (
        <div className="p-6 bg-[#f4f1e9] h-[calc(100vh-65px)] overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                        <div className=" bg-[#8B4513] bg-opacity-10 rounded-lg">
                            {/* <Users className="w-8 h-8 text-[#8B4513]" /> */}
                            <img src={restaurantInfo.state.restaurant.imageCover} alt="Restaurant Logo" className="w-16 h-16 rounded-lg object-cover border-2 border-white/20" />
                        </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#4b2e2e]">{restaurantName}</h1>
                        <p className="text-[#5f4637] mt-1">Manage your customer database</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-[#e2b96c] rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#5f4637] text-sm">Total Customers</p>
                                <p className="text-2xl font-bold text-[#4b2e2e]">{customers.length}</p>
                            </div>
                            <div className="p-3 bg-[#8B4513] bg-opacity-10 rounded-lg">
                                <Users className="w-6 h-6 text-[#8B4513]" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-[#e2b96c] rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#5f4637] text-sm">Average Orders</p>
                                <p className="text-2xl font-bold text-[#4b2e2e]">
                                    {(customers.reduce((sum, customer) => sum + customer.totalOrders, 0) / customers.length).toFixed(1)}
                                </p>
                            </div>
                            <div className="p-3 bg-[#8B4513] bg-opacity-10 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-[#8B4513]" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-[#e2b96c] rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#5f4637] text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-[#4b2e2e]">
                                    {formatCurrency(customers.reduce((sum, customer) => sum + customer.totalSpent, 0))}
                                </p>
                            </div>
                            <div className="p-3 bg-[#8B4513] bg-opacity-10 rounded-lg">
                                <DollarSign className="w-6 h-6 text-[#8B4513]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customers List */}
                <div className="bg-white border border-[#e2b96c] rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-[#e2b96c]">
                        <h2 className="text-xl font-semibold text-[#4b2e2e]">Customer List</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#8B4513] bg-opacity-5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-[#4b2e2e]">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-[#4b2e2e]">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-[#4b2e2e]">Orders</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-[#4b2e2e]">Total Spent</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-[#4b2e2e]">Customer Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2b96c]">
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-[#8B4513] hover:bg-opacity-5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#8B4513] bg-opacity-10 rounded-full flex items-center justify-center">
                                                    <span className="text-[#8B4513] font-medium text-sm">
                                                        {customer.firstName[0]}{customer.lastName[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#4b2e2e]">
                                                        {customer.firstName} {customer.lastName}
                                                    </p>
                                                    <p className="text-sm text-[#5f4637]">ID: {customer.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-[#5f4637]">
                                                <Phone className="w-4 h-4" />
                                                {customer.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-[#8B4513] bg-opacity-10 text-[#8B4513] rounded-full text-sm font-medium">
                                                {customer.totalOrders}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-[#4b2e2e]">
                                                {formatCurrency(customer.totalSpent)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <p className="text-sm text-[#5f4637] truncate" title={customer.feedback}>
                                                    {customer.feedback}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Customers;