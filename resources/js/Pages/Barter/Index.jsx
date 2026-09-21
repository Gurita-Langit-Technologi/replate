import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Check,
    X,
    Package,
} from 'lucide-react';

const statusConfig = {
    pending: { label: 'Menunggu', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    accepted: { label: 'Disetujui', color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-400' },
    rejected: { label: 'Ditolak', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
    cancelled: { label: 'Dibatalkan', color: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
};

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}j lalu`;
    return `${Math.floor(seconds / 86400)}h lalu`;
}

function IncomingCard({ offer, onAccept, onReject }) {
    const status = statusConfig[offer.status];
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm flex-shrink-0">
                        {offer.offerer?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{offer.offerer?.name}</p>
                        <p className="text-xs text-gray-400">{timeAgo(offer.created_at)}</p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                </span>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-lg mb-3">
                <p className="text-xs text-purple-500 font-medium mb-0.5">Untuk produk Anda:</p>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{offer.product?.title}</p>
                    <span className="text-xs font-semibold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-lg border border-purple-200">
                        Minta: {offer.quantity || 1} {offer.product?.unit || 'satuan'}
                    </span>
                </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg mb-3">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Tawaran barter:</p>
                <p className="text-sm text-gray-800">{offer.offer_description}</p>
            </div>
            {offer.offer_photo && (
                <img
                    src={`/storage/${offer.offer_photo}`}
                    alt="Foto tawaran"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/image/image default.jpg';
                    }}
                    className="w-full h-40 object-cover rounded-xl mb-3 border border-gray-200"
                />
            )}
            {offer.status === 'pending' && (
                <div className="flex gap-2">
                    <button onClick={() => onAccept(offer)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition">
                        <Check size={16} /> Setujui ({offer.quantity || 1} {offer.product?.unit || 'satuan'})
                    </button>
                    <button onClick={() => onReject(offer)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition">
                        <X size={16} /> Tolak
                    </button>
                </div>
            )}
        </div>
    );
}

function OutgoingCard({ offer }) {
    const status = statusConfig[offer.status];
    return (
        <div className={`bg-white rounded-xl border p-4 ${offer.status === 'rejected' ? 'bg-gray-50/50 border-gray-200' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} />
                    <p className="text-xs text-gray-500">{timeAgo(offer.created_at)}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${status.color}`}>{status.label}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <Package size={14} className="text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-600 truncate">Untuk: <Link href={`/products/${offer.product?.id}`} className="font-semibold text-gray-900 hover:text-green-600">{offer.product?.title}</Link> <span className="text-gray-500">milik {offer.product?.user?.name}</span></p>
                </div>
                <span className="text-xs font-semibold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-lg border border-purple-200 flex-shrink-0 ml-2">
                    {offer.quantity || 1} {offer.product?.unit || 'satuan'}
                </span>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                <p className="text-xs text-purple-700 mb-1 font-semibold">Tawaran Anda:</p>
                <p className="text-sm text-purple-900">{offer.offer_description}</p>
            </div>
            {offer.offer_photo && (
                <img
                    src={`/storage/${offer.offer_photo}`}
                    alt="Foto tawaran"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/image/image default.jpg';
                    }}
                    className="w-full h-32 object-cover rounded-xl mt-3 border border-gray-200"
                />
            )}
        </div>
    );
}

export default function Index({ incoming, outgoing }) {
    const [tab, setTab] = useState('incoming');
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        confirmText: 'Ya, Lanjutkan',
        variant: 'primary',
        onConfirm: () => {},
    });

    const pendingCount = incoming.filter(o => o.status === 'pending').length;

    function handleAccept(offer) {
        setConfirmModal({
            show: true,
            title: 'Setujui Tawaran Barter',
            message: `Setujui tawaran barter dari ${offer.offerer?.name}? Transaksi barter akan dibuat.`,
            confirmText: 'Setujui Barter',
            variant: 'success',
            onConfirm: () => router.patch(`/barter/${offer.id}/accept`),
        });
    }

    function handleReject(offer) {
        setConfirmModal({
            show: true,
            title: 'Tolak Tawaran Barter',
            message: `Tolak tawaran barter dari ${offer.offerer?.name}?`,
            confirmText: 'Tolak Tawaran',
            variant: 'danger',
            onConfirm: () => router.patch(`/barter/${offer.id}/reject`),
        });
    }

    return (
        <AppLayout>
            <Head title="Tawaran Barter" />

            <ConfirmModal
                show={confirmModal.show}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
            />

            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Tawaran barter</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{incoming.length} masuk · {outgoing.length} terkirim</p>
                </div>

                <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
                    <button onClick={() => setTab('incoming')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition ${tab === 'incoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <ArrowDownLeft size={16} /> Masuk
                        {pendingCount > 0 && <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{pendingCount}</span>}
                    </button>
                    <button onClick={() => setTab('outgoing')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition ${tab === 'outgoing' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <ArrowUpRight size={16} /> Terkirim
                    </button>
                </div>

                {tab === 'incoming' && (
                    incoming.length > 0 ? (
                        <div className="space-y-4">{incoming.map(o => <IncomingCard key={o.id} offer={o} onAccept={handleAccept} onReject={handleReject} />)}</div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                            <ArrowDownLeft size={40} className="mx-auto text-gray-200 mb-3" />
                            <p className="text-gray-500 mb-1">Belum ada tawaran masuk</p>
                            <p className="text-sm text-gray-400">Tawaran barter untuk produk Anda akan muncul di sini</p>
                        </div>
                    )
                )}

                {tab === 'outgoing' && (
                    outgoing.length > 0 ? (
                        <div className="space-y-4">{outgoing.map(o => <OutgoingCard key={o.id} offer={o} />)}</div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                            <ArrowUpRight size={40} className="mx-auto text-gray-200 mb-3" />
                            <p className="text-gray-500 mb-1">Belum ada tawaran terkirim</p>
                            <p className="text-sm text-gray-400 mb-4">Temukan produk yang menerima barter di marketplace</p>
                            <Link href="/marketplace" className="text-sm text-green-600 hover:underline">Buka marketplace →</Link>
                        </div>
                    )
                )}
            </div>
        </AppLayout>
    );
}