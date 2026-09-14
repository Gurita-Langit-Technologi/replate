import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
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
    Star,
    Camera,
    MessageSquare,
    Phone,
    AlertTriangle,
    AlertCircle,
    Ticket,
    FileText,
    CheckCircle2,
    Printer,
    QrCode,
    Building2,
    ShieldCheck,
    Leaf,
    Coins,
    Receipt,
} from 'lucide-react';

const statusConfig = {
    pending:         { label: 'Menunggu konfirmasi',             color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-200',  dot: 'bg-amber-400'  },
    confirmed:       { label: 'Dikonfirmasi',                    color: 'text-blue-700',   bg: 'bg-blue-50   border-blue-200',   dot: 'bg-blue-400'   },
    completed:       { label: 'Selesai',                         color: 'text-green-700',  bg: 'bg-green-50  border-green-200',  dot: 'bg-green-500'  },
    cancelled:       { label: 'Dibatalkan',                      color: 'text-red-700',    bg: 'bg-red-50    border-red-200',    dot: 'bg-red-400'    },
    dispute_spoiled: { label: 'Dispute — Makanan Basi/Rusak',    color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-400' },
};

const typeConfig = {
    sale:             { label: 'Jual beli',      icon: ShoppingBasket, color: 'text-green-700  bg-green-50'  },
    barter:           { label: 'Barter',          icon: ArrowLeftRight, color: 'text-violet-700 bg-violet-50' },
    donation:         { label: 'Donasi',          icon: Heart,          color: 'text-sky-700    bg-sky-50'    },
    partner_transfer: { label: 'Alih ke partner', icon: Handshake,      color: 'text-amber-700  bg-amber-50'  },
};

const steps = ['pending', 'confirmed', 'completed'];

function StatusTracker({ currentStatus }) {
    const isCancelled = currentStatus === 'cancelled';
    const isDispute = currentStatus === 'dispute_spoiled';
    const currentIdx = steps.indexOf(currentStatus);

    const stepLabels = {
        pending: 'Menunggu',
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

    if (isDispute) {
        return (
            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <AlertTriangle size={18} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-orange-700">Sedang dalam dispute</p>
                    <p className="text-xs text-orange-500 mt-0.5">Produk dialihkan ke mitra pengolah dan admin sedang meninjau laporan.</p>
                </div>
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
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition
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

function DisputeModal({ transactionId, onClose }) {
    const [loading, setLoading] = useState(false);

    const handleDispute = () => {
        setLoading(true);
        router.patch(`/transactions/${transactionId}/dispute`, {}, {
            onFinish: () => {
                setLoading(false);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4 text-orange-600">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 text-center mb-1">
                    Lapor Makanan Basi/Rusak?
                </h2>
                <p className="text-sm text-gray-500 text-center mb-5">
                    Tindakan ini akan mengalihkan produk ke mitra pengolah dan membuat laporan dispute untuk ditinjau admin.
                </p>
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl mb-5">
                    <p className="text-xs text-orange-700 text-center font-medium flex items-center justify-center gap-1.5">
                        <AlertCircle size={14} /> Produk akan otomatis dialihkan ke Mitra Alih Fungsi
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Kembali
                    </button>
                    <button
                        onClick={handleDispute}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        )}
                        {loading ? 'Mengirim...' : 'Ya, Lapor Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ReviewModal({ transactionId, onClose }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post(`/transactions/${transactionId}/review`, { rating, comment }, {
            onFinish: () => {
                setLoading(false);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Beri Ulasan</h2>
                <p className="text-sm text-gray-500 text-center mb-4">Bagaimana pengalaman transaksi Anda?</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`p-1 transition ${star <= rating ? 'text-amber-400 scale-110' : 'text-gray-300'}`}
                            >
                                <Star size={24} className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tulis ulasan Anda (opsional)..."
                        className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                        rows={3}
                    />
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? 'Mengirim...' : 'Kirim Ulasan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ProofUploadModal({ transactionId, onClose }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('proof_photo', file);
        router.post(`/transactions/${transactionId}/proof-photo`, formData, {
            onFinish: () => {
                setLoading(false);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Unggah Bukti Transaksi</h2>
                <p className="text-sm text-gray-500 text-center mb-4">Unggah foto penyerahan barang / bukti penerimaan.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full p-2 border border-gray-200 rounded-xl text-xs mb-4"
                        required
                    />
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Mengunggah...' : 'Unggah Foto'}
                        </button>
                    </div>
                </form>
            </div>
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

export default function Show({ transaction, isBuyer, isSeller, hasReviewed }) {
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        confirmText: 'Ya, Lanjutkan',
        cancelText: 'Batal',
        variant: 'primary',
        onConfirm: () => {},
    });

    const status = statusConfig[transaction.status] ?? statusConfig.pending;
    const type = typeConfig[transaction.type] || typeConfig.sale;
    const TypeIcon = type.icon;
    const product = transaction.product;

    const isTerminalStatus = ['completed', 'cancelled', 'dispute_spoiled'].includes(transaction.status);

    return (
        <AppLayout>
            <Head title={`Transaksi #${transaction.id}`} />

            <ConfirmModal
                show={confirmModal.show}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                variant={confirmModal.variant}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
            />

            {showDisputeModal && (
                <DisputeModal
                    transactionId={transaction.id}
                    onClose={() => setShowDisputeModal(false)}
                />
            )}

            {showReviewModal && (
                <ReviewModal
                    transactionId={transaction.id}
                    onClose={() => setShowReviewModal(false)}
                />
            )}

            {showProofModal && (
                <ProofUploadModal
                    transactionId={transaction.id}
                    onClose={() => setShowProofModal(false)}
                />
            )}

            <div className="max-w-2xl mx-auto print:hidden">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/transactions" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={16} />
                        Riwayat transaksi
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-2xs transition active:scale-95"
                    >
                        <Printer size={15} className="text-emerald-600" />
                        Cetak Invoice / Bukti
                    </button>
                </div>

                {/* Header */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
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
                        <span className={`text-[11px] font-medium px-3 py-1 rounded-full border ${status.bg} ${status.color}`}>
                            {status.label}
                        </span>
                    </div>

                    <StatusTracker currentStatus={transaction.status} />
                </div>

                {/* Drop-Off Ticket Card for Dispute */}
                {transaction.status === 'dispute_spoiled' && (
                    <div className="bg-amber-50/70 rounded-2xl border border-amber-300 p-5 mb-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <Ticket size={20} className="text-orange-700" />
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Tiket Drop-Off BUMDes Resmi</h3>
                                    <p className="text-[11px] text-gray-500">Gunakan tiket ini untuk verifikasi di Pos Drop-Off Desa</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-orange-100 text-orange-800 font-mono font-bold text-xs rounded-lg border border-orange-200">
                                DROP-TX{transaction.id}
                            </span>
                        </div>

                        <div className="bg-white rounded-xl p-3.5 border border-orange-100 mb-3 space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                                <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-800">Lokasi Pos Pengumpulan Terpusat:</p>
                                    <p className="text-gray-600 font-medium">Pos Drop-Off BUMDes Desa {product.desa || 'Sumbermulyo'}, Jl. Desa No. 1</p>
                                    <p className="text-[11px] text-gray-400">Jam Operasional: 08.00 - 16.00 WIB (Diangkut Mitra Pukul 17.00 WIB)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-3 border border-orange-100 text-[11px] text-gray-600 space-y-1.5">
                            <p className="font-bold text-orange-900 flex items-center gap-1.5">
                                <FileText size={13} /> SOP Pengantaran Sisa Makanan Basi ke Pos:
                            </p>
                            <p>1. Wajib dikemas dalam <strong>kantong / wadah tertutup rapat</strong> agar tidak menimbulkan bau.</p>
                            <p>2. Hanya menerima <strong>sisa organik/pangan</strong> (dilarang mencampur plastik, tusuk sate, atau sampah anorganik).</p>
                            <p>3. Tunjukkan kode <strong>DROP-TX{transaction.id}</strong> kepada Petugas BUMDes untuk pencatatan timbangan.</p>
                        </div>
                    </div>
                )}

                {/* Produk */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Produk</p>
                    <Link href={`/products/${product.id}`} className="flex items-center gap-4 group">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.photo ? (
                                <img
                                    src={`/storage/${product.photo}`}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Package size={24} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-gray-900 truncate group-hover:text-green-600 transition">
                                {product.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {product.category} · {product.condition}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-900">
                                    <Scale size={13} className="text-gray-400" />
                                    {transaction.quantity ? `${transaction.quantity} ${product.unit || 'unit'}` : '1 unit'}
                                    {product.weight_grams ? ` (~${((product.weight_grams * (transaction.quantity || 1)) / 1000).toFixed(1)} kg)` : ''}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            {transaction.price ? (
                                <div>
                                    <p className="text-base font-bold text-gray-900">
                                        Rp {(transaction.price * (transaction.quantity || 1)).toLocaleString('id-ID')}
                                    </p>
                                    {(transaction.quantity || 1) > 1 && (
                                        <p className="text-[10px] text-gray-400">
                                            Rp {Number(transaction.price).toLocaleString('id-ID')} / {product.unit || 'satuan'}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <span className="text-sm font-semibold text-sky-600">Gratis (Donasi)</span>
                            )}
                        </div>
                    </Link>

                    {transaction.barter_notes && (
                        <div className="mt-3 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                            <p className="text-xs text-violet-500 mb-0.5 font-medium">Catatan barter</p>
                            <p className="text-sm text-violet-700">{transaction.barter_notes}</p>
                        </div>
                    )}
                </div>

                {/* Bukti Foto Serah Terima */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Bukti Foto Serah Terima</p>
                        {isSeller && !transaction.proof_photo && !isTerminalStatus && (
                            <button
                                onClick={() => setShowProofModal(true)}
                                className="text-xs font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                                <Camera size={13} /> Unggah Foto
                            </button>
                        )}
                    </div>
                    {transaction.proof_photo ? (
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-100">
                            <img
                                src={`/storage/${transaction.proof_photo}`}
                                alt="Bukti serah terima"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                            <Camera size={24} className="mx-auto text-gray-300 mb-1" />
                            <p className="text-xs text-gray-400">Belum ada foto bukti serah terima.</p>
                        </div>
                    )}
                </div>

                {/* Ulasan & Rating */}
                {(isTerminalStatus || hasReviewed) && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Ulasan & Rating</p>
                            {isBuyer && !hasReviewed && transaction.status === 'completed' && (
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="text-xs font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
                                >
                                    <Star size={13} /> Beri Ulasan
                                </button>
                            )}
                        </div>
                        {transaction.reviews && transaction.reviews.length > 0 ? (
                            <div className="space-y-3">
                                {transaction.reviews.map((rev) => (
                                    <div key={rev.id} className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-800">{rev.user?.name}</span>
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i < rev.rating ? 'fill-amber-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {rev.comment && <p className="text-gray-600 mt-1">{rev.comment}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Belum ada ulasan untuk transaksi ini.</p>
                        )}
                    </div>
                )}

                {/* Pihak Terlibat */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Pihak terlibat</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className={`p-4 rounded-xl ${isSeller ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <User size={14} className="text-gray-400" />
                                <p className="text-xs text-gray-400">Penjual / Pendonor</p>
                                {isSeller && <span className="text-[10px] px-1.5 py-0.5 bg-green-200 text-green-700 rounded font-medium">Anda</span>}
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{transaction.seller?.name}</p>
                            {transaction.seller?.desa && (
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                    <MapPin size={11} className="text-gray-400" /> Desa {transaction.seller.desa}
                                </p>
                            )}
                            {!isSeller && (
                                <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex flex-wrap gap-2">
                                    <Link
                                        href={`/chat/${transaction.seller?.id}/${product.id}`}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 hover:border-green-300 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition"
                                    >
                                        <MessageSquare size={13} className="text-green-600" />
                                        Chat In-App
                                    </Link>
                                    {transaction.seller?.whatsapp_number && (
                                        <a
                                            href={`https://wa.me/${transaction.seller.whatsapp_number.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo kak ${transaction.seller.name}, saya pembeli produk "${product.title}" di Replate (Transaksi #${transaction.id}). Mau konfirmasi penjemputan barang ya kak.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
                                        >
                                            <Phone size={13} />
                                            WhatsApp
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={`p-4 rounded-xl ${isBuyer ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <User size={14} className="text-gray-400" />
                                <p className="text-xs text-gray-400">Pembeli / Penerima</p>
                                {isBuyer && <span className="text-[10px] px-1.5 py-0.5 bg-green-200 text-green-700 rounded font-medium">Anda</span>}
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{transaction.buyer?.name}</p>
                            {transaction.buyer?.desa && (
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                    <MapPin size={11} className="text-gray-400" /> Desa {transaction.buyer.desa}
                                </p>
                            )}
                            {!isBuyer && (
                                <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex flex-wrap gap-2">
                                    <Link
                                        href={`/chat/${transaction.buyer?.id}/${product.id}`}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 hover:border-green-300 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition"
                                    >
                                        <MessageSquare size={13} className="text-green-600" />
                                        Chat In-App
                                    </Link>
                                    {transaction.buyer?.whatsapp_number && (
                                        <a
                                            href={`https://wa.me/${transaction.buyer.whatsapp_number.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo kak ${transaction.buyer.name}, saya penjual produk "${product.title}" di Replate (Transaksi #${transaction.id}). Mengenai pesanan kakak, silakan info jika ingin konfirmasi pengambilan ya kak.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
                                        >
                                            <Phone size={13} />
                                            WhatsApp
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {hasReviewed ? (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                            <CheckCircle2 size={13} /> Anda telah memberikan ulasan untuk transaksi ini.
                        </p>
                    ) : isBuyer ? (
                        <p className="text-xs text-gray-400 mt-2">Beri bintang dan feedback untuk penjual guna membangun reputasi desa.</p>
                    ) : null}
                </div>

                {/* Actions */}
                {!isTerminalStatus && (
                    <div className="space-y-3">
                        {/* Donasi Pending -> Donor bisa Setuju / Tolak */}
                        {isSeller && (transaction.type === 'donation' || transaction.type?.value === 'donation') && transaction.status === 'pending' && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setConfirmModal({
                                            show: true,
                                            title: 'Setujui Klaim Donasi',
                                            message: `Apakah Anda ingin menyetujui klaim donasi dari ${transaction.buyer?.name}?`,
                                            confirmText: 'Ya, Setujui',
                                            variant: 'success',
                                            onConfirm: () => router.patch(`/transactions/${transaction.id}/accept-donation`),
                                        });
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
                                >
                                    <Check size={18} />
                                    Setujui Klaim Donasi
                                </button>
                                <button
                                    onClick={() => {
                                        setConfirmModal({
                                            show: true,
                                            title: 'Tolak Klaim Donasi',
                                            message: `Apakah Anda yakin ingin menolak klaim donasi ini? Produk akan kembali tayang di marketplace.`,
                                            confirmText: 'Tolak Klaim',
                                            variant: 'danger',
                                            onConfirm: () => router.patch(`/transactions/${transaction.id}/reject-donation`),
                                        });
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition"
                                >
                                    <X size={18} />
                                    Tolak Klaim
                                </button>
                            </div>
                        )}

                        {/* Standard Confirm (Sale/Barter Pending) */}
                        {isSeller && transaction.type !== 'donation' && transaction.type?.value !== 'donation' && transaction.status === 'pending' && (
                            <button
                                onClick={() => {
                                    setConfirmModal({
                                        show: true,
                                        title: 'Konfirmasi Pesanan',
                                        message: `Konfirmasi pesanan dari ${transaction.buyer?.name}? Silakan siapkan produk untuk serah terima.`,
                                        confirmText: 'Konfirmasi Pesanan',
                                        variant: 'success',
                                        onConfirm: () => router.patch(`/transactions/${transaction.id}/confirm`),
                                    });
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
                            >
                                <Check size={18} />
                                Konfirmasi pesanan
                            </button>
                        )}

                        {isBuyer && transaction.status === 'confirmed' && (
                            <>
                                <button
                                    onClick={() => {
                                        setConfirmModal({
                                            show: true,
                                            title: 'Konfirmasi Barang Diterima',
                                            message: 'Apakah Anda telah menerima produk dalam kondisi baik dan sesuai?',
                                            confirmText: 'Selesai & Diterima',
                                            variant: 'success',
                                            onConfirm: () => router.patch(`/transactions/${transaction.id}/complete`),
                                        });
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
                                >
                                    <Check size={18} />
                                    Konfirmasi barang diterima
                                </button>

                                <button
                                    onClick={() => setShowDisputeModal(true)}
                                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-xl transition"
                                >
                                    <AlertTriangle size={15} />
                                    Lapor makanan basi / rusak
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => {
                                setConfirmModal({
                                    show: true,
                                    title: 'Batalkan Transaksi',
                                    message: 'Apakah Anda yakin ingin membatalkan transaksi ini?',
                                    confirmText: 'Batalkan Transaksi',
                                    variant: 'danger',
                                    onConfirm: () => router.patch(`/transactions/${transaction.id}/cancel`),
                                });
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                        >
                            <X size={16} />
                            Batalkan transaksi
                        </button>
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* OFFICIAL MARKETPLACE PRINT INVOICE / BUKTI TRANSAKSI RESMI (PRINT ONLY)   */}
            {/* ========================================================================= */}
            <div className="hidden print:block max-w-4xl mx-auto p-8 bg-white text-gray-900 font-sans">
                {/* Header Kop Resmi Marketplace */}
                <div className="flex items-start justify-between pb-6 border-b-2 border-gray-900">
                    <div className="flex items-center gap-3.5">
                        <img src="/image/logo(2).png" alt="Replate" className="w-auto h-12 rounded-lg object-contain" />
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-emerald-900 uppercase">REPLATE INDONESIA</h1>
                            <p className="text-xs font-semibold text-gray-600">Platform Marketplace & Hub Sirkular Pangan Desa</p>
                            <p className="text-[11px] text-gray-400">Pemberdayaan BUMDes, Rumah Tangga & Komunitas Nol Sampah Makanan</p>
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        <span className="inline-block text-xs font-extrabold uppercase px-3 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                            BUKTI TRANSAKSI RESMI
                        </span>
                        <p className="text-xs font-bold text-gray-800 font-mono mt-1">
                            INV/RPL/{new Date(transaction.created_at || Date.now()).getFullYear()}/{String(transaction.id).padStart(6, '0')}
                        </p>
                        <p className="text-[11px] text-gray-500">
                            Waktu: {new Date(transaction.created_at || Date.now()).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>

                {/* Status Banner */}
                <div className="my-5 p-3.5 bg-gray-50 border border-gray-300 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700 uppercase tracking-wide">Status Transaksi:</span>
                        <span className="font-extrabold px-2.5 py-0.5 rounded bg-emerald-600 text-white uppercase text-[11px]">
                            {status.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-500">Metode Transaksi:</span>
                        <span className="font-bold text-gray-900 capitalize">{type.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-500">Kode Unik:</span>
                        <span className="font-mono font-bold text-gray-900">TX-{transaction.id}</span>
                    </div>
                </div>

                {/* 2-Column Info: Penjual & Pembeli */}
                <div className="grid grid-cols-2 gap-6 my-6 text-xs">
                    {/* Data Penjual */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 uppercase tracking-wider text-[11px] pb-1 border-b border-gray-200">
                            <Building2 size={13} className="text-emerald-700" />
                            Informasi Penjual / Penyedia Pangan
                        </div>
                        <p className="text-sm font-bold text-gray-900 pt-1">{transaction.seller?.name || 'Warga Penyedia'}</p>
                        <p className="text-gray-600"><strong>Wilayah:</strong> Desa {transaction.seller?.desa || product.desa || '-'}, Kec. {transaction.seller?.kecamatan || product.kecamatan || '-'}</p>
                        <p className="text-gray-600"><strong>Kontak / WA:</strong> {transaction.seller?.whatsapp_number || '-'}</p>
                        <p className="text-gray-600"><strong>Alamat Penjemputan:</strong> {product.pickup_address || transaction.seller?.address || 'Alamat Terdaftar di Profil'}</p>
                        {product.pickup_notes && (
                            <p className="text-gray-500 italic text-[11px]"><strong>Catatan Lokasi:</strong> {product.pickup_notes}</p>
                        )}
                    </div>

                    {/* Data Pembeli */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 uppercase tracking-wider text-[11px] pb-1 border-b border-gray-200">
                            <User size={13} className="text-emerald-700" />
                            Informasi Pembeli / Penerima Manfaat
                        </div>
                        <p className="text-sm font-bold text-gray-900 pt-1">{transaction.buyer?.name || 'Warga Penerima'}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {transaction.buyer?.email || '-'}</p>
                        <p className="text-gray-600"><strong>Wilayah:</strong> Desa {transaction.buyer?.desa || '-'}, Kec. {transaction.buyer?.kecamatan || '-'}</p>
                        <p className="text-gray-600"><strong>Kontak / WA:</strong> {transaction.buyer?.whatsapp_number || '-'}</p>
                        <p className="text-gray-600"><strong>Tipe Serah Terima:</strong> Diambil Langsung / Sesuai Kesepakatan</p>
                    </div>
                </div>

                {/* Tabel Itemized Produk */}
                <div className="my-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Rincian Barang yang Ditransaksikan</h2>
                    <table className="w-full border-collapse border border-gray-300 text-xs">
                        <thead>
                            <tr className="bg-gray-100 text-gray-800 uppercase font-bold text-[10px] tracking-wider">
                                <th className="border border-gray-300 p-2.5 text-center w-10">No</th>
                                <th className="border border-gray-300 p-2.5 text-left">Nama Produk Makanan</th>
                                <th className="border border-gray-300 p-2.5 text-left">Kategori & Kondisi</th>
                                <th className="border border-gray-300 p-2.5 text-center">Kuantitas</th>
                                <th className="border border-gray-300 p-2.5 text-center">Estimasi Berat</th>
                                <th className="border border-gray-300 p-2.5 text-right">Harga Satuan</th>
                                <th className="border border-gray-300 p-2.5 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-3 text-center font-bold">1</td>
                                <td className="border border-gray-300 p-3">
                                    <p className="font-bold text-gray-900">{product.title}</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">{product.description ? (product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description) : '-'}</p>
                                </td>
                                <td className="border border-gray-300 p-3">
                                    <span className="capitalize">{product.category || 'Mentah'}</span> · <span className="capitalize">{product.condition?.replace(/_/g, ' ') || 'Layak'}</span>
                                </td>
                                <td className="border border-gray-300 p-3 text-center font-bold">
                                    {transaction.quantity || 1} {product.unit || 'unit'}
                                </td>
                                <td className="border border-gray-300 p-3 text-center font-medium">
                                    {product.weight_grams ? `${((product.weight_grams * (transaction.quantity || 1)) / 1000).toFixed(1)} kg` : '1.0 kg'}
                                </td>
                                <td className="border border-gray-300 p-3 text-right font-medium">
                                    {transaction.price ? `Rp ${Number(transaction.price).toLocaleString('id-ID')}` : 'Gratis'}
                                </td>
                                <td className="border border-gray-300 p-3 text-right font-bold text-emerald-900">
                                    {transaction.price ? `Rp ${(transaction.price * (transaction.quantity || 1)).toLocaleString('id-ID')}` : 'Rp 0 (Donasi)'}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50 font-bold">
                                <td colSpan="6" className="border border-gray-300 p-2.5 text-right uppercase text-[11px]">Subtotal Pembayaran:</td>
                                <td className="border border-gray-300 p-2.5 text-right text-emerald-900 text-xs">
                                    {transaction.price ? `Rp ${(transaction.price * (transaction.quantity || 1)).toLocaleString('id-ID')}` : 'Rp 0'}
                                </td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td colSpan="6" className="border border-gray-300 p-2 text-right text-[11px] text-gray-600">Biaya Fasilitasi Platform BUMDes:</td>
                                <td className="border border-gray-300 p-2 text-right text-green-700 text-xs font-semibold">Rp 0 (Subsidi Desa)</td>
                            </tr>
                            <tr className="bg-emerald-50 text-emerald-950 font-extrabold text-sm">
                                <td colSpan="6" className="border border-gray-300 p-3 text-right uppercase">TOTAL AKHIR TRANSAKSI:</td>
                                <td className="border border-gray-300 p-3 text-right text-base text-emerald-800">
                                    {transaction.price ? `Rp ${(transaction.price * (transaction.quantity || 1)).toLocaleString('id-ID')}` : 'Rp 0 (Donasi Sosial)'}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Dampak Sirkularitas & RePoin */}
                <div className="grid grid-cols-3 gap-3 my-5 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                        <Leaf size={16} className="text-emerald-700 shrink-0" />
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-semibold">Pangan Diselamatkan</p>
                            <p className="font-extrabold text-emerald-900 text-sm">
                                {product.weight_grams ? `${((product.weight_grams * (transaction.quantity || 1)) / 1000).toFixed(1)} kg` : '1.0 kg'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 border-x border-emerald-200 px-3">
                        <ShieldCheck size={16} className="text-teal-700 shrink-0" />
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-semibold">Cegah Emisi CO2</p>
                            <p className="font-extrabold text-teal-900 text-sm">
                                ~{product.weight_grams ? (((product.weight_grams * (transaction.quantity || 1)) / 1000) * 2.5).toFixed(1) : '2.5'} kg CO2e
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pl-2">
                        <Coins size={16} className="text-amber-600 shrink-0" />
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-semibold">Apresiasi RePoin</p>
                            <p className="font-extrabold text-amber-900 text-sm">
                                +{product.weight_grams ? Math.max(1, Math.round(((product.weight_grams * (transaction.quantity || 1)) / 1000) * (product.condition === 'layak_konsumsi' ? 3 : 2))) : 3} RePoin
                            </p>
                        </div>
                    </div>
                </div>

                {/* Catatan & Ketentuan */}
                <div className="my-5 p-3.5 border border-gray-200 rounded-xl text-[11px] text-gray-600 space-y-1 bg-gray-50/30">
                    <p className="font-bold text-gray-800 uppercase tracking-wide text-[10px]">Ketentuan & Kebijakan Transaksi Sirkular:</p>
                    <p>1. Transaksi ini tercatat resmi dalam sistem audit sirkularitas pangan desa Replate terintegrasi BUMDes.</p>
                    <p>2. Makanan yang telah diterima dianjurkan segera dikonsumsi atau diolah sesuai standar higienitas dapur.</p>
                    <p>3. Apabila terjadi kendala kualitas (makanan basi), pengguna dapat memanfaatkan fasilitas tiket pos pengalihan mitra pengolah.</p>
                </div>

                {/* Tanda Tangan & QR Verification */}
                <div className="pt-6 border-t-2 border-dashed border-gray-300 grid grid-cols-3 text-center text-xs text-gray-700">
                    <div>
                        <p className="font-medium text-gray-500">Pihak Penjual / Penyedia,</p>
                        <div className="h-16 flex items-center justify-center">
                            <span className="text-[10px] font-mono text-gray-400">[Tanda Tangan Digital]</span>
                        </div>
                        <p className="font-bold text-gray-900 underline">{transaction.seller?.name || 'Penjual'}</p>
                        <p className="text-[10px] text-gray-400">ID: W-{transaction.seller?.id || '01'}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border border-gray-400 rounded-lg flex flex-col items-center justify-center p-1 bg-white shadow-2xs mb-1">
                            <QrCode size={36} className="text-gray-900" />
                            <span className="text-[8px] font-mono font-bold mt-0.5">RPL-VERIFIED</span>
                        </div>
                        <p className="text-[9px] text-gray-500 font-mono">SEAL-TX-{transaction.id}</p>
                    </div>

                    <div>
                        <p className="font-medium text-gray-500">Pihak Pembeli / Penerima,</p>
                        <div className="h-16 flex items-center justify-center">
                            <span className="text-[10px] font-mono text-gray-400">[Tanda Tangan Digital]</span>
                        </div>
                        <p className="font-bold text-gray-900 underline">{transaction.buyer?.name || 'Pembeli'}</p>
                        <p className="text-[10px] text-gray-400">ID: W-{transaction.buyer?.id || '02'}</p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-gray-400">
                    Dokumen ini dicetak otomatis dari Replate Platform (Sistem Sirkular Pangan Desa Terintegrasi). Sah tanpa tanda tangan basah.
                </div>
            </div>
        </AppLayout>
    );
}