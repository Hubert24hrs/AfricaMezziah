"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const shipping = items.length > 0 ? 3500 : 0;
    const total = getTotalPrice() + shipping;

    return (
        <>
            <Header />

            <section className="pt-28 pb-16 bg-cream min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-950 mb-8">
                        Shopping Cart
                    </h1>

                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <svg
                                className="w-24 h-24 mx-auto text-dark-300 mb-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <h2 className="text-2xl font-semibold text-dark-950 mb-4">
                                Your cart is empty
                            </h2>
                            <p className="text-dark-500 mb-8">
                                Looks like you haven&apos;t added anything to your cart yet.
                            </p>
                            <Link href="/shop" className="btn-primary">
                                Start Shopping
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm"
                                    >
                                        <div className="relative w-24 h-32 rounded-lg overflow-hidden shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-dark-950">{item.name}</h3>
                                                    {(item.size || item.color) && (
                                                        <p className="text-sm text-dark-500">
                                                            {item.size && `Size: ${item.size}`}
                                                            {item.size && item.color && " | "}
                                                            {item.color && `Color: ${item.color}`}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-dark-400 hover:text-red-500 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-lg border border-dark-200 flex items-center justify-center text-dark-600 hover:border-dark-400"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-lg border border-dark-200 flex items-center justify-center text-dark-600 hover:border-dark-400"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="font-semibold text-primary-600">
                                                    ₦{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                <button
                                    onClick={clearCart}
                                    className="text-sm text-dark-500 hover:text-red-500 transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
                                    <h2 className="text-xl font-semibold text-dark-950 mb-6">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-dark-600">
                                            <span>Subtotal</span>
                                            <span>₦{getTotalPrice().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-dark-600">
                                            <span>Shipping</span>
                                            <span>₦{shipping.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t border-dark-100 pt-4 flex justify-between text-lg font-semibold text-dark-950">
                                            <span>Total</span>
                                            <span>₦{total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Link href="/checkout" className="block w-full btn-primary text-center">
                                        Proceed to Checkout
                                    </Link>

                                    <Link
                                        href="/shop"
                                        className="block w-full text-center mt-4 text-primary-500 hover:text-primary-600 font-medium"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
