import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import Modal from '@/Components/Modal';
import { Head, Link, router } from '@inertiajs/react';
import {
    Flag,
    Package,
    User,
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Eye,
    X,
    Filter,
    Clock,
    FileText,
    Camera,
    Ban,
    Trash2,
    ChevronRight,
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
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    reviewed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dismissed: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusLabels = {
    pending: 'Perlu Ditinjau',
    reviewed: 'Selesai Ditindak',
    dismissed: 'Diabaikan',
};

export default function Reports({ reports = [] }) {
    const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'product' | 'user'
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'reviewed' | 'dismissed'

    const [previewImage, setPreviewImage] = useState(null);

    const [actionModal, setActionModal] = useState({
        show: false,
        reportId: null,
        type: 'review', // 'review' | 'blacklist' | 'dismiss'
        title: '',
        message: '',
        confirmText: '',
        variant: 'danger',
        adminNotes: '',
    });

    const filteredReports = reports.filter((r) => {
        const isProduct = Boolean(r.product_id || r.product);
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
        const url =
            actionModal.type === 'blacklist'
                ? `/admin/reports/${actionModal.reportId}/blacklist`
                : actionModal.type === 'dismiss'
                ? `/admin/reports/${actionModal.reportId}/dismiss`
                : `/admin/reports/${actionModal.reportId}/review`;

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
            <Head title="Moderasi & Laporan Pelanggaran — Admin Replate" />

            {/* Modal Preview Bukti Foto */}
            <Modal show={Boolean(previewImage)} onClose={() => setPreviewImage(null)} maxWidth="2xl">
                <div className="p-4 relative bg-black/95 rounded-2xl flex flex-col items-center">
                    <button
                        type="button"
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition z-10"
                    >
                        <X size={18} />
                    </button>
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Bukti Laporan Penuh"
                            className="max-h-[80vh] w-auto object-contain rounded-lg"
                        />
                    )}
                </div>
            </Modal>

            {/* Action Dialog Modal */}
            <Modal show={actionModal.show} onClose={() => setActionModal((prev) => ({ ...prev, show: false }))} maxWidth="md">
                <form onSubmit={handleActionSubmit} className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`p-2.5 rounded-xl ${
                                actionModal.variant === 'danger'
                                    ? 'bg-red-100 text-red-700'
                                    : actionModal.variant === 'warning'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {actionModal.variant === 'danger' ? <Ban size={22} /> : <AlertTriangle size={22} />}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">{actionModal.title}</h3>
                            <p className="text-xs text-gray-500">{actionModal.message}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Catatan Tindakan Admin (Terkirim ke Notifikasi Terlapor & Pelapor) *
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={actionModal.adminNotes}
                            onChange={(e) => setActionModal((prev) => ({ ...prev, adminNotes: e.target.value }))}
                            placeholder="Tuliskan alasan / keputusan sanksi untuk transparansi warga..."
                            className="w-full text-xs border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setActionModal((prev) => ({ ...prev, show: false }))}
                            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 py-2.5 px-4 text-white text-xs font-semibold rounded-xl transition shadow-xs ${
                                actionModal.variant === 'danger'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : actionModal.variant === 'warning'
                                    ? 'bg-amber-600 hover:bg-amber-700'
                                    : 'bg-gray-700 hover:bg-gray-800'
                            }`}
                        >
                            {actionModal.confirmText}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ShieldAlert className="text-red-600" size={26} />
                            Moderasi & Laporan Komunitas
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Tinjau dan tindak lanjuti laporan ketidaksesuaian produk pangan dan pelanggaran akun warga desa.
                        </p>
                    </div>

                    {pendingCount > 0 && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold self-start sm:self-auto">
                            <Clock size={14} className="text-amber-600" />
                            {pendingCount} Laporan Menunggu Tindakan
                        </div>
                    )}
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Tabs Tipe Laporan */}
                    <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => setTabFilter('all')}
                            className={`px-3 py-1.5 rounded-lg transition ${
                                tabFilter === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Semua ({reports.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTabFilter('product')}
                            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                                tabFilter === 'product' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Package size={13} />
                            Produk ({productCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTabFilter('user')}
                            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                                tabFilter === 'user' ? 'bg-white text-blue-800 shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <User size={13} />
                            Akun Pengguna ({userCount})
                        </button>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400 font-medium">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Perlu Ditinjau (Pending)</option>
                            <option value="reviewed">Selesai Ditindak (Reviewed)</option>
                            <option value="dismissed">Diabaikan (Dismissed)</option>
                        </select>
                    </div>
                </div>

                {/* Reports List */}
                {filteredReports.length > 0 ? (
                    <div className="space-y-4">
                        {filteredReports.map((r) => {
                            const isProductReport = Boolean(r.product_id || r.product);
                            const targetUser = r.reported_user ?? r.product?.user;

                            return (
                                <div
                                    key={r.id}
                                    className={`bg-white rounded-2xl border transition p-6 shadow-2xs space-y-4 ${
                                        r.status === 'pending'
                                            ? 'border-amber-300 ring-1 ring-amber-200'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    {/* Card Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                                                    isProductReport
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                                }`}
                                            >
                                                {isProductReport ? <Package size={20} /> : <User size={20} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                                        {isProductReport ? 'Laporan Produk' : 'Laporan Akun Pengguna'}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-mono">#{r.id}</span>
                                                </div>

                                                <h3 className="text-base font-bold text-gray-900 mt-1">
                                                    {isProductReport ? (
                                                        <span>
                                                            Produk: <span className="text-emerald-900 font-semibold">"{r.product?.title || 'Produk telah dihapus'}"</span>
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            Akun Terlapor: <span className="text-blue-950 font-bold">{targetUser?.name || 'Pengguna'}</span>
                                                        </span>
                                                    )}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-start">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                    statusStyles[r.status] || 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {statusLabels[r.status] || r.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Detail Target & Pelapor Info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                                            <p className="text-[11px] text-gray-400 font-semibold uppercase">Pihak Terlapor</p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-gray-900">{targetUser?.name || 'N/A'}</p>
                                                {targetUser && (
                                                    <span
                                                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                                            targetUser.is_blacklisted
                                                                ? 'bg-red-100 text-red-800'
                                                                : targetUser.report_count > 0
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}
                                                    >
                                                        {targetUser.is_blacklisted
                                                            ? 'Ter-Blacklist'
                                                            : `${targetUser.report_count || 0}/3 Pelanggaran`}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-[11px]">
                                                {targetUser?.email} {targetUser?.desa ? `• Desa ${targetUser?.desa}` : ''}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                                            <p className="text-[11px] text-gray-400 font-semibold uppercase">Pihak Pelapor</p>
                                            <p className="font-bold text-gray-900">{r.reporter?.name || 'Anonim'}</p>
                                            <p className="text-gray-500 text-[11px]">
                                                Dilaporkan pada: {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reason & Content */}
                                    <div className="p-4 bg-red-50/70 border border-red-200/80 rounded-xl space-y-2">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={15} className="text-red-600 shrink-0" />
                                            <span className="text-xs font-bold text-red-900">
                                                Alasan: {reasonLabels[r.reason] || r.reason}
                                            </span>
                                        </div>
                                        {r.description && (
                                            <p className="text-xs text-red-950 leading-relaxed pl-5 bg-white/60 p-2.5 rounded-lg border border-red-100">
                                                "{r.description}"
                                            </p>
                                        )}
                                    </div>

                                    {/* Evidence Photo */}
                                    {r.evidence_photo && (
                                        <div className="space-y-1.5">
                                            <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                                <Camera size={14} className="text-gray-400" />
                                                Lampiran Bukti Foto dari Pelapor:
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setPreviewImage(`/storage/${r.evidence_photo}`)}
                                                className="group relative inline-block rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition"
                                            >
                                                <img
                                                    src={`/storage/${r.evidence_photo}`}
                                                    alt="Bukti Laporan"
                                                    className="w-32 h-32 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold gap-1">
                                                    <Eye size={14} /> Lihat Foto
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {/* Admin Notes jika sudah selesai ditinjau */}
                                    {r.admin_notes && (
                                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1">
                                            <span className="font-bold text-gray-700">Catatan Tindakan Admin:</span>
                                            <p className="text-gray-600 italic">"{r.admin_notes}"</p>
                                        </div>
                                    )}

                                    {/* Actions for Pending Reports */}
                                    {r.status === 'pending' && (
                                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Action Review (Sanksi Ringan / Normal) */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActionModal({
                                                            show: true,
                                                            reportId: r.id,
                                                            type: 'review',
                                                            title: isProductReport ? 'Hapus Produk & Beri Peringatan' : 'Beri Surat Peringatan (+1 Warning)',
                                                            message: isProductReport
                                                                ? `Produk "${r.product?.title}" akan dihapus dan penjual akan diberikan +1 catatan pelanggaran.`
                                                                : `Akun "${targetUser?.name}" akan diberikan surat peringatan pelanggaran (+1 count).`,
                                                            confirmText: isProductReport ? 'Hapus Produk + Warning' : 'Kirim Peringatan',
                                                            variant: 'danger',
                                                            adminNotes: isProductReport
                                                                ? 'Produk dihapus karena melanggar ketentuan pangan desa. Penjual diberikan peringatan.'
                                                                : 'Akun diberikan surat peringatan atas pelanggaran yang dilaporkan.',
                                                        })
                                                    }
                                                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition shadow-2xs flex items-center gap-1.5"
                                                >
                                                    {isProductReport ? <Trash2 size={13} /> : <AlertTriangle size={13} />}
                                                    {isProductReport ? 'Hapus Produk + Beri Warning' : 'Beri Peringatan Akun (+1 Warning)'}
                                                </button>

                                                {/* Action Blacklist (Pelanggaran Berat) */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActionModal({
                                                            show: true,
                                                            reportId: r.id,
                                                            type: 'blacklist',
                                                            title: 'Blokir / Blacklist Akun Pengguna Langsung',
                                                            message: `Akun "${targetUser?.name}" akan dinonaktifkan permanen dari seluruh transaksi Replate.`,
                                                            confirmText: 'Blacklist Akun Sekarang',
                                                            variant: 'danger',
                                                            adminNotes: 'Akun diblokir langsung oleh Admin BUMDes karena pelanggaran berat.',
                                                        })
                                                    }
                                                    className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition shadow-2xs flex items-center gap-1.5"
                                                >
                                                    <Ban size={13} className="text-red-400" />
                                                    Blacklist Akun Langsung
                                                </button>
                                            </div>

                                            {/* Dismiss */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActionModal({
                                                        show: true,
                                                        reportId: r.id,
                                                        type: 'dismiss',
                                                        title: 'Abaikan / Tutup Laporan',
                                                        message: 'Laporan akan ditandai sebagai diabaikan tanpa memberikan sanksi pada terlapor.',
                                                        confirmText: 'Abaikan Laporan',
                                                        variant: 'gray',
                                                        adminNotes: 'Laporan diabaikan setelah ditinjau: bukti tidak cukup atau tidak ditemukan pelanggaran.',
                                                    })
                                                }
                                                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
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
                        <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
                        <h3 className="text-base font-bold text-gray-900">Semua Bersih & Aman</h3>
                        <p className="text-xs text-gray-400">Tidak ada laporan yang sesuai dengan filter yang dipilih.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}