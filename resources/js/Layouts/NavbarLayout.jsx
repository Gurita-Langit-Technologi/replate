import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ShoppingBasket,
    Trophy,
    Leaf,
    Receipt,
    HelpCircle,
    Menu,
    X,
    User,
    LayoutDashboard,
    Download,
} from 'lucide-react';
import Toast from '@/Components/Toast';

export default function NavbarLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const user = auth?.user ?? null;

    const navLinks = [
        { label: 'Beranda', href: '/' },
        { label: 'Marketplace', href: '/marketplace', icon: ShoppingBasket },
        { label: 'Dampak Desa', href: '/impact', icon: Leaf },
        { label: 'Laporan ESG', href: '/impact/report', icon: Receipt },
        { label: 'Peringkat Warga', href: '/leaderboard', icon: Trophy },
        { label: 'FAQ', href: '/faq', icon: HelpCircle },
    ];

    const isActive = (href) => {
        if (href === '/') return currentPath === '/';
        return currentPath.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Toast />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/image/logo(2).png"
                                alt="Replate"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/image/logo.png';
                                }}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-5 lg:gap-7">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm transition-colors duration-150 flex items-center gap-1.5 py-1 ${
                                        active
                                            ? 'text-emerald-700 font-bold'
                                            : 'text-gray-600 hover:text-emerald-600 font-medium'
                                    }`}
                                >
                                    {link.icon && (
                                        <link.icon
                                            size={16}
                                            className={active ? 'text-emerald-700' : 'text-gray-400'}
                                        />
                                    )}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right User Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {user.points > 0 && (
                                    <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200">
                                        🪙 {user.points} RePoin
                                    </span>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition shadow-xs flex items-center gap-2"
                                >
                                    <LayoutDashboard size={16} />
                                    <span>Dashboard</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors py-1"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition shadow-xs"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white px-5 pt-3 pb-4 space-y-2 shadow-md">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-1.5 text-sm transition-colors ${
                                        active
                                            ? 'text-emerald-700 font-bold'
                                            : 'text-gray-700 hover:text-emerald-600 font-medium'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </header>

            {/* Main Page Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 print:p-0 print:max-w-none">
                {children}
            </main>

            {/* Simple Clean Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-auto print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                    <p>© 2026 Replate — Platform Digitalisasi Pangan & Lingkungan Desa</p>
                    <div className="flex items-center gap-4 font-medium text-gray-600">
                        <Link href="/impact" className="hover:text-emerald-700">Dampak Desa</Link>
                        <Link href="/impact/report" className="hover:text-emerald-700">Laporan ESG</Link>
                        <Link href="/faq" className="hover:text-emerald-700">Bantuan & FAQ</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
