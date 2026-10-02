import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Receipt,
    ShoppingBasket,
    ArrowLeftRight,
    Heart,
    Handshake,
    Package,
    Clock,
    Scale,
    Calendar,
    ChevronRight,
    CheckCircle2,
    Coins,
} from 'lucide-react';

const statusConfig = {
    pending: { label: 'Menunggu', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    confirmed: { label: 'Dikonfirmasi', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
    completed: { label: 'Selesai', color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
    cancelled: { label: 'Dibatalkan', color: 'bg-gray-50 text-gray-500 border-gray-200', dot: 'bg-gray-300' },
    dispute_spoiled: { label: 'Dispute / Basi', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
};

const typeConfig = {
    sale: { label: 'Jual Beli', icon: ShoppingBasket, color: 'bg-green-50 text-green-700 border-green-200' },
    barter: { label: 'Barter', icon: ArrowLeftRight, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    donation: { label: 'Donasi', icon: Heart, color: 'bg-sky-50 text-sky-700 border-sky-200' },
    partner_transfer: { label: 'Mitra', icon: Handshake, color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const periodLabels = {
    all: 'Semua Waktu',
    week: 'Minggu Ini (Per Minggu)',
    month: 'Bulan Ini (Per Bulan)',
    year: 'Tahun Ini (Per Tahun)',
};

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}j lalu`;
    return `${Math.floor(seconds / 86400)}h lalu`;
}

function TransactionCard({ transaction }) {
    const status = statusConfig[transaction.status] || statusConfig.pending;
    const type = typeConfig[transaction.type] || typeConfig.sale;
    const TypeIcon = type.icon;
    const product = transaction.product;
    const isDone = ['completed', 'cancelled'].includes(transaction.status);

    return (
        <Link
            href={`/transactions/${transaction.id}`}
            className={`block bg-white rounded-xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-xs transition duration-150 ${isDone ? 'opacity-85' : ''}`}
        >
            <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden shrink-0">
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
                            <Package size={22} />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {product?.title || 'Produk Transaksi'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${type.color}`}>
                            <TypeIcon size={11} />
                            {type.label}
                        </span>

                        {product && (
                            <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                                {transaction.quantity || 1} {product.unit || 'satuan'}
                            </span>
                        )}

                        {product?.weight_grams && (
                            <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                <Scale size={11} />
                                {(product.weight_grams / 1000).toFixed(1)}kg
                            </span>
                        )}

                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock size={11} />
                            {timeAgo(transaction.created_at)}
                        </span>
                    </div>
                </div>

                {/* Price & Status */}
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                    {transaction.price ? (
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                                Rp {Number(transaction.price).toLocaleString('id-ID')}
                            </p>
                            {(transaction.quantity || 1) > 1 && (
                                <p className="text-[10px] text-gray-400">
                                    {transaction.quantity} {product?.unit || 'satuan'} · Rp {Number(product?.discounted_price ?? product?.price ?? Math.round(transaction.price / (transaction.quantity || 1))).toLocaleString('id-ID')}/{product?.unit || 'satuan'}
                                </p>
                            )}
                        </div>
                    ) : transaction.barter_notes ? (
                        <p className="text-xs font-semibold text-purple-700">Barter Barang</p>
                    ) : (
                        <p className="text-xs font-semibold text-sky-700">Donasi Gratis</p>
                    )}

                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                    </span>
                </div>

                <div className="text-gray-300 hidden sm:block">
                    <ChevronRight size={16} />
                </div>
            </div>
        </Link>
    );
}

export default function Index({ transactions, currentPeriod = 'all', periodCounts = {} }) {
    const [statusFilter, setStatusFilter] = useState('all');

    const handlePeriodChange = (period) => {
        router.get('/transactions', { period }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const filtered = statusFilter === 'all'
        ? transactions
        : transactions.filter((t) => t.status === statusFilter);

    const counts = {
        all: transactions.length,
        pending: transactions.filter((t) => t.status === 'pending').length,
        confirmed: transactions.filter((t) => t.status === 'confirmed').length,
        completed: transactions.filter((t) => t.status === 'completed').length,
        cancelled: transactions.filter((t) => t.status === 'cancelled').length,
    };

    const totalSpent = transactions
        .filter((t) => t.status === 'completed' && t.price)
        .reduce((sum, t) => sum + Number(t.price || 0), 0);

    const completedCount = transactions.filter((t) => t.status === 'completed').length;

    return (
        <AppLayout>
            <Head title="Riwayat Transaksi" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Lihat semua aktivitas transaksi jual beli, barter, dan donasi pangan Anda.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 self-start sm:self-auto">
                        <Calendar size={14} className="text-gray-500" />
                        <span>Periode: {periodLabels[currentPeriod] || 'Semua Waktu'}</span>
                    </div>
                </div>

                {/* Period Filter Tabs (Semuanya, Per Minggu, Per Bulan, Per Tahun) */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-2.5 flex items-center gap-1.5">
                        <Calendar size={14} className="text-green-600" />
                        Pilih Rentang Waktu:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                            { key: 'all', label: 'Semuanya', sub: 'Semua Riwayat' },
                            { key: 'week', label: 'Per Minggu', sub: 'Minggu Ini' },
                            { key: 'month', label: 'Per Bulan', sub: 'Bulan Ini' },
                            { key: 'year', label: 'Per Tahun', sub: 'Tahun Ini' },
                        ].map((tab) => {
                            const isActive = currentPeriod === tab.key;
                            const count = periodCounts[tab.key] ?? 0;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => handlePeriodChange(tab.key)}
                                    className={`flex flex-col items-start p-3 rounded-lg border text-left transition duration-150 ${
                                        isActive
                                            ? 'bg-green-50 border-green-600 text-green-900'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-xs font-bold">{tab.label}</span>
                                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                                            isActive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {count}
                                        </span>
                                    </div>
                                    <span className={`text-[11px] mt-0.5 ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
                                        {tab.sub}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Period Summary Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                            <span className="text-xs font-medium">Transaksi</span>
                            <Receipt size={15} className="text-blue-500" />
                        </div>
                        <p className="text-lg font-bold text-gray-900">{transactions.length}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{periodLabels[currentPeriod]}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                            <span className="text-xs font-medium">Selesai Berhasil</span>
                            <CheckCircle2 size={15} className="text-green-500" />
                        </div>
                        <p className="text-lg font-bold text-green-700">{completedCount}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Tersalurkan</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                            <span className="text-xs font-medium">Nilai Transaksi</span>
                            <Coins size={15} className="text-emerald-500" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 truncate">
                            Rp {totalSpent.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Jual beli selesai</p>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[
                        { key: 'all', label: 'Semua Status' },
                        { key: 'pending', label: 'Menunggu' },
                        { key: 'confirmed', label: 'Dikonfirmasi' },
                        { key: 'completed', label: 'Selesai' },
                        { key: 'cancelled', label: 'Dibatalkan' },
                    ].map((tab) => {
                        const isActive = statusFilter === tab.key;
                        const count = counts[tab.key] ?? 0;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`text-xs font-medium px-3.5 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${
                                    isActive
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                                {count > 0 && (
                                    <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Transactions list */}
                {filtered.length > 0 ? (
                    <div className="space-y-2.5">
                        {filtered.map((t) => (
                            <TransactionCard key={t.id} transaction={t} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <Receipt size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="font-semibold text-gray-700 mb-1">
                            {statusFilter === 'all'
                                ? `Belum ada transaksi untuk ${periodLabels[currentPeriod].toLowerCase()}`
                                : `Tidak ada transaksi berstatus "${statusConfig[statusFilter]?.label}"`}
                        </p>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                            Ganti periode filter atau jelajahi marketplace pangan untuk mulai bertransaksi.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            {currentPeriod !== 'all' && (
                                <button
                                    onClick={() => handlePeriodChange('all')}
                                    className="px-3.5 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                                >
                                    Lihat Semua Riwayat
                                </button>
                            )}
                            <Link
                                href="/marketplace"
                                className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition"
                            >
                                Belanja Pangan
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}