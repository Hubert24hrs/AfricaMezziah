"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { useCartStore } from "@/store/cartStore";

// Sample product data (replace with API call)
const product = {
    id: "1",
    name: "Ankara Elegance Maxi Dress",
    price: 45000,
    description: "A stunning maxi dress featuring authentic Ankara print in vibrant colors. This elegant piece is perfect for special occasions, weddings, or cultural celebrations. Handcrafted with attention to detail, it celebrates African heritage while embracing modern fashion trends.",
    images: [
        "https://images.unsplash.com/photo-1611299288800-f3a7f5c4b1fa?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1594938391221-52c9089c9f8e?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Orange/Red", "Blue/Gold", "Green/Yellow"],
    category: "Dresses",
    tags: ["Ankara", "Maxi", "Traditional", "Wedding"],
    inStock: true,
};

const relatedProducts = [
    { id: "2", name: "Kente Wrap Top", price: 28000, image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=600&fit=crop" },
    { id: "3", name: "Adire Print Skirt", price: 32000, image: "https://images.unsplash.com/photo-1590735213408-9d0bd67b1ed3?w=400&h=600&fit=crop" },
    { id: "4", name: "Dashiki Blouse", price: 24000, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop" },
    { id: "5", name: "Aso-Oke Gown", price: 85000, image: "https://images.unsplash.com/photo-1594938391221-52c9089c9f8e?w=400&h=600&fit=crop" },
];

export default function ProductPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert("Please select a size and color");
            return;
        }
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor,
        });
        alert("Added to cart!");
    };

    return (
        <>
            <Header />

            <section className="pt-28 pb-16 bg-cream min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-ivory"
                            >
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>

                            <div className="flex gap-3">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === idx ? "border-primary-500" : "border-transparent"
                                            }`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <p className="text-primary-500 font-medium mb-2">{product.category}</p>
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-950 mb-4">
                                    {product.name}
                                </h1>
                                <p className="text-3xl font-bold text-primary-600 mb-6">
                                    ₦{product.price.toLocaleString()}
                                </p>
                                <p className="text-dark-500 mb-8 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Color Selection */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-dark-950 mb-3">Color</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 rounded-full border-2 transition-colors ${selectedColor === color
                                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                                    : "border-dark-200 text-dark-600 hover:border-dark-400"
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selection */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-dark-950 mb-3">Size</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-12 h-12 rounded-lg border-2 font-medium transition-colors ${selectedSize === size
                                                    ? "border-primary-500 bg-primary-500 text-white"
                                                    : "border-dark-200 text-dark-600 hover:border-dark-400"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="mb-8">
                                    <h3 className="font-semibold text-dark-950 mb-3">Quantity</h3>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg border-2 border-dark-200 flex items-center justify-center text-dark-600 hover:border-dark-400"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-lg border-2 border-dark-200 flex items-center justify-center text-dark-600 hover:border-dark-400"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Add to Cart */}
                                <div className="flex gap-4">
                                    <button onClick={handleAddToCart} className="flex-1 btn-primary">
                                        Add to Cart
                                    </button>
                                    <button className="p-4 border-2 border-dark-200 rounded-full hover:border-primary-500 hover:text-primary-500 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Tags */}
                                <div className="mt-8 flex flex-wrap gap-2">
                                    {product.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-ivory rounded-full text-sm text-dark-500">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-display font-bold text-dark-950 mb-8">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} {...p} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
