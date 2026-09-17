import { Link, usePage } from '@inertiajs/react';
import {
    ShieldCheck,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowRight,
    Utensils,
    FileText,
} from 'lucide-react';

export default function SellerVerificationSection({ verification, className = '' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isVerified = user?.role === 'verified_seller';
    const isAdmin = user?.role === 'admin';

    return (
        <section className={className}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900">
                            Verifikasi Penjual Olahan
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Izin standar untuk menjual produk olahan pangan dan kuliner UMKM desa.
                        </p>
                    </div>
                </div>

                {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        Terverifikasi
                    </span>
                ) : isAdmin ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-xs font-semibold">
                        Administrator
                    </span>
                ) : null}
            </div>

            <div className="mt-4">
                {/* 1. KONDISI SUDAH TERVERIFIKASI ATAU ADMIN */}
                {isVerified || isAdmin ? (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-xs space-y-2.5">
                        <p className="text-gray-700 leading-relaxed">
                            {isAdmin
                                ? 'Akun Administrator BUMDes memiliki akses penuh untuk mengelola seluruh produk, verifikasi, dan transaksi di desa.'
                                : 'Akun Anda telah divalidasi oleh pengelola desa. Anda memiliki izin penuh untuk menjual aneka makanan olahan, siap santap, dan produk UMKM.'}
                        </p>
                        <div className="flex flex-wrap gap-2 text-[11px] font-medium text-emerald-800">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded border border-emerald-200/80">
                                <Utensils size={12} /> Izin jual pangan olahan & siap saji
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded border border-emerald-200/80">
                                <CheckCircle2 size={12} /> Lencana "Penjual Terverifikasi" aktif
                            </span>
                        </div>
                    </div>
                ) : verification?.status === 'pending' ? (
                    /* 2. KONDISI PENGAJUAN SEDANG DITINJAU */
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs space-y-2">
                        <div className="flex items-center gap-2 text-amber-900 font-semibold">
                            <Clock size={16} className="text-amber-600 shrink-0" />
                            Pengajuan Sedang Ditinjau Admin
                        </div>
                        <p className="text-amber-800 leading-relaxed pl-6">
                            Dokumen legalitas dan foto tempat produksi Anda sedang diperiksa. Anda akan menerima notifikasi setelah proses verifikasi selesai.
                        </p>
                        <p className="text-[11px] text-amber-700 pl-6">
                            Diajukan pada: {new Date(verification.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                ) : verification?.status === 'rejected' ? (
                    /* 3. KONDISI PENGAJUAN DITOLAK */
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-xs space-y-3">
                        <div className="flex items-center gap-2 text-red-900 font-semibold">
                            <XCircle size={16} className="text-red-600 shrink-0" />
                            Pengajuan Verifikasi Belum Disetujui
                        </div>
                        <p className="text-red-800 leading-relaxed pl-6">
                            Mohon lengkapi dokumen dan foto tempat produksi sesuai catatan admin untuk mengajukan ulang.
                        </p>
                        {verification.admin_notes && (
                            <div className="ml-6 p-2.5 bg-white rounded border border-red-200 text-xs text-red-900 italic">
                                "{verification.admin_notes}"
                            </div>
                        )}
                        <div className="pt-1 pl-6">
                            <Link
                                href="/seller/apply"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition"
                            >
                                Ajukan Ulang Verifikasi <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* 4. KONDISI BELUM MENGAJUKAN */
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs space-y-3">
                        <p className="text-gray-600 leading-relaxed">
                            Akun standar hanya dapat menjual bahan mentah segar. Untuk menjaga higienitas, <strong>makanan olahan & masakan siap santap</strong> membutuhkan verifikasi pengelola desa.
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-200">
                            <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                <FileText size={12} /> Lampirkan PIRT/NIB/Surat Desa & foto tempat produksi
                            </span>
                            <Link
                                href="/seller/apply"
                                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md transition shrink-0"
                            >
                                Ajukan Verifikasi <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
