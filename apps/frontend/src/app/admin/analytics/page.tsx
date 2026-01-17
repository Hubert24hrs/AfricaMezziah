"use client";

import { motion } from "framer-motion";

const monthlyData = [
    { month: "Aug", revenue: 1200000, orders: 45 },
    { month: "Sep", revenue: 1450000, orders: 52 },
    { month: "Oct", revenue: 1680000, orders: 61 },
    { month: "Nov", revenue: 2100000, orders: 78 },
    { month: "Dec", revenue: 2850000, orders: 102 },
    { month: "Jan", revenue: 2450000, orders: 89 },
];

const topCategories = [
    { name: "Dresses", percentage: 42, color: "bg-primary-500" },
    { name: "Tops", percentage: 28, color: "bg-accent-500" },
    { name: "Traditional", percentage: 18, color: "bg-secondary-500" },
    { name: "Accessories", percentage: 12, color: "bg-dark-400" },
];

export default function AdminAnalytics() {
    const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-dark-950">Analytics</h2>
                <p className="text-dark-500">Track your store performance</p>
            </div>

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm"
            >
                <h3 className="font-semibold text-dark-950 mb-6">Revenue Overview</h3>
                <div className="flex items-end gap-4 h-48">
                    {monthlyData.map((data) => (
                        <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                            <p className="text-xs text-dark-500">₦{(data.revenue / 1000000).toFixed(1)}M</p>
                            <div
                                className="w-full bg-gradient-to-t from-primary-500 to-accent-400 rounded-t-lg transition-all duration-500"
                                style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                            />
                            <p className="text-sm font-medium text-dark-700">{data.month}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                >
                    <h3 className="font-semibold text-dark-950 mb-6">Sales by Category</h3>
                    <div className="space-y-4">
                        {topCategories.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-dark-700">{cat.name}</span>
                                    <span className="font-medium text-dark-950">{cat.percentage}%</span>
                                </div>
                                <div className="h-3 bg-dark-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                                        style={{ width: `${cat.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Key Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                >
                    <h3 className="font-semibold text-dark-950 mb-6">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-dark-50 rounded-lg">
                            <p className="text-dark-500 text-sm">Avg Order Value</p>
                            <p className="text-2xl font-bold text-dark-950 mt-1">₦28,500</p>
                        </div>
                        <div className="p-4 bg-dark-50 rounded-lg">
                            <p className="text-dark-500 text-sm">Conversion Rate</p>
                            <p className="text-2xl font-bold text-dark-950 mt-1">3.2%</p>
                        </div>
                        <div className="p-4 bg-dark-50 rounded-lg">
                            <p className="text-dark-500 text-sm">Return Rate</p>
                            <p className="text-2xl font-bold text-dark-950 mt-1">2.1%</p>
                        </div>
                        <div className="p-4 bg-dark-50 rounded-lg">
                            <p className="text-dark-500 text-sm">Cart Abandonment</p>
                            <p className="text-2xl font-bold text-dark-950 mt-1">68%</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
