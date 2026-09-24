import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ShoppingBasket,
    Leaf,
    Receipt,
    Trophy,
    HelpCircle,
    Download,
    Menu,
    X,
} from 'lucide-react';

export default function Navbar({ auth }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallApp = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstallable(false);
        }
        setDeferredPrompt(null);
    };

    const navLinks = [
        { label: 'Beranda', href: '/' },
        { label: 'Marketplace', href: '/marketplace', icon: ShoppingBasket },
        { label: 'Dampak Desa', href: '/impact', icon: Leaf },
        { label: 'Laporan ESG', href: '/impact/report', icon: Receipt },
        { label: 'Peringkat Warga', href: '/leaderboard', icon: Trophy },
        { label: 'FAQ', href: '/faq', icon: HelpCircle },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                        const active = link.href === '/';
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

                <div className="flex items-center gap-4">
                    {isInstallable && (
                        <button
                            onClick={handleInstallApp}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-emerald-50 transition"
                        >
                            <Download size={14} /> Install App
                        </button>
                    )}

                    {auth?.user ? (
                        <div className="flex items-center gap-3">
                            {auth.user.points > 0 && (
                                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200">
                                    🪙 {auth.user.points} RePoin
                                </span>
                            )}
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition shadow-xs"
                            >
                                Dashboard
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
                        const active = link.href === '/';
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
    );
}
