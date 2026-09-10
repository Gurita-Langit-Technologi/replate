import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import {
    Package,
    Leaf,
    Check,
    MapPin,
    Phone,
    User,
    Clock,
    Truck,
    ArrowRight,
    MessageCircle,
    Info,
    CheckCircle2,
    Navigation,
} from 'lucide-react';

export default function Dashboard({ pending, completed, totalWeight, pointHistory }) {
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    function handleConfirm(id, title) {
        setConfirmModal({
            show: true,
            title: 'Konfirmasi Pengambilan Produk',
            message: `Konfirmasi bahwa produk "${title}" telah berhasil dijemput/diterima oleh mitra?`,
            onConfirm: () => router.patch(`/partner/transactions/${id}/confirm`),
        });
    }

    return (
        <AppLayout>
            <Head title="Tugas Penjemputan - Partner" />

            <ConfirmModal
                show={confirmModal.show}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Konfirmasi Diterima"
                variant="success"
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
            />
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Panel Tugas Penjemputan Mitra</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Kelola alih fungsi produk pangan dan konfirmasi penjemputan dari warga desa.
                        </p>
                    </div>
                    <Link
                        href="/partner/history"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition shadow-sm"
                    >
                        <span>Lihat Riwayat Penerimaan</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <Package size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Menunggu Diambil</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{pending.length}</span>
                            <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                                Tugas Aktif
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                <Leaf size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Total Pangan Terselamatkan</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">{(totalWeight / 1000).toFixed(1)}</span>
                            <span className="text-sm text-gray-400 font-medium">kg</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Penerimaan Selesai</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{completed.length}</span>
                            <span className="text-xs text-gray-400 font-medium">transaksi</span>
                        </div>
                    </div>
                </div>

                {/* Pending Tasks Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Truck className="text-amber-500" size={20} />
                            <h2 className="text-base font-bold text-gray-900">Daftar Produk yang Perlu Diambil</h2>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                            {pending.length} Menunggu Penjemputan
                        </span>
                    </div>

                    {pending.length > 0 ? (
                        <div className="space-y-4">
                            {pending.map((t) => {
                                const product = t.product;
                                const seller = product?.user;
                                const pickupAddress = product?.pickup_address || seller?.address || 'Alamat tidak disertakan';
                                const sellerPhone = seller?.phone ? seller.phone.replace(/[^0-9]/g, '') : null;
                                const waUrl = sellerPhone
                                    ? `https://wa.me/${sellerPhone.startsWith('0') ? '62' + sellerPhone.slice(1) : sellerPhone}?text=${encodeURIComponent(`Halo ${seller?.name || ''}, saya mitra pengolah Replate ingin konfirmasi penjemputan produk "${product?.title}".`)}`
                                    : null;

                                return (
                                    <div
                                        key={t.id}
                                        className="border border-amber-200 bg-amber-50/30 rounded-2xl p-5 hover:border-amber-300 transition"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                            {/* Product Info & Photo */}
                                            <div className="flex items-start gap-4 flex-1">
                                                {product?.photo ? (
                                                    <img
                                                        src={`/storage/${product.photo}`}
                                                        alt={product.title}
                                                        className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                                                        <Package size={28} />
                                                    </div>
                                                )}

                                                <div className="space-y-1.5 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                                                            Alih Fungsi Mitra
                                                        </span>
                                                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium">
                                                            {product?.quantity} {product?.unit} {product?.weight_grams ? `(${product.weight_grams}g)` : ''}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                                                            product?.pickup_type === 'drop_point' || pickupAddress.includes('Pos Drop-Off')
                                                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                                                : product?.pickup_type === 'diantar'
                                                                ? 'bg-blue-50 text-blue-700'
                                                                : 'bg-emerald-50 text-emerald-700'
                                                        }`}>
                                                            {product?.pickup_type === 'drop_point' || pickupAddress.includes('Pos Drop-Off')
                                                                ? 'Ambil di Pos Drop-Off BUMDes'
                                                                : product?.pickup_type === 'diantar'
                                                                ? 'Diantar Penjual'
                                                                : 'Diambil ke Rumah Warga'}
                                                        </span>
                                                    </div>

                                                    <h3 className="font-bold text-gray-900 text-lg leading-snug">
                                                        {product?.title}
                                                    </h3>

                                                    {product?.description && (
                                                        <p className="text-xs text-gray-600 line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex lg:flex-col items-center justify-end gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handleConfirm(t.id, product?.title)}
                                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition shadow-sm"
                                                >
                                                    <Check size={18} />
                                                    Konfirmasi Diterima
                                                </button>
                                            </div>
                                        </div>

                                        {/* Details Grid (Pickup Address & Contact) */}
                                        <div className="mt-4 pt-4 border-t border-amber-200/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                            {/* Alamat Pengambilan */}
                                            <div className="bg-white/90 p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                                                <MapPin size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="font-semibold text-gray-800">Alamat Penjemputan:</p>
                                                        <a
                                                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${pickupAddress}, Desa ${product?.desa || ''}, Kec. ${product?.kecamatan || ''}`)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition"
                                                        >
                                                            <Navigation size={11} />
                                                            Petunjuk Arah Maps
                                                        </a>
                                                    </div>
                                                    <p className="text-gray-700 mt-1 font-medium">{pickupAddress}</p>
                                                    <p className="text-gray-400 text-[11px] mt-0.5">
                                                        Desa {product?.desa}, Kec. {product?.kecamatan}
                                                    </p>
                                                    {product?.pickup_notes && (
                                                        <div className="mt-1.5 p-1.5 bg-amber-50 rounded text-amber-900 text-[11px] border border-amber-200 flex items-start gap-1">
                                                            <Info size={13} className="text-amber-700 shrink-0 mt-0.5" />
                                                            <span><strong>Catatan:</strong> {product.pickup_notes}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Kontak Penjual */}
                                            <div className="bg-white/90 p-3.5 rounded-xl border border-amber-100 flex items-start gap-2.5">
                                                <User size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800">Penjual / Pemilik:</p>
                                                    <p className="text-gray-700 mt-0.5 font-medium">{seller?.name || 'Warga'}</p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        {(seller?.whatsapp_number || seller?.phone) ? (
                                                            <>
                                                                <a
                                                                    href={`tel:${seller?.whatsapp_number || seller?.phone}`}
                                                                    className="inline-flex items-center gap-1 text-gray-600 hover:text-green-600 font-medium bg-gray-50 px-2 py-0.5 rounded border border-gray-200"
                                                                >
                                                                    <Phone size={12} />
                                                                    {seller?.whatsapp_number || seller?.phone}
                                                                </a>
                                                                <a
                                                                    href={`https://wa.me/${(seller?.whatsapp_number || seller?.phone).replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo kak ${seller?.name || ''}, saya dari mitra pengolah limbah organik Replate ingin konfirmasi penjemputan produk "${product?.title}".`)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition"
                                                                >
                                                                    <MessageCircle size={12} />
                                                                    WhatsApp Penjual
                                                                </a>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400 italic text-[11px]">Nomor kontak tidak tercantum</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-3">
                                <Check size={24} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800">Semua Penjemputan Selesai</h3>
                            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                                Saat ini belum ada produk makanan yang dialihkan ke kuota mitra Anda.
                            </p>
                        </div>
                    )}
                </div>

                {/* Recent Completed Preview */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-900">Penerimaan Terakhir (10 Terakhir)</h2>
                        <Link
                            href="/partner/history"
                            className="text-xs font-semibold text-green-600 hover:text-green-700 hover:underline"
                        >
                            Lihat Semua →
                        </Link>
                    </div>

                    {completed.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {completed.map((t) => (
                                <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                            <Check size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{t.product?.title || 'Produk'}</p>
                                            <p className="text-xs text-gray-400">
                                                {t.product?.quantity} {t.product?.unit} ({t.product?.weight_grams}g) · Penjual: {t.product?.user?.name || 'Warga'} · {new Date(t.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">
                                        Tersalurkan
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 text-center py-6">Belum ada riwayat penerimaan produk.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}