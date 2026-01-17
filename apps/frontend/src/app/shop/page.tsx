"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";

// Sample products data
const allProducts = [
    { id: "1", name: "Ankara Elegance Dress", price: 45000, image: "https://images.unsplash.com/photo-1611299288800-f3a7f5c4b1fa?w=400&h=600&fit=crop", category: "Dresses", color: "Orange" },
    { id: "2", name: "Kente Wrap Top", price: 28000, image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=600&fit=crop", category: "Tops", color: "Gold" },
    { id: "3", name: "Adire Print Skirt", price: 32000, image: "https://images.unsplash.com/photo-1590735213408-9d0bd67b1ed3?w=400&h=600&fit=crop", category: "Traditional", color: "Blue" },
    { id: "4", name: "Beaded Statement Necklace", price: 18000, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=600&fit=crop", category: "Accessories", color: "Gold" },
    { id: "5", name: "Aso-Oke Gown", price: 85000, image: "https://images.unsplash.com/photo-1594938391221-52c9089c9f8e?w=400&h=600&fit=crop", category: "Dresses", color: "Cream" },
    { id: "6", name: "Dashiki Print Blouse", price: 24000, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop", category: "Tops", color: "Multi" },
    { id: "7", name: "Mud Cloth Trousers", price: 38000, image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=600&fit=crop", category: "Traditional", color: "Brown" },
    { id: "8", name: "Cowrie Shell Earrings", price: 12000, image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop", category: "Accessories", color: "Natural" },
];

const categories = ["All", "Dresses", "Tops", "Traditional", "Accessories"];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low"];

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");
    const [priceRange, setPriceRange] = useState([0, 100000]);

    const filteredProducts = allProducts
        .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
        .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
        .sort((a, b) => {
            if (sortBy === "Price: Low to High") return a.price - b.price;
            if (sortBy === "Price: High to Low") return b.price - a.price;
            return 0;
        });

    return (
        <>
            <Header />

            {/* Page Header */}
            <section className="pt-32 pb-12 bg-gradient-luxury">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">
                            Shop Collection
                        </h1>
                        <p className="text-cream/70 max-w-xl mx-auto">
                            Explore our curated selection of African-inspired fashion pieces.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 bg-cream min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar Filters */}
                        <aside className="lg:w-64 shrink-0">
                            <div className="sticky top-28 space-y-6">
                                {/* Categories */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-dark-950 mb-4">Category</h3>
                                    <div className="space-y-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat
                                                    ? "bg-primary-500 text-white"
                                                    : "text-dark-600 hover:bg-ivory"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-dark-950 mb-4">Price Range</h3>
                                    <div className="space-y-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100000"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                            className="w-full accent-primary-500"
                                        />
                                        <div className="flex justify-between text-sm text-dark-500">
                                            <span>₦0</span>
                                            <span>₦{priceRange[1].toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <main className="flex-1">
                            {/* Sort Bar */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-dark-500">
                                    Showing <span className="font-semibold text-dark-950">{filteredProducts.length}</span> products
                                </p>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-dark-200 bg-white text-dark-700 focus:outline-none focus:border-primary-500"
                                >
                                    {sortOptions.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Products */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20 text-dark-500">
                                    No products found matching your filters.
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
