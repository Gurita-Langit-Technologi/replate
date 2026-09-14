import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Receipt,
    Search,
    ShoppingBasket,
    ArrowLeftRight,
    Heart,
    Handshake,
    AlertTriangle,
    CheckCircle2,
    Clock,
    XCircle,
    ExternalLink,
    Filter,
    Package,
    Scale,
    Printer,
    Coins,
    Calendar,
} from 'lucide-react';

const statusConfig = {
    pending:         { label: 'Menunggu',                 color: 'text-amber-700 bg-amber-50 border-amber-200',  dot: 'bg-amber-400' },
    confirmed:       { label: 'Dikonfirmasi',             color: 'text-blue-700 bg-blue-50 border-blue-200',    dot: 'bg-blue-400' },
    completed:       { label: 'Selesai',                  color: 'text-green-700 bg-green-50 border-green-200',  dot: 'bg-green-500' },
    cancelled:       { label: 'Dibatalkan',               color: 'text-gray-700 bg-gray-50 border-gray-200',    dot: 'bg-gray-400' },
    dispute_spoiled: { label: 'Dispute / Makanan Basi',   color: 'text-orange-700 bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
};

const typeConfig = {
    sale:             { label: 'Jual Beli',      icon: ShoppingBasket, color: 'text-green-700 bg-green-50 border-green-200' },
    barter:           { label: 'Barter',          icon: ArrowLeftRight, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    donation:         { label: 'Donasi',          icon: Heart,          color: 'text-sky-700 bg-sky-50 border-sky-200' },
    partner_transfer: { label: 'Alih ke Mitra',   icon: Handshake,      color: 'text-amber-700 bg-amber-50 border-amber-200' },
};

const periodLabels = {
    all: 'Semua Waktu',
    week: 'Minggu Ini (Per Minggu)',
    month: 'Bulan Ini (Per Bulan)',
    year: 'Tahun Ini (Per Tahun)',
};

function formatRupiah(num) {
    if (!num) return 'Rp 0';
    return `Rp ${Number(num).toLocaleString('id-ID')}`;
}

export default function Transactions({ transactions = [], filters = {}, periodCounts = {}, metrics = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [periodFilter, setPeriodFilter] = useState(filters.period || 'all');

    const handleFilterChange = (newPeriod, newStatus, newType, newSearch) => {
        const query = {};
        const p = newPeriod !== undefined ? newPeriod : periodFilter;
        const s = newStatus !== undefined ? newStatus : statusFilter;
        const t = newType !== undefined ? newType : typeFilter;
        const q = newSearch !== undefined ? newSearch : search;

        if (p && p !== 'all') query.period = p;
        if (s && s !== 'all') query.status = s;
        if (t && t !== 'all') query.type = t;
        if (q && q.trim() !== '') query.search = q.trim();

        router.get('/admin/transactions', query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange(undefined, undefined, undefined, search);
    };

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setTypeFilter('all');
        setPeriodFilter('all');
        router.get('/admin/transactions');
    };

    return (
        <AppLayout>
            <Head title="Monitoring Transaksi Desa — Admin BUMDes" />

            <div className="max-w-7xl mx-auto space-y-6 print:m-0 print:p-0 print:max-w-none">
                {/* Official BUMDes Print Header (Print Only) */}
                <div className="hidden print:block pb-6 border-b-2 border-gray-900 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3.5">
                            <img src="/image/logo(2).png" alt="Replate" className="w-auto h-12 rounded-lg object-contain" />
                            <div>
                                <h1 className="text-xl font-black text-emerald-950 uppercase tracking-tight">BADAN USAHA MILIK DESA (BUMDES)</h1>
                                <p className="text-xs font-bold text-gray-700">LEMBAR REKAPITULASI AUDIT TRANSAKSI PANGAN SIRKULAR REPLATE</p>
                                <p className="text-[11px] text-gray-500">Unit Pengelolaan Ketahanan Pangan & Pencegahan Food Waste Desa</p>
                            </div>
                        </div>
                        <div className="text-right text-xs">
                            <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-900 font-extrabold rounded border border-emerald-300">
                                DOKUMEN AUDIT RESMI
                            </span>
                            <p className="text-gray-600 font-medium mt-1">Rentang: <strong>{periodLabels[periodFilter] || 'Semua Waktu'}</strong></p>
                            <p className="text-[10px] text-gray-400">Dicetak: {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                        </div>
                    </div>
                </div>

                {/* Header (Screen Only) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                BUMDes Supervisor
                            </span>
                            <span className="text-xs text-gray-400">Live Audit Log</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">
                            Monitoring Transaksi Desa
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Pantau seluruh arus perputaran pangan sirkular (jual, barter, donasi, dan alih fungsi mitra) secara real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition active:scale-95"
                        >
                            <Printer size={16} />
                            Cetak Laporan Rekap
                        </button>
                    </div>
                </div>

                {/* Period Filter Card (Semua, Per Minggu, Per Bulan, Per Tahun) */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 print:hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                            <Calendar size={14} className="text-green-600" />
                            Filter Rentang Waktu Transaksi:
                        </p>
                        <span className="text-xs font-medium text-gray-500">
                            Aktif: <strong className="text-gray-800">{periodLabels[periodFilter] || 'Semua Waktu'}</strong>
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        {[
                            { key: 'all', label: 'Semuanya', sub: 'Semua Waktu' },
                            { key: 'week', label: 'Per Minggu', sub: 'Minggu Ini' },
                            { key: 'month', label: 'Per Bulan', sub: 'Bulan Ini' },
                            { key: 'year', label: 'Per Tahun', sub: 'Tahun Ini' },
                        ].map((tab) => {
                            const isActive = periodFilter === tab.key;
                            const count = periodCounts[tab.key] ?? 0;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => {
                                        setPeriodFilter(tab.key);
                                        handleFilterChange(tab.key, undefined, undefined, undefined);
                                    }}
                                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition duration-150 ${
                                        isActive
                                            ? 'bg-green-50 border-green-600 text-green-900 ring-1 ring-green-600'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-xs font-bold">{tab.label}</span>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                                            isActive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {count}
                                        </span>
                                    </div>
                                    <span className={`text-[11px] mt-0.5 ${isActive ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                                        {tab.sub}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Metrics Cards (Reflects Active Period) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                            <span className="text-xs font-medium">Total Transaksi</span>
                            <Receipt size={16} className="text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{metrics.total ?? 0}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{periodLabels[periodFilter]}</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                            <span className="text-xs font-medium">Sedang Berjalan</span>
                            <Clock size={16} className="text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{metrics.active ?? 0}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Pending & Confirmed</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                            <span className="text-xs font-medium">Selesai Berhasil</span>
                            <CheckCircle2 size={16} className="text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-green-700">{metrics.completed ?? 0}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Tersalurkan tuntas</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                            <span className="text-xs font-medium">Dispute / Basi</span>
                            <AlertTriangle size={16} className="text-orange-500" />
                        </div>
                        <p className="text-2xl font-bold text-orange-600">{metrics.dispute ?? 0}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Dialihkan ke mitra</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                            <span className="text-xs font-medium">Omset Jual Beli</span>
                            <Coins size={16} className="text-emerald-500" />
                        </div>
                        <p className="text-base font-bold text-gray-900 truncate">{formatRupiah(metrics.revenueRp)}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Perputaran desa</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                            <span className="text-xs font-medium">Pangan Selamat</span>
                            <Scale size={16} className="text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-green-700">{metrics.weightSavedKg ?? 0} <span className="text-xs font-semibold">kg</span></p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Cegah food waste</p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 print:hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari ID transaksi, nama warga, atau produk..."
                                className="w-full pl-10 pr-20 py-2.5 text-sm bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                            >
                                Cari
                            </button>
                        </form>

                        {/* Reset Filter Button */}
                        {(filters.status !== 'all' || filters.type !== 'all' || filters.period !== 'all' || filters.search) && (
                            <button
                                onClick={resetFilters}
                                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 self-start md:self-auto"
                            >
                                <XCircle size={14} /> Reset Semua Filter
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs: Status & Jenis */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        {/* Status Filter */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                            <span className="text-xs font-semibold text-gray-400 mr-1 flex items-center gap-1">
                                <Filter size={12} /> Status:
                            </span>
                            {[
                                { key: 'all', label: 'Semua Status' },
                                { key: 'pending', label: 'Menunggu' },
                                { key: 'confirmed', label: 'Dikonfirmasi' },
                                { key: 'completed', label: 'Selesai' },
                                { key: 'dispute_spoiled', label: 'Dispute' },
                                { key: 'cancelled', label: 'Dibatalkan' },
                            ].map((tab) => {
                                const isActive = statusFilter === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            setStatusFilter(tab.key);
                                            handleFilterChange(undefined, tab.key, undefined, undefined);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                                            isActive
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                            <span className="text-xs font-semibold text-gray-400 mr-1">Jalur:</span>
                            {[
                                { key: 'all', label: 'Semua Jalur' },
                                { key: 'sale', label: 'Jual Beli' },
                                { key: 'barter', label: 'Barter' },
                                { key: 'donation', label: 'Donasi' },
                                { key: 'partner_transfer', label: 'Mitra' },
                            ].map((tab) => {
                                const isActive = typeFilter === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            setTypeFilter(tab.key);
                                            handleFilterChange(undefined, undefined, tab.key, undefined);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                                            isActive
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Table Data */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden print:border-none print:shadow-none">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse print:border print:border-gray-300">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider print:bg-gray-100 print:text-gray-900 print:border-gray-300">
                                    <th className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">ID & Tanggal</th>
                                    <th className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">Produk Pangan</th>
                                    <th className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">Penjual / Pendonor</th>
                                    <th className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">Pembeli / Mitra</th>
                                    <th className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">Jalur & Nilai</th>
                                    <th className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">Status</th>
                                    <th className="py-3.5 px-4 text-right print:hidden">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs text-gray-600 print:divide-gray-300">
                                {transactions && transactions.length > 0 ? (
                                    transactions.map((t) => {
                                        const status = statusConfig[t.status] || statusConfig.pending;
                                        const type = typeConfig[t.type] || typeConfig.sale;
                                        const TypeIcon = type.icon;
                                        const product = t.product;

                                        return (
                                            <tr key={t.id} className="hover:bg-gray-50/70 transition print:break-inside-avoid">
                                                {/* ID & Date */}
                                                <td className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">
                                                    <span className="font-mono font-bold text-gray-900">#{t.id}</span>
                                                    <p className="text-[11px] text-gray-400 mt-0.5 print:text-gray-600">
                                                        {new Date(t.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </td>

                                                {/* Product */}
                                                <td className="py-3.5 px-4 max-w-xs print:p-2.5 print:border print:border-gray-300">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 print:hidden">
                                                            {product?.photo ? (
                                                                <img
                                                                    src={`/storage/${product.photo}`}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '/image/image default.jpg';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                    <Package size={16} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-900 truncate">
                                                                {product?.title || 'Produk dihapus'}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5 print:text-gray-600">
                                                                <span className="font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded print:border-none print:p-0">
                                                                    {t.quantity || 1} {product?.unit || 'item'}
                                                                </span>
                                                                {product?.weight_grams && (
                                                                    <span>• {(product.weight_grams / 1000).toFixed(1)} kg</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Seller */}
                                                <td className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">
                                                    <p className="font-medium text-gray-900">{t.seller?.name || '-'}</p>
                                                    <p className="text-[11px] text-gray-400 print:text-gray-600">{t.seller?.desa ? `Desa ${t.seller.desa}` : t.seller?.email}</p>
                                                </td>

                                                {/* Buyer / Partner */}
                                                <td className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">
                                                    <p className="font-medium text-gray-900">
                                                        {t.type === 'partner_transfer'
                                                            ? (t.partner?.name || t.buyer?.name || 'Mitra Desa')
                                                            : (t.buyer?.name || '-')}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 print:text-gray-600">
                                                        {t.buyer?.desa ? `Desa ${t.buyer.desa}` : (t.buyer?.email || '-')}
                                                    </p>
                                                </td>

                                                {/* Type & Value */}
                                                <td className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${type.color} mb-1 print:border-none print:p-0`}>
                                                        <TypeIcon size={12} className="print:hidden" />
                                                        {type.label}
                                                    </span>
                                                    {t.price ? (
                                                        <p className="font-bold text-gray-900">{formatRupiah(t.price)}</p>
                                                    ) : t.barter_notes ? (
                                                        <p className="text-[11px] text-purple-700 italic truncate max-w-[140px]">{t.barter_notes}</p>
                                                    ) : (
                                                        <p className="text-[11px] text-sky-700 font-medium">Gratis (Donasi)</p>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="py-3.5 px-4 print:p-2.5 print:border print:border-gray-300">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${status.color} print:border-none print:p-0`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} print:hidden`} />
                                                        {status.label}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td className="py-3.5 px-4 text-right print:hidden">
                                                    <Link
                                                        href={`/transactions/${t.id}`}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 hover:text-green-700 border border-gray-200 hover:border-green-300 text-xs font-semibold rounded-lg transition"
                                                    >
                                                        Detail
                                                        <ExternalLink size={12} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-400">
                                            <Receipt size={36} className="mx-auto text-gray-300 mb-2" />
                                            <p className="font-medium text-gray-700">Tidak ada transaksi yang cocok untuk {periodLabels[periodFilter].toLowerCase()}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 mb-3">Coba ubah filter rentang waktu, status, jalur transaksi, atau kata kunci pencarian.</p>
                                            <button
                                                onClick={resetFilters}
                                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                                            >
                                                Tampilkan Semua Transaksi
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Official BUMDes Audit Signatures (Print Only) */}
                <div className="hidden print:block pt-8 mt-6 border-t-2 border-gray-900 text-xs text-gray-900 font-sans">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="font-semibold text-gray-600">Disiapkan Oleh:</p>
                            <p className="text-[11px] text-gray-500">Petugas Administrasi BUMDes</p>
                            <div className="h-20 flex items-center justify-center">
                                <span className="text-[10px] font-mono text-gray-400">[Tanda Tangan & Cap]</span>
                            </div>
                            <p className="font-bold underline text-gray-900">Admin Operasional Desa</p>
                            <p className="text-[10px] text-gray-500">Unit Sirkularitas Pangan</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-600">Diverifikasi Sistem:</p>
                            <p className="text-[11px] text-gray-500">Audit Digital Replate</p>
                            <div className="h-20 flex flex-col items-center justify-center">
                                <span className="inline-block px-2 py-0.5 border border-emerald-600 text-emerald-800 font-mono font-bold text-[9px] rounded">
                                    SYSTEM VERIFIED
                                </span>
                                <span className="text-[9px] font-mono text-gray-400 mt-1">LOG-ID: {Date.now().toString(36).toUpperCase()}</span>
                            </div>
                            <p className="font-bold text-emerald-900">Replate Engine Core</p>
                            <p className="text-[10px] text-gray-500">Terdaftar Resmi BUMDes</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-600">Disahkan Oleh:</p>
                            <p className="text-[11px] text-gray-500">Direktur / Kepala BUMDes</p>
                            <div className="h-20 flex items-center justify-center">
                                <span className="text-[10px] font-mono text-gray-400">[Tanda Tangan & Cap Basah]</span>
                            </div>
                            <p className="font-bold underline text-gray-900">Kepala Pengurus BUMDes</p>
                            <p className="text-[10px] text-gray-500">NIP / SK Desa Terlampir</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-300 text-center text-[10px] text-gray-500">
                        Dokumen Rekapitulasi Audit Transaksi Pangan BUMDes ini sah sebagai lampiran pertanggungjawaban program ketahanan pangan & ESG desa. Dicetak melalui Replate Platform.
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
