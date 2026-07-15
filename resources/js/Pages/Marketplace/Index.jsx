import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    SlidersHorizontal,
    Package,
    Clock,
    MapPin,
    Scale,
    ArrowLeftRight,
    ShoppingBasket,
    Heart,
    Plus,
    X,
} from 'lucide-react';

const conditionLabels = {
    layak_konsumsi: 'Layak konsumsi',
    layak_olah: 'Layak olah',
    layak_pakan_kompos: 'Pakan / kompos',
};

const conditionColors = {
    layak_konsumsi: 'bg-green-50 text-green-700 border-green-200',
    layak_olah: 'bg-amber-50 text-amber-700 border-amber-200',
    layak_pakan_kompos: 'bg-red-50 text-red-700 border-red-200',
};

function ProductCard({ product }) {
    const isTimeout = product.status === 'timeout_stage_1';
    const isDonation = product.status === 'timeout_stage_2' || product.transaction_mode === 'donate';
    const timeLeft = new Date(product.timeout_at) - new Date();
    const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));

    return (
        <Link
            href={`/products/${product.id}`}
            className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {product.photo ? (
                    <img
                        src={`/storage/${product.photo}`}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={36} />
                    </div>
                )}

                {/* Overlay badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {isTimeout && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-red-500 text-white rounded-full">
                            Diskon 25%
                        </span>
                    )}
                    {isDonation && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-blue-500 text-white rounded-full flex items-center gap-0.5">
                            <Heart size={10} /> Donasi
                        </span>
                    )}
                    {product.transaction_mode.includes('barter') && !isDonation && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-purple-500 text-white rounded-full flex items-center gap-0.5">
                            <ArrowLeftRight size={10} /> Barter
                        </span>
                    )}
                </div>

                {/* Countdown */}
                <div className="absolute bottom-2 right-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-black/60 text-white rounded-full flex items-center gap-1">
                        <Clock size={10} />
                        {hoursLeft}j lagi
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3.5">
                {/* Condition badge */}
                <span className={`inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full border mb-2 ${conditionColors[product.condition]}`}>
                    {conditionLabels[product.condition]}
                </span>

                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-green-600 transition">
                    {product.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-0.5">
                        <Scale size={10} />
                        {(product.weight_grams / 1000).toFixed(1)}kg
                    </span>
                    <span className="flex items-center gap-0.5">
                        <MapPin size={10} />
                        {product.desa}
                    </span>
                </div>

                {/* Price */}
                <div className="mt-2">
                    {product.price ? (
                        <div className="flex items-baseline gap-1.5">
                            {product.discounted_price ? (
                                <>
                                    <span className="text-base font-bold text-red-500">
                                        Rp {product.discounted_price.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-400 line-through">
                                        Rp {product.price.toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-base font-bold text-green-600">
                                    Rp {product.price.toLocaleString()}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-base font-bold text-purple-600">
                            {product.transaction_mode === 'donate' ? 'Gratis' : 'Barter'}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

function FilterPill({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition whitespace-nowrap
                ${active
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
        >
            {label}
        </button>
    );
}

export default function Index({ products, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);

    function handleFilter(key, value) {
        router.get('/marketplace', { ...filters, [key]: value || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleSearch(e) {
        e.preventDefault();
        handleFilter('search', search);
    }

    function clearFilters() {
        router.get('/marketplace', {}, { preserveState: true });
        setSearch('');
    }

    const hasActiveFilters = filters.category || filters.condition || filters.mode || filters.search;

    return (
        <AppLayout>
            <Head title="Marketplace" />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {products.total || products.data?.length || 0} produk tersedia
                        </p>
                    </div>
                    <Link
                        href="/products/create"
                        className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition"
                    >
                        <Plus size={16} />
                        Upload produk
                    </Link>
                </div>

                {/* Search bar */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 mb-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari produk food waste..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition"
                        >
                            Cari
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-2.5 border rounded-xl transition ${showFilters ? 'border-green-400 bg-green-50 text-green-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <SlidersHorizontal size={16} />
                        </button>
                    </form>

                    {/* Expandable filters */}
                    {showFilters && (
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                            {/* Category */}
                            <div>
                                <p className="text-xs font-medium text-gray-400 mb-1.5">Kategori</p>
                                <div className="flex gap-2 flex-wrap">
                                    <FilterPill label="Semua" active={!filters.category} onClick={() => handleFilter('category', '')} />
                                    <FilterPill label="Mentah" active={filters.category === 'mentah'} onClick={() => handleFilter('category', 'mentah')} />
                                    <FilterPill label="Olahan" active={filters.category === 'olahan'} onClick={() => handleFilter('category', 'olahan')} />
                                    <FilterPill label="Hasil bumi" active={filters.category === 'hasil_bumi'} onClick={() => handleFilter('category', 'hasil_bumi')} />
                                </div>
                            </div>

                            {/* Condition */}
                            <div>
                                <p className="text-xs font-medium text-gray-400 mb-1.5">Kondisi</p>
                                <div className="flex gap-2 flex-wrap">
                                    <FilterPill label="Semua" active={!filters.condition} onClick={() => handleFilter('condition', '')} />
                                    <FilterPill label="Layak konsumsi" active={filters.condition === 'layak_konsumsi'} onClick={() => handleFilter('condition', 'layak_konsumsi')} />
                                    <FilterPill label="Layak olah" active={filters.condition === 'layak_olah'} onClick={() => handleFilter('condition', 'layak_olah')} />
                                    <FilterPill label="Pakan / kompos" active={filters.condition === 'layak_pakan_kompos'} onClick={() => handleFilter('condition', 'layak_pakan_kompos')} />
                                </div>
                            </div>

                            {/* Mode */}
                            <div>
                                <p className="text-xs font-medium text-gray-400 mb-1.5">Mode transaksi</p>
                                <div className="flex gap-2 flex-wrap">
                                    <FilterPill label="Semua" active={!filters.mode} onClick={() => handleFilter('mode', '')} />
                                    <FilterPill label="Jual" active={filters.mode === 'sell'} onClick={() => handleFilter('mode', 'sell')} />
                                    <FilterPill label="Barter" active={filters.mode === 'barter'} onClick={() => handleFilter('mode', 'barter')} />
                                    <FilterPill label="Jual & barter" active={filters.mode === 'sell_and_barter'} onClick={() => handleFilter('mode', 'sell_and_barter')} />
                                    <FilterPill label="Donasi" active={filters.mode === 'donate'} onClick={() => handleFilter('mode', 'donate')} />
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <p className="text-xs font-medium text-gray-400 mb-1.5">Urutkan</p>
                                <div className="flex gap-2 flex-wrap">
                                    <FilterPill label="Terbaru" active={!filters.sort || filters.sort === 'newest'} onClick={() => handleFilter('sort', 'newest')} />
                                    <FilterPill label="Harga terendah" active={filters.sort === 'price_low'} onClick={() => handleFilter('sort', 'price_low')} />
                                    <FilterPill label="Harga tertinggi" active={filters.sort === 'price_high'} onClick={() => handleFilter('sort', 'price_high')} />
                                    <FilterPill label="Segera habis" active={filters.sort === 'timeout'} onClick={() => handleFilter('sort', 'timeout')} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active filters indicator */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-gray-400">Filter aktif:</span>
                        {filters.category && (
                            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                                {filters.category}
                            </span>
                        )}
                        {filters.condition && (
                            <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                {conditionLabels[filters.condition]}
                            </span>
                        )}
                        {filters.mode && (
                            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                                {filters.mode.replace(/_/g, ' ')}
                            </span>
                        )}
                        {filters.search && (
                            <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-200">
                                "{filters.search}"
                            </span>
                        )}
                        <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-0.5">
                            <X size={12} /> Hapus filter
                        </button>
                    </div>
                )}

                {/* Product Grid */}
                {products.data && products.data.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                        <ShoppingBasket size={48} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-500 mb-1">Tidak ada produk yang ditemukan</p>
                        {hasActiveFilters ? (
                            <button onClick={clearFilters} className="text-sm text-green-600 hover:underline mt-2">
                                Hapus semua filter
                            </button>
                        ) : (
                            <p className="text-sm text-gray-400">Jadilah yang pertama upload produk</p>
                        )}
                    </div>
                )}

                {/* Mobile FAB */}
                <Link
                    href="/products/create"
                    className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition z-20"
                >
                    <Plus size={24} />
                </Link>
            </div>
        </AppLayout>
    );
}