import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema, FAQSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL("https://africamezziah.com"),
  title: {
    default: "Africa Mezziah | Premium African Fashion & Clothing for Women",
    template: "%s | Africa Mezziah",
  },
  description: "Shop premium African fashion online. Discover beautiful Ankara dresses, Kente tops, Adire skirts, and traditional African wear. Handcrafted clothing celebrating African heritage for the modern woman. Free shipping in Nigeria.",
  keywords: [
    // Primary keywords
    "African fashion",
    "African clothing",
    "African wear",
    "African dresses",
    "African women fashion",
    // Product keywords
    "Ankara dresses",
    "Kente wear",
    "Adire clothing",
    "Aso-Oke gowns",
    "Dashiki tops",
    "African print dresses",
    "African maxi dress",
    // Style keywords
    "traditional African wear",
    "modern African fashion",
    "African wedding dress",
    "African party dress",
    "African office wear",
    // Location keywords
    "Nigerian fashion",
    "Lagos fashion",
    "African fashion online",
    "buy African clothes online",
    "African fashion store",
    // General fashion keywords
    "women's clothing",
    "women's fashion",
    "ladies wear",
    "fashion boutique",
    "premium clothing",
    "handmade clothing",
    "designer African clothes",
  ],
  authors: [{ name: "Africa Mezziah", url: "https://africamezziah.com" }],
  creator: "Africa Mezziah",
  publisher: "Africa Mezziah",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://africamezziah.com",
    languages: {
      "en-NG": "https://africamezziah.com",
      "en-US": "https://africamezziah.com/en-us",
    },
  },
  openGraph: {
    title: "Africa Mezziah | Premium African Fashion & Clothing",
    description: "Shop beautiful Ankara dresses, Kente tops, and traditional African wear. Handcrafted premium fashion celebrating African heritage.",
    type: "website",
    locale: "en_NG",
    url: "https://africamezziah.com",
    siteName: "Africa Mezziah",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Africa Mezziah - Premium African Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Africa Mezziah | Premium African Fashion",
    description: "Shop beautiful Ankara dresses, Kente tops, and traditional African wear online.",
    site: "@africamezziah",
    creator: "@africamezziah",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  category: "Fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <OrganizationSchema />
        <WebsiteSchema />
        <LocalBusinessSchema />
        <FAQSchema />

        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color */}
        <meta name="theme-color" content="#C35A00" />
        <meta name="msapplication-TileColor" content="#C35A00" />
      </head>
      <body className="min-h-screen bg-cream">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
