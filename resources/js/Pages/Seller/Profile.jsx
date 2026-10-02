import { useState } from 'react';
import NavbarLayout from '@/Layouts/NavbarLayout';
import Modal from '@/Components/Modal';
import { formatTimeLeftShort } from '@/Utils/time';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    User,
    Package,
    Scale,
    TrendingUp,
    Clock,
    MapPin,
    ShieldCheck,
    CheckCircle2,
    Flag,
    X,
    Camera,
    Star,
    MessageCircle,
    Award,
    Sparkles,
    Heart,
    RefreshCw,
    Calendar,
    ExternalLink,
    AlertCircle,
    ChevronRight,
    Leaf,
    ShoppingBag
} from 'lucide-react';

const userReportReasons = [
    { value: 'penipuan_transaksi', label: 'Penipuan Transaksi / Pembayaran / Barter' },
    { value: 'pelecehan_abusive', label: 'Perilaku Kasar, Ancaman, atau Pelecehan' },
    { value: 'akun_palsu', label: 'Akun Palsu / Identitas Meragukan' },
    { value: 'ghosting_tidak_hadir', label: 'Tidak Hadir / Membatalkan Sepihak Berulang Kali' },
    { value: 'spam_promosi', label: 'Spam / Promosi Ilegal' },
    { value: 'lainnya', label: 'Pelanggaran Aturan Desa Lainnya' },
];

export default function Profile({
    seller,
    products = [],
    reviews = [],
    ratings = { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
    badges = [],
    totalBadgesUnlocked = 0,
    impactStats = {},
    stats = { totalProducts: 0, totalSold: 0, totalWeight: 0, totalBarter: 0, totalDonation: 0 }
}) {
    const { auth } = usePage().props;
    const isSelf = auth?.user?.id === seller.id;
    const isVerified = seller.role === 'verified_seller';

    const [activeTab, setActiveTab] = useState('products'); // 'products' | 'reviews' | 'badges'

    const [reportModal, setReportModal] = useState({
        show: false,
        reason: 'penipuan_transaksi',
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

    function submitUserReport(e) {
        e.preventDefault();
        setReportModal(prev => ({ ...prev, submitting: true }));

        const formData = new FormData();
        formData.append('reason', reportModal.reason);
        formData.append('description', reportModal.description);
        if (reportModal.evidence_photo) {
            formData.append('evidence_photo', reportModal.evidence_photo);
        }

        router.post(`/users/${seller.id}/report`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setReportModal({
                    show: false,
                    reason: 'penipuan_transaksi',
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

    const weightKg = (stats.totalWeight / 1000).toFixed(1);
    const co2SavedKg = (stats.totalWeight / 1000 * 2.5).toFixed(1);

    return (
        <NavbarLayout title={`Profil — ${seller.name}`}>
            <Head title={`Profil — ${seller.name}`} />

            {/* Modal Laporkan Pengguna / Akun */}
            <Modal show={reportModal.show} onClose={() => !reportModal.submitting && setReportModal(prev => ({ ...prev, show: false }))} maxWidth="md">
                <form onSubmit={submitUserReport} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5 text-red-600">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                <Flag size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Laporkan Akun Pengguna</h3>
                                <p className="text-xs text-gray-500">Kirim laporan terkait akun "{seller.name}" ke Admin BUMDes</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled={reportModal.submitting}
                            onClick={() => setReportModal(prev => ({ ...prev, show: false }))}
                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                                Kategori Pelanggaran *
                            </label>
                            <div className="space-y-1.5">
                                {userReportReasons.map((r) => (
                                    <label
                                        key={r.value}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition text-xs ${
                                            reportModal.reason === r.value ? 'border-red-500 bg-red-50/60 font-semibold text-red-950' : 'border-gray-100 hover:border-gray-200 text-gray-700'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="user_report_reason"
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
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Kronologi & Penjelasan Masalah *
                            </label>
                            <textarea
                                required
                                value={reportModal.description}
                                onChange={(e) => setReportModal(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Jelaskan secara rinci tindakan pengguna yang merugikan (cantumkan detail waktu/transaksi jika ada)..."
                                rows={3}
                                className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Unggah Bukti Tangkapan Layar / Foto (Opsional, Maks 3MB)
                            </label>
                            {reportModal.evidence_preview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={reportModal.evidence_preview}
                                        alt="Bukti Laporan"
                                        className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setReportModal(prev => ({ ...prev, evidence_photo: null, evidence_preview: null }))}
                                        className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full shadow-sm hover:bg-red-700 transition"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center gap-2.5 px-3.5 py-2.5 border border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50/30 rounded-xl cursor-pointer transition text-xs text-gray-600">
                                    <Camera size={16} className="text-gray-400" />
                                    <span>Pilih screenshot percakapan / bukti transaksi</span>
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
                            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={reportModal.submitting || !reportModal.description}
                            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
                        >
                            {reportModal.submitting ? 'Mengirim...' : 'Kirim Laporan'}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="max-w-5xl mx-auto space-y-6 pb-12">
                {/* Hero / Cover Card */}
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-28 sm:h-36 bg-emerald-700"></div>

                    {/* Profile Detail Strip */}
                    <div className="px-6 pb-6 pt-0 relative">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16">
                            {/* Avatar & Main Info */}
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                <div className="relative">
                                    {seller.profile_photo ? (
                                        <img
                                            src={`/storage/${seller.profile_photo}`}
                                            alt={seller.name}
                                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-sm bg-white"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-emerald-100 text-emerald-800 border-4 border-white shadow-sm flex items-center justify-center font-bold text-3xl">
                                            {seller.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    {isVerified && (
                                        <div
                                            title="Penjual Olahan Terverifikasi"
                                            className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-lg border-2 border-white shadow-xs"
                                        >
                                            <CheckCircle2 size={16} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1 mb-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{seller.name}</h1>
                                        {isVerified && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
                                                <CheckCircle2 size={13} className="text-emerald-600" />
                                                Terverifikasi
                                            </span>
                                        )}
                                        {seller.is_blacklisted && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                                Non-Aktif
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={13} className="text-gray-400" />
                                            {seller.desa ? `Desa ${seller.desa}` : ''}{seller.kecamatan ? `, Kec. ${seller.kecamatan}` : 'Lokasi belum diset'}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={13} className="text-gray-400" />
                                            Bergabung sejak {seller.created_at}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
                                {isSelf ? (
                                    <Link
                                        href="/profile"
                                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl transition"
                                    >
                                        Edit Profil Saya
                                    </Link>
                                ) : (
                                    <>
                                        {auth?.user && (
                                            <Link
                                                href={`/chat/${seller.id}`}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                                            >
                                                <MessageCircle size={15} />
                                                Kirim Pesan
                                            </Link>
                                        )}
                                        {auth?.user && (
                                            <button
                                                type="button"
                                                onClick={() => setReportModal(prev => ({ ...prev, show: true }))}
                                                className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 rounded-xl text-xs font-medium transition"
                                                title="Laporkan akun ke Admin"
                                            >
                                                <Flag size={14} />
                                                <span className="hidden sm:inline">Laporkan</span>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Verified Seller Note */}
                        {isVerified && (
                            <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center gap-3 text-xs text-emerald-950">
                                <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-semibold text-emerald-900">Penjual Olahan Pangan Terverifikasi BUMDes</p>
                                    <p className="text-emerald-800 text-[11px]">
                                        Dapur dan standar kebersihan telah diverifikasi oleh koordinator desa.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-3.5 text-center">
                                <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                                    <Star size={16} className="fill-amber-400" />
                                    <span className="text-base sm:text-lg font-bold text-gray-900">
                                        {ratings.average > 0 ? ratings.average.toFixed(1) : 'Baru'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium">
                                    {ratings.count > 0 ? `${ratings.count} Ulasan` : 'Belum ada ulasan'}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-3.5 text-center">
                                <p className="text-base sm:text-lg font-bold text-gray-900">
                                    {weightKg} <span className="text-xs font-normal text-gray-500">kg</span>
                                </p>
                                <p className="text-[11px] text-gray-500 font-medium">Pangan Diselamatkan</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-3.5 text-center">
                                <p className="text-base sm:text-lg font-bold text-gray-900">{stats.totalSold}</p>
                                <p className="text-[11px] text-gray-500 font-medium">Transaksi Selesai</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-3.5 text-center">
                                <p className="text-base sm:text-lg font-bold text-gray-900">{products.length}</p>
                                <p className="text-[11px] text-gray-500 font-medium">Produk di Etalase</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px ${
                            activeTab === 'products'
                                ? 'border-emerald-600 text-emerald-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <ShoppingBag size={16} />
                        <span>Etalase Produk</span>
                        <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[11px] font-semibold">
                            {products.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('reviews')}
                        className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px ${
                            activeTab === 'reviews'
                                ? 'border-emerald-600 text-emerald-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Star size={16} />
                        <span>Ulasan & Penilaian</span>
                        <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[11px] font-semibold">
                            {ratings.count}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('badges')}
                        className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px ${
                            activeTab === 'badges'
                                ? 'border-emerald-600 text-emerald-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Award size={16} />
                        <span>Lencana & Dampak</span>
                        <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-semibold">
                            {totalBadgesUnlocked}
                        </span>
                    </button>
                </div>

                {/* Tab 1: Products */}
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-emerald-500 transition duration-200 flex flex-col justify-between group"
                                    >
                                        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                            {product.photo ? (
                                                <img
                                                    src={`/storage/${product.photo}`}
                                                    alt={product.title || ''}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = '/image/image default.jpg';
                                                    }}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                                    <Package size={28} />
                                                </div>
                                            )}

                                            {/* Transaction Mode Badge */}
                                            <div className="absolute top-2 left-2">
                                                {product.transaction_mode === 'donate' ? (
                                                    <span className="px-2 py-0.5 bg-rose-500/90 text-white rounded-lg text-[10px] font-bold backdrop-blur-xs shadow-xs">
                                                        Donasi Gratis
                                                    </span>
                                                ) : product.transaction_mode === 'barter' ? (
                                                    <span className="px-2 py-0.5 bg-purple-600/90 text-white rounded-lg text-[10px] font-bold backdrop-blur-xs shadow-xs">
                                                        Barter Pangan
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-emerald-600/90 text-white rounded-lg text-[10px] font-bold backdrop-blur-xs shadow-xs">
                                                        Jual Terjangkau
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-3.5 flex flex-col flex-1 justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition line-clamp-1">
                                                    {product.title}
                                                </h3>
                                                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
                                                    <span>{product.quantity} {product.unit}</span>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-0.5 text-amber-600">
                                                        <Clock size={11} />
                                                        {formatTimeLeftShort(product.timeout_at)}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                                                {product.price ? (
                                                    <p className="text-sm font-extrabold text-emerald-700">
                                                        Rp {product.price.toLocaleString('id-ID')}
                                                        <span className="text-[10px] text-gray-400 font-normal">/{product.unit || 'item'}</span>
                                                    </p>
                                                ) : (
                                                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                                                        {product.transaction_mode === 'donate' ? 'Gratis' : 'Tukar Produk'}
                                                    </p>
                                                )}

                                                <span className="text-[11px] text-emerald-600 font-semibold group-hover:translate-x-0.5 transition flex items-center">
                                                    Lihat <ChevronRight size={13} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
                                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-3">
                                    <Package size={28} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800">Belum Ada Produk Aktif</h3>
                                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                                    Penjual ini sedang tidak memiliki listing makanan berlebih yang aktif saat ini.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: Reviews */}
                {activeTab === 'reviews' && (
                    <div className="space-y-6">
                        {/* Rating Breakdown Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                {/* Left: Average Rating */}
                                <div className="text-center md:border-r md:border-gray-100 md:pr-6">
                                    <div className="text-5xl font-black text-gray-900">
                                        {ratings.average > 0 ? ratings.average.toFixed(1) : '0.0'}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 text-amber-400 my-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={18}
                                                className={star <= Math.round(ratings.average) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">
                                        Berdasarkan {ratings.count} ulasan transaksi warga
                                    </p>
                                </div>

                                {/* Right: Star Distribution */}
                                <div className="md:col-span-2 space-y-2">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = ratings.distribution[star] || 0;
                                        const pct = ratings.count > 0 ? Math.round((count / ratings.count) * 100) : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-3 text-xs">
                                                <div className="flex items-center gap-1 w-12 text-gray-600 font-semibold shrink-0">
                                                    <span>{star}</span>
                                                    <Star size={12} className="fill-amber-400 text-amber-400" />
                                                </div>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="w-10 text-right text-gray-400 font-medium">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Review List */}
                        {reviews.length > 0 ? (
                            <div className="space-y-3">
                                {reviews.map((rev) => (
                                    <div
                                        key={rev.id}
                                        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-3 hover:border-gray-200 transition"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {rev.reviewer?.profile_photo ? (
                                                    <img
                                                        src={`/storage/${rev.reviewer.profile_photo}`}
                                                        alt={rev.reviewer.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                                                        {rev.reviewer?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900">{rev.reviewer?.name}</p>
                                                    <p className="text-[11px] text-gray-400">{rev.created_at}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {rev.comment && (
                                            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/60 p-3 rounded-xl border border-gray-100">
                                                "{rev.comment}"
                                            </p>
                                        )}

                                        {rev.product_title && (
                                            <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                                <Package size={12} className="text-gray-400" />
                                                <span>Produk terkait: </span>
                                                <span className="font-semibold text-gray-600">{rev.product_title}</span>
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
                                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-3">
                                    <Star size={28} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800">Belum Ada Ulasan</h3>
                                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                                    Ulasan akan muncul di sini setelah transaksi selesai dan diberikan penilaian oleh pembeli atau penerima barter.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 3: Badges & Impact */}
                {activeTab === 'badges' && (
                    <div className="space-y-6">
                        {/* Ringkasan Kontribusi */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Award size={18} className="text-emerald-600" />
                                        <h3 className="font-bold text-gray-900 text-base">
                                            Status: {impactStats?.level_title || 'Warga Peduli'}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Catatan gotong royong {seller.name} dalam mencegah makanan terbuang di lingkungan desa.
                                    </p>
                                </div>
                                <Link
                                    href="/leaderboard"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition shrink-0 self-start sm:self-center"
                                >
                                    <span>Papan Peringkat Desa</span>
                                    <ChevronRight size={13} />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100 text-center">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-base font-bold text-gray-900">{weightKg} kg</p>
                                    <p className="text-[11px] text-gray-500">Pangan Terselamatkan</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-base font-bold text-gray-900">{stats.totalBarter || 0}</p>
                                    <p className="text-[11px] text-gray-500">Barter Sukses</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-base font-bold text-gray-900">{stats.totalDonation || 0}</p>
                                    <p className="text-[11px] text-gray-500">Donasi Disalurkan</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-base font-bold text-gray-900">{totalBadgesUnlocked} / {badges.length}</p>
                                    <p className="text-[11px] text-gray-500">Lencana Terbuka</p>
                                </div>
                            </div>
                        </div>

                        {/* Badges Showcase Grid */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-900">
                                Lencana Pencapaian ({totalBadgesUnlocked}/{badges.length} Terbuka)
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {badges.map((badge) => {
                                    return (
                                        <div
                                            key={badge.id}
                                            className={`p-4 rounded-xl border transition flex items-start gap-3.5 ${
                                                badge.unlocked
                                                    ? 'bg-white border-emerald-200 shadow-2xs'
                                                    : 'bg-gray-50/70 border-gray-200 opacity-60'
                                            }`}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                    badge.unlocked
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-gray-200 text-gray-400'
                                                }`}
                                            >
                                                {badge.id === 'pioneer' && <Leaf size={20} />}
                                                {badge.id === 'first_rescue' && <Award size={20} />}
                                                {badge.id === 'food_hero' && <Sparkles size={20} />}
                                                {badge.id === 'circular_knight' && <ShieldCheck size={20} />}
                                                {badge.id === 'barter_master' && <RefreshCw size={20} />}
                                                {badge.id === 'generous_donor' && <Heart size={20} />}
                                                {badge.id === 'active_seller' && <ShoppingBag size={20} />}
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-xs font-bold text-gray-900">{badge.title}</h5>
                                                    <span
                                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                            badge.unlocked
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                    >
                                                        {badge.unlocked ? 'Terbuka' : 'Terkunci'}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                                    {badge.description}
                                                </p>
                                                <div className="pt-1 flex items-center justify-between text-[10px] text-gray-400">
                                                    <span>Progres: {badge.progress}</span>
                                                    {badge.unlocked_at && <span>{badge.unlocked_at}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </NavbarLayout>
    );
}