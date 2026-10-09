import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    ArrowLeft,
    Clock,
    Check,
    X,
    ArrowLeftRight,
    ShoppingBasket,
    Heart,
    Handshake,
    Camera,
    Star,
    AlertTriangle,
    Ticket,
    FileText,
    Printer,
    MapPin,
} from 'lucide-react';
import StatusTracker from './Partials/StatusTracker';
import DisputeModal from './Partials/DisputeModal';
import ReviewModal from './Partials/ReviewModal';
import ProofUploadModal from './Partials/ProofUploadModal';
import CompleteModal from './Partials/CompleteModal';
import OfficialInvoicePrint from './Partials/OfficialInvoicePrint';
import TransactionProductCard from './Partials/TransactionProductCard';
import PartiesCard from './Partials/PartiesCard';

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

export default function Show({ transaction, isBuyer, isSeller, hasReviewed }) {
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
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

            {showCompleteModal && (
                <CompleteModal
                    transaction={transaction}
                    onClose={() => setShowCompleteModal(false)}
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

                {/* Header Info Status */}
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

                {/* Produk Card */}
                <TransactionProductCard product={product} transaction={transaction} />

                {/* Bukti Foto Serah Terima */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Bukti Foto Serah Terima</p>
                        {(isSeller || isBuyer) && !transaction.proof_photo && !isTerminalStatus && (
                            <button
                                onClick={() => setShowProofModal(true)}
                                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition"
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
                            <p className="text-xs text-gray-500 font-medium">Belum ada foto bukti serah terima.</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                {isBuyer
                                    ? 'Wajib melampirkan foto produk yang diterima saat menyelesaikan pesanan.'
                                    : 'Pembeli wajib menyertakan foto saat mengonfirmasi pesanan telah diterima.'}
                            </p>
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
                <PartiesCard
                    transaction={transaction}
                    product={product}
                    isBuyer={isBuyer}
                    isSeller={isSeller}
                    hasReviewed={hasReviewed}
                />

                {/* Actions Bar */}
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
                                    onClick={() => setShowCompleteModal(true)}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm active:scale-[0.99]"
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

            {/* Official Printable Invoice Component */}
            <OfficialInvoicePrint
                transaction={transaction}
                product={product}
                status={status}
                type={type}
            />
        </AppLayout>
    );
}