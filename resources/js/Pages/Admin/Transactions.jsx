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

            <div className="max-w-7xl mx-auto space-y-6 print:m-0 print:p-0 print:max-w-none print:w-full">
                {/* Official Formal Kop Surat BUMDes (Print Only) */}
                <div className="hidden print:block mb-5">
                    <div className="flex items-center justify-between pb-2">
                        <div className="flex items-center gap-4">
                            <img src="/image/logo(2).png" alt="Replate Logo" className="h-12 w-auto object-contain" />
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">PEMERINTAH KABUPATEN BANTUL • KECAMATAN BAMBANGLIPURO</p>
                                <h1 className="text-base font-black text-gray-950 uppercase tracking-tight">BADAN USAHA MILIK DESA (BUMDes) SUMBERMULYO</h1>
                                <p className="text-[11px] font-bold text-emerald-800">Unit Pengelolaan Ketahanan Pangan & Ekonomi Sirkular (Replate Platform)</p>
                                <p className="text-[9px] text-gray-500">Jl. Samas Km. 2, Sumbermulyo, Bambanglipuro, Bantul, D.I. Yogyakarta 55764 • bumdes@sumbermulyo.desa.id</p>
                            </div>
                        </div>
                        <div className="text-right border-l-2 border-gray-300 pl-3">
                            <span className="inline-block px-2 py-0.5 bg-gray-900 text-white font-mono font-bold text-[9px] rounded">
                                DOKUMEN AUDIT RESMI
                            </span>
                            <p className="text-[9px] font-mono text-gray-600 mt-1">NO: RPT-BUMDES/{new Date().getFullYear()}/{String(new Date().getMonth() + 1).padStart(2, '0')}/TX</p>
                            <p className="text-[9px] text-gray-500">Tgl Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Garis Ganda Kop Surat Resmi */}
                    <div className="border-b-2 border-gray-900" />
                    <div className="border-b border-gray-900 mt-[2px] mb-3" />

                    {/* Judul Dokumen */}
                    <div className="text-center my-2">
                        <h2 className="text-sm font-black uppercase text-gray-950 tracking-wide">
                            LAPORAN REKAPITULASI AUDIT TRANSAKSI PANGAN DESA
                        </h2>
                        <p className="text-[11px] font-medium text-gray-700">
                            Periode Audit: <strong className="text-gray-950">{periodLabels[periodFilter] || 'Semua Waktu'}</strong> • Total Data: <strong>{transactions?.length || 0} Transaksi</strong>
                        </p>
                    </div>

                    {/* Executive Summary Table (Ringkasan Eksekutif) */}
                    <div className="border border-gray-400 rounded bg-gray-50 p-2 mb-3 text-[10px]">
                        <div className="grid grid-cols-6 gap-2 text-center divide-x divide-gray-300">
                            <div>
                                <span className="text-gray-500 block text-[9px]">Total Transaksi</span>
                                <strong className="text-gray-900 text-[11px]">{metrics.total ?? 0} Transaksi</strong>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[9px]">Selesai Tuntas</span>
                                <strong className="text-emerald-800 text-[11px]">{metrics.completed ?? 0} Sukses</strong>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[9px]">Dalam Proses</span>
                                <strong className="text-amber-800 text-[11px]">{metrics.active ?? 0} Berjalan</strong>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[9px]">Dispute / Mitra</span>
                                <strong className="text-rose-800 text-[11px]">{metrics.dispute ?? 0} Kasus</strong>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[9px]">Perputaran Nilai</span>
                                <strong className="text-gray-900 text-[11px]">{formatRupiah(metrics.revenueRp)}</strong>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[9px]">Pangan Selamat</span>
                                <strong className="text-emerald-800 text-[11px]">{metrics.weightSavedKg ?? 0} kg</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header (Screen Only) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
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
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 print:hidden shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
                        <p className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                            <Calendar size={16} className="text-emerald-700" />
                            Filter Rentang Waktu Transaksi:
                        </p>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                            Aktif: <strong className="text-gray-900">{periodLabels[periodFilter] || 'Semua Waktu'}</strong>
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
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
                                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition duration-150 ${
                                        isActive
                                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold shadow-xs'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-xs sm:text-sm font-bold">{tab.label}</span>
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                            isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {count}
                                        </span>
                                    </div>
                                    <span className={`text-xs mt-1 ${isActive ? 'text-emerald-800 font-semibold' : 'text-gray-500'}`}>
                                        {tab.sub}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Metrics Cards (Reflects Active Period) — Screen Only */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 print:hidden">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                        <div className="flex items-center justify-between text-gray-600 mb-1.5">
                            <span className="text-xs sm:text-sm font-semibold">Total Transaksi</span>
                            <Receipt size={18} className="text-blue-600" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{metrics.total ?? 0}</p>
                        <p className="text-xs text-gray-600 mt-1">{periodLabels[periodFilter]}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                        <div className="flex items-center justify-between text-gray-600 mb-1.5">
                            <span className="text-xs sm:text-sm font-semibold">Sedang Berjalan</span>
                            <Clock size={18} className="text-amber-600" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-amber-700">{metrics.active ?? 0}</p>
                        <p className="text-xs text-gray-600 mt-1">Pending & Confirmed</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                        <div className="flex items-center justify-between text-gray-600 mb-1.5">
                            <span className="text-xs sm:text-sm font-semibold">Selesai Berhasil</span>
                            <CheckCircle2 size={18} className="text-green-600" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-green-700">{metrics.completed ?? 0}</p>
                        <p className="text-xs text-gray-600 mt-1">Tersalurkan tuntas</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                        <div className="flex items-center justify-between text-gray-600 mb-1.5">
                            <span className="text-xs sm:text-sm font-semibold">Dispute / Basi</span>
                            <AlertTriangle size={18} className="text-orange-600" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-orange-700">{metrics.dispute ?? 0}</p>
                        <p className="text-xs text-gray-600 mt-1">Dialihkan ke mitra</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                        <div className="flex items-center justify-between text-gray-600 mb-1.5">
                            <span className="text-xs sm:text-sm font-semibold">Omset Jual Beli</span>
                            <Coins size={18} className="text-emerald-600" />
                        </div>
                        <p className="text-base sm:text-lg font-bold text-gray-900 truncate">{formatRupiah(metrics.revenueRp)}</p>
                        <p className="text-xs text-gray-600 mt-1">Perputaran desa</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                        <div className="flex items-center justify-between text-gray-600 mb-1.5">
                            <span className="text-xs sm:text-sm font-semibold">Pangan Selamat</span>
                            <Scale size={18} className="text-green-700" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-green-700">{metrics.weightSavedKg ?? 0} <span className="text-sm font-semibold">kg</span></p>
                        <p className="text-xs text-gray-600 mt-1">Cegah food waste</p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 space-y-4 print:hidden shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari ID transaksi, nama warga, atau produk..."
                                className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-0 transition text-gray-900 placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition"
                            >
                                Cari
                            </button>
                        </form>

                        {/* Reset Filter Button */}
                        {(filters.status !== 'all' || filters.type !== 'all' || filters.period !== 'all' || filters.search) && (
                            <button
                                onClick={resetFilters}
                                className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1.5 self-start md:self-auto"
                            >
                                <XCircle size={16} /> Reset Semua Filter
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs: Status & Jenis */}
                    <div className="flex flex-wrap items-center justify-between gap-3.5 pt-3.5 border-t border-gray-100">
                        {/* Quick Status Pill */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                            {[
                                { key: 'all', label: 'Semua Status' },
                                { key: 'pending', label: 'Menunggu' },
                                { key: 'confirmed', label: 'Diproses' },
                                { key: 'completed', label: 'Selesai' },
                                { key: 'cancelled', label: 'Batal' },
                                { key: 'timeout', label: 'Kedaluwarsa' },
                            ].map((tab) => {
                                const isActive = statusFilter === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            setStatusFilter(tab.key);
                                            handleFilterChange(undefined, tab.key, undefined, undefined);
                                        }}
                                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                                            isActive
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                            <span className="text-xs sm:text-sm font-bold text-gray-600 mr-1">Jalur:</span>
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
                                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                                            isActive
                                                ? 'bg-gray-900 text-white shadow-xs'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden print:border-none print:shadow-none shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse print:border print:border-gray-400">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider print:bg-gray-100 print:text-gray-950 print:border-gray-400">
                                    <th className="hidden print:table-cell py-4 px-5 print:p-2 print:border print:border-gray-400 print:text-center w-8">No.</th>
                                    <th className="py-4 px-5 print:p-2 print:border print:border-gray-400">ID & Tanggal</th>
                                    <th className="py-4 px-5 print:p-2 print:border print:border-gray-400">Produk Pangan</th>
                                    <th className="py-4 px-5 print:p-2 print:border print:border-gray-400">Penjual / Pendonor</th>
                                    <th className="py-4 px-5 print:p-2 print:border print:border-gray-400">Pembeli / Mitra</th>
                                    <th className="py-4 px-5 print:p-2 print:border print:border-gray-400">Jalur & Nilai</th>
                                    <th className="py-4 px-5 print:p-2 print:border print:border-gray-400">Status</th>
                                    <th className="py-4 px-5 text-right print:hidden">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700 print:divide-gray-400">
                                {transactions && transactions.length > 0 ? (
                                    transactions.map((t, index) => {
                                        const status = statusConfig[t.status] || statusConfig.pending;
                                        const type = typeConfig[t.type] || typeConfig.sale;
                                        const TypeIcon = type.icon;
                                        const product = t.product;

                                        return (
                                            <tr key={t.id} className="hover:bg-gray-50/80 transition print:break-inside-avoid">
                                                {/* Print No Column */}
                                                <td className="hidden print:table-cell py-4 px-5 print:p-2 print:border print:border-gray-400 print:text-center font-mono font-bold text-gray-950">
                                                    {index + 1}
                                                </td>

                                                {/* ID & Date */}
                                                <td className="py-4 px-5 print:p-2 print:border print:border-gray-400">
                                                    <span className="font-mono font-bold text-gray-900 print:text-gray-950">#{t.id}</span>
                                                    <p className="text-xs text-gray-600 mt-0.5 print:text-gray-700 print:text-[9.5px]">
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
                                                <td className="py-4 px-5 max-w-xs print:p-2 print:border print:border-gray-400">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 print:hidden">
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
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <Package size={18} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 print:text-gray-950 print:text-[10px] truncate text-xs sm:text-sm">
                                                                {product?.title || 'Produk dihapus'}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5 print:text-gray-700 print:text-[9.5px]">
                                                                <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md print:border-none print:p-0 print:text-gray-950">
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
                                                <td className="py-4 px-5 print:p-2 print:border print:border-gray-400">
                                                    <p className="font-bold text-gray-900 print:text-gray-950 print:text-[10px] text-xs sm:text-sm">{t.seller?.name || '-'}</p>
                                                    <p className="text-xs text-gray-600 print:text-gray-700 print:text-[9px] mt-0.5">{t.seller?.desa ? `Desa ${t.seller.desa}` : (t.seller?.email || '-')}</p>
                                                </td>

                                                {/* Buyer / Partner */}
                                                <td className="py-4 px-5 print:p-2 print:border print:border-gray-400">
                                                    <p className="font-bold text-gray-900 print:text-gray-950 print:text-[10px] text-xs sm:text-sm">
                                                        {t.type === 'partner_transfer'
                                                            ? (t.partner?.name || t.buyer?.name || 'Mitra Desa')
                                                            : (t.buyer?.name || '-')}
                                                    </p>
                                                    <p className="text-xs text-gray-600 print:text-gray-700 print:text-[9px] mt-0.5">
                                                        {t.buyer?.desa ? `Desa ${t.buyer.desa}` : (t.buyer?.email || '-')}
                                                    </p>
                                                </td>

                                                {/* Type & Value */}
                                                <td className="py-4 px-5 print:p-2 print:border print:border-gray-400">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${type.color} mb-1 print:border-none print:p-0 print:text-gray-950 print:text-[9.5px] print:block`}>
                                                        <TypeIcon size={14} className="print:hidden" />
                                                        {type.label}
                                                    </span>
                                                    {t.price ? (
                                                        <p className="font-bold text-gray-900 print:text-gray-950 print:text-[10px] text-xs sm:text-sm">{formatRupiah(t.price)}</p>
                                                    ) : t.barter_notes ? (
                                                        <p className="text-xs text-purple-800 italic font-medium truncate max-w-[140px] print:text-gray-700 print:text-[9px]">{t.barter_notes}</p>
                                                    ) : (
                                                        <p className="text-xs text-sky-800 font-semibold print:text-gray-700 print:text-[9px]">Gratis (Donasi)</p>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-5 print:p-2 print:border print:border-gray-400">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${status.color} print:border-none print:p-0 print:text-gray-950 print:font-bold print:text-[9.5px]`}>
                                                        <span className={`w-2 h-2 rounded-full ${status.dot} print:hidden`} />
                                                        {status.label}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td className="py-4 px-5 text-right print:hidden">
                                                    <Link
                                                        href={`/transactions/${t.id}`}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 hover:text-emerald-800 border border-gray-300 hover:border-emerald-300 text-xs sm:text-sm font-bold rounded-xl transition shadow-xs"
                                                    >
                                                        Detail
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-14 text-center text-gray-600">
                                            <Receipt size={40} className="mx-auto text-gray-400 mb-2.5" />
                                            <p className="font-bold text-gray-800 text-base">Tidak ada transaksi yang cocok untuk {periodLabels[periodFilter].toLowerCase()}</p>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-4">Coba ubah filter rentang waktu, status, jalur transaksi, atau kata kunci pencarian.</p>
                                            <button
                                                onClick={resetFilters}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold rounded-xl transition"
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
                <div className="hidden print:block pt-6 mt-4 border-t-2 border-gray-900 text-xs text-gray-900 font-sans print-avoid-break">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="font-semibold text-gray-700 text-[11px]">Disiapkan Oleh:</p>
                            <p className="text-[10px] text-gray-500">Petugas Administrasi BUMDes</p>
                            <div className="h-16 flex items-center justify-center">
                                <span className="text-[9px] font-mono text-gray-400">[Tanda Tangan & Cap]</span>
                            </div>
                            <p className="font-bold underline text-gray-950 text-[11px]">Admin Operasional Desa</p>
                            <p className="text-[9px] text-gray-500">Unit Sirkularitas Pangan</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-700 text-[11px]">Diverifikasi Sistem:</p>
                            <p className="text-[10px] text-gray-500">Audit Digital Replate</p>
                            <div className="h-16 flex flex-col items-center justify-center">
                                <span className="inline-block px-2 py-0.5 border border-gray-900 text-gray-950 font-mono font-bold text-[9px] rounded">
                                    SYSTEM VERIFIED
                                </span>
                                <span className="text-[8px] font-mono text-gray-500 mt-0.5">LOG-ID: {Date.now().toString(36).toUpperCase()}</span>
                            </div>
                            <p className="font-bold text-gray-950 text-[11px]">Replate Engine Core</p>
                            <p className="text-[9px] text-gray-500">Terdaftar Resmi BUMDes</p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-700 text-[11px]">Disahkan Oleh:</p>
                            <p className="text-[10px] text-gray-500">Direktur / Kepala BUMDes</p>
                            <div className="h-16 flex items-center justify-center">
                                <span className="text-[9px] font-mono text-gray-400">[Tanda Tangan & Cap Basah]</span>
                            </div>
                            <p className="font-bold underline text-gray-950 text-[11px]">Kepala Pengurus BUMDes</p>
                            <p className="text-[9px] text-gray-500">NIP / SK Desa Terlampir</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-gray-300 text-center text-[9px] text-gray-500">
                        Dokumen Rekapitulasi Audit Transaksi Pangan BUMDes ini sah sebagai lampiran pertanggungjawaban program ketahanan pangan & ESG desa. Dicetak melalui Replate Platform.
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
