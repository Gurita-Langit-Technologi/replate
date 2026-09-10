import { useState, useEffect, useRef } from 'react';

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
    Coins,
    Users,
    MessageCircle,
    ChevronsLeft,
    ChevronsRight,
    Truck,
    History,
    Trophy,
    Leaf,
    ShieldCheck,
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
        { label: 'RePoin & Lencana', href: '/points', icon: Coins },
        { label: 'Peringkat Warga', href: '/leaderboard', icon: Trophy },
        { label: 'Dampak Desa', href: '/impact', icon: Leaf },
        { label: 'Verifikasi Penjual', href: '/seller/apply', icon: ShieldCheck },
    ],
    admin: [
        { label: 'Admin Panel', href: '/admin/dashboard', icon: Shield },
        { label: 'Semua Transaksi', href: '/admin/transactions', icon: Receipt },
        { label: 'Verifikasi', href: '/admin/verifications', icon: Shield },
        { label: 'Laporan', href: '/admin/reports', icon: Shield },
        { label: 'Partner', href: '/admin/partners', icon: Handshake },
        { label: 'Pengguna', href: '/admin/users', icon: Users },
        { label: 'Tukar RePoin', href: '/admin/redeem', icon: Coins },
    ],
    partner: [
        { label: 'Tugas Penjemputan', href: '/partner/dashboard', icon: Truck },
        { label: 'Riwayat Penerimaan', href: '/partner/history', icon: History },
    ],
};

export default function AppLayout({ children }) {
    const { auth, unreadNotifications } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const currentPath = window.location.pathname;

    // State untuk unread count yang bisa diupdate real-time
    const [unreadCount, setUnreadCount] = useState(unreadNotifications ?? 0);

    // State untuk toast notifikasi
    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);

    // Subscribe ke channel notifikasi milik user yang sedang login
    useEffect(() => {
        if (!auth?.user?.id) return;

        const channel = window.Echo.private(`notifications.${auth.user.id}`)
            .listen('.NotificationCreated', (e) => {
                const notif = e.notification ?? e;

                // Update badge
                setUnreadCount((prev) => prev + 1);

                // Play subtle notification chime
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) {
                        const ctx = new AudioCtx();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
                        gain.gain.setValueAtTime(0.15, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.35);
                    }
                } catch (e) {
                    // Audio context ignored if user has not interacted
                }

                // Tampilkan toast popup
                const toastId = ++toastIdRef.current;
                setToasts((prev) => [...prev, { id: toastId, ...notif }]);

                // Auto-dismiss toast setelah 5 detik
                setTimeout(() => {
                    setToasts((prev) => prev.filter((t) => t.id !== toastId));
                }, 5000);
            });

        return () => {
            channel.stopListening('.NotificationCreated');
            window.Echo.leave(`notifications.${auth.user.id}`);
        };
    }, [auth?.user?.id]);

    // Reset unread count saat user mengklik icon notifikasi
    function handleNotificationClick() {
        setUnreadCount(0);
    }

    const user = auth.user;
    const role = user.role;

    let navItems = NAV_ITEMS.user;
    if (role === 'admin') navItems = NAV_ITEMS.admin;
    else if (role === 'partner') navItems = NAV_ITEMS.partner;

    function isActive(href) {
        if (href === '/dashboard') return currentPath === '/dashboard';
        return currentPath.startsWith(href);
    }

    const roleColors = {
        user:            'bg-green-100  text-green-700',
        verified_seller: 'bg-violet-100 text-violet-700',
        partner:         'bg-sky-100    text-sky-700',
        admin:           'bg-red-100    text-red-700',
    };

    const roleLabels = {
        user: 'User',
        verified_seller: 'Penjual Olahan',
        partner: 'Partner',
        admin: 'Admin',
    };

    const sidebarWidth = collapsed ? 'w-[72px]' : 'w-64';
    const mainPadding = collapsed ? 'lg:pl-[72px]' : 'lg:pl-64';

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200
                    flex flex-col transition-all duration-200 ease-in-out
                    ${sidebarWidth}
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
                        <img src="/image/logo(2).png" alt="Replate" className="h-8 max-w-[150px] object-contain flex-shrink-0" />
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* User info */}
                {!collapsed ? (
                    <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm flex-shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 ${roleColors[role]}`}>
                                    {roleLabels[role]}
                                </span>
                                {user.points > 0 && (
                                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 bg-amber-100 text-amber-700 ml-1">
                                        {user.points} RePoin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-3 border-b border-gray-100 flex justify-center flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="px-2 py-4 flex-1 overflow-y-auto">
                    {!collapsed && <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>}
                    <div className="space-y-0.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={collapsed ? item.label : undefined}
                                    className={`
                                        flex items-center gap-3 rounded-xl text-sm font-medium transition
                                        ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                                        ${active
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <Icon size={18} className={`flex-shrink-0 ${active ? 'text-green-600' : 'text-gray-400'}`} />
                                    {!collapsed && item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-6">
                        {!collapsed && <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Akun</p>}
                        <div className="space-y-0.5">
                            <Link
                                href="/profile"
                                title={collapsed ? 'Profil' : undefined}
                                className={`flex items-center gap-3 rounded-xl text-sm font-medium transition
                                    ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                                    ${currentPath === '/profile' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <User size={18} className={`flex-shrink-0 ${currentPath === '/profile' ? 'text-green-600' : 'text-gray-400'}`} />
                                {!collapsed && 'Profil'}
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                title={collapsed ? 'Keluar' : undefined}
                                className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition
                                    ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
                            >
                                <LogOut size={18} className="text-gray-400 flex-shrink-0" />
                                {!collapsed && 'Keluar'}
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Collapse toggle — desktop only */}
                <div className="hidden lg:flex border-t border-gray-100 p-2 flex-shrink-0">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition text-sm"
                    >
                        {collapsed ? <ChevronsRight size={18} /> : <><ChevronsLeft size={18} /> <span>Kecilkan</span></>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className={`${mainPadding} transition-all duration-200`}>
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center px-4 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="flex-1" />

                    {role !== 'admin' && role !== 'partner' && (
                        <Link
                            href="/products/create"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition mr-3"
                        >
                            <Package size={16} />
                            Upload Produk
                        </Link>
                    )}

                    <Link
                            href="/notifications"
                            onClick={handleNotificationClick}
                            className="relative p-2 text-gray-400 hover:text-gray-600"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>
                </header>
                {/* Toast Notifikasi Real-time */}
            {toasts.length > 0 && (
                <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right"
                            style={{ animation: 'slideInRight 0.3s ease-out' }}
                        >
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Bell size={14} className="text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{toast.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                                className="text-gray-300 hover:text-gray-500 flex-shrink-0"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}