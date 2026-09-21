import NavbarLayout from '@/Layouts/NavbarLayout';
import ProductImage from '@/Components/ui/ProductImage';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
    CheckCircle2,
    ShieldCheck,
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
    const cond = CONDITION_MAP[product.condition] ?? { label: product.condition, style: 'text-gray-700 bg-gray-100 border-gray-200' };

    return (
        <Link
            href={`/products/${product.id}`}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-emerald-500 transition duration-150 flex flex-col justify-between shadow-xs"
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
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                        {isDiscounted && (
                            <span className="text-xs font-bold px-2.5 py-1 bg-red-600 text-white rounded-lg shadow-xs">
                                Diskon 25%
                            </span>
                        )}
                        {product.transaction_mode === 'donate' && (
                            <span className="text-xs font-bold px-2.5 py-1 bg-blue-600 text-white rounded-lg shadow-xs">
                                Donasi
                            </span>
                        )}
                        {product.transaction_mode === 'barter' && (
                            <span className="text-xs font-bold px-2.5 py-1 bg-purple-600 text-white rounded-lg shadow-xs">
                                Barter
                            </span>
                        )}
                    </div>

                    {/* Countdown Timer */}
                    <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-black/75 backdrop-blur-sm text-white rounded-lg flex items-center gap-1.5 shadow-xs">
                            <Clock size={12} className="text-amber-300" />
                            {formatTimeLeftShort(product.timeout_at)}
                        </span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                    {/* Condition badge & stock */}
                    <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${cond.style}`}>
                            {cond.label}
                        </span>
                        <span className="text-xs font-medium text-gray-600">
                            Stok: {product.quantity || 1} {product.unit || 'satuan'}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition leading-snug">
                        {product.title}
                    </h3>

                    {/* Location, Weight & Verified Seller Badge */}
                    <div className="flex items-center justify-between gap-1.5 text-xs text-gray-600 pt-1">
                        <div className="flex items-center gap-1.5 truncate">
                            {product.desa && (
                                <span className="flex items-center gap-1 truncate text-xs font-medium text-gray-700">
                                    <MapPin size={13} className="text-gray-500 flex-shrink-0" />
                                    {product.desa}
                                </span>
                            )}
                            {product.weight_grams > 0 && (
                                <span className="flex items-center gap-0.5 text-xs text-gray-500 font-medium">
                                    • {(product.weight_grams / 1000).toFixed(1)} kg
                                </span>
                            )}
                        </div>

                        {product.user?.role === 'verified_seller' && (
                            <span
                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0"
                                title="Penjual Olahan Terverifikasi BUMDes / P-IRT"
                            >
                                <CheckCircle2 size={12} className="text-emerald-700" />
                                Terverifikasi
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Price section */}
            <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                <div className="pt-3">
                    {product.transaction_mode === 'donate' ? (
                        <span className="text-base font-bold text-blue-600">Gratis</span>
                    ) : !product.price && product.transaction_mode === 'barter' ? (
                        <span className="text-base font-bold text-purple-600">Barter</span>
                    ) : product.discounted_price ? (
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-base font-bold text-red-600">
                                Rp {product.discounted_price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                                Rp {product.price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-gray-600 font-medium">/{product.unit || 'satuan'}</span>
                        </div>
                    ) : (
                        <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold text-gray-900">
                                Rp {(product.price ?? 0).toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-gray-600 font-medium">/{product.unit || 'satuan'}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function Index({ products, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const isAdmin = auth?.user?.role === 'admin';

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
        <NavbarLayout title="Marketplace">
            <Head title="Marketplace — Replate" />

            <div className="w-full space-y-6">
                {/* Header title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                            {isAdmin && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                                    <ShieldCheck size={14} />
                                    Mode Pengawas BUMDes
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {isAdmin
                                ? `Pengawasan aktif: ${totalCount} produk pangan beredar di desa (mode pemantauan).`
                                : `${totalCount} produk sisa pangan & hasil kebun tersedia di desa Anda`}
                        </p>
                    </div>

                    {auth?.user?.role !== 'admin' && auth?.user?.role !== 'partner' && (
                        <Link
                            href={auth?.user ? "/products/create" : "/login"}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-emerald-700 transition self-start sm:self-auto shadow-xs"
                        >
                            <Plus size={16} /> Upload Produk
                        </Link>
                    )}
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-2.5">
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nasi kotak, sayuran, roti, jagung..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-emerald-700 transition"
                        >
                            Cari
                        </button>
                    </form>

                    {/* Filter categories pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm border-t border-gray-100 pt-3 flex-wrap">
                        <span className="text-gray-700 font-bold flex items-center gap-1.5 text-xs whitespace-nowrap">
                            <Filter size={14} className="text-gray-500" /> Kategori:
                        </span>
                        <button
                            onClick={() => handleFilter('category', '')}
                            className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm whitespace-nowrap transition ${
                                !filters.category
                                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => handleFilter('category', 'mentah')}
                            className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm whitespace-nowrap transition ${
                                filters.category === 'mentah'
                                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Bahan Mentah
                        </button>
                        <button
                            onClick={() => handleFilter('category', 'olahan')}
                            className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm whitespace-nowrap transition ${
                                filters.category === 'olahan'
                                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Makanan Olahan
                        </button>
                        <button
                            onClick={() => handleFilter('category', 'hasil_bumi')}
                            className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm whitespace-nowrap transition ${
                                filters.category === 'hasil_bumi'
                                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Hasil Bumi
                        </button>

                        <span className="text-gray-300 hidden sm:inline">|</span>

                        <span className="text-gray-700 font-bold text-xs whitespace-nowrap">Mode:</span>
                        <button
                            onClick={() => handleFilter('mode', '')}
                            className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm whitespace-nowrap transition ${
                                !filters.mode
                                    ? 'bg-gray-900 text-white border-gray-900 font-bold shadow-xs'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => handleFilter('mode', 'sell')}
                            className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm whitespace-nowrap transition ${
                                filters.mode === 'sell'
                                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Jual Beli
                        </button>
                        <button
                            onClick={() => handleFilter('mode', 'barter')}
                            className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm whitespace-nowrap transition ${
                                filters.mode === 'barter'
                                    ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Barter
                        </button>
                        <button
                            onClick={() => handleFilter('mode', 'donate')}
                            className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm whitespace-nowrap transition ${
                                filters.mode === 'donate'
                                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Donasi
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="ml-auto text-xs sm:text-sm text-red-600 hover:underline font-bold flex items-center gap-1 whitespace-nowrap"
                            >
                                <X size={14} /> Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {products.data && products.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center space-y-3">
                        <ShoppingBasket size={44} className="mx-auto text-gray-400 mb-2" />
                        <h3 className="text-base font-bold text-gray-900">Tidak ada produk ditemukan</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold rounded-xl transition"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}
            </div>
        </NavbarLayout>
    );
}