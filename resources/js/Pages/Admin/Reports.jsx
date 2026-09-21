import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Modal from '@/Components/Modal';
import { Head, Link, router } from '@inertiajs/react';
import {
    Flag,
    Package,
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
    Eye,
    X,
    Filter,
    Clock,
    FileText,
    Camera,
    Video,
    Ban,
    Trash2,
    RotateCcw,
    Check,
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

const statusStyles = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    reviewed: 'bg-gray-100 text-gray-700 border-gray-200',
    dismissed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

const statusLabels = {
    pending: 'Perlu Ditinjau',
    reviewed: 'Selesai Ditindak',
    dismissed: 'Selesai',
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

export default function Reports({ reports = [] }) {
    const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'appeal' | 'product' | 'user'
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'reviewed' | 'dismissed'

    const [previewMedia, setPreviewMedia] = useState(null);

    const [actionModal, setActionModal] = useState({
        show: false,
        reportId: null,
        type: 'review', // 'review' | 'blacklist' | 'dismiss' | 'approve_appeal' | 'reject_appeal'
        title: '',
        message: '',
        confirmText: '',
        variant: 'danger', // 'danger' | 'warning' | 'success' | 'gray'
        adminNotes: '',
    });

    const pendingAppealsCount = reports.filter((r) => r.appeal_status === 'pending').length;

    const filteredReports = reports.filter((r) => {
        const isProduct = Boolean(r.product_id || r.product);
        if (tabFilter === 'appeal' && r.appeal_status !== 'pending') return false;
        if (tabFilter === 'product' && !isProduct) return false;
        if (tabFilter === 'user' && isProduct) return false;
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        return true;
    });

    const pendingCount = reports.filter((r) => r.status === 'pending').length;
    const productCount = reports.filter((r) => Boolean(r.product_id || r.product)).length;
    const userCount = reports.filter((r) => !Boolean(r.product_id || r.product)).length;

    function handleActionSubmit(e) {
        e.preventDefault();
        let url = `/admin/reports/${actionModal.reportId}/review`;

        if (actionModal.type === 'blacklist') {
            url = `/admin/reports/${actionModal.reportId}/blacklist`;
        } else if (actionModal.type === 'dismiss') {
            url = `/admin/reports/${actionModal.reportId}/dismiss`;
        } else if (actionModal.type === 'approve_appeal') {
            url = `/admin/reports/${actionModal.reportId}/appeal/approve`;
        } else if (actionModal.type === 'reject_appeal') {
            url = `/admin/reports/${actionModal.reportId}/appeal/reject`;
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
            <Head title="Moderasi & Laporan — Admin Replate" />

            {/* Modal Preview Media */}
            <Modal show={Boolean(previewMedia)} onClose={() => setPreviewMedia(null)} maxWidth="2xl">
                <div className="p-4 relative bg-slate-900 rounded-2xl flex flex-col items-center">
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

            {/* Action Dialog Modal */}
            <Modal show={actionModal.show} onClose={() => setActionModal((prev) => ({ ...prev, show: false }))} maxWidth="md">
                <form onSubmit={handleActionSubmit} className="p-5 space-y-4">
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
                            <h3 className="text-sm font-bold text-slate-900">{actionModal.title}</h3>
                            <p className="text-xs text-slate-500">{actionModal.message}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Catatan Resmi Tindakan Admin *
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={actionModal.adminNotes}
                            onChange={(e) => setActionModal((prev) => ({ ...prev, adminNotes: e.target.value }))}
                            placeholder="Tuliskan catatan alasan tindakan atau hasil evaluasi..."
                            className="w-full text-xs border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-slate-800 focus:ring-0"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setActionModal((prev) => ({ ...prev, show: false }))}
                            className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
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
                                    : 'bg-slate-900 hover:bg-slate-800'
                            }`}
                        >
                            {actionModal.confirmText}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Moderasi & Laporan Komunitas
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Tinjau laporan ketidaksesuaian produk dan proses pengajuan banding warga desa.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap text-xs sm:text-sm">
                        {pendingAppealsCount > 0 && (
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl font-semibold shadow-xs">
                                <RotateCcw size={15} />
                                {pendingAppealsCount} Banding Masuk
                            </span>
                        )}
                        {pendingCount > 0 && (
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-semibold">
                                <Clock size={15} />
                                {pendingCount} Menunggu Tindakan
                            </span>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex bg-gray-100 p-1.5 rounded-xl text-xs sm:text-sm font-semibold flex-wrap gap-1.5">
                        <button
                            type="button"
                            onClick={() => setTabFilter('all')}
                            className={`px-3.5 py-2 rounded-lg transition ${
                                tabFilter === 'all' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-700 hover:text-gray-900'
                            }`}
                        >
                            Semua ({reports.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTabFilter('appeal')}
                            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
                                tabFilter === 'appeal'
                                    ? 'bg-white text-gray-900 font-bold shadow-xs'
                                    : 'text-gray-700 hover:text-gray-900'
                            }`}
                        >
                            <RotateCcw size={15} />
                            Banding ({pendingAppealsCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTabFilter('product')}
                            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
                                tabFilter === 'product' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-700 hover:text-gray-900'
                            }`}
                        >
                            <Package size={15} />
                            Produk ({productCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTabFilter('user')}
                            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
                                tabFilter === 'user' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-700 hover:text-gray-900'
                            }`}
                        >
                            <User size={15} />
                            Pengguna ({userCount})
                        </button>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <span className="text-gray-600 font-semibold">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:border-gray-800 font-semibold text-gray-800"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Perlu Ditinjau</option>
                            <option value="reviewed">Selesai Ditindak</option>
                            <option value="dismissed">Selesai</option>
                        </select>
                    </div>
                </div>

                {/* Daftar Laporan */}
                {filteredReports.length > 0 ? (
                    <div className="space-y-5">
                        {filteredReports.map((r) => {
                            const isProductReport = Boolean(r.product_id || r.product);
                            const targetUser = r.reported_user ?? r.product?.user;

                            const evidenceList = r.evidence_media_list?.length > 0
                                ? r.evidence_media_list
                                : (r.evidence_photo ? [r.evidence_photo] : []);

                            const appealList = r.appeal_media_list?.length > 0
                                ? r.appeal_media_list
                                : (r.appeal_photo ? [r.appeal_photo] : []);

                            return (
                                <div
                                    key={r.id}
                                    className={`bg-white rounded-2xl border transition p-6 space-y-5 shadow-xs ${
                                        r.appeal_status === 'pending'
                                            ? 'border-gray-400'
                                            : r.status === 'pending'
                                            ? 'border-amber-300'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    {/* Card Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-gray-100">
                                        <div className="flex items-start gap-3.5">
                                            <div className="p-3 bg-gray-100 text-gray-800 rounded-xl shrink-0 mt-0.5">
                                                {isProductReport ? <Package size={22} /> : <User size={22} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                        {isProductReport ? 'Produk' : 'Akun Pengguna'}
                                                    </span>
                                                    <span className="text-xs text-gray-600 font-mono font-bold bg-gray-100 px-2 py-0.5 rounded">#{r.id}</span>
                                                    {r.appeal_status === 'pending' && (
                                                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-900 text-white">
                                                            Ada Banding
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-base font-bold text-gray-900 mt-1">
                                                    {isProductReport
                                                        ? `"${r.product?.title || 'Produk telah dinonaktifkan'}"`
                                                        : targetUser?.name || 'Pengguna'}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 self-start">
                                            <Link
                                                href={`/reports/${r.id}`}
                                                className="text-xs sm:text-sm text-emerald-800 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition"
                                                target="_blank"
                                            >
                                                Lihat Lengkap ↗
                                            </Link>
                                            <span
                                                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                                                    statusStyles[r.status] || 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {statusLabels[r.status] || r.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pihak Terlapor & Pelapor */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <span className="text-xs text-gray-600 font-bold uppercase tracking-wider block">Terlapor:</span>
                                            <p className="font-bold text-gray-900 text-sm sm:text-base mt-1">{targetUser?.name || 'N/A'}</p>
                                            <p className="text-gray-700 text-xs sm:text-sm mt-1">
                                                {targetUser?.email} {targetUser?.desa ? `• Desa ${targetUser?.desa}` : ''}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <span className="text-xs text-gray-600 font-bold uppercase tracking-wider block">Pelapor:</span>
                                            <p className="font-bold text-gray-900 text-sm sm:text-base mt-1">{r.reporter?.name || 'Anonim'}</p>
                                            <p className="text-gray-700 text-xs sm:text-sm mt-1">
                                                {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Alasan Laporan Awal */}
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm space-y-1.5">
                                        <div className="flex items-center gap-2 font-bold text-gray-900">
                                            <AlertCircle size={16} className="text-red-600 shrink-0" />
                                            Alasan: {reasonLabels[r.reason] || r.reason}
                                        </div>
                                        {r.description && (
                                            <p className="text-gray-800 pl-6 leading-relaxed italic font-medium">
                                                "{r.description}"
                                            </p>
                                        )}
                                    </div>

                                    {/* Bukti Pelapor Grid */}
                                    {evidenceList.length > 0 && (
                                        <div className="space-y-2 pt-1">
                                            <p className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                                                <Camera size={15} className="text-gray-600" />
                                                Bukti dari Pelapor ({evidenceList.length} berkas):
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                                    )}

                                    {/* Catatan Admin Sebelumnya */}
                                    {r.admin_notes && (
                                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm space-y-1">
                                            <span className="font-bold text-gray-800">Catatan Tindakan:</span>
                                            <p className="text-gray-800 italic font-medium">"{r.admin_notes}"</p>
                                        </div>
                                    )}

                                    {/* SECTION BANDING DARI PENJUAL */}
                                    {r.appeal_status && (
                                        <div
                                            className={`p-5 rounded-2xl border space-y-3.5 shadow-xs ${
                                                r.appeal_status === 'pending'
                                                    ? 'bg-amber-50 border-amber-300'
                                                    : r.appeal_status === 'approved'
                                                    ? 'bg-emerald-50 border-emerald-300'
                                                    : 'bg-red-50 border-red-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                                <div className="flex items-center gap-2 font-bold text-gray-900">
                                                    <RotateCcw size={16} className="text-gray-800" />
                                                    Sanggahan Banding Penjual
                                                </div>
                                                <span
                                                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                                        r.appeal_status === 'pending'
                                                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                                            : r.appeal_status === 'approved'
                                                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                                            : 'bg-red-100 text-red-900 border border-red-300'
                                                    }`}
                                                >
                                                    {r.appeal_status === 'pending'
                                                        ? 'Menunggu Respon'
                                                        : r.appeal_status === 'approved'
                                                        ? 'Banding Diterima'
                                                        : 'Banding Ditolak'}
                                                </span>
                                            </div>

                                            <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-xs sm:text-sm">
                                                <p className="text-gray-900 italic font-medium leading-relaxed">"{r.appeal_notes}"</p>
                                            </div>

                                            {appealList.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                                                        <Camera size={14} className="text-gray-600" />
                                                        Bukti Sanggahan Penjual ({appealList.length} berkas):
                                                    </p>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

                                            {r.appeal_admin_notes && (
                                                <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm">
                                                    <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">Keputusan Banding:</span>
                                                    <p className="text-gray-800 italic font-medium mt-1">"{r.appeal_admin_notes}"</p>
                                                </div>
                                            )}

                                            {/* Action Buttons for Pending Appeal */}
                                            {r.appeal_status === 'pending' && (
                                                <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setActionModal({
                                                                show: true,
                                                                reportId: r.id,
                                                                type: 'approve_appeal',
                                                                title: 'Terima Banding Penjual',
                                                                message: 'Produk akan diaktifkan kembali dan catatan peringatan penjual dikurangi.',
                                                                confirmText: 'Terima & Pulihkan',
                                                                variant: 'success',
                                                                adminNotes: 'Banding disetujui setelah ditinjau ulang oleh pengelola.',
                                                            })
                                                        }
                                                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
                                                    >
                                                        <Check size={16} />
                                                        Terima Banding
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setActionModal({
                                                                show: true,
                                                                reportId: r.id,
                                                                type: 'reject_appeal',
                                                                title: 'Tolak Banding Penjual',
                                                                message: 'Sanksi moderasi sebelumnya akan tetap berlaku.',
                                                                confirmText: 'Tolak Banding',
                                                                variant: 'danger',
                                                                adminNotes: 'Banding ditolak setelah evaluasi: bukti tidak mencukupi.',
                                                            })
                                                        }
                                                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
                                                    >
                                                        <XCircle size={16} />
                                                        Tolak Banding
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Awal untuk Laporan Pending Tanpa Banding */}
                                    {r.status === 'pending' && !r.appeal_status && (
                                        <div className="pt-3.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActionModal({
                                                            show: true,
                                                            reportId: r.id,
                                                            type: 'review',
                                                            title: isProductReport ? 'Hapus Produk & Beri Peringatan' : 'Beri Peringatan Akun (+1 Warning)',
                                                            message: isProductReport
                                                                ? `Produk "${r.product?.title}" akan dinonaktifkan dan penjual diberikan +1 peringatan.`
                                                                : `Pengguna "${targetUser?.name}" akan diberikan surat peringatan pelanggaran.`,
                                                            confirmText: isProductReport ? 'Hapus Produk + Warning' : 'Kirim Peringatan',
                                                            variant: 'danger',
                                                            adminNotes: isProductReport
                                                                ? 'Produk dinonaktifkan karena melanggar ketentuan pangan desa.'
                                                                : 'Akun diberikan peringatan atas pelanggaran yang dilaporkan.',
                                                        })
                                                    }
                                                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
                                                >
                                                    {isProductReport ? <Trash2 size={16} /> : <AlertCircle size={16} />}
                                                    {isProductReport ? 'Hapus Produk + Warning' : 'Beri Peringatan Akun'}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActionModal({
                                                            show: true,
                                                            reportId: r.id,
                                                            type: 'blacklist',
                                                            title: 'Blokir Akun Pengguna',
                                                            message: `Akun "${targetUser?.name}" akan dinonaktifkan dari transaksi.`,
                                                            confirmText: 'Blokir Akun',
                                                            variant: 'danger',
                                                            adminNotes: 'Akun dinonaktifkan oleh pengelola karena pelanggaran berat.',
                                                        })
                                                    }
                                                    className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
                                                >
                                                    <Ban size={16} />
                                                    Blokir Akun
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActionModal({
                                                        show: true,
                                                        reportId: r.id,
                                                        type: 'dismiss',
                                                        title: 'Abaikan Laporan',
                                                        message: 'Laporan akan ditutup tanpa memberikan sanksi pada terlapor.',
                                                        confirmText: 'Abaikan Laporan',
                                                        variant: 'gray',
                                                        adminNotes: 'Laporan diabaikan setelah ditinjau: bukti tidak cukup atau tidak ditemukan pelanggaran.',
                                                    })
                                                }
                                                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl transition"
                                            >
                                                Abaikan Laporan
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 space-y-2">
                        <CheckCircle size={36} className="mx-auto text-emerald-600" />
                        <h3 className="text-base font-bold text-gray-900">Tidak Ada Laporan</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Tidak ada data laporan pada kategori ini.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}