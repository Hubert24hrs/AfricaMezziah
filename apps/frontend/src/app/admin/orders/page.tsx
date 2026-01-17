"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const initialOrders = [
    { id: "ORD-001", customer: "Adaeze Okonkwo", email: "adaeze@email.com", items: 2, amount: 45000, status: "Delivered", date: "2026-01-16" },
    { id: "ORD-002", customer: "Fatima Ibrahim", email: "fatima@email.com", items: 3, amount: 78000, status: "Shipped", date: "2026-01-16" },
    { id: "ORD-003", customer: "Grace Adekunle", email: "grace@email.com", items: 1, amount: 32000, status: "Processing", date: "2026-01-15" },
    { id: "ORD-004", customer: "Ngozi Eze", email: "ngozi@email.com", items: 4, amount: 120000, status: "Pending", date: "2026-01-15" },
    { id: "ORD-005", customer: "Chiamaka Nwosu", email: "chiamaka@email.com", items: 2, amount: 56000, status: "Cancelled", date: "2026-01-14" },
];

const statusColors: Record<string, string> = {
    Delivered: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Pending: "bg-gray-100 text-gray-700",
    Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
    const [orders, setOrders] = useState(initialOrders);
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

    const filteredOrders = orders.filter(
        (o) => statusFilter === "All" || o.status === statusFilter
    );

    const updateStatus = (orderId: string, newStatus: string) => {
        setOrders(orders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ));
        setSelectedOrder(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark-950">Orders</h2>
                    <p className="text-dark-500">Manage customer orders</p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="bg-white rounded-xl p-2 shadow-sm flex flex-wrap gap-2">
                {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg transition-colors ${statusFilter === status
                                ? "bg-primary-500 text-white"
                                : "text-dark-600 hover:bg-dark-50"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
                <table className="w-full">
                    <thead>
                        <tr className="bg-dark-50">
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Order ID</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Customer</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Items</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Amount</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Date</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="border-b border-dark-50 hover:bg-dark-50">
                                <td className="px-6 py-4 font-medium text-primary-600">{order.id}</td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-dark-950">{order.customer}</p>
                                        <p className="text-sm text-dark-500">{order.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-dark-700">{order.items} items</td>
                                <td className="px-6 py-4 font-medium text-dark-950">₦{order.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <div className="relative">
                                        <button
                                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                                            className={`px-3 py-1 text-xs rounded-full ${statusColors[order.status]} cursor-pointer`}
                                        >
                                            {order.status}
                                        </button>
                                        {selectedOrder === order.id && (
                                            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-dark-100 z-10">
                                                {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => updateStatus(order.id, s)}
                                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-dark-50 first:rounded-t-lg last:rounded-b-lg"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-dark-500">{order.date}</td>
                                <td className="px-6 py-4">
                                    <button className="p-2 text-dark-400 hover:text-primary-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-dark-500">
                        No orders found with this status.
                    </div>
                )}
            </motion.div>
        </div>
    );
}
