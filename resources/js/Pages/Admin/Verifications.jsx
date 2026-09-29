import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    CheckCircle, XCircle, Clock, FileText, Image as ImageIcon,
    ExternalLink, ChevronRight, User, MapPin, Calendar,
    ShieldCheck, AlertCircle, X, ZoomIn,
} from 'lucide-react';

/* ── Constants ──────────────────────────────────────────── */
const DOC_LABELS = {
    pirt:     { label: 'Izin PIRT',           color: 'bg-blue-100   text-blue-800   border-blue-200'   },
    bpom:     { label: 'Sertifikat BPOM',     color: 'bg-purple-100 text-purple-800 border-purple-200' },
    halal:    { label: 'Sertifikat Halal MUI', color: 'bg-green-100  text-green-800  border-green-200'  },
    nib:      { label: 'NIB (OSS)',            color: 'bg-amber-100  text-amber-800  border-amber-200'  },
    lainnya:  { label: 'Dokumen Lain',         color: 'bg-gray-100   text-gray-700   border-gray-200'   },
};

const STATUS_META = {
    pending:  { label: 'Menunggu Review', icon: Clock,        color: 'bg-amber-100  text-amber-800  border-amber-200'  },
    approved: { label: 'Disetujui',       icon: CheckCircle,  color: 'bg-green-100  text-green-800  border-green-200'  },
    rejected: { label: 'Ditolak',         icon: XCircle,      color: 'bg-red-100    text-red-800    border-red-200'    },
};

const REJECT_TEMPLATES = [
    'Foto dokumen tidak terbaca / buram.',
    'Dokumen yang diunggah tidak sesuai dengan tipe yang dipilih.',
    'Izin PIRT/dokumen sudah kadaluwarsa.',
    'Foto tempat produksi tidak memenuhi standar kebersihan.',
    'Informasi pada dokumen tidak sesuai dengan profil akun.',
];

/* ── Helpers ────────────────────────────────────────────── */
function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60)   return `${diff} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
}

/* ── Status tab ─────────────────────────────────────────── */
function StatusTab({ status, label, count, active, onClick }) {
    const meta = STATUS_META[status] ?? {};
    const Icon = meta.icon ?? Clock;
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                active
                    ? status === 'pending'  ? 'bg-amber-600  text-white border-amber-600'
                    : status === 'approved' ? 'bg-green-700  text-white border-green-700'
                    : status === 'rejected' ? 'bg-red-600    text-white border-red-600'
                    :                         'bg-gray-900   text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
            <Icon size={13} />
            {label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold tabular-nums ${
                active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
                {count}
            </span>
        </button>
    );
}

/* ── Image viewer (lightbox) ─────────────────────────────── */
function PhotoTile({ src, label, alt }) {
    const [lightbox, setLightbox] = useState(false);
    const url = `/storage/${src}`;

    return (
        <>
            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
                <button
                    onClick={() => setLightbox(true)}
                    className="relative w-36 h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group hover:border-emerald-400 transition"
                >
                    <img
                        src={url}
                        alt={alt}
                        onError={(e) => { e.currentTarget.src = '/image/image default.jpg'; }}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition">
                        <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition" />
                    </div>
                </button>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                >
                    <ExternalLink size={11} /> Buka di tab baru
                </a>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center p-4"
                    onClick={() => setLightbox(false)}
                >
                    <button
                        onClick={() => setLightbox(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                    >
                        <X size={28} />
                    </button>
                    <img
                        src={url}
                        alt={alt}
                        className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}

/* ── Reject modal ─────────────────────────────────────────── */
function RejectModal({ verificationId, onClose }) {
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function handleTemplate(t) {
        setNotes((prev) => prev ? prev + ' ' + t : t);
    }

    function handleSubmit() {
        if (!notes.trim()) return;
        setSubmitting(true);
        router.patch(`/admin/verifications/${verificationId}/reject`, { admin_notes: notes }, {
            onFinish: () => { setSubmitting(false); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <XCircle size={20} className="text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-gray-900">Tolak Pengajuan</h3>
                        <p className="text-xs text-gray-500">Alasan akan dikirimkan ke pemohon via notifikasi</p>
                    </div>
                    <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>

                {/* Quick-pick templates */}
                <div className="mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Alasan umum (klik untuk menambah)</p>
                    <div className="flex flex-wrap gap-1.5">
                        {REJECT_TEMPLATES.map((t) => (
                            <button
                                key={t}
                                onClick={() => handleTemplate(t)}
                                className="text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg transition text-left"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tulis catatan detail untuk pemohon..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 resize-none mb-4"
                />

                <div className="flex gap-2.5">
                    <button
                        onClick={handleSubmit}
                        disabled={!notes.trim() || submitting}
                        className="flex-1 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {submitting ? 'Menolak...' : 'Tolak Pengajuan'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Verification card ────────────────────────────────────── */
function VerificationCard({ v, onReject }) {
    const status = STATUS_META[v.status?.value ?? v.status] ?? STATUS_META.pending;
    const StatusIcon = status.icon;
    const docType = DOC_LABELS[v.document_type?.value ?? v.document_type] ?? DOC_LABELS.lainnya;
    const isPending = (v.status?.value ?? v.status) === 'pending';
    const isRejected = (v.status?.value ?? v.status) === 'rejected';

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            {/* Card header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0"
                        style={{
                            background: `hsl(${(v.user?.name?.charCodeAt(0) ?? 0) * 37 % 360},50%,88%)`,
                            color: `hsl(${(v.user?.name?.charCodeAt(0) ?? 0) * 37 % 360},55%,32%)`,
                        }}
                    >
                        {v.user?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div>
                        <p className="text-sm font-extrabold text-gray-900">{v.user?.name}</p>
                        <p className="text-xs text-gray-500">{v.user?.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
                {/* Meta row */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <FileText size={13} className="text-gray-400" />
                        <span className={`font-bold px-2 py-0.5 rounded-md border text-[11px] ${docType.color}`}>{docType.label}</span>
                    </div>
                    {v.user?.desa && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin size={12} className="text-gray-400" />
                            {v.user.desa}{v.user.kecamatan ? `, ${v.user.kecamatan}` : ''}
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} className="text-gray-400" />
                        Diajukan {timeAgo(v.created_at)}
                    </div>
                </div>

                {/* Photos */}
                <div className="flex flex-wrap gap-5">
                    {v.document_photo && (
                        <PhotoTile src={v.document_photo} label="Dokumen Izin" alt="Dokumen" />
                    )}
                    {v.production_photo && (
                        <PhotoTile src={v.production_photo} label="Foto Tempat Produksi" alt="Tempat produksi" />
                    )}
                </div>

                {/* Admin notes (for rejected) */}
                {isRejected && v.admin_notes && (
                    <div className="flex gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 mb-0.5">Alasan Penolakan</p>
                            <p className="text-sm text-red-800">{v.admin_notes}</p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                {isPending && (
                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={() => router.patch(`/admin/verifications/${v.id}/approve`)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition"
                        >
                            <CheckCircle size={16} /> Setujui
                        </button>
                        <button
                            onClick={() => onReject(v.id)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 text-sm font-bold rounded-xl hover:bg-red-100 transition"
                        >
                            <XCircle size={16} /> Tolak
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Main page ────────────────────────────────────────────── */
export default function Verifications({ verifications, statusCounts = {}, filters = {} }) {
    const [rejectTarget, setRejectTarget] = useState(null);
    const activeStatus = filters.status || 'pending';

    function navigate(status) {
        router.get('/admin/verifications', { status }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AppLayout>
            <Head title="Verifikasi Penjual — Admin" />

            {/* Reject modal */}
            {rejectTarget && (
                <RejectModal
                    verificationId={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                />
            )}

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Admin BUMDes</p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Verifikasi Penjual Olahan</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tinjau dan verifikasi pengajuan izin usaha warga sebelum mereka dapat menjual produk olahan.
                    </p>
                </div>

                {/* Status tabs */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'pending',  label: 'Menunggu'   },
                        { key: 'approved', label: 'Disetujui'  },
                        { key: 'rejected', label: 'Ditolak'    },
                        { key: 'all',      label: 'Semua'      },
                    ].map(({ key, label }) => (
                        <StatusTab
                            key={key}
                            status={key}
                            label={label}
                            count={statusCounts[key] ?? 0}
                            active={activeStatus === key}
                            onClick={() => navigate(key)}
                        />
                    ))}
                </div>

                {/* List */}
                {verifications.length > 0 ? (
                    <div className="space-y-4">
                        {verifications.map((v) => (
                            <VerificationCard
                                key={v.id}
                                v={v}
                                onReject={(id) => setRejectTarget(id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">
                        <ShieldCheck size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm font-bold text-gray-500">Tidak ada pengajuan di sini</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {activeStatus === 'pending'
                                ? 'Semua pengajuan sudah diproses.'
                                : 'Ganti filter tab untuk melihat data lain.'}
                        </p>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}