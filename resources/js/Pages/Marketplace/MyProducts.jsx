import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Package,
    Clock,
    Eye,
    Pencil,
    Trash2,
    Plus,
    Scale,
    ArrowLeftRight,
} from 'lucide-react';

const statusConfig = {
    active: { label: 'Aktif', color: 'bg-green-50 text-green-700 border-green-200' },
    timeout_stage_1: { label: 'Diskon otomatis', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    timeout_stage_2: { label: 'Jalur donasi', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    timeout_stage_3: { label: 'Dialihkan', color: 'bg-red-50 text-red-700 border-red-200' },
    sold: { label: 'Terjual', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    bartered: { label: 'Terbarter', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    donated: { label: 'Terdonasi', color: 'bg-pink-50 text-pink-700 border-pink-200' },
    transferred: { label: 'Dialihkan', color: 'bg-gray-50 text-gray-600 border-gray-200' },
};

const modeIcons = {
    sell: '💰',
    barter: '🔄',
    sell_and_barter: '💰🔄',
    donate: '🎁',
};

const modeLabels = {
    sell: 'Jual',
    barter: 'Barter',
    sell_and_barter: 'Jual & barter',
    donate: 'Donasi',
};

function ProductCard({ product }) {
    const status = statusConfig[product.status] || statusConfig.active;
    const timeLeft = Math.max(0, Math.floor((new Date(product.timeout_at) - new Date()) / (1000 * 60 * 60)));
    const isActive = ['active', 'timeout_stage_1'].includes(product.status);
    const isDone = ['sold', 'bartered', 'donated', 'transferred'].includes(product.status);

    function handleDelete() {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            router.delete(`/products/${product.id}`);
        }
    }

    return (
        <div className={`bg-white rounded-xl border overflow-hidden transition hover:shadow-sm ${isDone ? 'border-gray-100 opacity-75' : 'border-gray-100'}`}>
            <div className="flex">
                {/* Thumbnail */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-gray-100">
                    {product.photo ? (
                        <img src={`/storage/${product.photo}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package size={28} />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                        {/* Title + Status */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                            <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 truncate hover:text-green-600 transition">
                                {product.title}
                            </Link>
                            <span className={`flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full border ${status.color}`}>
                                {status.label}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <Scale size={12} />
                                {(product.weight_grams / 1000).toFixed(1)} kg
                            </span>
                            <span>{product.condition.replace(/_/g, ' ')}</span>
                            <span className="flex items-center gap-1">
                                {modeIcons[product.transaction_mode]} {modeLabels[product.transaction_mode]}
                            </span>
                            {isActive && (
                                <span className="flex items-center gap-1 text-amber-500">
                                    <Clock size={12} />
                                    {timeLeft}j lagi
                                </span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="mt-1.5">
                            {product.price ? (
                                <div className="flex items-baseline gap-1.5">
                                    {product.discounted_price ? (
                                        <>
                                            <span className="text-sm font-bold text-red-500">Rp {product.discounted_price.toLocaleString()}</span>
                                            <span className="text-xs text-gray-400 line-through">Rp {product.price.toLocaleString()}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-bold text-green-600">Rp {product.price.toLocaleString()}</span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-sm font-semibold text-purple-600">
                                    {product.transaction_mode === 'donate' ? 'Donasi' : 'Barter'}
                                </span>
                            )}
                        </div>

                        {/* Barter info */}
                        {product.barter_description && (
                            <p className="text-xs text-purple-500 mt-1 truncate flex items-center gap-1">
                                <ArrowLeftRight size={10} />
                                {product.barter_description}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-2">
                        <Link
                            href={`/products/${product.id}`}
                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                        >
                            <Eye size={12} />
                            Lihat
                        </Link>
                        {product.status === 'active' && (
                            <>
                                <Link
                                    href={`/products/${product.id}/edit`}
                                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                >
                                    <Pencil size={12} />
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                >
                                    <Trash2 size={12} />
                                    Hapus
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MyProducts({ products }) {
    const activeProducts = products.filter(p => ['active', 'timeout_stage_1', 'timeout_stage_2'].includes(p.status));
    const doneProducts = products.filter(p => ['sold', 'bartered', 'donated', 'transferred', 'timeout_stage_3'].includes(p.status));

    return (
        <AppLayout>
            <Head title="Produk Saya" />
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Produk saya</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{products.length} produk total</p>
                    </div>
                    <Link
                        href="/products/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition"
                    >
                        <Plus size={16} />
                        Upload produk
                    </Link>
                </div>

                {products.length > 0 ? (
                    <div className="space-y-8">
                        {/* Active products */}
                        {activeProducts.length > 0 && (
                            <div>
                                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                                    Sedang tayang ({activeProducts.length})
                                </h2>
                                <div className="space-y-3">
                                    {activeProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Done products */}
                        {doneProducts.length > 0 && (
                            <div>
                                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                                    Selesai ({doneProducts.length})
                                </h2>
                                <div className="space-y-3">
                                    {doneProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                        <Package size={48} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-500 mb-1">Belum ada produk yang diunggah</p>
                        <p className="text-sm text-gray-400 mb-4">Mulai kurangi food waste dengan upload produk pertama</p>
                        <Link
                            href="/products/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition"
                        >
                            <Plus size={16} />
                            Upload produk pertama
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}