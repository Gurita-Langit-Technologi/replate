import AppLayout from '@/Layouts/AppLayout';
import { StatCard } from '@/Components/ui/Layout';
import { ProductStatusBadge, TxnStatusBadge, ModeBadge } from '@/Components/ui/Badge';
import ProductImage from '@/Components/ui/ProductImage';
import { formatTimeLeftShort } from '@/Utils/time';
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
    Coins,
} from 'lucide-react';

function ProductRow({ product }) {
    return (
        <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group"
        >
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/80">
                <ProductImage
                    src={product.photo}
                    title={product.title}
                    category={product.category}
                    alt={product.title}
                    aspect="aspect-square"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                    {product.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <ModeBadge mode={product.transaction_mode} size="xs" />
                    {product.price && (
                        <span className="text-[11px] text-gray-400">
                            Rp {(product.discounted_price || product.price).toLocaleString('id-ID')}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {product.status === 'active' && (
                    <span className="text-[11px] text-amber-500 flex items-center gap-0.5 font-medium">
                        <Clock size={10} />
                        {formatTimeLeftShort(product.timeout_at)}
                    </span>
                )}
                <ProductStatusBadge status={product.status} size="xs" />
            </div>
        </Link>
    );
}

function DashboardSection({ title, href, linkText = 'Lihat semua', children }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
                {href && (
                    <Link href={href} className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1 font-medium">
                        {linkText} <ArrowRight size={13} />
                    </Link>
                )}
            </div>
            {children}
        </div>
    );
}

const TXN_TYPE_LABEL = {
    sale: 'Jual beli',
    barter: 'Barter',
    donation: 'Donasi',
    partner_transfer: 'Partner',
};

const TXN_STATUS_DOT = {
    pending:   'bg-amber-400',
    confirmed: 'bg-blue-400',
    completed: 'bg-green-500',
    cancelled: 'bg-gray-300',
};

export default function Dashboard({ stats, recentProducts, recentTransactions, incomingBarters }) {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="max-w-6xl mx-auto">
                {/* Greeting */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                        Halo, {auth.user.name}!
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Selamat datang di Replate — mari kurangi food waste bersama.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                    <StatCard icon={Package}       label="Produk Aktif"        value={stats.myProducts}                                     color="green"  />
                    <StatCard icon={TrendingUp}    label="Total Transaksi"      value={stats.totalTransactions}                              color="blue"   />
                    <StatCard icon={Leaf}          label="Waste Terselamatkan"  value={(stats.totalWeightSaved / 1000).toFixed(1)} unit="kg" color="violet" />
                    <StatCard icon={ArrowLeftRight} label="Tawaran Barter"     value={stats.incomingBarterCount || 0}                       color="amber"  />
                    <StatCard icon={Coins}         label="RePoin"               value={stats.userPoints || 0} unit="poin"                   color="sky"    />
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Produk aktif */}
                    <DashboardSection title="Produk Aktif Saya" href="/my-products">
                        {recentProducts?.length > 0 ? (
                            <div className="divide-y divide-gray-50 -mx-1">
                                {recentProducts.map((product) => (
                                    <ProductRow key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Package size={32} className="mx-auto text-gray-200 mb-2" strokeWidth={1.5} />
                                <p className="text-sm text-gray-400 mb-3">Belum ada produk aktif</p>
                                <Link href="/products/create" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                    Upload produk pertama →
                                </Link>
                            </div>
                        )}
                    </DashboardSection>

                    {/* Transaksi terbaru */}
                    <DashboardSection title="Transaksi Terbaru" href="/transactions">
                        {recentTransactions?.length > 0 ? (
                            <div className="space-y-1">
                                {recentTransactions.map((t) => (
                                    <Link
                                        key={t.id}
                                        href={`/transactions/${t.id}`}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group"
                                    >
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${TXN_STATUS_DOT[t.status] ?? 'bg-gray-300'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                                                {t.product?.title || 'Produk'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {TXN_TYPE_LABEL[t.type] ?? t.type}
                                                {t.price ? ` · Rp ${t.price.toLocaleString('id-ID')}` : ''}
                                            </p>
                                        </div>
                                        <TxnStatusBadge status={t.status} size="xs" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Receipt size={32} className="mx-auto text-gray-200 mb-2" strokeWidth={1.5} />
                                <p className="text-sm text-gray-400">Belum ada transaksi</p>
                            </div>
                        )}
                    </DashboardSection>

                    {/* Tawaran barter masuk */}
                    {incomingBarters?.length > 0 && (
                        <DashboardSection title="Tawaran Barter Masuk" href="/barter" linkText="Lihat semua" className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {incomingBarters.map((offer) => (
                                    <div key={offer.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-50/60 border border-violet-100">
                                        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm flex-shrink-0">
                                            {offer.offerer?.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm">
                                                <span className="font-semibold text-gray-900">{offer.offerer?.name}</span>
                                                <span className="text-gray-500"> menawarkan barter untuk </span>
                                                <span className="font-semibold text-gray-900">{offer.product?.title}</span>
                                            </p>
                                            <p className="text-xs text-violet-600 mt-0.5 truncate">"{offer.offer_description}"</p>
                                        </div>
                                        <Link
                                            href="/barter"
                                            className="text-xs px-3 py-1.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition flex-shrink-0 font-medium"
                                        >
                                            Lihat
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </DashboardSection>
                    )}
                </div>

                {/* Mobile quick links */}
                <div className="grid grid-cols-2 gap-3 mt-4 lg:hidden">
                    <Link href="/marketplace" className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-green-200 hover:shadow-sm transition">
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                            <ShoppingBasket size={18} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Marketplace</span>
                    </Link>
                    <Link href="/products/create" className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-green-200 hover:shadow-sm transition">
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                            <Package size={18} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Upload</span>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}