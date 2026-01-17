import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Africa Mezziah | Premium African Fashion",
  description: "Discover elegant, African-inspired fashion for the modern woman. Africa Mezziah offers premium clothing that celebrates African identity with global appeal.",
  keywords: ["African fashion", "Nigerian fashion", "African dresses", "Women's clothing", "Premium fashion", "Africa Mezziah"],
  authors: [{ name: "Africa Mezziah" }],
  openGraph: {
    title: "Africa Mezziah | Premium African Fashion",
    description: "Elegant African-inspired fashion for the modern woman",
    type: "website",
    locale: "en_NG",
    siteName: "Africa Mezziah",
  },
  twitter: {
    card: "summary_large_image",
    title: "Africa Mezziah | Premium African Fashion",
    description: "Elegant African-inspired fashion for the modern woman",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
