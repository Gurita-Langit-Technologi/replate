import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Modal from '@/Components/Modal';
import { Head, Link, useForm } from '@inertiajs/react';
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
    pending: { label: 'Menunggu Ditinjau', style: 'bg-amber-50 text-amber-800 border-amber-200' },
    reviewed: { label: 'Selesai Ditindak', style: 'bg-rose-50 text-rose-800 border-rose-200' },
    dismissed: { label: 'Selesai', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
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

    return (
        <AppLayout>
            <Head title={`Laporan #${report.id}`} />

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

            <div className="max-w-3xl mx-auto space-y-4">
                {/* Header Navigasi */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/notifications"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft size={15} />
                        Kembali ke Notifikasi
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono">#{report.id}</span>
                        <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                                statusConfig[report.status]?.style || 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                        >
                            {statusConfig[report.status]?.label || report.status}
                        </span>
                    </div>
                </div>

                {/* Judul Halaman */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-100">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-gray-900">
                                {isProductReport ? 'Laporan Produk' : 'Laporan Pengguna'}
                            </h1>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Detail laporan dan formulir sanggahan/klarifikasi kepada pengelola.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Catatan Tindakan Admin */}
                {report.admin_notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                            <Info size={15} className="text-amber-700" />
                            Catatan dari Pengelola:
                        </div>
                        <p className="text-amber-950 leading-relaxed pl-5 italic">
                            "{report.admin_notes}"
                        </p>
                    </div>
                )}

                {/* Objek Terlapor */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                    <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                                {isProductReport ? <Package size={18} /> : <User size={18} />}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">
                                    {isProductReport ? 'Produk yang Dilaporkan' : 'Akun Terlapor'}
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {isProductReport ? report.product?.title || 'Produk telah dinonaktifkan' : targetUser?.name}
                                </p>
                            </div>
                        </div>

                        {targetUser && (
                            <div className="text-right text-xs">
                                <span className="text-gray-400 block text-[11px]">Penjual</span>
                                <span className="font-semibold text-gray-800">{targetUser.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Alasan Laporan */}
                    <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                            <AlertCircle size={14} className="text-red-600 shrink-0" />
                            Alasan: {reasonLabels[report.reason] || report.reason}
                        </div>
                        {report.description && (
                            <p className="text-gray-600 pl-5 leading-relaxed italic">
                                "{report.description}"
                            </p>
                        )}
                    </div>

                    {/* Bukti Foto / Video dari Pelapor */}
                    {evidenceList.length > 0 && (
                        <div className="space-y-2 pt-1">
                            <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                <Camera size={14} className="text-gray-400" />
                                Bukti dari Pelapor ({evidenceList.length} berkas):
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {evidenceList.map((item, idx) => {
                                    const isVid = isVideoFile(item);
                                    return (
                                        <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900 aspect-square flex items-center justify-center">
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
                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium gap-1">
                                                        <Eye size={13} /> Lihat
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Banding Sedang Diproses */}
                {report.appeal_status === 'pending' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                                <Clock size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Pengajuan Banding Sedang Ditinjau</h3>
                                <p className="text-xs text-gray-500">
                                    Pengelola sedang memeriksa alasan dan bukti sanggahan Anda.
                                </p>
                            </div>
                        </div>

                        <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-2.5">
                            <div>
                                <span className="font-semibold text-gray-700 block text-[11px] uppercase">Alasan Sanggahan:</span>
                                <p className="text-gray-800 mt-1 italic leading-relaxed">
                                    "{report.appeal_notes}"
                                </p>
                            </div>

                            {appealList.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                    <span className="font-semibold text-gray-700 block text-[11px] uppercase">
                                        Bukti Lampiran ({appealList.length} berkas):
                                    </span>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {appealList.map((item, idx) => {
                                            const isVid = isVideoFile(item);
                                            return (
                                                <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900 aspect-square flex items-center justify-center">
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
                                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium gap-1">
                                                                <Eye size={13} /> Lihat
                                                            </div>
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <p className="text-[11px] text-gray-400">
                                Dikirim pada: {new Date(report.appealed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Banding Diterima */}
                {report.appeal_status === 'approved' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2.5">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle size={18} className="text-emerald-700" />
                            Banding Disetujui
                        </div>
                        <p className="text-xs text-emerald-800 leading-relaxed">
                            Pengelola telah menyetujui klarifikasi Anda. Produk dan status akun Anda telah dipulihkan.
                        </p>
                        {report.appeal_admin_notes && (
                            <p className="text-xs text-emerald-950 italic bg-white p-2.5 rounded-lg border border-emerald-100">
                                Catatan Pengelola: "{report.appeal_admin_notes}"
                            </p>
                        )}
                    </div>
                )}

                {/* Banding Ditolak */}
                {report.appeal_status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-2.5">
                        <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                            <XCircle size={18} className="text-red-700" />
                            Banding Ditolak
                        </div>
                        <p className="text-xs text-red-800 leading-relaxed">
                            Setelah peninjauan bukti ulang, keputusan moderasi tetap berlaku.
                        </p>
                        {report.appeal_admin_notes && (
                            <p className="text-xs text-red-950 italic bg-white p-2.5 rounded-lg border border-red-100">
                                Alasan: "{report.appeal_admin_notes}"
                            </p>
                        )}
                    </div>
                )}

                {/* Form Banding Baru */}
                {!report.appeal_status && isReportedUser && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
                                <FileText size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Ajukan Banding / Klarifikasi</h3>
                                <p className="text-xs text-gray-500">
                                    Jika Anda merasa laporan ini keliru atau memiliki bukti kondisi barang sebenarnya, kirimkan sanggahan Anda di bawah ini.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitAppeal} className="space-y-4 pt-2 border-t border-gray-100">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Penjelasan Sanggahan *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={data.appeal_notes}
                                    onChange={(e) => setData('appeal_notes', e.target.value)}
                                    placeholder="Tuliskan penjelasan kondisi sebenarnya saat produk diserahkan atau klarifikasi detail lainnya..."
                                    className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800"
                                />
                                {errors.appeal_notes && (
                                    <p className="text-xs text-red-600 mt-1">{errors.appeal_notes}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-gray-700">
                                        Foto atau Video Bukti (Opsional, Maks 4 Berkas)
                                    </label>
                                    <span className="text-[11px] text-gray-400">
                                        {mediaPreviews.length}/4 Terpilih
                                    </span>
                                </div>

                                {/* Previews Grid */}
                                {mediaPreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                                        {mediaPreviews.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900 aspect-square flex items-center justify-center"
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
                                                    className="absolute top-1.5 right-1.5 p-1 bg-gray-800/80 text-white rounded hover:bg-red-600 transition z-10"
                                                    title="Hapus berkas ini"
                                                >
                                                    <X size={12} />
                                                </button>
                                                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                                                    #{idx + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Trigger Upload Button */}
                                {mediaPreviews.length < 4 && (
                                    <div className="flex items-center gap-3">
                                        <label className="cursor-pointer py-2 px-3 border border-gray-300 hover:border-gray-400 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2 text-xs font-medium text-gray-700">
                                            {mediaPreviews.length === 0 ? (
                                                <>
                                                    <Video size={14} className="text-gray-500" />
                                                    <ImageIcon size={14} className="text-gray-500" />
                                                    Pilih Foto / Video
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={14} className="text-gray-600" />
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
                                        <span className="text-[11px] text-gray-400">JPG, PNG, MP4 (Maks 20MB per berkas)</span>
                                    </div>
                                )}
                                {errors.appeal_photos && (
                                    <p className="text-xs text-red-600 mt-1">{errors.appeal_photos}</p>
                                )}
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="py-2.5 px-5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    <Send size={13} />
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
