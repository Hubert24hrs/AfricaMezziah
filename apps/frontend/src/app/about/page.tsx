import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
    title: "About Us - Our African Fashion Story",
    description: "Learn about Africa Mezziah, a premium African fashion brand celebrating heritage through handcrafted Ankara dresses, Kente tops, and traditional wear. Founded with a passion for African culture and modern style.",
    keywords: [
        "about Africa Mezziah",
        "African fashion brand",
        "Nigerian fashion designer",
        "African clothing company",
        "African heritage fashion",
        "African women fashion",
    ],
    openGraph: {
        title: "About Africa Mezziah | Our African Fashion Story",
        description: "Discover the story behind Africa Mezziah and our mission to celebrate African heritage through fashion.",
        url: "https://africamezziah.com/about",
    },
};

export default function AboutPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://africamezziah.com" },
                    { name: "About Us", url: "https://africamezziah.com/about" },
                ]}
            />
            <Header />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-luxury">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-cream mb-6">
                        Our Story
                    </h1>
                    <p className="text-cream/70 max-w-2xl mx-auto text-lg">
                        Celebrating African heritage through premium fashion that empowers women.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <article className="prose prose-lg">
                            <h2 className="text-3xl font-display font-bold text-dark-950 mb-6">
                                Who We Are
                            </h2>
                            <p className="text-dark-600 mb-6 leading-relaxed">
                                Africa Mezziah is a premium African fashion brand dedicated to celebrating the rich
                                heritage and vibrant culture of Africa through beautifully crafted clothing. We believe
                                that fashion is more than just clothing—it&apos;s a way to express identity, celebrate
                                heritage, and embrace the beauty of African artistry.
                            </p>

                            <h2 className="text-3xl font-display font-bold text-dark-950 mb-6 mt-12">
                                Our Mission
                            </h2>
                            <p className="text-dark-600 mb-6 leading-relaxed">
                                Our mission is to bring the elegance of African fashion to the global stage while
                                supporting local artisans and preserving traditional craftsmanship. Every piece in
                                our collection is carefully designed to blend traditional African aesthetics with
                                modern sophistication.
                            </p>

                            <h2 className="text-3xl font-display font-bold text-dark-950 mb-6 mt-12">
                                What We Offer
                            </h2>
                            <ul className="text-dark-600 space-y-3 mb-6">
                                <li><strong>Ankara Dresses</strong> – Vibrant African print dresses for every occasion</li>
                                <li><strong>Kente Wear</strong> – Traditional Ghanaian-inspired tops and accessories</li>
                                <li><strong>Adire Clothing</strong> – Hand-dyed Nigerian tie-dye fashion</li>
                                <li><strong>Aso-Oke Gowns</strong> – Premium handwoven traditional wear</li>
                                <li><strong>African Accessories</strong> – Beaded jewelry and statement pieces</li>
                            </ul>

                            <h2 className="text-3xl font-display font-bold text-dark-950 mb-6 mt-12">
                                Our Promise
                            </h2>
                            <p className="text-dark-600 mb-6 leading-relaxed">
                                We are committed to quality, authenticity, and customer satisfaction. When you shop
                                with Africa Mezziah, you&apos;re not just buying clothes—you&apos;re investing in
                                handcrafted pieces that tell a story and support African communities.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
