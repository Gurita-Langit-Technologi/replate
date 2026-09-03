import AppLayout from '@/Layouts/AppLayout';
import ProductImage from '@/Components/ui/ProductImage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatTimeLeftShort } from '@/Utils/time';
import {
    Search,
    Clock,
    MapPin,
    Scale,
    ShoppingBasket,
    Plus,
    X,
    Filter,
    ArrowUpDown,
    Tag,
} from 'lucide-react';

const CATEGORY_MAP = {
    mentah: 'Bahan Mentah',
    olahan: 'Makanan Olahan',
    hasil_bumi: 'Hasil Bumi',
};

const CONDITION_MAP = {
    layak_konsumsi: { label: 'Siap Konsumsi', style: 'text-green-700 bg-green-50 border-green-200' },
    layak_olah: { label: 'Perlu Diolah', style: 'text-amber-700 bg-amber-50 border-amber-200' },
    layak_pakan_kompos: { label: 'Pakan / Kompos', style: 'text-orange-700 bg-orange-50 border-orange-200' },
};

function ProductCard({ product }) {
    const isDiscounted = product.status === 'timeout_stage_1';
    const cond = CONDITION_MAP[product.condition] ?? { label: product.condition, style: 'text-gray-600 bg-gray-100 border-gray-200' };

    return (
        <Link
            href={`/products/${product.id}`}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-green-500/60 transition duration-150 flex flex-col justify-between"
        >
            <div>
                {/* Photo container */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <ProductImage
                        src={product.photo}
                        alt={product.title}
                        aspect="aspect-square"
                    />

                    {/* Mode Tag on image */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {isDiscounted && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded shadow-sm">
                                Diskon 25%
                            </span>
                        )}
                        {product.transaction_mode === 'donate' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-600 text-white rounded shadow-sm">
                                Donasi
                            </span>
                        )}
                        {product.transaction_mode === 'barter' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-600 text-white rounded shadow-sm">
                                Barter
                            </span>
                        )}
                    </div>

                    {/* Countdown Timer */}
                    <div className="absolute bottom-2 right-2 z-10">
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white rounded flex items-center gap-1">
                            <Clock size={10} className="text-amber-300" />
                            {formatTimeLeftShort(product.timeout_at)}
                        </span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-3">
                    {/* Condition badge & stock */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${cond.style}`}>
                            {cond.label}
                        </span>
                        <span className="text-[11px] text-gray-500">
                            Stok: {product.quantity || 1} {product.unit || 'satuan'}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition leading-snug">
                        {product.title}
                    </h3>

                    {/* Location & Weight */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        {product.desa && (
                            <span className="flex items-center gap-1 truncate text-xs">
                                <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                                {product.desa}
                            </span>
                        )}
                        {product.weight_grams > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-gray-400">
                                • {(product.weight_grams / 1000).toFixed(1)} kg
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Price section */}
            <div className="p-3 pt-0 border-t border-gray-100 mt-2">
                <div className="pt-2">
                    {product.transaction_mode === 'donate' ? (
                        <span className="text-sm font-bold text-blue-600">Gratis</span>
                    ) : !product.price && product.transaction_mode === 'barter' ? (
                        <span className="text-sm font-bold text-purple-600">Barter</span>
                    ) : product.discounted_price ? (
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-sm font-bold text-red-600">
                                Rp {product.discounted_price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                                Rp {product.price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[11px] text-gray-500">/{product.unit || 'satuan'}</span>
                        </div>
                    ) : (
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-gray-900">
                                Rp {(product.price ?? 0).toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-gray-500">/{product.unit || 'satuan'}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function Index({ products, filters }) {
    const [search, setSearch] = useState(filters.search || '');

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
    const totalCount = products.total ?? products.data?.length ?? 0;

    return (
        <AppLayout>
            <Head title="Marketplace — Replate" />

            <div className="max-w-6xl mx-auto space-y-4">
                {/* Header title */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Marketplace</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {totalCount} produk sisa pangan & hasil kebun tersedia di desa Anda
                        </p>
                    </div>
                    <Link
                        href="/products/create"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                        <Plus size={15} /> Upload Produk
                    </Link>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm space-y-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nasi kotak, sayuran, roti, jagung..."
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 transition"
                        >
                            Cari
                        </button>
                    </form>

                    {/* Filter categories pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-gray-100 pt-2.5">
                        <span className="text-gray-400 font-medium flex items-center gap-1 text-[11px] whitespace-nowrap">
                            <Filter size={12} /> Kategori:
                        </span>
                        <button
                            onClick={() => handleFilter('category', '')}
                            className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition ${
                                !filters.category
                                    ? 'bg-green-600 text-white border-green-600 font-semibold'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => handleFilter('category', 'mentah')}
                            className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition ${
                                filters.category === 'mentah'
                                    ? 'bg-green-600 text-white border-green-600 font-semibold'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Bahan Mentah
                        </button>
                        <button
                            onClick={() => handleFilter('category', 'olahan')}
                            className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition ${
                                filters.category === 'olahan'
                                    ? 'bg-green-600 text-white border-green-600 font-semibold'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Makanan Olahan
                        </button>
                        <button
                            onClick={() => handleFilter('category', 'hasil_bumi')}
                            className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition ${
                                filters.category === 'hasil_bumi'
                                    ? 'bg-green-600 text-white border-green-600 font-semibold'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Hasil Bumi
                        </button>

                        <span className="text-gray-300">|</span>

                        <span className="text-gray-400 font-medium text-[11px] whitespace-nowrap">Mode:</span>
                        <button
                            onClick={() => handleFilter('mode', '')}
                            className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition ${
                                !filters.mode
                                    ? 'bg-gray-800 text-white border-gray-800 font-semibold'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => handleFilter('mode', 'sell')}
                            className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition ${
                                filters.mode === 'sell'
                                    ? 'bg-green-600 text-white border-green-600 font-semibold'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Jual Beli
                        </button>
                        <button
                            onClick={() => handleFilter('mode', 'barter')}
                            className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition ${
                                filters.mode === 'barter'
                                    ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Barter
                        </button>
                        <button
                            onClick={() => handleFilter('mode', 'donate')}
                            className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition ${
                                filters.mode === 'donate'
                                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Donasi
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="ml-auto text-xs text-red-600 hover:underline font-medium flex items-center gap-1 whitespace-nowrap"
                            >
                                <X size={12} /> Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {products.data && products.data.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <ShoppingBasket size={36} className="mx-auto text-gray-300 mb-2" />
                        <h3 className="text-sm font-semibold text-gray-800">Tidak ada produk ditemukan</h3>
                        <p className="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md transition"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}