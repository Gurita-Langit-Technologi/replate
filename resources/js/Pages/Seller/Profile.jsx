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
                <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Gradient Header Pattern */}
                    <div className="h-36 sm:h-44 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 relative">
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        
                        {/* Level Tag di Header */}
                        {impactStats?.level_title && (
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                                <Sparkles size={13} className="text-yellow-300" />
                                {impactStats.level_title}
                            </div>
                        )}
                    </div>

                    {/* Profile Detail Strip */}
                    <div className="px-6 pb-6 pt-0 relative">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
                            {/* Avatar & Main Info */}
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                <div className="relative">
                                    {seller.profile_photo ? (
                                        <img
                                            src={`/storage/${seller.profile_photo}`}
                                            alt={seller.name}
                                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
                                        />
                                    ) : (
                                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-200 border-4 border-white shadow-md flex items-center justify-center text-emerald-800 font-extrabold text-4xl">
                                            {seller.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    {isVerified && (
                                        <div
                                            title="Penjual Olahan Terverifikasi"
                                            className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1.5 rounded-xl border-2 border-white shadow-xs"
                                        >
                                            <ShieldCheck size={18} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1 mb-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-2xl font-black text-gray-900">{seller.name}</h1>
                                        {isVerified && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold shadow-2xs">
                                                <ShieldCheck size={13} className="text-emerald-600" />
                                                Verified Seller
                                            </span>
                                        )}
                                        {seller.is_blacklisted && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
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
                                            Bergabung {seller.created_at}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
                                {isSelf ? (
                                    <Link
                                        href="/profile"
                                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition"
                                    >
                                        Edit Profil Saya
                                    </Link>
                                ) : (
                                    <>
                                        {auth?.user && (
                                            <Link
                                                href={`/chat/${seller.id}`}
                                                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                                            >
                                                <MessageCircle size={15} />
                                                Kirim Pesan
                                            </Link>
                                        )}
                                        {auth?.user && (
                                            <button
                                                type="button"
                                                onClick={() => setReportModal(prev => ({ ...prev, show: true }))}
                                                className="inline-flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 rounded-xl text-xs font-medium transition"
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

                        {/* Verified Seller Trust Note */}
                        {isVerified && (
                            <div className="mt-5 p-3.5 bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border border-emerald-200/80 rounded-2xl flex items-start sm:items-center gap-3 text-xs text-emerald-950">
                                <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 shadow-xs">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-bold text-emerald-900">Penjual Olahan Pangan Terverifikasi BUMDes</p>
                                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                                        Dapur dan standar higienitas telah lolos uji kelayakan oleh koordinator desa untuk menyajikan makanan olahan & siap santap.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                            <div className="bg-gray-50/90 hover:bg-gray-50 border border-gray-100 rounded-2xl p-3.5 text-center transition">
                                <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                                    <Star size={16} className="fill-amber-400" />
                                    <span className="text-lg font-black text-gray-900">
                                        {ratings.average > 0 ? ratings.average.toFixed(1) : 'Baru'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium">
                                    {ratings.count > 0 ? `${ratings.count} Ulasan` : 'Belum ada review'}
                                </p>
                            </div>

                            <div className="bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/70 rounded-2xl p-3.5 text-center transition">
                                <p className="text-lg font-black text-emerald-700">
                                    {weightKg} <span className="text-xs font-normal">kg</span>
                                </p>
                                <p className="text-[11px] text-emerald-800/80 font-medium">Waste Terselamatkan</p>
                            </div>

                            <div className="bg-teal-50/50 hover:bg-teal-50 border border-teal-100/70 rounded-2xl p-3.5 text-center transition">
                                <p className="text-lg font-black text-teal-700">
                                    {co2SavedKg} <span className="text-xs font-normal">kg</span>
                                </p>
                                <p className="text-[11px] text-teal-800/80 font-medium">CO₂ Tercegah</p>
                            </div>

                            <div className="bg-blue-50/50 hover:bg-blue-50 border border-blue-100/70 rounded-2xl p-3.5 text-center transition">
                                <p className="text-lg font-black text-blue-700">{stats.totalSold}</p>
                                <p className="text-[11px] text-blue-800/80 font-medium">Transaksi Sukses</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition -mb-px ${
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
                        className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition -mb-px ${
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
                        className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition -mb-px ${
                            activeTab === 'badges'
                                ? 'border-emerald-600 text-emerald-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Award size={16} />
                        <span>Lencana & Dampak Hijau</span>
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

                {/* Tab 3: Badges & Environmental Impact */}
                {activeTab === 'badges' && (
                    <div className="space-y-6">
                        {/* Summary Badges Header */}
                        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
                                <Leaf size={240} />
                            </div>
                            <div className="relative z-10 space-y-4 max-w-2xl">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-semibold backdrop-blur-xs">
                                    <Award size={14} />
                                    Reputasi Ekologis Komunitas
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black leading-snug">
                                    {impactStats?.level_title || 'Penyelamat Pangan'}
                                </h3>
                                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                                    Setiap transaksi yang diselesaikan oleh {seller.name} telah berkontribusi nyata mengurangi emisi gas rumah kaca dan mencegah makanan bernutrisi terbuang sia-sia ke TPA.
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                                        <p className="text-xl font-black text-emerald-300">{weightKg} kg</p>
                                        <p className="text-[11px] text-emerald-100/70">Pangan Terselamatkan</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                                        <p className="text-xl font-black text-teal-300">{co2SavedKg} kg</p>
                                        <p className="text-[11px] text-teal-100/70">Reduksi CO₂</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                                        <p className="text-xl font-black text-purple-300">{stats.totalBarter || 0}</p>
                                        <p className="text-[11px] text-purple-100/70">Barter Sukses</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                                        <p className="text-xl font-black text-rose-300">{stats.totalDonation || 0}</p>
                                        <p className="text-[11px] text-rose-100/70">Donasi Disalurkan</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Badges Showcase Grid */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center justify-between">
                                <span>Koleksi Lencana Pencapaian ({totalBadgesUnlocked}/{badges.length} Terbuka)</span>
                                <Link href="/leaderboard" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                    Lihat Papan Peringkat Desa <ChevronRight size={13} />
                                </Link>
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {badges.map((badge) => {
                                    return (
                                        <div
                                            key={badge.id}
                                            className={`p-4 rounded-2xl border transition flex items-start gap-4 ${
                                                badge.unlocked
                                                    ? 'bg-white border-emerald-200/80 shadow-xs'
                                                    : 'bg-gray-50/70 border-gray-200 opacity-60'
                                            }`}
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                                                    badge.unlocked
                                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                                                        : 'bg-gray-200 text-gray-400'
                                                }`}
                                            >
                                                {badge.id === 'pioneer' && <Leaf size={22} />}
                                                {badge.id === 'first_rescue' && <Award size={22} />}
                                                {badge.id === 'food_hero' && <Sparkles size={22} />}
                                                {badge.id === 'circular_knight' && <ShieldCheck size={22} />}
                                                {badge.id === 'barter_master' && <RefreshCw size={22} />}
                                                {badge.id === 'generous_donor' && <Heart size={22} />}
                                                {badge.id === 'active_seller' && <ShoppingBag size={22} />}
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-xs font-bold text-gray-900">{badge.title}</h5>
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                                                <div className="pt-1 flex items-center justify-between text-[10px] text-gray-400 font-medium">
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