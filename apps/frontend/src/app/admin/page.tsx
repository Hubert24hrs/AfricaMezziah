"use client";

import { motion } from "framer-motion";

const stats = [
    { label: "Total Revenue", value: "₦2,450,000", change: "+12.5%", positive: true },
    { label: "Orders", value: "156", change: "+8.2%", positive: true },
    { label: "Products", value: "48", change: "+3", positive: true },
    { label: "Customers", value: "1,234", change: "+24", positive: true },
];

const recentOrders = [
    { id: "ORD-001", customer: "Adaeze Okonkwo", amount: 45000, status: "Delivered", date: "2026-01-16" },
    { id: "ORD-002", customer: "Fatima Ibrahim", amount: 78000, status: "Shipped", date: "2026-01-16" },
    { id: "ORD-003", customer: "Grace Adekunle", amount: 32000, status: "Processing", date: "2026-01-15" },
    { id: "ORD-004", customer: "Ngozi Eze", amount: 120000, status: "Pending", date: "2026-01-15" },
];

const topProducts = [
    { name: "Ankara Elegance Dress", sales: 42, revenue: 1890000 },
    { name: "Kente Wrap Top", sales: 38, revenue: 1064000 },
    { name: "Adire Print Skirt", sales: 25, revenue: 800000 },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm"
                    >
                        <p className="text-dark-500 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-dark-950 mt-2">{stat.value}</p>
                        <p className={`text-sm mt-2 ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                            {stat.change} from last month
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-dark-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-dark-950">Recent Orders</h2>
                        <a href="/admin/orders" className="text-primary-500 text-sm hover:underline">
                            View All
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-dark-50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Order ID</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Customer</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Amount</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-dark-50 hover:bg-dark-50">
                                        <td className="px-6 py-4 text-sm font-medium text-dark-950">{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-dark-700">{order.customer}</td>
                                        <td className="px-6 py-4 text-sm text-dark-700">₦{order.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                                    order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                                                        order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                                                            "bg-gray-100 text-gray-700"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-dark-500">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-dark-100">
                        <h2 className="text-lg font-semibold text-dark-950">Top Products</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={product.name} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-dark-950 text-sm">{product.name}</p>
                                    <p className="text-xs text-dark-500">{product.sales} sales</p>
                                </div>
                                <p className="font-medium text-dark-700 text-sm">
                                    ₦{product.revenue.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
