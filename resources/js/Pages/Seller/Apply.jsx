import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShieldCheck,
    Upload,
    FileText,
    Image,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowLeft,
    Building2,
    Check
} from 'lucide-react';

export default function Apply({ existing }) {
    const { data, setData, post, processing, errors } = useForm({
        document_type: 'pirt',
        document_photo: null,
        production_photo: null,
    });

    const [docPreview, setDocPreview] = useState(null);
    const [prodPreview, setProdPreview] = useState(null);

    function handleDocPhoto(e) {
        const file = e.target.files[0];
        if (file) {
            setData('document_photo', file);
            setDocPreview(URL.createObjectURL(file));
        }
    }

    function handleProdPhoto(e) {
        const file = e.target.files[0];
        if (file) {
            setData('production_photo', file);
            setProdPreview(URL.createObjectURL(file));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        post('/seller/apply');
    }

    return (
        <AppLayout>
            <Head title="Verifikasi Penjual Olahan — Replate" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <Link href="/profile" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 mb-3 transition">
                        <ArrowLeft size={14} /> Kembali ke Profil
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Pengajuan Verifikasi Penjual Olahan</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Dapatkan lencana penjual resmi BUMDes untuk menjual produk makanan olahan, siap santap, dan hasil olahan UMKM desa.
                    </p>
                </div>

                {/* Grid Manfaat & Keuntungan Menjadi Verified Seller */}
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 rounded-2xl border border-emerald-200/80 p-5 space-y-3.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-emerald-950">Keuntungan Menjadi Penjual Terverifikasi</h3>
                                <p className="text-[11px] text-emerald-800">Standar higienitas & perlindungan konsumen ekosistem pangan Replate</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-md">
                            Manfaat Resmi
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-200/70 space-y-1">
                            <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                                Izin Unggah Kategori Olahan
                            </p>
                            <p className="text-emerald-800 text-[11px] leading-relaxed">
                                Membuka akses penuh menjual makanan matang siap santap, katering, kue, frozen food, dan pupuk kompos olahan.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-200/70 space-y-1">
                            <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                                Lencana "Verified Seller" Resmi
                            </p>
                            <p className="text-emerald-800 text-[11px] leading-relaxed">
                                Menampilkan centang terverifikasi pada kartu marketplace, halaman produk, dan profil penjual Anda.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-200/70 space-y-1">
                            <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                                Tingkat Kepercayaan Pembeli
                            </p>
                            <p className="text-emerald-800 text-[11px] leading-relaxed">
                                Pembeli lebih yakin bertransaksi karena tempat produksi telah tervalidasi izin usaha PIRT / surat desa.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-200/70 space-y-1">
                            <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                                Perlindungan & Dukungan BUMDes
                            </p>
                            <p className="text-emerald-800 text-[11px] leading-relaxed">
                                Terdata sebagai mitra binaan pangan desa, mendapatkan bantuan promosi, dan prioritas sirkularitas pakan/kompos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Pengajuan Sebelumnya */}
                {existing && (
                    <div className={`p-5 rounded-2xl border ${
                        existing.status === 'pending'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : existing.status === 'approved'
                            ? 'bg-green-50 border-green-200 text-green-900'
                            : 'bg-red-50 border-red-200 text-red-900'
                    }`}>
                        <div className="flex items-start gap-3">
                            {existing.status === 'pending' && <Clock className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />}
                            {existing.status === 'approved' && <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />}
                            {existing.status === 'rejected' && <XCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />}
                            
                            <div className="space-y-1 text-xs">
                                <p className="font-bold text-sm">
                                    {existing.status === 'pending' && 'Pengajuan Sedang Ditinjau Admin BUMDes'}
                                    {existing.status === 'approved' && 'Selamat! Anda Telah Terverifikasi sebagai Penjual Olahan'}
                                    {existing.status === 'rejected' && 'Pengajuan Sebelumnya Ditolak'}
                                </p>
                                <p className="text-gray-600">
                                    {existing.status === 'pending' && 'Admin BUMDes sedang memvalidasi dokumen legalitas & tempat produksi Anda. Notifikasi akan masuk saat selesai ditinjau.'}
                                    {existing.status === 'approved' && 'Anda sekarang dapat mengunggah dan menjual seluruh kategori produk olahan di marketplace Replate.'}
                                    {existing.status === 'rejected' && 'Anda dapat mengajukan ulang formulir di bawah dengan dokumen yang lebih lengkap dan jelas.'}
                                </p>
                                {existing.admin_notes && (
                                    <div className="mt-2 p-2.5 bg-white/80 rounded-xl border border-red-200 text-red-800">
                                        <strong>Catatan Admin:</strong> {existing.admin_notes}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Pengajuan (Jika belum ada atau ditolak) */}
                {(!existing || existing.status === 'rejected') && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-2xs">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1.5">
                            <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                                <ShieldCheck size={16} className="text-green-600" />
                                Mengapa Perlu Verifikasi Penjual Olahan?
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Untuk menjamin keamanan pangan dan higienitas bagi warga desa, produk olahan (makanan siap saji, selai, kue, atau pupuk olahan) memerlukan izin PIRT atau surat keterangan usaha dari BUMDes / Kelurahan setempat.
                            </p>
                        </div>

                        {/* Jenis Dokumen */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Jenis Dokumen Legalitas / Izin Usaha *
                            </label>
                            <select
                                value={data.document_type}
                                onChange={e => setData('document_type', e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                            >
                                <option value="pirt">PIRT (Pangan Industri Rumah Tangga) / NIB Usaha</option>
                                <option value="surat_desa">Surat Keterangan Rekomendasi Kepala Desa / BUMDes</option>
                            </select>
                            {errors.document_type && <p className="text-red-500 text-xs mt-1">{errors.document_type}</p>}
                        </div>

                        {/* Upload Foto Dokumen */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Foto Dokumen Izin / Rekomendasi *
                            </label>
                            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition relative">
                                {docPreview ? (
                                    <div className="space-y-2">
                                        <img src={docPreview} alt="Preview Dokumen" className="max-h-48 mx-auto rounded-lg object-contain" />
                                        <p className="text-xs text-green-700 font-medium">Foto dokumen terpilih</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5 py-3">
                                        <FileText size={28} className="mx-auto text-gray-400" />
                                        <p className="text-xs font-semibold text-gray-700">Unggah foto sertifikat PIRT atau surat desa</p>
                                        <p className="text-[11px] text-gray-400">Format JPG, PNG (Maks 2MB)</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleDocPhoto}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    required
                                />
                            </div>
                            {errors.document_photo && <p className="text-red-500 text-xs mt-1">{errors.document_photo}</p>}
                        </div>

                        {/* Upload Foto Tempat Produksi */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Foto Dapur / Tempat Produksi Higienis *
                            </label>
                            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition relative">
                                {prodPreview ? (
                                    <div className="space-y-2">
                                        <img src={prodPreview} alt="Preview Tempat Produksi" className="max-h-48 mx-auto rounded-lg object-contain" />
                                        <p className="text-xs text-green-700 font-medium">Foto tempat produksi terpilih</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5 py-3">
                                        <Image size={28} className="mx-auto text-gray-400" />
                                        <p className="text-xs font-semibold text-gray-700">Unggah foto dapur / area pengolahan produk</p>
                                        <p className="text-[11px] text-gray-400">Format JPG, PNG (Maks 2MB)</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProdPhoto}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    required
                                />
                            </div>
                            {errors.production_photo && <p className="text-red-500 text-xs mt-1">{errors.production_photo}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !data.document_photo || !data.production_photo}
                            className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Check size={18} />
                            {processing ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Verifikasi'}
                        </button>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}