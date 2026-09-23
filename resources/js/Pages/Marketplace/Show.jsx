import { useState } from 'react';
import NavbarLayout from '@/Layouts/NavbarLayout';
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
    Upload,
    Camera,
    CheckCircle2,
    ShieldCheck,
    AlertCircle,
    X,
} from 'lucide-react';

function Badge({ children, color = 'gray' }) {
    const colors = {
        green: 'bg-green-50 text-green-800 border-green-200',
        purple: 'bg-purple-50 text-purple-800 border-purple-200',
        blue: 'bg-blue-50 text-blue-800 border-blue-200',
        amber: 'bg-amber-50 text-amber-800 border-amber-200',
        red: 'bg-red-50 text-red-800 border-red-200',
        gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
        <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-lg border ${colors[color]}`}>
            {children}
        </span>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3.5 py-3.5">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600 border border-gray-200">
                <Icon size={18} className="text-gray-600" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
        </div>
    );
}

export default function Show({ product, reservedQty = 0, availableQty }) {
    const { auth } = usePage().props;
    const isOwner = auth?.user?.id === product.user_id;
    const isSpecialRole = auth?.user?.role === 'admin' || auth?.user?.role === 'partner';
    const isGuest = !auth?.user;

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
        sell: 'Jual Beli',
        barter: 'Barter',
        sell_and_barter: 'Jual & Barter',
        donate: 'Donasi',
    };

    const categoryLabels = {
        mentah: 'Bahan Mentah',
        olahan: 'Olahan (Siap Santap / Produk Olahan)',
        hasil_bumi: 'Hasil Bumi',
    };

    const categoryColors = {
        mentah: 'green',
        olahan: 'amber',
        hasil_bumi: 'blue',
    };

    const reportReasons = [
        { value: 'tidak_sesuai_foto', label: 'Tidak sesuai foto / informasi keliru' },
        { value: 'kondisi_buruk', label: 'Kondisi lebih buruk / basi' },
        { value: 'produk_tidak_layak', label: 'Produk tidak layak konsumsi' },
        { value: 'penipuan', label: 'Indikasi penipuan / informasi palsu' },
        { value: 'produk_dilarang', label: 'Produk dilarang / melanggar aturan desa' },
    ];

    const [reportModal, setReportModal] = useState({
        show: false,
        reason: 'tidak_sesuai_foto',
        description: '',
        evidence_photo: null,
        evidence_preview: null,
        submitting: false,
    });

    function handleReportPhoto(e) {
        const file = e.target.files[0];
        if (file) {
            setReportModal(prev => ({
                ...prev,
                evidence_photo: file,
                evidence_preview: URL.createObjectURL(file),
            }));
        }
    }

    function submitReport() {
        setReportModal(prev => ({ ...prev, submitting: true }));
        const formData = new FormData();
        formData.append('reason', reportModal.reason);
        if (reportModal.description) {
            formData.append('description', reportModal.description);
        }
        if (reportModal.evidence_photo) {
            formData.append('evidence_photo', reportModal.evidence_photo);
        }

        router.post(`/products/${product.id}/report`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setReportModal({
                    show: false,
                    reason: 'tidak_sesuai_foto',
                    description: '',
                    evidence_photo: null,
                    evidence_preview: null,
                    submitting: false,
                });
            },
            onFinish: () => {
                setReportModal(prev => ({ ...prev, submitting: false }));
            },
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

    const Layout = auth?.user ? AppLayout : NavbarLayout;

    return (
        <Layout title={product.title}>
            <Head title={`${product.title} — Marketplace Replate`} />

            {/* Custom Report Modal */}
            <Modal show={reportModal.show} onClose={() => !reportModal.submitting && setReportModal(prev => ({ ...prev, show: false }))} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5 text-red-600">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                <Flag size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Laporkan Produk</h3>
                                <p className="text-xs text-gray-600">Bantu kami menjaga kelayakan pangan & keamanan komunitas</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled={reportModal.submitting}
                            onClick={() => setReportModal(prev => ({ ...prev, show: false }))}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
                                Alasan Pelaporan Produk *
                            </label>
                            <div className="space-y-2">
                                {reportReasons.map((r) => (
                                    <label
                                        key={r.value}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition text-xs sm:text-sm ${
                                            reportModal.reason === r.value ? 'border-red-500 bg-red-50 font-bold text-red-950' : 'border-gray-200 hover:border-gray-300 text-gray-700'
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
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            reportModal.reason === r.value ? 'border-red-600' : 'border-gray-300'
                                        }`}>
                                            {reportModal.reason === r.value && <div className="w-2 h-2 rounded-full bg-red-600" />}
                                        </div>
                                        <span>{r.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                                Rincian / Kronologi Pelanggaran (Opsional)
                            </label>
                            <textarea
                                value={reportModal.description}
                                onChange={(e) => setReportModal(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Jelaskan kendala produk secara jelas (misal: makanan bau asam, barang tidak sesuai foto, dll)..."
                                rows={3}
                                className="w-full text-xs sm:text-sm border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                                Unggah Bukti Foto (Opsional, JPG/PNG Maks 3MB)
                            </label>
                            {reportModal.evidence_preview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={reportModal.evidence_preview}
                                        alt="Bukti Laporan"
                                        className="w-24 h-24 object-cover rounded-xl border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setReportModal(prev => ({ ...prev, evidence_photo: null, evidence_preview: null }))}
                                        className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full shadow-xs"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center gap-2.5 px-4 py-3 border border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50/40 rounded-xl cursor-pointer transition text-xs sm:text-sm text-gray-700 font-medium">
                                    <Camera size={18} className="text-gray-500" />
                                    <span>Pilih foto bukti kondisi produk / kemasan</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleReportPhoto}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            disabled={reportModal.submitting}
                            onClick={() => setReportModal(prev => ({ ...prev, show: false }))}
                            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold rounded-xl transition"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            disabled={reportModal.submitting}
                            onClick={submitReport}
                            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                        >
                            {reportModal.submitting ? 'Mengirim...' : 'Kirim Laporan'}
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

            <div className="max-w-5xl mx-auto space-y-6">
                <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-emerald-700 transition bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Marketplace
                </Link>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-xs">
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <ProductImage
                            src={product.photo}
                            alt={product.title}
                            aspect="aspect-square"
                        />
                        {/* Countdown overlay */}
                        <div className="absolute top-4 left-4 z-10">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-sm">
                                <Clock size={14} className="text-emerald-400" />
                                {formatTimeLeft(product.timeout_at)}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                        <div>
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-3.5">
                                <Badge color={categoryColors[product.category] || 'gray'}>
                                    {categoryLabels[product.category]}
                                </Badge>
                                <Badge color={conditionColors[product.condition] || 'gray'}>
                                    {conditionLabels[product.condition]}
                                </Badge>
                                <Badge color="purple">{modeLabels[product.transaction_mode]}</Badge>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>

                            {/* Price */}
                            {product.price ? (
                                <div className="mb-4">
                                    {product.discounted_price ? (
                                        <div className="space-y-1">
                                            <div className="flex items-baseline gap-2.5 flex-wrap">
                                                <span className="text-3xl sm:text-4xl font-extrabold text-red-600">
                                                    Rp {product.discounted_price.toLocaleString('id-ID')}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-600">
                                                    / {product.unit || 'satuan'}
                                                </span>
                                                <span className="text-base text-gray-400 line-through ml-1">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </span>
                                                <Badge color="red">-25% Diskon</Badge>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-600">
                                                    / {product.unit || 'satuan'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                                        {product.transaction_mode === 'donate' ? 'Donasi Gratis' : 'Barter'}
                                    </span>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-4" />

                            {/* Info items */}
                            <div className="divide-y divide-gray-100">
                                <InfoItem
                                    icon={Scale}
                                    label="Stok Tersedia"
                                    value={
                                        reservedQty > 0
                                            ? `${currentAvailable} ${product.unit} (dari total ${product.quantity} ${product.unit}, ${reservedQty} ${product.unit} sedang dipesan)`
                                            : `${product.quantity} ${product.unit}${product.weight_grams ? ` (Estimasi total: ${(product.weight_grams / 1000).toFixed(1)}kg)` : ''}`
                                    }
                                />
                                <InfoItem icon={MapPin} label="Lokasi" value={`${product.desa}, ${product.kecamatan || 'Bantul'}`} />
                                <InfoItem icon={Clock} label="Sisa Waktu" value={`${formatTimeLeft(product.timeout_at)} lagi`} />
                                <InfoItem icon={Tag} label="Kategori & Kondisi" value={`${categoryLabels[product.category]} · ${conditionLabels[product.condition]}`} />
                            </div>

                            {/* Barter description */}
                            {product.barter_description && (
                                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ArrowLeftRight size={16} className="text-purple-700" />
                                        <p className="text-sm font-bold text-purple-900">Menerima Barter</p>
                                    </div>
                                    <p className="text-sm text-purple-900 font-medium">{product.barter_description}</p>
                                </div>
                            )}

                            {/* Seller info */}
                            {product.user && (
                                <Link href={`/seller/${product.user.id}`} className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-3.5 hover:bg-gray-100 transition group shadow-xs">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-base shrink-0 border border-emerald-200">
                                            {product.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Penjual / Pemilik</p>
                                            <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                                <p className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition">{product.user.name}</p>
                                                {product.user.role === 'verified_seller' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                                                        <ShieldCheck size={13} className="text-emerald-700" />
                                                        Verified Seller
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs sm:text-sm text-emerald-700 font-bold group-hover:translate-x-1 transition">Profil Penjual →</span>
                                </Link>
                            )}

                            {/* Trust banner jika kategori olahan */}
                            {product.category === 'olahan' && (
                                <div className="mt-3.5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
                                    <ShieldCheck size={18} className="text-emerald-700 mt-0.5 shrink-0" />
                                    <div>
                                        <span className="font-bold">Keamanan Pangan Olahan:</span> Produk ini diolah oleh penjual yang terdata dan terverifikasi izin higienitas PIRT / BUMDes setempat.
                                    </div>
                                </div>
                            )}

                            {/* Lokasi Pengambilan */}
                            {(product.pickup_address || product.pickup_notes) && (
                                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-600" />
                                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Lokasi Pengambilan</p>
                                    </div>
                                    {product.pickup_address && (
                                        <p className="text-sm font-semibold text-gray-900 pl-6">{product.pickup_address}</p>
                                    )}
                                    {product.pickup_notes && (
                                        <p className="text-xs text-gray-600 pl-6 flex items-center gap-1.5 font-medium">
                                            <FileText size={14} className="text-gray-500" /> {product.pickup_notes}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-4" />

                            {/* Description */}
                            <div className="mb-4">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Deskripsi Produk</p>
                                <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">{product.description || '-'}</p>
                            </div>

                            {/* Alert when all stock is currently reserved in active transactions */}
                            {!isOwner && !isSpecialRole && !isGuest && currentAvailable <= 0 && ['active', 'timeout_stage_1'].includes(product.status) && (
                                <div className="mb-4 p-5 bg-amber-50 border border-amber-300 rounded-2xl text-xs sm:text-sm space-y-1.5">
                                    <p className="font-bold flex items-center gap-2 text-amber-950">
                                        <Clock size={16} className="text-amber-700" /> Seluruh Stok Sedang Dalam Transaksi
                                    </p>
                                    <p className="text-amber-900 leading-relaxed font-medium">
                                        Semua stok produk ini ({product.quantity} {product.unit}) saat ini sedang diproses dalam transaksi oleh pembeli lain. Jika ada transaksi yang dibatalkan, sisa stok akan kembali tersedia.
                                    </p>
                                </div>
                            )}

                            {/* Quantity Selector for Buy Mode (Logged in users) */}
                            {!isOwner && !isSpecialRole && !isGuest && (product.transaction_mode === 'sell' || product.transaction_mode === 'sell_and_barter') && ['active', 'timeout_stage_1'].includes(product.status) && currentAvailable > 0 && (
                                <div className="mb-4 p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs sm:text-sm font-bold text-gray-800">Pilih Jumlah Pembelian:</span>
                                        <span className="text-xs text-gray-600 font-semibold">Sisa tersedia: {currentAvailable} {product.unit}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl p-1.5 shadow-xs">
                                            <button
                                                type="button"
                                                onClick={() => setBuyQty(Math.max(1, buyQty - 1))}
                                                disabled={buyQty <= 1}
                                                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition"
                                            >
                                                <Minus size={18} />
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
                                                className="w-14 text-center font-bold text-base border-none p-0 focus:ring-0 text-gray-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setBuyQty(Math.min(currentAvailable, buyQty + 1))}
                                                disabled={buyQty >= currentAvailable}
                                                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600 font-medium">Total Pembayaran ({buyQty} {product.unit}):</p>
                                            <p className="text-xl font-extrabold text-emerald-700">Rp {totalPrice.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Guest CTA Box */}
                            {isGuest && (
                                <div className="space-y-4 pt-2">
                                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-3 shadow-xs">
                                        <div className="flex items-center gap-2.5 text-emerald-950 font-bold text-sm">
                                            <ShoppingBasket size={20} className="text-emerald-700" />
                                            Tertarik Mengambil atau Membeli Produk Ini?
                                        </div>
                                        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                                            Masuk atau buat akun Replate untuk mulai bertransaksi, mengajukan barter, mengklaim donasi makanan, serta menghubungi penjual secara langsung.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                                            <Link
                                                href="/login"
                                                className="flex-1 py-3 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-xs text-xs sm:text-sm"
                                            >
                                                Masuk ke Akun
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="flex-1 py-3 text-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold rounded-xl transition text-xs sm:text-sm"
                                            >
                                                Daftar Akun Warga
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Link
                                            href="/login"
                                            className="w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                                        >
                                            <MessageCircle size={18} />
                                            Chat dengan Penjual (Perlu Masuk)
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons (Logged In Non-Owner Users) */}
                            {!isOwner && !isSpecialRole && !isGuest && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex gap-3">
                                        {(product.transaction_mode === 'sell' || product.transaction_mode === 'sell_and_barter') &&
                                         ['active', 'timeout_stage_1'].includes(product.status) && (
                                            currentAvailable > 0 ? (
                                                <button
                                                    onClick={() => {
                                                        setConfirmModal({
                                                            show: true,
                                                            title: 'Konfirmasi Pembelian',
                                                            message: `Beli ${buyQty} ${product.unit} "${product.title}" seharga Rp ${totalPrice.toLocaleString('id-ID')}?`,
                                                            confirmText: 'Beli Sekarang',
                                                            variant: 'success',
                                                            onConfirm: () => router.post(`/products/${product.id}/buy`, { quantity: buyQty }),
                                                        });
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-xs text-sm sm:text-base"
                                                >
                                                    <ShoppingBasket size={20} />
                                                    Beli ({buyQty} {product.unit})
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed text-sm sm:text-base"
                                                >
                                                    <Clock size={20} />
                                                    Semua Stok Sedang Dipesan
                                                </button>
                                            )
                                        )}

                                        {(product.transaction_mode === 'barter' || product.transaction_mode === 'sell_and_barter') &&
                                         ['active', 'timeout_stage_1'].includes(product.status) && (
                                            <Link
                                                href={`/products/${product.id}/barter`}
                                                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shadow-xs text-sm sm:text-base"
                                            >
                                                <ArrowLeftRight size={20} />
                                                Ajukan Barter
                                            </Link>
                                        )}
                                    </div>

                                    {(product.transaction_mode === 'donate' || product.status === 'timeout_stage_2') && (
                                        <div className="space-y-3">
                                            {currentAvailable > 0 ? (
                                                <>
                                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs sm:text-sm font-bold text-blue-950">Jumlah Donasi yang Diambil:</span>
                                                            <span className="text-xs text-blue-800 font-bold">Tersedia: {currentAvailable} {product.unit}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-2 bg-white border border-blue-300 rounded-xl p-1.5 shadow-xs">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDonateQty(Math.max(1, donateQty - 1))}
                                                                    disabled={donateQty <= 1}
                                                                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition"
                                                                >
                                                                    <Minus size={16} />
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
                                                                    className="w-14 text-center font-bold text-base border-none p-0 focus:ring-0 text-blue-900"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDonateQty(Math.min(currentAvailable, donateQty + 1))}
                                                                    disabled={donateQty >= currentAvailable}
                                                                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition"
                                                                >
                                                                    <Plus size={16} />
                                                                </button>
                                                            </div>
                                                            <span className="text-sm font-extrabold text-blue-800">
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
                                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-xs text-sm sm:text-base"
                                                    >
                                                        <Heart size={18} />
                                                        Klaim {donateQty} {product.unit} Donasi
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed text-sm sm:text-base"
                                                >
                                                    <Clock size={18} />
                                                    Semua Donasi Sedang Diklaim
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <Link
                                        href={`/products/${product.id}/chat`}
                                        className="w-full flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                                    >
                                        <MessageCircle size={18} />
                                        Chat dengan Penjual
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => setReportModal(prev => ({ ...prev, show: true }))}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                    >
                                        <Flag size={15} />
                                        Laporkan Produk Ini
                                    </button>
                                </div>
                            )}



                            {isOwner && (
                                <div className="flex gap-3 pt-2">
                                    <Link
                                        href={`/products/${product.id}/edit`}
                                        className="flex-1 py-3.5 text-center bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition text-sm"
                                    >
                                        Edit Produk
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
                                        className="flex-1 py-3.5 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 transition text-sm"
                                    >
                                        Hapus Produk
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}