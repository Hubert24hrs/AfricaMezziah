import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
    title: "Contact Us - Get in Touch",
    description: "Contact Africa Mezziah for customer support, wholesale inquiries, or styling advice. Shop African fashion with confidence - Ankara dresses, Kente tops, and traditional African wear.",
    keywords: [
        "contact Africa Mezziah",
        "African fashion support",
        "buy African clothes Nigeria",
        "Lagos fashion store",
        "African clothing customer service",
    ],
    openGraph: {
        title: "Contact Africa Mezziah | Customer Support",
        description: "Get in touch with our team for any inquiries about our African fashion collection.",
        url: "https://africamezziah.com/contact",
    },
};

export default function ContactPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://africamezziah.com" },
                    { name: "Contact", url: "https://africamezziah.com/contact" },
                ]}
            />
            <Header />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-luxury">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-cream mb-6">
                        Contact Us
                    </h1>
                    <p className="text-cream/70 max-w-2xl mx-auto text-lg">
                        We&apos;d love to hear from you. Reach out for styling advice, orders, or any questions.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Form */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-display font-bold text-dark-950 mb-6">
                                Send us a Message
                            </h2>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-dark-200 focus:outline-none focus:border-primary-500"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-lg border border-dark-200 focus:outline-none focus:border-primary-500"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">
                                        Subject
                                    </label>
                                    <select className="w-full px-4 py-3 rounded-lg border border-dark-200 focus:outline-none focus:border-primary-500">
                                        <option>Order Inquiry</option>
                                        <option>Styling Advice</option>
                                        <option>Wholesale Inquiry</option>
                                        <option>Returns & Exchanges</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-lg border border-dark-200 focus:outline-none focus:border-primary-500 resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button type="submit" className="w-full btn-primary">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-dark-950 mb-6">
                                    Get in Touch
                                </h2>
                                <p className="text-dark-600 mb-8">
                                    Have questions about our African fashion collection? Need help finding
                                    the perfect Ankara dress or Kente outfit? Our team is here to help!
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                        📍
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-dark-950">Location</h3>
                                        <p className="text-dark-600">Lagos, Nigeria</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                        📧
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-dark-950">Email</h3>
                                        <p className="text-dark-600">hello@africamezziah.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                        📱
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-dark-950">WhatsApp</h3>
                                        <p className="text-dark-600">+234 XXX XXX XXXX</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                        🕐
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-dark-950">Business Hours</h3>
                                        <p className="text-dark-600">Mon - Sat: 9AM - 6PM (WAT)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="pt-6 border-t border-dark-100">
                                <h3 className="font-semibold text-dark-950 mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-dark-950 text-white flex items-center justify-center hover:bg-primary-500 transition-colors">
                                        <span className="sr-only">Instagram</span>📷
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-dark-950 text-white flex items-center justify-center hover:bg-primary-500 transition-colors">
                                        <span className="sr-only">Facebook</span>📘
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-dark-950 text-white flex items-center justify-center hover:bg-primary-500 transition-colors">
                                        <span className="sr-only">Twitter</span>🐦
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
