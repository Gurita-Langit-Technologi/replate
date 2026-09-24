import NavbarLayout from '@/Layouts/NavbarLayout';
import AppLayout from '@/Layouts/AppLayout';
import ProductImage from '@/Components/ui/ProductImage';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatTimeLeftShort } from '@/Utils/time';
import {
    Search,
    Clock,
    MapPin,
    ShoppingBasket,
    Plus,
    X,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    SlidersHorizontal,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

const CONDITION_MAP = {
    layak_konsumsi:    { label: 'Siap Konsumsi',  style: 'text-green-700 bg-green-50 border-green-200' },
    layak_olah:        { label: 'Perlu Diolah',   style: 'text-amber-700 bg-amber-50 border-amber-200' },
    layak_pakan_kompos:{ label: 'Pakan / Kompos', style: 'text-orange-700 bg-orange-50 border-orange-200' },
};

const SORT_OPTIONS = [
    { value: 'newest',     label: 'Terbaru' },
    { value: 'timeout',    label: 'Segera Kedaluwarsa' },
    { value: 'price_low',  label: 'Harga: Terendah' },
    { value: 'price_high', label: 'Harga: Tertinggi' },
];

// ─── ProductCard ──────────────────────────────────────────────────────────────

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

                    {/* Mode / Diskon Tag */}
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
                    <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${cond.style}`}>
                            {cond.label}
                        </span>
                        <span className="text-xs font-medium text-gray-600">
                            Stok: {product.quantity || 1} {product.unit || 'satuan'}
                        </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition leading-snug">
                        {product.title}
                    </h3>

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

// ─── FilterPill ───────────────────────────────────────────────────────────────

function FilterPill({ active, color = 'emerald', onClick, children }) {
    const colors = {
        emerald: active ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
        purple:  active ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
        blue:    active ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
        gray:    active ? 'bg-gray-900 text-white border-gray-900 font-bold shadow-xs'      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
        amber:   active ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs'    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
        orange:  active ? 'bg-orange-500 text-white border-orange-500 font-bold shadow-xs'  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
    };
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition ${colors[color]}`}
        >
            {children}
        </button>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ links, meta }) {
    if (!meta || meta.last_page <= 1) return null;

    const { current_page, last_page, from, to, total } = meta;

    // Laravel's `links` array: [{ url, label, active }, ...]
    // Filter out prev/next arrows — we handle those manually
    const pageLinks = (links ?? []).filter(
        (l) => l.label !== '&laquo; Previous' && l.label !== 'Next &raquo;'
    );

    const prevUrl = (links ?? []).find((l) => l.label === '&laquo; Previous')?.url;
    const nextUrl = (links ?? []).find((l) => l.label === 'Next &raquo;')?.url;

    function go(url) {
        if (url) router.get(url, {}, { preserveScroll: true, preserveState: true });
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-gray-500">
                Menampilkan <span className="font-semibold text-gray-700">{from}–{to}</span> dari{' '}
                <span className="font-semibold text-gray-700">{total}</span> produk
            </p>

            <div className="flex items-center gap-1.5">
                {/* Prev */}
                <button
                    disabled={!prevUrl}
                    onClick={() => go(prevUrl)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <ArrowLeft size={14} /> Sebelumnya
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {pageLinks.map((link, idx) =>
                        link.label === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">…</span>
                        ) : (
                            <button
                                key={link.label}
                                disabled={link.active || !link.url}
                                onClick={() => go(link.url)}
                                className={`w-8 h-8 text-xs font-bold rounded-lg border transition ${
                                    link.active
                                        ? 'bg-emerald-600 text-white border-emerald-600 cursor-default'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {link.label}
                            </button>
                        )
                    )}
                </div>

                {/* Next */}
                <button
                    disabled={!nextUrl}
                    onClick={() => go(nextUrl)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    Berikutnya <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Index({ products, filters, availableKecamatan = [] }) {
    const { auth } = usePage().props;
    const [search, setSearch]           = useState(filters.search || '');
    const [filterOpen, setFilterOpen]   = useState(false);
    const isLoggedIn = !!auth?.user;

    function handleFilter(key, value) {
        router.get('/marketplace', { ...filters, [key]: value || undefined, page: undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleSearch(e) {
        e.preventDefault();
        router.get('/marketplace', { ...filters, search: search || undefined, page: undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function clearFilters() {
        router.get('/marketplace', {}, { preserveState: true });
        setSearch('');
    }

    const hasActiveFilters = filters.category || filters.condition || filters.mode || filters.kecamatan || filters.search || filters.sort;
    const totalCount = products.total ?? products.data?.length ?? 0;
    const activeFilterCount = [filters.category, filters.condition, filters.mode, filters.kecamatan, filters.search, filters.sort].filter(Boolean).length;

    const Layout = isLoggedIn ? AppLayout : NavbarLayout;

    return (
        <Layout title="Marketplace">
            <Head title="Marketplace — Replate" />

            <div className="w-full space-y-5">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {totalCount} produk sisa pangan &amp; hasil kebun tersedia
                        </p>
                    </div>

                    {auth?.user?.role !== 'admin' && auth?.user?.role !== 'partner' && (
                        <Link
                            href={auth?.user ? '/products/create' : '/login'}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-emerald-700 transition self-start sm:self-auto shadow-xs"
                        >
                            <Plus size={16} /> Upload Produk
                        </Link>
                    )}
                </div>

                {/* ── Search + Filter panel ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">

                    {/* Search row */}
                    <div className="p-4 sm:p-5 flex gap-2.5">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2.5">
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

                        {/* Toggle filter panel (mobile) */}
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition ${
                                filterOpen || activeFilterCount > 0
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                            title="Filter"
                        >
                            <SlidersHorizontal size={16} />
                            <span className="hidden sm:inline">Filter</span>
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] font-black bg-emerald-600 text-white rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                            {filterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>

                    {/* Collapsible filter panel */}
                    {filterOpen && (
                        <div className="border-t border-gray-100 px-4 sm:px-5 pb-5 pt-4 space-y-4">

                            {/* Row 1: Kategori */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Kategori</p>
                                <div className="flex flex-wrap gap-2">
                                    <FilterPill active={!filters.category} color="emerald" onClick={() => handleFilter('category', '')}>Semua</FilterPill>
                                    <FilterPill active={filters.category === 'mentah'} color="emerald" onClick={() => handleFilter('category', 'mentah')}>Bahan Mentah</FilterPill>
                                    <FilterPill active={filters.category === 'olahan'} color="emerald" onClick={() => handleFilter('category', 'olahan')}>Makanan Olahan</FilterPill>
                                    <FilterPill active={filters.category === 'hasil_bumi'} color="emerald" onClick={() => handleFilter('category', 'hasil_bumi')}>Hasil Bumi</FilterPill>
                                </div>
                            </div>

                            {/* Row 2: Kondisi */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Kondisi</p>
                                <div className="flex flex-wrap gap-2">
                                    <FilterPill active={!filters.condition} color="emerald" onClick={() => handleFilter('condition', '')}>Semua</FilterPill>
                                    <FilterPill active={filters.condition === 'layak_konsumsi'} color="emerald" onClick={() => handleFilter('condition', 'layak_konsumsi')}>✅ Siap Konsumsi</FilterPill>
                                    <FilterPill active={filters.condition === 'layak_olah'} color="amber" onClick={() => handleFilter('condition', 'layak_olah')}>🍳 Perlu Diolah</FilterPill>
                                    <FilterPill active={filters.condition === 'layak_pakan_kompos'} color="orange" onClick={() => handleFilter('condition', 'layak_pakan_kompos')}>♻️ Pakan / Kompos</FilterPill>
                                </div>
                            </div>

                            {/* Row 3: Mode transaksi */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mode Transaksi</p>
                                <div className="flex flex-wrap gap-2">
                                    <FilterPill active={!filters.mode} color="gray" onClick={() => handleFilter('mode', '')}>Semua</FilterPill>
                                    <FilterPill active={filters.mode === 'sell'} color="emerald" onClick={() => handleFilter('mode', 'sell')}>🛒 Jual Beli</FilterPill>
                                    <FilterPill active={filters.mode === 'barter'} color="purple" onClick={() => handleFilter('mode', 'barter')}>🔄 Barter</FilterPill>
                                    <FilterPill active={filters.mode === 'donate'} color="blue" onClick={() => handleFilter('mode', 'donate')}>💙 Donasi</FilterPill>
                                </div>
                            </div>

                            {/* Row 4: Kecamatan + Sort (side by side on sm+) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Kecamatan dropdown */}
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <Filter size={12} /> Kecamatan
                                    </p>
                                    <div className="relative">
                                        <select
                                            value={filters.kecamatan || ''}
                                            onChange={(e) => handleFilter('kecamatan', e.target.value)}
                                            className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-800 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                                        >
                                            <option value="">Semua Kecamatan</option>
                                            {availableKecamatan.map((kec) => (
                                                <option key={kec} value={kec}>{kec}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Sort dropdown */}
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <ArrowUpDown size={12} /> Urutkan
                                    </p>
                                    <div className="relative">
                                        <select
                                            value={filters.sort || 'newest'}
                                            onChange={(e) => handleFilter('sort', e.target.value)}
                                            className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-800 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                                        >
                                            {SORT_OPTIONS.map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Reset */}
                            {hasActiveFilters && (
                                <div className="pt-1">
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline"
                                    >
                                        <X size={13} /> Reset semua filter
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Active filter summary chips (shown below search when panel is closed) */}
                    {!filterOpen && hasActiveFilters && (
                        <div className="border-t border-gray-100 px-4 sm:px-5 py-2.5 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Filter aktif:</span>
                            {filters.search && (
                                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg">
                                    "{filters.search}"
                                    <button onClick={() => handleFilter('search', '')}><X size={11} /></button>
                                </span>
                            )}
                            {filters.category && (
                                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg">
                                    {filters.category}
                                    <button onClick={() => handleFilter('category', '')}><X size={11} /></button>
                                </span>
                            )}
                            {filters.condition && (
                                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-lg">
                                    {CONDITION_MAP[filters.condition]?.label ?? filters.condition}
                                    <button onClick={() => handleFilter('condition', '')}><X size={11} /></button>
                                </span>
                            )}
                            {filters.mode && (
                                <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-1 rounded-lg">
                                    {filters.mode}
                                    <button onClick={() => handleFilter('mode', '')}><X size={11} /></button>
                                </span>
                            )}
                            {filters.kecamatan && (
                                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-lg">
                                    📍 {filters.kecamatan}
                                    <button onClick={() => handleFilter('kecamatan', '')}><X size={11} /></button>
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="ml-auto text-xs text-red-600 hover:underline font-bold flex items-center gap-1"
                            >
                                <X size={13} /> Reset
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Products Grid ── */}
                {products.data && products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination links={products.links} meta={products.meta} />
                    </>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center space-y-3">
                        <ShoppingBasket size={44} className="mx-auto text-gray-400 mb-2" />
                        <h3 className="text-base font-bold text-gray-900">Tidak ada produk ditemukan</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                            {hasActiveFilters
                                ? 'Coba sesuaikan atau reset filter pencarian.'
                                : 'Belum ada produk yang tersedia saat ini.'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold rounded-xl transition"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}