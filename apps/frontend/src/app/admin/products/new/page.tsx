"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Dresses",
        inventory: "",
        sizes: [] as string[],
        colors: "",
        tags: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        alert("Product created successfully!");
        router.push("/admin/products");
    };

    const handleSizeToggle = (size: string) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size],
        }));
    };

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/products"
                    className="text-dark-500 hover:text-dark-700 transition-colors flex items-center gap-2 mb-4"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </Link>
                <h2 className="text-2xl font-bold text-dark-950">Add New Product</h2>
                <p className="text-dark-500">Create a new product in your catalog</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-dark-950">Basic Information</h3>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Product Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-primary-500"
                            placeholder="e.g., Ankara Elegance Dress"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Description *</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                            placeholder="Describe your product..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Price (₦) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-primary-500"
                                placeholder="45000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-primary-500"
                            >
                                <option value="Dresses">Dresses</option>
                                <option value="Tops">Tops</option>
                                <option value="Traditional">Traditional</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Inventory *</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.inventory}
                            onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                            className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-primary-500"
                            placeholder="10"
                        />
                    </div>
                </div>

                {/* Variants */}
                <div className="space-y-4 pt-4 border-t border-dark-100">
                    <h3 className="font-semibold text-dark-950">Variants</h3>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-2">Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeToggle(size)}
                                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${formData.sizes.includes(size)
                                            ? "border-primary-500 bg-primary-50 text-primary-700"
                                            : "border-dark-200 text-dark-600 hover:border-dark-400"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Colors (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.colors}
                            onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                            className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-primary-500"
                            placeholder="e.g., Orange, Blue, Green"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:border-primary-500"
                            placeholder="e.g., Ankara, Wedding, Traditional"
                        />
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4 pt-4 border-t border-dark-100">
                    <h3 className="font-semibold text-dark-950">Images</h3>
                    <div className="border-2 border-dashed border-dark-200 rounded-lg p-8 text-center">
                        <svg className="w-12 h-12 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-dark-500 mb-2">Drag and drop images here, or click to browse</p>
                        <p className="text-xs text-dark-400">PNG, JPG up to 5MB</p>
                        <input type="file" multiple accept="image/*" className="hidden" />
                        <button type="button" className="mt-4 px-4 py-2 text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50">
                            Browse Files
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-4 border-t border-dark-100">
                    <Link
                        href="/admin/products"
                        className="px-6 py-2 text-dark-600 hover:text-dark-800 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
