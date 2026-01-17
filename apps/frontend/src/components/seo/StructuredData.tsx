// JSON-LD Structured Data for SEO
// These components add schema.org markup for better search visibility

export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Africa Mezziah",
        url: "https://africamezziah.com",
        logo: "https://africamezziah.com/logo.png",
        description: "Premium African-inspired fashion for the modern woman. Handcrafted clothing celebrating African heritage.",
        sameAs: [
            "https://www.instagram.com/africamezziah",
            "https://www.facebook.com/africamezziah",
            "https://twitter.com/africamezziah",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+234-XXX-XXX-XXXX",
            contactType: "customer service",
            areaServed: "NG",
            availableLanguage: "English",
        },
        address: {
            "@type": "PostalAddress",
            addressLocality: "Lagos",
            addressCountry: "NG",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function WebsiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Africa Mezziah",
        url: "https://africamezziah.com",
        description: "Shop premium African fashion, Ankara dresses, Kente tops, and traditional African wear online.",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://africamezziah.com/shop?q={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface ProductSchemaProps {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    sku?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
    category?: string;
}

export function ProductSchema({
    name,
    description,
    image,
    price,
    currency = "NGN",
    sku = "AM-001",
    availability = "InStock",
    category = "Clothing",
}: ProductSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image,
        sku,
        brand: {
            "@type": "Brand",
            name: "Africa Mezziah",
        },
        category,
        offers: {
            "@type": "Offer",
            url: `https://africamezziah.com/product/${sku}`,
            priceCurrency: currency,
            price: price.toString(),
            availability: `https://schema.org/${availability}`,
            seller: {
                "@type": "Organization",
                name: "Africa Mezziah",
            },
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "124",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface BreadcrumbSchemaProps {
    items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ClothingStore",
        name: "Africa Mezziah",
        image: "https://africamezziah.com/storefront.jpg",
        description: "Premium African fashion boutique offering Ankara dresses, Kente wear, and traditional African clothing.",
        url: "https://africamezziah.com",
        telephone: "+234-XXX-XXX-XXXX",
        priceRange: "₦₦-₦₦₦",
        address: {
            "@type": "PostalAddress",
            streetAddress: "Lagos, Nigeria",
            addressLocality: "Lagos",
            addressCountry: "NG",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 6.5244,
            longitude: 3.3792,
        },
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "18:00",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export function FAQSchema() {
    const faqs = [
        {
            question: "What is Africa Mezziah?",
            answer: "Africa Mezziah is a premium African fashion brand offering handcrafted Ankara dresses, Kente tops, traditional African wear, and modern African-inspired clothing for women.",
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes! We ship to over 50 countries worldwide. Shipping times and costs vary by location.",
        },
        {
            question: "What sizes do you offer?",
            answer: "We offer sizes from XS to XXL. Each product page includes a detailed size guide to help you find your perfect fit.",
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 14-day return policy for unworn items in original condition with tags attached.",
        },
    ];

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
