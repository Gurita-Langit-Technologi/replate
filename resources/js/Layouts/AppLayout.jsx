import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    ShoppingBasket,
    Package,
    Receipt,
    ArrowLeftRight,
    Bell,
    User,
    Shield,
    Handshake,
    Menu,
    X,
    LogOut,
    Leaf,
    Users,
    MessageCircle,
} from 'lucide-react';
import Toast from '@/Components/Toast';

const NAV_ITEMS = {
    user: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Marketplace', href: '/marketplace', icon: ShoppingBasket },
        { label: 'Produk Saya', href: '/my-products', icon: Package },
        { label: 'Transaksi', href: '/transactions', icon: Receipt },
        { label: 'Barter', href: '/barter', icon: ArrowLeftRight },
        { label: 'Chat', href: '/chat', icon: MessageCircle },
    ],
    admin: [
        { label: 'Admin Panel', href: '/admin/dashboard', icon: Shield },
        { label: 'Verifikasi', href: '/admin/verifications', icon: Shield },
        { label: 'Laporan', href: '/admin/reports', icon: Shield },
        { label: 'Partner', href: '/admin/partners', icon: Handshake },
        { label: 'Pengguna', href: '/admin/users', icon: Users },
    ],
    partner: [
        { label: 'Partner Panel', href: '/partner/dashboard', icon: Handshake },
    ],
};

export default function AppLayout({ children }) {
    const { auth, unreadNotifications } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentPath = window.location.pathname;

    const user = auth.user;
    const role = user.role;

    // Build nav items based on role
    let navItems = [...NAV_ITEMS.user];
    if (role === 'admin') navItems = [...navItems, ...NAV_ITEMS.admin];
    if (role === 'partner') navItems = [...navItems, ...NAV_ITEMS.partner];

    function isActive(href) {
        if (href === '/dashboard') return currentPath === '/dashboard';
        return currentPath.startsWith(href);
    }

    const roleColors = {
        user: 'bg-green-100 text-green-700',
        verified_seller: 'bg-purple-100 text-purple-700',
        partner: 'bg-blue-100 text-blue-700',
        admin: 'bg-red-100 text-red-700',
    };

    const roleLabels = {
        user: 'User',
        verified_seller: 'Penjual Olahan',
        partner: 'Partner',
        admin: 'Admin',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast />
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
                    transform transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100">
                    <img src="/image/logo(2).png" alt="Replate" className=" weight-auto h-12 rounded-lg object-cover" />  
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                {/* User info */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 ${roleColors[role]}`}>
                                {roleLabels[role]}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-3 py-4 flex-1 overflow-y-auto">
                    <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                    <div className="space-y-0.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                                        ${active
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <Icon size={18} className={active ? 'text-green-600' : 'text-gray-400'} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-6">
                        <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Akun</p>
                        <div className="space-y-0.5">
                            <Link
                                href="/profile"
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                                    ${currentPath === '/profile' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <User size={18} className={currentPath === '/profile' ? 'text-green-600' : 'text-gray-400'} />
                                Profil
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
                            >
                                <LogOut size={18} className="text-gray-400" />
                                Keluar
                            </Link>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center px-4 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="flex-1" />

                    <Link
                        href="/products/create"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition mr-3"
                    >
                        <Package size={16} />
                        Upload Produk
                    </Link>

                    <Link href="/notifications" className="relative p-2 text-gray-400 hover:text-gray-600">
                        <Bell size={20} />
                        {unreadNotifications > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadNotifications > 9 ? '9+' : unreadNotifications}
                            </span>
                        )}
                    </Link>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}