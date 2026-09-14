import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
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
} from 'lucide-react';

const userReportReasons = [
    { value: 'penipuan_transaksi', label: 'Penipuan Transaksi / Pembayaran / Barter' },
    { value: 'pelecehan_abusive', label: 'Perilaku Kasar, Ancaman, atau Pelecehan' },
    { value: 'akun_palsu', label: 'Akun Palsu / Identitas Meragukan' },
    { value: 'ghosting_tidak_hadir', label: 'Tidak Hadir / Membatalkan Sepihak Berulang Kali' },
    { value: 'spam_promosi', label: 'Spam / Promosi Ilegal' },
    { value: 'lainnya', label: 'Pelanggaran Aturan Desa Lainnya' },
];

export default function Profile({ seller, products, stats }) {
    const { auth } = usePage().props;
    const isSelf = auth?.user?.id === seller.id;
    const isVerified = seller.role === 'verified_seller';

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

    return (
        <AppLayout>
            <Head title={`Profil Penjual — ${seller.name}`} />

            {/* Modal Laporkan Pengguna / Akun */}
            <Modal show={reportModal.show} onClose={() => !reportModal.submitting && setReportModal(prev => ({ ...prev, show: false }))} maxWidth="md">
                <form onSubmit={submitUserReport} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-red-600">
                            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                                <Flag size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Laporkan Akun Pengguna</h3>
                                <p className="text-xs text-gray-500">Laporkan pelanggaran akun "{seller.name}" ke Admin BUMDes</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled={reportModal.submitting}
                            onClick={() => setReportModal(prev => ({ ...prev, show: false }))}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Kategori Pelanggaran Akun *
                            </label>
                            <div className="space-y-1.5">
                                {userReportReasons.map((r) => (
                                    <label
                                        key={r.value}
                                        className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition text-xs ${
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
                                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            reportModal.reason === r.value ? 'border-red-600' : 'border-gray-300'
                                        }`}>
                                            {reportModal.reason === r.value && <div className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                                        </div>
                                        <span>{r.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Rincian / Kronologi Masalah *
                            </label>
                            <textarea
                                required
                                value={reportModal.description}
                                onChange={(e) => setReportModal(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Jelaskan secara rinci tindakan pengguna yang merugikan (sertakan detail waktu/transaksi jika ada)..."
                                rows={3}
                                className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Unggah Bukti Tangkapan Layar / Foto (Opsional, JPG/PNG Maks 3MB)
                            </label>
                            {reportModal.evidence_preview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={reportModal.evidence_preview}
                                        alt="Bukti Laporan Akun"
                                        className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setReportModal(prev => ({ ...prev, evidence_photo: null, evidence_preview: null }))}
                                        className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full shadow-xs"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50/30 rounded-xl cursor-pointer transition text-xs text-gray-600">
                                    <Camera size={16} className="text-gray-400" />
                                    <span>Pilih screenshot chat / bukti pelanggaran</span>
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
                            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
                        >
                            {reportModal.submitting ? 'Mengirim...' : 'Kirim Laporan Akun'}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Seller Info Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl shrink-0">
                                {seller.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-xl font-bold text-gray-900">{seller.name}</h1>
                                    {isVerified && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold shadow-2xs">
                                            <ShieldCheck size={14} className="text-emerald-600" />
                                            Verified Seller
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <MapPin size={13} className="text-gray-400" />
                                    {seller.desa ? `Desa ${seller.desa}` : ''}{seller.kecamatan ? `, Kec. ${seller.kecamatan}` : 'Lokasi belum diset'}
                                </p>
                            </div>
                        </div>

                        {/* Aksi Laporkan Akun */}
                        {!isSelf && auth?.user && (
                            <button
                                type="button"
                                onClick={() => setReportModal(prev => ({ ...prev, show: true }))}
                                className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 rounded-xl text-xs font-medium transition self-start sm:self-auto"
                            >
                                <Flag size={13} />
                                Laporkan Pengguna
                            </button>
                        )}
                    </div>

                    {/* Banner Terverifikasi */}
                    {isVerified && (
                        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-950">
                            <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                                <CheckCircle2 size={16} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold text-emerald-900">Penjual Olahan Terverifikasi Resmi</p>
                                <p className="text-emerald-800 text-[11px]">
                                    Akun ini telah memenuhi syarat legalitas usaha & audit higienitas dapur oleh BUMDes untuk menyajikan pangan olahan dan siap saji.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="bg-gray-50 rounded-xl p-3.5 text-center border border-gray-100">
                            <p className="text-xl font-black text-gray-900">{stats.totalProducts}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Produk Aktif</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3.5 text-center border border-gray-100">
                            <p className="text-xl font-black text-emerald-700">{stats.totalSold}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Transaksi Selesai</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3.5 text-center border border-gray-100">
                            <p className="text-xl font-black text-teal-700">{(stats.totalWeight / 1000).toFixed(1)} <span className="text-xs font-normal">kg</span></p>
                            <p className="text-xs text-gray-500 mt-0.5">Waste Terselamatkan</p>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Produk Pangan dari {seller.name}</h2>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {products.map((product) => {
                                return (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-emerald-500 transition flex flex-col justify-between"
                                    >
                                        <div className="aspect-[4/3] bg-gray-100">
                                            {product.photo ? (
                                                <img src={`/storage/${product.photo}`} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Package size={28} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h3>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                                <span>{product.quantity} {product.unit}</span>
                                                <span>·</span>
                                                <span className="flex items-center gap-0.5">
                                                    <Clock size={10} />
                                                    {formatTimeLeftShort(product.timeout_at)}
                                                </span>
                                            </p>
                                            {product.price ? (
                                                <p className="text-sm font-bold text-emerald-700 mt-1">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                    <span className="text-[11px] text-gray-400 font-normal">/{product.unit || 'satuan'}</span>
                                                </p>
                                            ) : (
                                                <p className="text-sm font-bold text-purple-600 mt-1">
                                                    {product.transaction_mode === 'donate' ? 'Donasi' : 'Barter'}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                            <Package size={32} className="mx-auto text-gray-200 mb-2" />
                            <p className="text-gray-400 text-sm">Belum ada produk aktif dari penjual ini</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}