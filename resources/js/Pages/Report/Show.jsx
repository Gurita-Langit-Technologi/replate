import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Modal from '@/Components/Modal';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Package,
    User,
    Camera,
    Video,
    Eye,
    X,
    CheckCircle,
    Clock,
    Send,
    ArrowLeft,
    FileText,
    Info,
    XCircle,
    Image as ImageIcon,
    Plus,
    Shield,
    Trash2,
    Ban,
    RotateCcw,
    Check,
    ExternalLink,
    Phone,
    MapPin,
    Mail,
    AlertTriangle,
} from 'lucide-react';

const reasonLabels = {
    tidak_sesuai_foto: 'Tidak Sesuai Foto',
    kondisi_buruk: 'Kondisi Lebih Buruk / Basi',
    produk_tidak_layak: 'Produk Tidak Layak Konsumsi',
    penipuan: 'Penipuan / Informasi Palsu',
    dispute_spoiled: 'Pangan Basi Saat Diterima (Dispute)',
    produk_dilarang: 'Produk Dilarang / Melanggar Aturan',
    akun_palsu: 'Akun Palsu / Identitas Meragukan',
    pelecehan_abusive: 'Perilaku Kasar / Pelecehan',
    penipuan_transaksi: 'Penipuan Transaksi / Barter',
    ghosting_tidak_hadir: 'Tidak Hadir / Membatalkan Sepihak',
    spam_promosi: 'Spam / Promosi Tidak Pantas',
    lainnya: 'Pelanggaran Lainnya',
};

const statusConfig = {
    pending: { label: 'Perlu Ditinjau', style: 'bg-amber-50 text-amber-800 border-amber-200' },
    reviewed: { label: 'Selesai Ditindak', style: 'bg-rose-50 text-rose-800 border-rose-200' },
    dismissed: { label: 'Selesai / Ditutup', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
};

function isVideoFile(path) {
    if (!path) return false;
    const clean = path.split('?')[0].toLowerCase();
    return (
        clean.endsWith('.mp4') ||
        clean.endsWith('.webm') ||
        clean.endsWith('.mov') ||
        clean.endsWith('.ogg') ||
        clean.endsWith('.mkv')
    );
}

export default function Show({ report, isReportedUser, isReporter, isAdmin }) {
    const [previewMedia, setPreviewMedia] = useState(null);
    const [mediaPreviews, setMediaPreviews] = useState([]);

    // Action Modal for Admin
    const [actionModal, setActionModal] = useState({
        show: false,
        type: 'review', // 'review' | 'blacklist' | 'dismiss' | 'approve_appeal' | 'reject_appeal'
        title: '',
        message: '',
        confirmText: '',
        variant: 'danger', // 'danger' | 'warning' | 'success' | 'gray'
        adminNotes: '',
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        appeal_notes: '',
        appeal_photos: [],
    });

    const isProductReport = Boolean(report.product_id || report.product);
    const targetUser = report.reported_user ?? report.product?.user;

    const evidenceList = report.evidence_media_list?.length > 0
        ? report.evidence_media_list
        : (report.evidence_photo ? [report.evidence_photo] : []);

    const appealList = report.appeal_media_list?.length > 0
        ? report.appeal_media_list
        : (report.appeal_photo ? [report.appeal_photo] : []);

    function handleMediaChange(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const currentTotal = mediaPreviews.length;
        const availableSlots = 4 - currentTotal;

        if (availableSlots <= 0) {
            alert('Maksimal lampiran adalah 4 berkas.');
            return;
        }

        const filesToAdd = files.slice(0, availableSlots);
        const newPreviews = filesToAdd.map((file) => ({
            url: URL.createObjectURL(file),
            isVideo: file.type.startsWith('video/') || isVideoFile(file.name),
            file,
        }));

        const updatedPreviews = [...mediaPreviews, ...newPreviews];
        setMediaPreviews(updatedPreviews);
        setData('appeal_photos', updatedPreviews.map((p) => p.file));
    }

    function removeMedia(index) {
        const itemToRemove = mediaPreviews[index];
        if (itemToRemove?.url) {
            URL.revokeObjectURL(itemToRemove.url);
        }
        const updatedPreviews = mediaPreviews.filter((_, i) => i !== index);
        setMediaPreviews(updatedPreviews);
        setData('appeal_photos', updatedPreviews.map((p) => p.file));
    }

    function handleSubmitAppeal(e) {
        e.preventDefault();
        post(`/reports/${report.id}/appeal`, {
            onSuccess: () => {
                reset();
                mediaPreviews.forEach((p) => URL.revokeObjectURL(p.url));
                setMediaPreviews([]);
            },
        });
    }

    function handleAdminActionSubmit(e) {
        e.preventDefault();
        let url = `/admin/reports/${report.id}/review`;

        if (actionModal.type === 'blacklist') {
            url = `/admin/reports/${report.id}/blacklist`;
        } else if (actionModal.type === 'dismiss') {
            url = `/admin/reports/${report.id}/dismiss`;
        } else if (actionModal.type === 'approve_appeal') {
            url = `/admin/reports/${report.id}/appeal/approve`;
        } else if (actionModal.type === 'reject_appeal') {
            url = `/admin/reports/${report.id}/appeal/reject`;
        }

        router.patch(
            url,
            { admin_notes: actionModal.adminNotes },
            {
                onSuccess: () => {
                    setActionModal((prev) => ({ ...prev, show: false, adminNotes: '' }));
                },
            }
        );
    }

    return (
        <AppLayout>
            <Head title={`Laporan #${report.id} — ${isAdmin ? 'Tinjauan Pengawas' : 'Detail Laporan'}`} />

            {/* Modal Preview Media */}
            <Modal show={Boolean(previewMedia)} onClose={() => setPreviewMedia(null)} maxWidth="2xl">
                <div className="p-4 relative bg-gray-900 rounded-xl flex flex-col items-center">
                    <button
                        type="button"
                        onClick={() => setPreviewMedia(null)}
                        className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition z-10"
                    >
                        <X size={18} />
                    </button>
                    {previewMedia && (
                        previewMedia.isVideo ? (
                            <video
                                src={previewMedia.url}
                                controls
                                autoPlay
                                className="max-h-[75vh] w-full max-w-2xl rounded-lg"
                            />
                        ) : (
                            <img
                                src={previewMedia.url}
                                alt="Bukti Penuh"
                                className="max-h-[75vh] w-auto object-contain rounded-lg"
                            />
                        )
                    )}
                </div>
            </Modal>

            {/* Modal Konfirmasi Tindakan Admin */}
            <Modal show={actionModal.show} onClose={() => setActionModal((prev) => ({ ...prev, show: false }))} maxWidth="md">
                <form onSubmit={handleAdminActionSubmit} className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`p-2.5 rounded-xl ${
                                actionModal.variant === 'success'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : actionModal.variant === 'danger'
                                    ? 'bg-rose-50 text-rose-700'
                                    : actionModal.variant === 'warning'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-slate-100 text-slate-700'
                            }`}
                        >
                            {actionModal.variant === 'success' ? (
                                <CheckCircle size={20} />
                            ) : actionModal.variant === 'danger' ? (
                                <Ban size={20} />
                            ) : (
                                <AlertCircle size={20} />
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">{actionModal.title}</h3>
                            <p className="text-xs text-gray-500">{actionModal.message}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Catatan Resmi Pengelola BUMDes *
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={actionModal.adminNotes}
                            onChange={(e) => setActionModal((prev) => ({ ...prev, adminNotes: e.target.value }))}
                            placeholder="Tuliskan catatan alasan tindakan atau hasil evaluasi pengawas..."
                            className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-800 focus:ring-0"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setActionModal((prev) => ({ ...prev, show: false }))}
                            className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 py-2 px-3 text-white text-xs font-semibold rounded-lg transition ${
                                actionModal.variant === 'success'
                                    ? 'bg-emerald-600 hover:bg-emerald-700'
                                    : actionModal.variant === 'danger'
                                    ? 'bg-rose-600 hover:bg-rose-700'
                                    : actionModal.variant === 'warning'
                                    ? 'bg-amber-600 hover:bg-amber-700'
                                    : 'bg-gray-900 hover:bg-gray-800'
                            }`}
                        >
                            {actionModal.confirmText}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Navigasi */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {isAdmin ? (
                            <>
                                <Link
                                    href="/admin/reports"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900 transition bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200"
                                >
                                    <ArrowLeft size={16} />
                                    Kembali ke Moderasi Laporan
                                </Link>
                                <Link
                                    href="/notifications"
                                    className="text-xs text-gray-600 hover:text-gray-900 font-medium px-2.5 py-1.5"
                                >
                                    Notifikasi
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/notifications"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl"
                            >
                                <ArrowLeft size={16} />
                                Kembali ke Notifikasi
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                        <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">#{report.id}</span>
                        {isAdmin && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gray-900 text-white">
                                <Shield size={13} /> Mode Pengawas
                            </span>
                        )}
                        <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                                statusConfig[report.status]?.style || 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                        >
                            {statusConfig[report.status]?.label || report.status}
                        </span>
                    </div>
                </div>

                {/* Judul & Context Header */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                    <div className="flex items-start sm:items-center gap-3.5">
                        <div className={`p-3 rounded-xl border ${
                            isAdmin
                                ? 'bg-slate-100 text-slate-800 border-slate-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                            {isAdmin ? <Shield size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                                {isAdmin
                                    ? `Tinjauan Laporan #${report.id} — ${isProductReport ? 'Produk Pangan' : 'Akun Pengguna'}`
                                    : isProductReport ? 'Laporan Produk' : 'Laporan Pengguna'}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {isAdmin
                                    ? 'Panel evaluasi pengawas BUMDes: periksa bukti laporan, identitas pihak terkait, dan eksekusi tindakan.'
                                    : isReporter
                                    ? 'Detail laporan yang Anda ajukan dan status tindak lanjut oleh pengelola.'
                                    : 'Detail laporan dan formulir sanggahan/klarifikasi kepada pengelola desa.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Pihak Terlapor & Pelapor (Khusus Admin / Supervisor) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Terlapor */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                <User size={14} className="text-red-500" /> Pihak Terlapor ({isProductReport ? 'Pemilik Produk' : 'Pengguna'})
                            </span>
                            {targetUser?.role === 'verified_seller' && (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                                    Penjual Terverifikasi
                                </span>
                            )}
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm">
                            <p className="font-bold text-gray-900 text-base">{targetUser?.name || 'N/A'}</p>
                            <div className="flex flex-col gap-1.5 text-gray-700 pt-1">
                                <span className="flex items-center gap-2 text-xs sm:text-sm">
                                    <Mail size={14} className="text-gray-500 shrink-0" />
                                    {targetUser?.email || '-'}
                                </span>
                                {targetUser?.whatsapp_number && (
                                    <span className="flex items-center gap-2 text-xs sm:text-sm">
                                        <Phone size={14} className="text-gray-500 shrink-0" />
                                        {targetUser.whatsapp_number}
                                    </span>
                                )}
                                {targetUser?.desa && (
                                    <span className="flex items-center gap-2 text-xs sm:text-sm">
                                        <MapPin size={14} className="text-gray-500 shrink-0" />
                                        Desa {targetUser.desa}, Kec. {targetUser.kecamatan || 'Bambanglipuro'}
                                    </span>
                                )}
                                {isAdmin && targetUser?.report_count > 0 && (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md mt-1 w-fit">
                                        <AlertTriangle size={13} /> Akumulasi Peringatan: {targetUser.report_count}/3
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pelapor */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                <User size={14} className="text-emerald-700" /> Pihak Pelapor
                            </span>
                            <span className="text-xs text-gray-600 font-medium">
                                {new Date(report.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm">
                            <p className="font-bold text-gray-900 text-base">{report.reporter?.name || 'Warga Desa'}</p>
                            <div className="flex flex-col gap-1.5 text-gray-700 pt-1">
                                <span className="flex items-center gap-2 text-xs sm:text-sm">
                                    <Mail size={14} className="text-gray-500 shrink-0" />
                                    {report.reporter?.email || '-'}
                                </span>
                                {report.reporter?.desa && (
                                    <span className="flex items-center gap-2 text-xs sm:text-sm">
                                        <MapPin size={14} className="text-gray-500 shrink-0" />
                                        Desa {report.reporter.desa}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Catatan Resmi Pengelola (Jika Ada) */}
                {report.admin_notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs sm:text-sm space-y-1.5 shadow-xs">
                        <div className="flex items-center gap-2 text-amber-900 font-bold">
                            <Info size={16} className="text-amber-700" />
                            Catatan Resmi Pengelola BUMDes:
                        </div>
                        <p className="text-amber-950 leading-relaxed pl-6 italic font-medium">
                            "{report.admin_notes}"
                        </p>
                    </div>
                )}

                {/* Detail Objek & Bukti Laporan */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-xs">
                    <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                        <div className="flex items-start gap-3.5">
                            <div className="p-3 bg-gray-100 text-gray-700 rounded-xl shrink-0 mt-0.5">
                                {isProductReport ? <Package size={22} /> : <User size={22} />}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    {isProductReport ? 'Objek Produk yang Dilaporkan' : 'Objek Akun yang Dilaporkan'}
                                </p>
                                <p className="text-base font-bold text-gray-900 mt-0.5">
                                    {isProductReport ? report.product?.title || 'Produk telah dinonaktifkan' : targetUser?.name}
                                </p>
                                {isProductReport && report.product?.category && (
                                    <span className="inline-block mt-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                                        Kategori: {report.product.category.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {isProductReport && report.product && (
                            <Link
                                href={`/products/${report.product.id}`}
                                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition"
                                target="_blank"
                            >
                                Lihat Produk <ExternalLink size={14} />
                            </Link>
                        )}
                    </div>

                    {/* Alasan Laporan */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm space-y-2">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <AlertCircle size={16} className="text-red-600 shrink-0" />
                            Alasan: {reasonLabels[report.reason] || report.reason}
                        </div>
                        {report.description ? (
                            <p className="text-gray-800 pl-6 leading-relaxed italic font-medium">
                                "{report.description}"
                            </p>
                        ) : (
                            <p className="text-gray-500 pl-6 italic text-xs">
                                (Pelapor tidak menyertakan deskripsi tambahan)
                            </p>
                        )}
                    </div>

                    {/* Bukti Foto / Video dari Pelapor */}
                    {evidenceList.length > 0 ? (
                        <div className="space-y-3 pt-2">
                            <p className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Camera size={16} className="text-gray-600" />
                                Bukti dari Pelapor ({evidenceList.length} berkas):
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                                {evidenceList.map((item, idx) => {
                                    const isVid = isVideoFile(item);
                                    return (
                                        <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-900 aspect-square flex items-center justify-center shadow-xs">
                                            {isVid ? (
                                                <video
                                                    src={`/storage/${item}`}
                                                    controls
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPreviewMedia({
                                                            url: `/storage/${item}`,
                                                            isVideo: false,
                                                        })
                                                    }
                                                    className="group relative w-full h-full block bg-gray-100"
                                                >
                                                    <img
                                                        src={`/storage/${item}`}
                                                        alt={`Bukti #${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                                        <Eye size={15} /> Lihat Bukti
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 italic pt-1">
                            Tidak ada berkas bukti foto/video yang dilampirkan pelapor.
                        </p>
                    )}
                </div>

                {/* Section Sanggahan Banding Penjual (Jika Ada) */}
                {report.appeal_status && (
                    <div
                        className={`rounded-2xl border p-6 space-y-4 shadow-xs ${
                            report.appeal_status === 'pending'
                                ? 'bg-white border-amber-300'
                                : report.appeal_status === 'approved'
                                ? 'bg-emerald-50 border-emerald-300'
                                : 'bg-red-50 border-red-300'
                        }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${
                                    report.appeal_status === 'pending'
                                        ? 'bg-amber-100 text-amber-800'
                                        : report.appeal_status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    <RotateCcw size={18} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">
                                        Sanggahan Banding Terlapor
                                    </h3>
                                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                                        Diajukan pada: {new Date(report.appealed_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold self-start sm:self-auto ${
                                    report.appeal_status === 'pending'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : report.appeal_status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-red-100 text-red-800 border border-red-300'
                                }`}
                            >
                                {report.appeal_status === 'pending'
                                    ? 'Menunggu Keputusan Pengawas'
                                    : report.appeal_status === 'approved'
                                    ? 'Banding Disetujui'
                                    : 'Banding Ditolak'}
                            </span>
                        </div>

                        {/* Isi Sanggahan */}
                        <div className="p-4 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm space-y-1.5">
                            <span className="font-bold text-gray-700 block text-xs uppercase tracking-wider">
                                Alasan / Kronologi Sanggahan:
                            </span>
                            <p className="text-gray-900 italic leading-relaxed font-medium">
                                "{report.appeal_notes}"
                            </p>
                        </div>

                        {/* Bukti Sanggahan Lampiran */}
                        {appealList.length > 0 && (
                            <div className="space-y-2 pt-1">
                                <span className="font-bold text-gray-800 block text-xs sm:text-sm flex items-center gap-2">
                                    <Camera size={15} className="text-gray-600" />
                                    Bukti Lampiran Banding ({appealList.length} berkas):
                                </span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                                    {appealList.map((item, idx) => {
                                        const isVid = isVideoFile(item);
                                        return (
                                            <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-900 aspect-square flex items-center justify-center shadow-xs">
                                                {isVid ? (
                                                    <video
                                                        src={`/storage/${item}`}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setPreviewMedia({
                                                                url: `/storage/${item}`,
                                                                isVideo: false,
                                                            })
                                                        }
                                                        className="group relative w-full h-full block bg-gray-100"
                                                    >
                                                        <img
                                                            src={`/storage/${item}`}
                                                            alt={`Sanggahan #${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                                            <Eye size={15} /> Lihat Bukti
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Catatan Keputusan Banding */}
                        {report.appeal_admin_notes && (
                            <div className="p-4 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm space-y-1.5">
                                <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">
                                    Catatan Keputusan Pengawas Banding:
                                </span>
                                <p className="text-gray-800 italic font-medium leading-relaxed">"{report.appeal_admin_notes}"</p>
                            </div>
                        )}

                        {/* Tombol Eksekusi Banding untuk Admin */}
                        {isAdmin && report.appeal_status === 'pending' && (
                            <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActionModal({
                                            show: true,
                                            type: 'approve_appeal',
                                            title: 'Terima Banding Penjual',
                                            message: 'Produk akan diaktifkan kembali dan catatan peringatan penjual dikurangi.',
                                            confirmText: 'Terima & Pulihkan',
                                            variant: 'success',
                                            adminNotes: 'Banding disetujui setelah ditinjau ulang oleh pengelola.',
                                        })
                                    }
                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
                                >
                                    <Check size={16} />
                                    Terima Banding (Pulihkan Produk)
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActionModal({
                                            show: true,
                                            type: 'reject_appeal',
                                            title: 'Tolak Banding Penjual',
                                            message: 'Sanksi moderasi sebelumnya akan tetap berlaku penuh.',
                                            confirmText: 'Tolak Banding',
                                            variant: 'danger',
                                            adminNotes: 'Banding ditolak setelah evaluasi: bukti sanggahan tidak mencukupi.',
                                        })
                                    }
                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
                                >
                                    <XCircle size={16} />
                                    Tolak Banding
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Panel Tindakan Pengawas (Khusus Admin pada Laporan Pending) */}
                {isAdmin && report.status === 'pending' && !report.appeal_status && (
                    <div className="bg-white rounded-2xl border-2 border-amber-400 p-6 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2.5 text-amber-950 font-bold text-base">
                            <Shield size={20} className="text-amber-700" />
                            Aksi Keputusan Moderasi Pengawas
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                            Pilih tindakan tegas untuk menangani laporan ini. Keputusan Anda akan dicatat dan diberitahukan kepada kedua belah pihak.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() =>
                                    setActionModal({
                                        show: true,
                                        type: 'review',
                                        title: isProductReport ? 'Hapus Produk & Beri Peringatan' : 'Beri Peringatan Akun (+1 Warning)',
                                        message: isProductReport
                                            ? `Produk "${report.product?.title}" akan dinonaktifkan dan penjual diberikan +1 peringatan.`
                                            : `Pengguna "${targetUser?.name}" akan diberikan surat peringatan pelanggaran.`,
                                        confirmText: isProductReport ? 'Hapus Produk + Warning' : 'Kirim Peringatan',
                                        variant: 'danger',
                                        adminNotes: isProductReport
                                            ? 'Produk dinonaktifkan karena melanggar ketentuan pangan desa.'
                                            : 'Akun diberikan peringatan atas pelanggaran yang dilaporkan.',
                                    })
                                }
                                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
                            >
                                {isProductReport ? <Trash2 size={16} /> : <AlertCircle size={16} />}
                                {isProductReport ? 'Hapus Produk & Peringatkan' : 'Beri Peringatan Akun'}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setActionModal({
                                        show: true,
                                        type: 'blacklist',
                                        title: 'Blokir Akun Pengguna',
                                        message: `Akun "${targetUser?.name}" akan dinonaktifkan dari seluruh transaksi Replate.`,
                                        confirmText: 'Blokir Akun Permanen',
                                        variant: 'danger',
                                        adminNotes: 'Akun dinonaktifkan oleh pengelola karena pelanggaran berat.',
                                    })
                                }
                                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
                            >
                                <Ban size={16} />
                                Blokir Akun
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setActionModal({
                                        show: true,
                                        type: 'dismiss',
                                        title: 'Abaikan Laporan',
                                        message: 'Laporan akan ditutup tanpa memberikan sanksi pada terlapor.',
                                        confirmText: 'Abaikan & Tutup',
                                        variant: 'gray',
                                        adminNotes: 'Laporan diabaikan setelah ditinjau: bukti tidak cukup atau tidak ditemukan pelanggaran.',
                                    })
                                }
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl transition ml-auto"
                            >
                                Abaikan Laporan
                            </button>
                        </div>
                    </div>
                )}

                {/* Form Banding untuk Penjual/Terlapor */}
                {!report.appeal_status && isReportedUser && !isAdmin && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-100 text-gray-800 rounded-xl">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Ajukan Banding / Klarifikasi</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                    Jika Anda merasa laporan ini keliru atau memiliki bukti kondisi barang sebenarnya, kirimkan sanggahan Anda di bawah ini.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitAppeal} className="space-y-4 pt-3 border-t border-gray-100">
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                                    Penjelasan Sanggahan *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={data.appeal_notes}
                                    onChange={(e) => setData('appeal_notes', e.target.value)}
                                    placeholder="Tuliskan penjelasan kondisi sebenarnya saat produk diserahkan atau klarifikasi detail lainnya..."
                                    className="w-full text-xs sm:text-sm border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:border-gray-800 focus:ring-0"
                                />
                                {errors.appeal_notes && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.appeal_notes}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs sm:text-sm font-bold text-gray-800">
                                        Foto atau Video Bukti (Opsional, Maks 4 Berkas)
                                    </label>
                                    <span className="text-xs text-gray-600 font-medium">
                                        {mediaPreviews.length}/4 Terpilih
                                    </span>
                                </div>

                                {/* Previews Grid */}
                                {mediaPreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3.5">
                                        {mediaPreviews.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-900 aspect-square flex items-center justify-center shadow-xs"
                                            >
                                                {item.isVideo ? (
                                                    <video
                                                        src={item.url}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <img
                                                        src={item.url}
                                                        alt={`Pratinjau #${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-gray-900/90 text-white rounded-lg hover:bg-red-600 transition z-10"
                                                    title="Hapus berkas ini"
                                                >
                                                    <X size={14} />
                                                </button>
                                                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md font-mono font-bold">
                                                    #{idx + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Trigger Upload Button */}
                                {mediaPreviews.length < 4 && (
                                    <div className="flex items-center gap-3.5 flex-wrap">
                                        <label className="cursor-pointer py-2.5 px-4 border border-gray-300 hover:border-gray-400 rounded-xl bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-700">
                                            {mediaPreviews.length === 0 ? (
                                                <>
                                                    <Video size={16} className="text-gray-600" />
                                                    <ImageIcon size={16} className="text-gray-600" />
                                                    Pilih Foto / Video
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={16} className="text-gray-700" />
                                                    Tambah Berkas ({4 - mediaPreviews.length} slot tersisa)
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,video/mp4,video/webm,video/quicktime,video/x-matroska"
                                                onChange={handleMediaChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <span className="text-xs text-gray-500">JPG, PNG, MP4 (Maks 20MB per berkas)</span>
                                    </div>
                                )}
                                {errors.appeal_photos && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.appeal_photos}</p>
                                )}
                            </div>

                            <div className="pt-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50 shadow-xs"
                                >
                                    <Send size={15} />
                                    {processing ? 'Mengirim...' : 'Kirim Banding'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
