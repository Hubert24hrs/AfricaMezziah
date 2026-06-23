import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Collections - Curated African Fashion",
    description: "Explore our curated African fashion collections. From Ankara wedding guest dresses to everyday Kente styles, traditional Aso-Oke gowns and modern African prints. Shop premium African clothing online.",
    keywords: [
        "African fashion collections",
        "Ankara collection 2026",
        "African wedding guest dress",
        "African party wear",
        "Nigerian fashion styles",
        "Kente collection",
        "traditional African wear",
        "African print clothing",
    ],
    openGraph: {
        title: "Fashion Collections | Africa Mezziah",
        description: "Browse our curated collections of premium African fashion.",
        url: "https://africamezziah.com/collections",
    },
};

const collections = [
    {
        name: "New Arrivals",
        description: "Fresh African prints and styles just added to our collection",
        image: "https://images.unsplash.com/photo-1760907949889-eb62b7fd9f75?w=600&h=400&fit=crop",
        count: 24,
        slug: "new-arrivals",
    },
    {
        name: "Wedding Guest",
        description: "Stunning Aso-Ebi and traditional outfits for ceremonies",
        image: "https://images.unsplash.com/photo-1681545303529-b6beb2e19f02?w=600&h=400&fit=crop",
        count: 18,
        slug: "wedding-guest",
    },
    {
        name: "Ankara Prints",
        description: "Vibrant African wax print dresses and separates",
        image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=400&fit=crop",
        count: 32,
        slug: "ankara",
    },
    {
        name: "Kente Collection",
        description: "Traditional Ghanaian Kente-inspired tops and accessories",
        image: "https://images.unsplash.com/photo-1709809081557-78f803ce93a0?w=600&h=400&fit=crop",
        count: 15,
        slug: "kente",
    },
    {
        name: "Office Elegance",
        description: "Professional African-inspired workwear for the modern woman",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
        count: 20,
        slug: "office",
    },
    {
        name: "Accessories",
        description: "Handcrafted African jewelry, bags, and statement pieces",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=400&fit=crop",
        count: 45,
        slug: "accessories",
    },
];

export default function CollectionsPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://africamezziah.com" },
                    { name: "Collections", url: "https://africamezziah.com/collections" },
                ]}
            />
            <Header />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-luxury">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-cream mb-6">
                        Our Collections
                    </h1>
                    <p className="text-cream/70 max-w-2xl mx-auto text-lg">
                        Discover curated African fashion collections for every occasion.
                        From traditional to contemporary, find your perfect style.
                    </p>
                </div>
            </section>

            {/* Collections Grid */}
            <section className="py-20 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection) => (
                            <Link
                                key={collection.slug}
                                href={`/shop?collection=${collection.slug}`}
                                className="group block"
                            >
                                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="relative aspect-[3/2] overflow-hidden">
                                        <Image
                                            src={collection.image}
                                            alt={`${collection.name} - African Fashion Collection`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
                                        <span className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-dark-950">
                                            {collection.count} items
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-xl font-display font-bold text-dark-950 mb-2 group-hover:text-primary-500 transition-colors">
                                            {collection.name}
                                        </h2>
                                        <p className="text-dark-500 text-sm">
                                            {collection.description}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="py-16 bg-ivory">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-display font-bold text-dark-950 mb-6">
                            Shop Premium African Fashion Online
                        </h2>
                        <p className="text-dark-600 leading-relaxed mb-4">
                            Africa Mezziah offers the finest selection of African clothing for women.
                            Our collections feature authentic Ankara dresses, traditional Kente wear,
                            hand-dyed Adire prints, and elegant Aso-Oke gowns. Whether you&apos;re shopping
                            for African wedding guest outfits, office-appropriate African fashion, or
                            statement accessories, we have something beautiful for every occasion.
                        </p>
                        <p className="text-dark-600 leading-relaxed">
                            Each piece is carefully selected to celebrate African heritage while
                            embracing modern style. Shop with confidence and enjoy free shipping
                            on orders over ₦50,000 within Nigeria.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
