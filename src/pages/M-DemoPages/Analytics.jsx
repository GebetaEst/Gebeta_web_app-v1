import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign } from "lucide-react";

const Analytics = () => {
    const [analytics, setAnalytics] = useState({
        totalRevenue: 45230,
        orderCount: 1547,
        customerCount: 892,
        revenueGrowth: 12.5,
        orderGrowth: 8.3,
        customerGrowth: 15.7
    });

    const [timeFrame, setTimeFrame] = useState("This Month");

    // Demo data for charts
    const monthlyData = [
        { month: "Jan", revenue: 32000, orders: 890, customers: 120 },
        { month: "Feb", revenue: 35500, orders: 920, customers: 145 },
        { month: "Mar", revenue: 38900, orders: 1100, customers: 167 },
        { month: "Apr", revenue: 42100, orders: 1250, customers: 189 },
        { month: "May", revenue: 45230, orders: 1547, customers: 213 }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const StatCard = ({ title, value, growth, icon: Icon, isRevenue = false }) => {
        const isPositive = growth > 0;
        const displayValue = isRevenue ? formatCurrency(value) : value.toLocaleString();

        return (
            <div className="bg-white border border-[#e2b96c] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-[#8B4513] bg-opacity-10 rounded-lg">
                        <Icon className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                        isPositive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {Math.abs(growth)}%
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-[#4b2e2e] mb-1">{displayValue}</h3>
                <p className="text-[#5f4637] text-sm">{title}</p>
            </div>
        );
    };

    const ChartBar = ({ data, maxValue, label }) => {
        const height = (data / maxValue) * 100;
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-gray-200 rounded-t-md h-32 flex items-end">
                    <div 
                        className="w-full bg-gradient-to-t from-[#722828] to-[#a05c2c] rounded-t-md transition-all duration-500"
                        style={{ height: `${height}%` }}
                    ></div>
                </div>
                <span className="text-xs text-[#5f4637] font-medium">{label}</span>
            </div>
        );
    };
    const restaurantInfo = JSON.parse(sessionStorage.getItem("user-data"));
    const restaurantName = restaurantInfo.state.restaurant.name;

    return (
        <div className="h-[calc(100vh-65px)] bg-[#f9f5f0] p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">

                    <div className=" bg-[#8B4513] bg-opacity-10 rounded-lg">
                            {/* <Users className="w-8 h-8 text-[#8B4513]" /> */}
                            <img src={restaurantInfo.state.restaurant.imageCover ||restaurantInfo.state.user.profilePicture } alt="Restaurant Logo" className="w-16 h-16 rounded-lg object-cover border-2 border-white/20" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#4b2e2e]">{restaurantName}</h1>
                            <p className="text-[#5f4637] mt-1">Business Insights</p>
                        </div>
                        </div>
                    <select 
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value)}
                        className="bg-white border border-[#e2b96c] rounded-lg px-4 py-2 text-[#4b2e2e] focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                    >
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>This Quarter</option>
                        <option>This Year</option>
                    </select>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={analytics.totalRevenue}
                        growth={analytics.revenueGrowth}
                        icon={DollarSign}
                        isRevenue={true}
                    />
                    <StatCard
                        title="Total Orders"
                        value={analytics.orderCount}
                        growth={analytics.orderGrowth}
                        icon={ShoppingBag}
                    />
                    <StatCard
                        title="Total Customers"
                        value={analytics.customerCount}
                        growth={analytics.customerGrowth}
                        icon={Users}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="bg-white border border-[#e2b96c] rounded-xl p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-[#4b2e2e] mb-6">Monthly Revenue</h3>
                        <div className="flex items-end justify-between gap-4 h-40">
                            {monthlyData.map((data, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <span className="text-xs text-[#5f4637] mb-1 font-medium">
                                        {formatCurrency(data.revenue)}
                                    </span>
                                    <ChartBar
                                        data={data.revenue}
                                        maxValue={Math.max(...monthlyData.map(d => d.revenue))}
                                        label={data.month}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orders Chart */}
                    <div className="bg-white border border-[#e2b96c] rounded-xl p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-[#4b2e2e] mb-6">Monthly Orders</h3>
                        <div className="relative flex items-end justify-between gap-4 h-40">
                            {/* Vertical axis with numbers */}
                            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-[#8B4513] font-medium">
                                <span>2000</span>
                                <span>1500</span>
                                <span>1000</span>
                                <span>500</span>
                                <span>0</span>
                            </div>
                            {/* Vertical line */}
                            <div className="absolute left-12 top-0 bottom-0 border-l border-[#8B4513] opacity-30"></div>
                            <div className="ml-16 flex items-end justify-between gap-4 h-40 flex-1">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="relative group">
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#4b2e2e] text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                            {data.orders} orders
                                        </div>
                                        <ChartBar
                                            data={data.orders}
                                            maxValue={Math.max(...monthlyData.map(d => d.orders))}
                                            label={data.month}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="mt-8 bg-white border border-[#e2b96c] rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-[#4b2e2e] mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-4 bg-[#8B4513] bg-opacity-5 rounded-lg">
                            <p className="text-[#5f4637]">Average Order Value</p>
                            <p className="text-lg font-semibold text-[#4b2e2e]">{formatCurrency(analytics.totalRevenue / analytics.orderCount)}</p>
                        </div>
                        <div className="text-center p-4 bg-[#8B4513] bg-opacity-5 rounded-lg">
                            <p className="text-[#5f4637]">Orders per Customer</p>
                            <p className="text-lg font-semibold text-[#4b2e2e]">{(analytics.orderCount / analytics.customerCount).toFixed(1)}</p>
                        </div>
                        <div className="text-center p-4 bg-[#8B4513] bg-opacity-5 rounded-lg">
                            <p className="text-[#5f4637]">Revenue per Customer</p>
                            <p className="text-lg font-semibold text-[#4b2e2e]">{formatCurrency(analytics.totalRevenue / analytics.customerCount)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Analytics;