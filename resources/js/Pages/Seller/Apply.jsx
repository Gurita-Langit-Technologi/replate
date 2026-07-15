import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Apply({ existing }) {
    const { data, setData, post, processing, errors } = useForm({
        document_type: 'pirt',
        document_photo: null,
        production_photo: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/seller/apply');
    }

    const statusStyles = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        approved: 'bg-green-100 text-green-700 border-green-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
    };

    const statusLabels = {
        pending: 'Sedang ditinjau oleh admin',
        approved: 'Disetujui — Anda sudah menjadi penjual olahan',
        rejected: 'Ditolak',
    };

    return (
        <AppLayout>
            <Head title="Pengajuan Penjual Olahan" />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengajuan Penjual Olahan</h1>

                {existing && (
                    <div className={`p-4 rounded-xl border mb-6 ${statusStyles[existing.status]}`}>
                        <p className="font-medium">{statusLabels[existing.status]}</p>
                        {existing.admin_notes && (
                            <p className="text-sm mt-1">Catatan admin: {existing.admin_notes}</p>
                        )}
                    </div>
                )}

                {(!existing || existing.status === 'rejected') && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 mb-2">
                            Untuk menjual produk olahan (kompos, pupuk, selai, dried fruit, dll), Anda perlu diverifikasi oleh admin.
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Jenis dokumen *</label>
                            <select value={data.document_type} onChange={e => setData('document_type', e.target.value)} className="w-full border rounded-lg px-4 py-2">
                                <option value="pirt">PIRT (Pangan Industri Rumah Tangga)</option>
                                <option value="surat_desa">Surat rekomendasi Kepala Desa / BUMDes</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Foto dokumen *</label>
                            <input type="file" accept="image/*" onChange={e => setData('document_photo', e.target.files[0])} className="w-full border rounded-lg px-4 py-2" />
                            {errors.document_photo && <p className="text-red-500 text-sm mt-1">{errors.document_photo}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Foto tempat produksi *</label>
                            <input type="file" accept="image/*" onChange={e => setData('production_photo', e.target.files[0])} className="w-full border rounded-lg px-4 py-2" />
                            {errors.production_photo && <p className="text-red-500 text-sm mt-1">{errors.production_photo}</p>}
                        </div>

                        <button type="submit" disabled={processing} className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50">
                            {processing ? 'Mengirim...' : 'Ajukan Verifikasi'}
                        </button>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}