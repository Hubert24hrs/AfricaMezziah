"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Products", icon: "👗" },
    { href: "/admin/orders", label: "Orders", icon: "📦" },
    { href: "/admin/customers", label: "Customers", icon: "👥" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-dark-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-950 text-white shrink-0">
                <div className="p-6 border-b border-dark-800">
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-xl font-display font-bold">
                            Africa <span className="text-gradient">Mezziah</span>
                        </span>
                    </Link>
                    <p className="text-xs text-dark-400 mt-1">Admin Dashboard</p>
                </div>

                <nav className="p-4">
                    <ul className="space-y-1">
                        {adminNavItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== "/admin" && pathname.startsWith(item.href));
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? "bg-primary-500 text-white"
                                                : "text-dark-300 hover:bg-dark-800 hover:text-white"
                                            }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-dark-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-dark-400 hover:text-white transition-colors"
                    >
                        <span>🌐</span>
                        <span>View Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Top Bar */}
                <header className="bg-white border-b border-dark-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-dark-950">
                        {adminNavItems.find((item) =>
                            pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href))
                        )?.label || "Dashboard"}
                    </h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-dark-500 hover:text-dark-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-medium">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
