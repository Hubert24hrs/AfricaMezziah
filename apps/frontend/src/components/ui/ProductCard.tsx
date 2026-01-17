"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Link href={`/product/${id}`} className="group block">
                <div className="card-product">
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/20 transition-colors duration-300">
                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <button className="w-full btn-primary text-sm py-3">
                                    Quick Add
                                </button>
                            </div>
                        </div>

                        {/* Category Badge */}
                        {category && (
                            <span className="absolute top-4 left-4 px-3 py-1 glass text-xs font-medium text-dark-950 rounded-full">
                                {category}
                            </span>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                        <h3 className="font-medium text-dark-950 group-hover:text-primary-500 transition-colors duration-300">
                            {name}
                        </h3>
                        <p className="mt-1 text-lg font-semibold text-primary-600">
                            ₦{price.toLocaleString()}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
