import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Package,
    ArrowLeftRight,
    Leaf,
    TrendingUp,
    Clock,
    ShoppingBasket,
    ArrowRight,
    Receipt,
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, unit, color }) {
    const colorClasses = {
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon size={20} />
                </div>
                <span className="text-sm text-gray-500">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{value}</span>
                {unit && <span className="text-sm text-gray-400">{unit}</span>}
            </div>
        </div>
    );
}

function ProductRow({ product }) {
    const timeLeft = Math.max(0, Math.floor((new Date(product.timeout_at) - new Date()) / (1000 * 60 * 60)));

    const statusStyles = {
        active: 'bg-green-50 text-green-700',
        timeout_stage_1: 'bg-amber-50 text-amber-700',
        timeout_stage_2: 'bg-orange-50 text-orange-700',
        sold: 'bg-blue-50 text-blue-700',
        bartered: 'bg-purple-50 text-purple-700',
        donated: 'bg-pink-50 text-pink-700',
    };

    const statusLabels = {
        active: 'Aktif',
        timeout_stage_1: 'Diskon',
        timeout_stage_2: 'Donasi',
        sold: 'Terjual',
        bartered: 'Terbarter',
        donated: 'Terdonasi',
    };

    const modeIcons = {
        sell: '💰',
        barter: '🔄',
        sell_and_barter: '💰🔄',
        donate: '🎁',
    };

    return (
        <Link href={`/products/${product.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition group">
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {product.photo ? (
                    <img src={`/storage/${product.photo}`} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={20} />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                <p className="text-xs text-gray-400">
                    {(product.weight_grams / 1000).toFixed(1)}kg · {modeIcons[product.transaction_mode]}
                    {product.price && ` · Rp ${(product.discounted_price || product.price).toLocaleString()}`}
                </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {product.status === 'active' && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {timeLeft}j
                    </span>
                )}
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusStyles[product.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[product.status] || product.status}
                </span>
            </div>
        </Link>
    );
}

function SectionHeader({ title, href, linkText }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            {href && (
                <Link href={href} className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
                    {linkText || 'Lihat semua'} <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

export default function Dashboard({ stats, recentProducts, recentTransactions, incomingBarters }) {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="max-w-6xl mx-auto">
                {/* Greeting */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Halo, {auth.user.name}!
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Selamat datang di Replate — mari kurangi food waste bersama.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={Package}
                        label="Produk Aktif"
                        value={stats.myProducts}
                        color="green"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Total Transaksi"
                        value={stats.totalTransactions}
                        color="blue"
                    />
                    <StatCard
                        icon={Leaf}
                        label="Waste Terselamatkan"
                        value={(stats.totalWeightSaved / 1000).toFixed(1)}
                        unit="kg"
                        color="purple"
                    />
                    <StatCard
                        icon={ArrowLeftRight}
                        label="Tawaran Barter"
                        value={stats.incomingBarterCount || 0}
                        color="amber"
                    />
                </div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Produk Aktif Saya */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <SectionHeader title="Produk Aktif Saya" href="/my-products" />
                        {recentProducts && recentProducts.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {recentProducts.map((product) => (
                                    <ProductRow key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Package size={32} className="mx-auto text-gray-200 mb-2" />
                                <p className="text-sm text-gray-400 mb-3">Belum ada produk aktif</p>
                                <Link href="/products/create" className="text-sm text-green-600 hover:underline">
                                    Upload produk pertama →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Transaksi Terbaru */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <SectionHeader title="Transaksi Terbaru" href="/transactions" />
                        {recentTransactions && recentTransactions.length > 0 ? (
                            <div className="space-y-2">
                                {recentTransactions.map((t) => {
                                    const statusStyles = {
                                        pending: 'bg-yellow-400',
                                        confirmed: 'bg-blue-400',
                                        completed: 'bg-green-400',
                                        cancelled: 'bg-gray-300',
                                    };
                                    const statusLabels = {
                                        pending: 'Menunggu',
                                        confirmed: 'Dikonfirmasi',
                                        completed: 'Selesai',
                                        cancelled: 'Dibatalkan',
                                    };
                                    const typeLabels = {
                                        sale: 'Jual',
                                        barter: 'Barter',
                                        donation: 'Donasi',
                                        partner_transfer: 'Partner',
                                    };

                                    return (
                                        <Link
                                            key={t.id}
                                            href={`/transactions/${t.id}`}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusStyles[t.status]}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {t.product?.title || 'Produk'}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {typeLabels[t.type]} · {statusLabels[t.status]}
                                                    {t.price && ` · Rp ${t.price.toLocaleString()}`}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Receipt size={32} className="mx-auto text-gray-200 mb-2" />
                                <p className="text-sm text-gray-400">Belum ada transaksi</p>
                            </div>
                        )}
                    </div>

                    {/* Tawaran Barter Masuk */}
                    {incomingBarters && incomingBarters.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 p-5 lg:col-span-2">
                            <SectionHeader title="Tawaran Barter Masuk" href="/barter" linkText="Lihat semua tawaran" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {incomingBarters.map((offer) => (
                                    <div key={offer.id} className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-xs flex-shrink-0">
                                            {offer.offerer?.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm">
                                                <span className="font-medium text-gray-900">{offer.offerer?.name}</span>
                                                <span className="text-gray-500"> menawarkan barter untuk </span>
                                                <span className="font-medium text-gray-900">{offer.product?.title}</span>
                                            </p>
                                            <p className="text-xs text-purple-600 mt-1 truncate">"{offer.offer_description}"</p>
                                        </div>
                                        <Link
                                            href="/barter"
                                            className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex-shrink-0"
                                        >
                                            Lihat
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions (mobile) */}
                <div className="grid grid-cols-2 gap-3 mt-6 lg:hidden">
                    <Link href="/marketplace" className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:border-green-200 transition">
                        <ShoppingBasket size={20} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Marketplace</span>
                    </Link>
                    <Link href="/products/create" className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:border-green-200 transition">
                        <Package size={20} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Upload</span>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}