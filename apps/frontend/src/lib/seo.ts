import { Metadata } from "next";

// Reusable SEO configuration for different page types
export const seoConfig = {
    siteName: "Africa Mezziah",
    siteUrl: "https://africamezziah.com",
    twitterHandle: "@africamezziah",
};

// Generate metadata for shop/category pages
export function generateShopMetadata(category?: string): Metadata {
    const categoryName = category || "All Products";
    const title = category
        ? `${category} - African ${category} Collection`
        : "Shop African Fashion | Ankara Dresses, Kente Tops & More";

    return {
        title,
        description: `Shop our collection of African ${categoryName.toLowerCase()}. Find beautiful Ankara dresses, Kente tops, Adire prints, and traditional African wear. Free shipping on orders over ₦50,000.`,
        keywords: [
            `African ${categoryName.toLowerCase()}`,
            `buy African ${categoryName.toLowerCase()} online`,
            "Ankara fashion",
            "Kente clothing",
            "African print",
            "Nigerian fashion",
            "women's African wear",
        ],
        openGraph: {
            title: `${title} | Africa Mezziah`,
            description: `Discover beautiful African ${categoryName.toLowerCase()} at Africa Mezziah`,
            url: category ? `${seoConfig.siteUrl}/shop/${category.toLowerCase()}` : `${seoConfig.siteUrl}/shop`,
            type: "website",
            images: ["/og-shop.jpg"],
        },
    };
}

// Generate metadata for product pages
export function generateProductMetadata(product: {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}): Metadata {
    return {
        title: `${product.name} - African ${product.category}`,
        description: `${product.description.slice(0, 155)}... Shop now at Africa Mezziah. ₦${product.price.toLocaleString()}`,
        keywords: [
            product.name,
            `African ${product.category.toLowerCase()}`,
            "buy African fashion",
            "Ankara dress",
            "African print clothing",
            "Nigerian fashion online",
        ],
        openGraph: {
            title: `${product.name} | Africa Mezziah`,
            description: product.description,
            url: `${seoConfig.siteUrl}/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`,
            type: "website",
            images: [
                {
                    url: product.image,
                    width: 600,
                    height: 800,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${product.name} | Africa Mezziah`,
            description: product.description.slice(0, 200),
            images: [product.image],
        },
    };
}

// Static metadata for about page
export const aboutPageMetadata: Metadata = {
    title: "About Us - Our African Fashion Story",
    description: "Learn about Africa Mezziah, a premium African fashion brand celebrating heritage through handcrafted Ankara dresses, Kente tops, and traditional wear. Founded with a passion for African culture and modern style.",
    keywords: [
        "about Africa Mezziah",
        "African fashion brand",
        "Nigerian fashion designer",
        "African clothing company",
        "African heritage fashion",
    ],
    openGraph: {
        title: "About Africa Mezziah | Our African Fashion Story",
        description: "Discover the story behind Africa Mezziah and our mission to celebrate African heritage through fashion.",
        url: `${seoConfig.siteUrl}/about`,
    },
};

// Static metadata for contact page
export const contactPageMetadata: Metadata = {
    title: "Contact Us - Get in Touch",
    description: "Contact Africa Mezziah for customer support, wholesale inquiries, or styling advice. We're here to help you find the perfect African fashion piece.",
    keywords: [
        "contact Africa Mezziah",
        "African fashion support",
        "buy African clothes",
        "Lagos fashion store",
    ],
    openGraph: {
        title: "Contact Africa Mezziah",
        description: "Get in touch with our team for any inquiries about our African fashion collection.",
        url: `${seoConfig.siteUrl}/contact`,
    },
};

// Static metadata for collections page
export const collectionsPageMetadata: Metadata = {
    title: "Collections - Curated African Fashion",
    description: "Explore our curated African fashion collections. From wedding guest looks to everyday Ankara styles, find your perfect outfit at Africa Mezziah.",
    keywords: [
        "African fashion collections",
        "Ankara collection",
        "African wedding guest dress",
        "African party wear",
        "Nigerian fashion styles",
    ],
    openGraph: {
        title: "Fashion Collections | Africa Mezziah",
        description: "Browse our curated collections of premium African fashion.",
        url: `${seoConfig.siteUrl}/collections`,
    },
};
