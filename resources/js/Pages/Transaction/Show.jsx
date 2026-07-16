import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Package,
    User,
    Clock,
    Check,
    X,
    ArrowLeftRight,
    ShoppingBasket,
    Heart,
    Handshake,
    Scale,
    MapPin,
} from 'lucide-react';

const statusConfig = {
    pending: { label: 'Menunggu konfirmasi', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
    confirmed: { label: 'Dikonfirmasi', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-400' },
    completed: { label: 'Selesai', color: 'text-green-600', bg: 'bg-green-50 border-green-200', dot: 'bg-green-400' },
    cancelled: { label: 'Dibatalkan', color: 'text-red-600', bg: 'bg-red-50 border-red-200', dot: 'bg-red-400' },
};

const typeConfig = {
    sale: { label: 'Jual beli', icon: ShoppingBasket, color: 'text-green-600 bg-green-50' },
    barter: { label: 'Barter', icon: ArrowLeftRight, color: 'text-purple-600 bg-purple-50' },
    donation: { label: 'Donasi', icon: Heart, color: 'text-blue-600 bg-blue-50' },
    partner_transfer: { label: 'Alih ke partner', icon: Handshake, color: 'text-amber-600 bg-amber-50' },
};

const steps = ['pending', 'confirmed', 'completed'];

function StatusTracker({ currentStatus }) {
    const isCancelled = currentStatus === 'cancelled';
    const currentIdx = steps.indexOf(currentStatus);

    const stepLabels = {
        pending: 'Pesanan dibuat',
        confirmed: 'Dikonfirmasi',
        completed: 'Selesai',
    };

    if (isCancelled) {
        return (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <X size={16} className="text-red-500" />
                </div>
                <p className="text-sm font-medium text-red-700">Transaksi dibatalkan</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
                const isDone = idx <= currentIdx;
                const isActive = idx === currentIdx;
                return (
                    <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition
                                ${isDone ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}
                                ${isActive ? 'ring-4 ring-green-100' : ''}`}
                            >
                                {isDone && idx < currentIdx ? <Check size={16} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                            </div>
                            <p className={`text-[11px] mt-1.5 font-medium ${isDone ? 'text-green-600' : 'text-gray-400'}`}>
                                {stepLabels[step]}
                            </p>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 mb-5 ${idx < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    return `${Math.floor(seconds / 86400)} hari lalu`;
}

export default function Show({ transaction, isBuyer, isSeller }) {
    const status = statusConfig[transaction.status];
    const type = typeConfig[transaction.type] || typeConfig.sale;
    const TypeIcon = type.icon;
    const product = transaction.product;

    return (
        <AppLayout>
            <Head title={`Transaksi #${transaction.id}`} />

            <div className="max-w-2xl mx-auto">
                <Link href="/transactions" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <ArrowLeft size={16} />
                    Riwayat transaksi
                </Link>

                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type.color}`}>
                                <TypeIcon size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Transaksi #{transaction.id}</p>
                                <p className="text-sm font-medium text-gray-900 capitalize">{type.label}</p>
                            </div>
                        </div>
                        <span className={`text-[11px] font-medium px-3 py-1 rounded-full border ${status.bg}`}>
                            {status.label}
                        </span>
                    </div>

                    <StatusTracker currentStatus={transaction.status} />
                </div>

                {/* Produk */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Produk</p>
                    <Link href={`/products/${product.id}`} className="flex items-center gap-4 group">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.photo ? (
                                <img src={`/storage/${product.photo}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Package size={24} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 group-hover:text-green-600 transition truncate">{product.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Scale size={12} /> {(product.weight_grams / 1000).toFixed(1)}kg</span>
                                {product.desa && <span className="flex items-center gap-1"><MapPin size={12} /> {product.desa}</span>}
                            </div>
                        </div>
                        {transaction.price ? (
                            <p className="text-lg font-bold text-green-600 flex-shrink-0">Rp {transaction.price.toLocaleString()}</p>
                        ) : (
                            <p className="text-sm font-semibold text-purple-600 flex-shrink-0">{type.label}</p>
                        )}
                    </Link>

                    {transaction.barter_notes && (
                        <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                            <p className="text-xs text-purple-500 mb-0.5 font-medium">Catatan barter</p>
                            <p className="text-sm text-purple-700">{transaction.barter_notes}</p>
                        </div>
                    )}
                </div>

                {/* Pihak */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Pihak terlibat</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`p-4 rounded-xl ${isSeller ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <User size={14} className="text-gray-400" />
                                <p className="text-xs text-gray-400">Penjual</p>
                                {isSeller && <span className="text-[10px] px-1.5 py-0.5 bg-green-200 text-green-700 rounded font-medium">Anda</span>}
                            </div>
                            <p className="text-sm font-medium text-gray-900">{transaction.seller?.name}</p>
                        </div>
                        <div className={`p-4 rounded-xl ${isBuyer ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <User size={14} className="text-gray-400" />
                                <p className="text-xs text-gray-400">Pembeli</p>
                                {isBuyer && <span className="text-[10px] px-1.5 py-0.5 bg-green-200 text-green-700 rounded font-medium">Anda</span>}
                            </div>
                            <p className="text-sm font-medium text-gray-900">{transaction.buyer?.name}</p>
                        </div>
                    </div>
                </div>

                {/* Waktu */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock size={12} />
                        Dibuat {timeAgo(transaction.created_at)} · {new Date(transaction.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                {/* Actions */}
                {transaction.status !== 'completed' && transaction.status !== 'cancelled' && (
                    <div className="space-y-3">
                        {isSeller && transaction.status === 'pending' && (
                            <button
                                onClick={() => router.patch(`/transactions/${transaction.id}/confirm`)}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
                            >
                                <Check size={18} />
                                Konfirmasi pesanan
                            </button>
                        )}

                        {isBuyer && transaction.status === 'confirmed' && (
                            <button
                                onClick={() => router.patch(`/transactions/${transaction.id}/complete`)}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
                            >
                                <Check size={18} />
                                Konfirmasi barang diterima
                            </button>
                        )}

                        <button
                            onClick={() => {
                                if (confirm('Yakin ingin membatalkan transaksi ini?')) {
                                    router.patch(`/transactions/${transaction.id}/cancel`);
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                        >
                            <X size={16} />
                            Batalkan transaksi
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}