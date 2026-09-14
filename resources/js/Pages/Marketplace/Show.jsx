import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import Modal from '@/Components/Modal';
import ProductImage from '@/Components/ui/ProductImage';
import { formatTimeLeft } from '@/Utils/time';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    MapPin,
    Scale,
    Clock,
    Tag,
    ShoppingBasket,
    ArrowLeftRight,
    Heart,
    Flag,
    User,
    MessageCircle,
    Plus,
    Minus,
    AlertTriangle,
    FileText,
    X,
} from 'lucide-react';

function Badge({ children, color = 'gray' }) {
    const colors = {
        green: 'bg-green-50 text-green-700 border-green-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        red: 'bg-red-50 text-red-700 border-red-200',
        gray: 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return (
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${colors[color]}`}>
            {children}
        </span>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-gray-400" />
            </div>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
}

export default function Show({ product, reservedQty = 0, availableQty }) {
    const { auth } = usePage().props;
    const isOwner = auth?.user?.id === product.user_id;
    const isSpecialRole = auth?.user?.role === 'admin' || auth?.user?.role === 'partner';

    const currentAvailable = availableQty !== undefined ? availableQty : Math.max(0, (product.quantity || 1) - reservedQty);
    const maxQty = Math.max(1, currentAvailable);
    const [buyQty, setBuyQty] = useState(1);
    const [donateQty, setDonateQty] = useState(1);

    const unitPrice = product.discounted_price ?? product.price ?? 0;
    const totalPrice = unitPrice * buyQty;

    const timeLeft = new Date(product.timeout_at) - new Date();
    const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
    const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

    const conditionLabels = {
        layak_konsumsi: 'Layak Konsumsi / Siap Santap',
        layak_olah: 'Bahan Olahan / Perlu Diolah',
        layak_pakan_kompos: 'Pakan / Kompos',
    };

    const conditionColors = {
        layak_konsumsi: 'green',
        layak_olah: 'amber',
        layak_pakan_kompos: 'red',
    };

    const modeLabels = {
        sell: 'Jual',
        barter: 'Barter',
        sell_and_barter: 'Jual & barter',
        donate: 'Donasi',
    };

    const categoryLabels = {
        mentah: 'Mentah',
        olahan: 'Olahan (Siap Santap / Produk Olahan)',
        hasil_bumi: 'Hasil bumi',
    };

    const categoryColors = {
        mentah: 'green',
        olahan: 'amber',
        hasil_bumi: 'blue',
    };

    const reportReasons = [
        { value: 'tidak_sesuai_foto', label: 'Tidak sesuai foto / informasi keliru' },
        { value: 'kondisi_buruk', label: 'Kondisi lebih buruk dari deskripsi' },
        { value: 'produk_tidak_layak', label: 'Produk busuk / tidak layak' },
        { value: 'penipuan', label: 'Indikasi penipuan / spam' },
    ];

    const [reportModal, setReportModal] = useState({
        show: false,
        reason: 'tidak_sesuai_foto',
    });

    function submitReport() {
        router.post(`/products/${product.id}/report`, { reason: reportModal.reason }, {
            onSuccess: () => setReportModal({ show: false, reason: 'tidak_sesuai_foto' }),
        });
    }

    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        confirmText: 'Ya, Lanjutkan',
        variant: 'primary',
        onConfirm: () => {},
    });

    return (
        <AppLayout>
            <Head title={product.title} />

            {/* Custom Report Modal */}
            <Modal show={reportModal.show} onClose={() => setReportModal(prev => ({ ...prev, show: false }))} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-red-600">
                            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                                <Flag size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Laporkan Produk</h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setReportModal(prev => ({ ...prev, show: false }))}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                        Pilih alasan mengapa Anda ingin melaporkan produk <span className="font-semibold text-gray-700">"{product.title}"</span>:
                    </p>

                    <div className="space-y-2 mb-6">
                        {reportReasons.map((r) => (
                            <label
                                key={r.value}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                                    reportModal.reason === r.value ? 'border-red-400 bg-red-50/50' : 'border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="report_reason"
                                    value={r.value}
                                    checked={reportModal.reason === r.value}
                                    onChange={(e) => setReportModal(prev => ({ ...prev, reason: e.target.value }))}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                    reportModal.reason === r.value ? 'border-red-500' : 'border-gray-300'
                                }`}>
                                    {reportModal.reason === r.value && <div className="w-2 h-2 rounded-full bg-red-500" />}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{r.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setReportModal(prev => ({ ...prev, show: false }))}
                            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={submitReport}
                            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
                        >
                            Kirim Laporan
                        </button>
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                show={confirmModal.show}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
            />

            <div className="max-w-4xl mx-auto">
                <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
                >
                    <ArrowLeft size={16} />
                    Kembali ke marketplace
                </Link>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-sm">
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <ProductImage
                            src={product.photo}
                            alt={product.title}
                            aspect="aspect-square"
                        />
                        {/* Countdown overlay */}
                        <div className="absolute top-4 left-4 z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/75 backdrop-blur-md text-white text-xs font-semibold rounded-lg shadow-sm">
                                <Clock size={12} className="text-emerald-400" />
                                {formatTimeLeft(product.timeout_at)}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between">
                        <div>
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                <Badge color={categoryColors[product.category] || 'gray'}>
                                    {categoryLabels[product.category]}
                                </Badge>
                                <Badge color={conditionColors[product.condition] || 'gray'}>
                                    {conditionLabels[product.condition]}
                                </Badge>
                                <Badge color="purple">{modeLabels[product.transaction_mode]}</Badge>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>

                            {/* Price */}
                            {product.price ? (
                                <div className="mb-4">
                                    {product.discounted_price ? (
                                        <div className="space-y-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-red-500">
                                                    Rp {product.discounted_price.toLocaleString()}
                                                </span>
                                                <span className="text-sm font-medium text-gray-500">
                                                    / {product.unit || 'satuan'}
                                                </span>
                                                <span className="text-base text-gray-400 line-through ml-1">
                                                    Rp {product.price.toLocaleString()}
                                                </span>
                                                <Badge color="red">-25%</Badge>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-green-600">
                                                    Rp {product.price.toLocaleString()}
                                                </span>
                                                <span className="text-sm font-medium text-gray-500">
                                                    / {product.unit || 'satuan'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <span className="text-2xl font-bold text-blue-600">
                                        {product.transaction_mode === 'donate' ? 'Donasi gratis' : 'Barter'}
                                    </span>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-4" />

                            {/* Info items */}
                            <div className="divide-y divide-gray-50">
                                <InfoItem
                                    icon={Scale}
                                    label="Stok Tersedia"
                                    value={
                                        reservedQty > 0
                                            ? `${currentAvailable} ${product.unit} (dari total ${product.quantity} ${product.unit}, ${reservedQty} ${product.unit} sedang dipesan)`
                                            : `${product.quantity} ${product.unit}${product.weight_grams ? ` (Estimasi total: ${(product.weight_grams / 1000).toFixed(1)}kg)` : ''}`
                                    }
                                />
                                <InfoItem icon={MapPin} label="Lokasi" value={`${product.desa}, ${product.kecamatan}`} />
                                <InfoItem icon={Clock} label="Sisa waktu" value={`${formatTimeLeft(product.timeout_at)} lagi`} />
                                <InfoItem icon={Tag} label="Kategori" value={`${categoryLabels[product.category]} · ${conditionLabels[product.condition]}`} />
                            </div>

                            {/* Barter description */}
                            {product.barter_description && (
                                <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ArrowLeftRight size={14} className="text-purple-600" />
                                        <p className="text-sm font-medium text-purple-700">Menerima barter</p>
                                    </div>
                                    <p className="text-sm text-purple-600">{product.barter_description}</p>
                                </div>
                            )}

                            {/* Seller info */}
                            {product.user && (
                                <Link href={`/seller/${product.user.id}`} className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-sm flex-shrink-0">
                                        <User size={18} className="text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400">Penjual</p>
                                        <p className="text-sm font-medium text-gray-900">{product.user.name}</p>
                                    </div>
                                    <span className="text-xs text-green-600">Lihat semua produk →</span>
                                </Link>
                            )}

                            {/* Lokasi Pengambilan */}
                            {(product.pickup_address || product.pickup_notes) && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin size={14} className="text-gray-500" />
                                        <p className="text-xs text-gray-400">Lokasi pengambilan</p>
                                    </div>
                                    {product.pickup_address && (
                                        <p className="text-sm text-gray-700">{product.pickup_address}</p>
                                    )}
                                    {product.pickup_notes && (
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <FileText size={12} className="text-gray-400" /> {product.pickup_notes}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-4" />

                            {/* Description */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-400 mb-1">Deskripsi</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Alert when all stock is currently reserved in active transactions */}
                            {!isOwner && !isSpecialRole && currentAvailable <= 0 && ['active', 'timeout_stage_1'].includes(product.status) && (
                                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
                                    <p className="font-semibold flex items-center gap-1.5 text-amber-900">
                                        <Clock size={14} className="text-amber-700" /> Seluruh Stok Sedang Dalam Transaksi
                                    </p>
                                    <p className="text-amber-700 leading-relaxed">
                                        Semua stok produk ini ({product.quantity} {product.unit}) saat ini sedang diproses dalam transaksi oleh pembeli lain. Jika ada transaksi yang dibatalkan, sisa stok akan kembali tersedia.
                                    </p>
                                </div>
                            )}

                            {/* Quantity Selector for Buy Mode */}
                            {!isOwner && !isSpecialRole && (product.transaction_mode === 'sell' || product.transaction_mode === 'sell_and_barter') && ['active', 'timeout_stage_1'].includes(product.status) && currentAvailable > 0 && (
                                <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-700">Pilih Jumlah Pembelian:</span>
                                        <span className="text-xs text-gray-500 font-medium">Sisa tersedia: {currentAvailable} {product.unit}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() => setBuyQty(Math.max(1, buyQty - 1))}
                                                disabled={buyQty <= 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <input
                                                type="number"
                                                value={buyQty}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 1;
                                                    setBuyQty(Math.min(currentAvailable, Math.max(1, val)));
                                                }}
                                                min={1}
                                                max={currentAvailable}
                                                className="w-14 text-center font-bold text-sm border-none p-0 focus:ring-0"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setBuyQty(Math.min(currentAvailable, buyQty + 1))}
                                                disabled={buyQty >= currentAvailable}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] text-gray-400">Total Pembayaran ({buyQty} {product.unit}):</p>
                                            <p className="text-lg font-bold text-green-600">Rp {totalPrice.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {!isOwner && !isSpecialRole && (
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        {(product.transaction_mode === 'sell' || product.transaction_mode === 'sell_and_barter') &&
                                         ['active', 'timeout_stage_1'].includes(product.status) && (
                                            currentAvailable > 0 ? (
                                                <button
                                                    onClick={() => {
                                                        setConfirmModal({
                                                            show: true,
                                                            title: 'Konfirmasi Pembelian',
                                                            message: `Beli ${buyQty} ${product.unit} "${product.title}" seharga Rp ${totalPrice.toLocaleString()}?`,
                                                            confirmText: 'Beli Sekarang',
                                                            variant: 'success',
                                                            onConfirm: () => router.post(`/products/${product.id}/buy`, { quantity: buyQty }),
                                                        });
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-sm"
                                                >
                                                    <ShoppingBasket size={18} />
                                                    Beli ({buyQty} {product.unit})
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-200 text-gray-400 font-semibold rounded-xl cursor-not-allowed"
                                                >
                                                    <Clock size={18} />
                                                    Semua Stok Sedang Dipesan
                                                </button>
                                            )
                                        )}

                                        {(product.transaction_mode === 'barter' || product.transaction_mode === 'sell_and_barter') &&
                                         ['active', 'timeout_stage_1'].includes(product.status) && (
                                            <Link
                                                href={`/products/${product.id}/barter`}
                                                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
                                            >
                                                <ArrowLeftRight size={18} />
                                                Ajukan barter
                                            </Link>
                                        )}
                                    </div>

                                    {(product.transaction_mode === 'donate' || product.status === 'timeout_stage_2') && (
                                        <div className="space-y-3">
                                            {currentAvailable > 0 ? (
                                                <>
                                                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-semibold text-blue-900">Jumlah Donasi yang Diambil:</span>
                                                            <span className="text-xs text-blue-700 font-medium">Tersedia: {currentAvailable} {product.unit}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg p-1 shadow-xs">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDonateQty(Math.max(1, donateQty - 1))}
                                                                    disabled={donateQty <= 1}
                                                                    className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
                                                                >
                                                                    <Minus size={15} />
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    value={donateQty}
                                                                    onChange={(e) => {
                                                                        const val = parseInt(e.target.value) || 1;
                                                                        setDonateQty(Math.min(currentAvailable, Math.max(1, val)));
                                                                    }}
                                                                    min={1}
                                                                    max={currentAvailable}
                                                                    className="w-12 text-center font-bold text-sm border-none p-0 focus:ring-0 text-blue-900"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDonateQty(Math.min(currentAvailable, donateQty + 1))}
                                                                    disabled={donateQty >= currentAvailable}
                                                                    className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
                                                                >
                                                                    <Plus size={15} />
                                                                </button>
                                                            </div>
                                                            <span className="text-xs font-bold text-blue-700">
                                                                {donateQty} {product.unit} (Gratis)
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setConfirmModal({
                                                                show: true,
                                                                title: 'Klaim Donasi Makanan',
                                                                message: `Klaim ${donateQty} ${product.unit} donasi "${product.title}"?`,
                                                                confirmText: 'Klaim Sekarang',
                                                                variant: 'primary',
                                                                onConfirm: () => router.post(`/products/${product.id}/claim-donation`, { quantity: donateQty }),
                                                            });
                                                        }}
                                                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm"
                                                    >
                                                        <Heart size={16} />
                                                        Klaim {donateQty} {product.unit} Donasi
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-400 font-semibold rounded-xl cursor-not-allowed"
                                                >
                                                    <Clock size={16} />
                                                    Semua Donasi Sedang Diklaim
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <Link
                                        href={`/products/${product.id}/chat`}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                                    >
                                        <MessageCircle size={16} />
                                        Chat dengan penjual
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => setReportModal(prev => ({ ...prev, show: true }))}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                                    >
                                        <Flag size={14} />
                                        Laporkan produk
                                    </button>
                                </div>
                            )}

                            {isSpecialRole && (
                                <div className="p-3 bg-gray-100 border border-gray-200 rounded-xl text-center">
                                    <p className="text-xs text-gray-500">
                                        {auth.user.role === 'admin' ? 'Mode Administrator — Meninjau rincian produk.' : 'Mode Mitra — Produk ini dikelola oleh pengguna.'}
                                    </p>
                                </div>
                            )}

                            {isOwner && (
                                <div className="flex gap-3">
                                    <Link
                                        href={`/products/${product.id}/edit`}
                                        className="flex-1 py-3.5 text-center bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                                    >
                                        Edit produk
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setConfirmModal({
                                                show: true,
                                                title: 'Hapus Produk',
                                                message: `Apakah Anda yakin ingin menghapus produk "${product.title}"? Tindakan ini tidak dapat dibatalkan.`,
                                                confirmText: 'Hapus Produk',
                                                variant: 'danger',
                                                onConfirm: () => router.delete(`/products/${product.id}`),
                                            });
                                        }}
                                        className="flex-1 py-3.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition"
                                    >
                                        Hapus produk
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}