"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";

// Dynamic import for 3D component (client-side only)
const Hero3D = dynamic(() => import("@/components/3d/Hero3D"), { ssr: false });

// Sample featured products (replace with API data)
const featuredProducts = [
  { id: "1", name: "Ankara Elegance Dress", price: 45000, image: "https://images.unsplash.com/photo-1611299288800-f3a7f5c4b1fa?w=400&h=600&fit=crop", category: "Dresses" },
  { id: "2", name: "Kente Wrap Top", price: 28000, image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=600&fit=crop", category: "Tops" },
  { id: "3", name: "Adire Print Skirt", price: 32000, image: "https://images.unsplash.com/photo-1590735213408-9d0bd67b1ed3?w=400&h=600&fit=crop", category: "Traditional" },
  { id: "4", name: "Beaded Statement Necklace", price: 18000, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=600&fit=crop", category: "Accessories" },
];

const categories = [
  { name: "Dresses", image: "https://images.unsplash.com/photo-1611299288800-f3a7f5c4b1fa?w=300&h=400&fit=crop", count: 42 },
  { name: "Tops", image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&h=400&fit=crop", count: 38 },
  { name: "Traditional Wear", image: "https://images.unsplash.com/photo-1590735213408-9d0bd67b1ed3?w=300&h=400&fit=crop", count: 25 },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=400&fit=crop", count: 56 },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-luxury">
        <Hero3D />

        <div className="relative z-10 container mx-auto px-4 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-1 mb-6 text-accent-400 text-sm font-medium tracking-wider uppercase glass rounded-full">
              New Collection 2026
            </span>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-cream mb-6 leading-tight">
              Elegance Rooted in{" "}
              <span className="text-gradient">African Heritage</span>
            </h1>

            <p className="text-lg md:text-xl text-cream/70 mb-10 max-w-2xl mx-auto">
              Discover premium, African-inspired fashion that celebrates your identity.
              Handcrafted pieces for the modern woman who embraces her roots.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/shop" className="btn-gold">
                Shop Collection
              </a>
              <a href="/about" className="btn-secondary border-cream/30 text-cream hover:bg-cream hover:text-dark-950">
                Our Story
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center text-cream/50">
            <span className="text-xs mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-950 mb-4">
              Featured Pieces
            </h2>
            <p className="text-dark-500 max-w-xl mx-auto">
              Handpicked selections from our latest collection, designed to make you stand out.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a href="/shop" className="btn-primary">
              View All Products
            </a>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-950 mb-4">
              Shop by Category
            </h2>
            <p className="text-dark-500 max-w-xl mx-auto">
              Explore our curated collections, from traditional African designs to contemporary styles.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.a
                key={category.name}
                href={`/shop/${category.name.toLowerCase().replace(" ", "-")}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-cream mb-1">{category.name}</h3>
                  <p className="text-cream/60 text-sm">{category.count} items</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-primary-500">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">
              Join the Africa Mezziah Family
            </h2>
            <p className="text-cream/80 max-w-xl mx-auto mb-8">
              Subscribe to our newsletter for exclusive offers, new arrivals, and African fashion inspiration.
            </p>
            <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/20 text-cream placeholder-cream/60 border border-cream/20 focus:outline-none focus:border-cream/40"
              />
              <button type="submit" className="btn-gold">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
