"use client";

import { motion } from "framer-motion";

const customers = [
    { id: "1", name: "Adaeze Okonkwo", email: "adaeze@email.com", orders: 5, totalSpent: 245000, joined: "2025-12-01" },
    { id: "2", name: "Fatima Ibrahim", email: "fatima@email.com", orders: 3, totalSpent: 156000, joined: "2025-11-15" },
    { id: "3", name: "Grace Adekunle", email: "grace@email.com", orders: 8, totalSpent: 420000, joined: "2025-10-20" },
    { id: "4", name: "Ngozi Eze", email: "ngozi@email.com", orders: 2, totalSpent: 98000, joined: "2026-01-05" },
    { id: "5", name: "Chiamaka Nwosu", email: "chiamaka@email.com", orders: 12, totalSpent: 680000, joined: "2025-09-10" },
];

export default function AdminCustomers() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-dark-950">Customers</h2>
                <p className="text-dark-500">Manage your customer base</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-dark-500 text-sm">Total Customers</p>
                    <p className="text-3xl font-bold text-dark-950 mt-2">1,234</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-dark-500 text-sm">New This Month</p>
                    <p className="text-3xl font-bold text-dark-950 mt-2">89</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-dark-500 text-sm">Repeat Customers</p>
                    <p className="text-3xl font-bold text-dark-950 mt-2">67%</p>
                </div>
            </div>

            {/* Customers Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
                <table className="w-full">
                    <thead>
                        <tr className="bg-dark-50">
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Customer</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Orders</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Total Spent</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Joined</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id} className="border-b border-dark-50 hover:bg-dark-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-dark-950">{customer.name}</p>
                                            <p className="text-sm text-dark-500">{customer.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-dark-700">{customer.orders}</td>
                                <td className="px-6 py-4 font-medium text-dark-950">₦{customer.totalSpent.toLocaleString()}</td>
                                <td className="px-6 py-4 text-dark-500">{customer.joined}</td>
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
            </motion.div>
        </div>
    );
}
