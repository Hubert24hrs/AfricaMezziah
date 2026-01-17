"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Sample products data
const initialProducts = [
    { id: "1", name: "Ankara Elegance Dress", price: 45000, inventory: 15, category: "Dresses", status: "Active" },
    { id: "2", name: "Kente Wrap Top", price: 28000, inventory: 22, category: "Tops", status: "Active" },
    { id: "3", name: "Adire Print Skirt", price: 32000, inventory: 8, category: "Traditional", status: "Active" },
    { id: "4", name: "Beaded Statement Necklace", price: 18000, inventory: 30, category: "Accessories", status: "Active" },
    { id: "5", name: "Aso-Oke Gown", price: 85000, inventory: 5, category: "Dresses", status: "Low Stock" },
    { id: "6", name: "Dashiki Print Blouse", price: 24000, inventory: 0, category: "Tops", status: "Out of Stock" },
];

export default function AdminProducts() {
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((p) => p.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark-950">Products</h2>
                    <p className="text-dark-500">Manage your product catalog</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-primary-500"
                >
                    <option value="All">All Categories</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Accessories">Accessories</option>
                </select>
            </div>

            {/* Products Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
                <table className="w-full">
                    <thead>
                        <tr className="bg-dark-50">
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Product</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Category</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Price</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Inventory</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-dark-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b border-dark-50 hover:bg-dark-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-ivory flex items-center justify-center">
                                            👗
                                        </div>
                                        <span className="font-medium text-dark-950">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-dark-700">{product.category}</td>
                                <td className="px-6 py-4 font-medium text-dark-950">₦{product.price.toLocaleString()}</td>
                                <td className="px-6 py-4 text-dark-700">{product.inventory}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${product.status === "Active" ? "bg-green-100 text-green-700" :
                                            product.status === "Low Stock" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"
                                        }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-2 text-dark-400 hover:text-primary-500 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-dark-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-dark-500">
                        No products found matching your criteria.
                    </div>
                )}
            </motion.div>
        </div>
    );
}
