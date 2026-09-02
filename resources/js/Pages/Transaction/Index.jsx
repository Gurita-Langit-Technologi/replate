import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
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
} from 'lucide-react';

const statusConfig = {
    pending: { label: 'Menunggu', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    confirmed: { label: 'Dikonfirmasi', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
    completed: { label: 'Selesai', color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-400' },
    cancelled: { label: 'Dibatalkan', color: 'bg-gray-50 text-gray-500 border-gray-200', dot: 'bg-gray-300' },
};

const typeConfig = {
    sale: { label: 'Jual beli', icon: ShoppingBasket, color: 'bg-green-50 text-green-600' },
    barter: { label: 'Barter', icon: ArrowLeftRight, color: 'bg-purple-50 text-purple-600' },
    donation: { label: 'Donasi', icon: Heart, color: 'bg-blue-50 text-blue-600' },
    partner_transfer: { label: 'Partner', icon: Handshake, color: 'bg-amber-50 text-amber-600' },
};

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}j lalu`;
    return `${Math.floor(seconds / 86400)}h lalu`;
}

function TransactionCard({ transaction }) {
    const status = statusConfig[transaction.status];
    const type = typeConfig[transaction.type] || typeConfig.sale;
    const TypeIcon = type.icon;
    const product = transaction.product;
    const isDone = ['completed', 'cancelled'].includes(transaction.status);

    return (
        <Link
            href={`/transactions/${transaction.id}`}
            className={`block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm hover:border-gray-200 transition ${isDone ? 'opacity-75' : ''}`}
        >
            <div className="flex items-center p-4">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 mr-4">
                    {product?.photo ? (
                        <img src={`/storage/${product.photo}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package size={22} />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product?.title || 'Produk'}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${type.color}`}>
                            <TypeIcon size={10} />
                            {type.label}
                        </span>
                        {product && (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium text-[11px]">
                                {transaction.quantity || 1} {product.unit || 'satuan'}
                            </span>
                        )}
                        {product && (
                            <span className="flex items-center gap-0.5">
                                <Scale size={10} />
                                {(product.weight_grams / 1000).toFixed(1)}kg
                            </span>
                        )}
                        <span className="flex items-center gap-0.5">
                            <Clock size={10} />
                            {timeAgo(transaction.created_at)}
                        </span>
                    </div>
                </div>

                {/* Price + Status */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                    {transaction.price ? (
                        <p className="text-sm font-bold text-gray-900">Rp {transaction.price.toLocaleString()}</p>
                    ) : (
                        <p className="text-sm font-semibold text-purple-600">{type.label}</p>
                    )}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.color}`}>
                        {status.label}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function FilterPill({ label, active, onClick, count }) {
    return (
        <button
            onClick={onClick}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition whitespace-nowrap flex items-center gap-1.5
                ${active ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
        >
            {label}
            {count > 0 && (
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold
                    ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}

export default function Index({ transactions }) {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all'
        ? transactions
        : transactions.filter(t => t.status === filter);

    const counts = {
        all: transactions.length,
        pending: transactions.filter(t => t.status === 'pending').length,
        confirmed: transactions.filter(t => t.status === 'confirmed').length,
        completed: transactions.filter(t => t.status === 'completed').length,
        cancelled: transactions.filter(t => t.status === 'cancelled').length,
    };

    return (
        <AppLayout>
            <Head title="Riwayat Transaksi" />
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Riwayat transaksi</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{transactions.length} transaksi total</p>
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 flex-wrap mb-5">
                    <FilterPill label="Semua" active={filter === 'all'} onClick={() => setFilter('all')} count={counts.all} />
                    <FilterPill label="Menunggu" active={filter === 'pending'} onClick={() => setFilter('pending')} count={counts.pending} />
                    <FilterPill label="Dikonfirmasi" active={filter === 'confirmed'} onClick={() => setFilter('confirmed')} count={counts.confirmed} />
                    <FilterPill label="Selesai" active={filter === 'completed'} onClick={() => setFilter('completed')} count={counts.completed} />
                    <FilterPill label="Dibatalkan" active={filter === 'cancelled'} onClick={() => setFilter('cancelled')} count={counts.cancelled} />
                </div>

                {/* Transactions list */}
                {filtered.length > 0 ? (
                    <div className="space-y-3">
                        {filtered.map((t) => (
                            <TransactionCard key={t.id} transaction={t} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                        <Receipt size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-500 mb-1">
                            {filter === 'all' ? 'Belum ada transaksi' : `Tidak ada transaksi ${statusConfig[filter]?.label.toLowerCase()}`}
                        </p>
                        {filter !== 'all' && (
                            <button onClick={() => setFilter('all')} className="text-sm text-green-600 hover:underline mt-2">
                                Lihat semua transaksi
                            </button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}