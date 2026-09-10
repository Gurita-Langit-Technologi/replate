import { Link, usePage } from '@inertiajs/react';
import {
    ShieldCheck,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowRight,
    Utensils,
    Award,
    Sparkles,
    ChefHat,
    FileText,
} from 'lucide-react';

export default function SellerVerificationSection({ verification, className = '' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isVerified = user?.role === 'verified_seller';
    const isAdmin = user?.role === 'admin';

    return (
        <section className={className}>
            <header className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="text-green-600" size={20} />
                        Status Verifikasi Penjual Olahan
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Status legalitas dan izin untuk menjual produk olahan pangan, makanan matang, dan hasil UMKM desa.
                    </p>
                </div>

                {isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                        <CheckCircle2 size={14} className="text-green-600" />
                        Terverifikasi
                    </span>
                )}
            </header>

            <div className="mt-4 space-y-4">
                {/* 1. KONDISI SUDAH TERVERIFIKASI */}
                {isVerified || isAdmin ? (
                    <div className="bg-green-50/70 border border-green-200 rounded-xl p-4.5 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-600 text-white rounded-lg shrink-0 mt-0.5">
                                <Award size={20} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-green-900">
                                    {isAdmin ? 'Akun Administrator BUMDes' : 'Penjual Olahan Terverifikasi Aktif'}
                                </h3>
                                <p className="text-xs text-green-800 leading-relaxed">
                                    {isAdmin
                                        ? 'Sebagai Admin, Anda memiliki hak penuh untuk mengelola dan memvalidasi seluruh produk dan penjual di desa.'
                                        : 'Akun Anda telah divalidasi oleh BUMDes. Anda memiliki izin penuh untuk menjual seluruh kategori makanan olahan, siap saji, dan produk UMKM.'}
                                </p>
                            </div>
                        </div>

                        {/* Keuntungan yang aktif */}
                        <div className="pt-3 border-t border-green-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-green-900">
                            <div className="flex items-center gap-2 bg-white/70 p-2 rounded-lg border border-green-200">
                                <Utensils size={14} className="text-green-700 shrink-0" />
                                <span>Izin jual makanan matang & olahan</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/70 p-2 rounded-lg border border-green-200">
                                <Award size={14} className="text-green-700 shrink-0" />
                                <span>Lencana resmi "Penjual Olahan"</span>
                            </div>
                        </div>
                    </div>
                ) : verification?.status === 'pending' ? (
                    /* 2. KONDISI PENGAJUAN SEDANG DITINJAU */
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4.5 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
                                <Clock size={20} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-amber-900">
                                    Pengajuan Sedang Ditinjau Admin BUMDes
                                </h3>
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    Dokumen legalitas dan foto tempat produksi Anda sedang diperiksa oleh tim pengawas BUMDes. Anda akan menerima notifikasi setelah proses verifikasi selesai.
                                </p>
                                <p className="text-[11px] text-amber-700 pt-1">
                                    Diajukan pada: <strong>{new Date(verification.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> • Dokumen: <strong>{verification.document_type === 'pirt' ? 'PIRT / NIB' : 'Surat Rekomendasi Desa'}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : verification?.status === 'rejected' ? (
                    /* 3. KONDISI PENGAJUAN DITOLAK */
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4.5 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-600 text-white rounded-lg shrink-0 mt-0.5">
                                <XCircle size={20} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-red-900">
                                    Pengajuan Verifikasi Belum Disetujui
                                </h3>
                                <p className="text-xs text-red-800 leading-relaxed">
                                    Mohon lengkapi dokumen dan foto tempat produksi sesuai catatan admin untuk mengajukan ulang.
                                </p>
                                {verification.admin_notes && (
                                    <div className="mt-2 p-2.5 bg-white rounded-lg border border-red-200 text-xs text-red-800">
                                        <strong>Catatan Admin:</strong> {verification.admin_notes}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Link
                                href="/seller/apply"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
                            >
                                Ajukan Ulang Verifikasi
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* 4. KONDISI BELUM MENGAJUKAN (USER BIASA) */
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4.5 space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                <ChefHat size={16} className="text-green-700" />
                                Ingin Menjual Makanan Olahan atau Produk Kuliner UMKM?
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Akun standar saat ini hanya dapat menjual bahan mentah segar (sayur, buah, sembako mentah). Untuk melindungi higienitas warga, <strong>makanan olahan dan masakan siap santap</strong> membutuhkan verifikasi BUMDes.
                            </p>
                        </div>

                        {/* Manfaat Menjadi Penjual Terverifikasi */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1">
                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                    <Utensils size={13} className="text-green-600" /> Jual Pangan Olahan
                                </span>
                                <p className="text-[11px] text-gray-500">
                                    Bisa menjual masakan matang, kue, selai, dan kuliner siap saji di marketplace.
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1">
                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                    <Award size={13} className="text-blue-600" /> Lencana Resmi
                                </span>
                                <p className="text-[11px] text-gray-500">
                                    Mendapatkan centang / badge "Penjual Olahan" untuk meningkatkan kepercayaan warga.
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1">
                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                    <Sparkles size={13} className="text-amber-600" /> Dukungan UMKM
                                </span>
                                <p className="text-[11px] text-gray-500">
                                    Prioritas kurasi produk dan program pendampingan ekonomi sirkular desa.
                                </p>
                            </div>
                        </div>

                        {/* Tombol Ajukan */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-200/80">
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                <FileText size={13} className="text-gray-400" />
                                Syarat: Foto PIRT/NIB/Surat Desa + Foto Tempat Produksi
                            </div>
                            <Link
                                href="/seller/apply"
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition shrink-0"
                            >
                                Ajukan Verifikasi Penjual Olahan
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
