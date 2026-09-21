import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Verifications({ verifications }) {
    const [rejectId, setRejectId] = useState(null);
    const [notes, setNotes] = useState('');

    const statusStyles = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    function handleReject(id) {
        if (!notes.trim()) return alert('Alasan penolakan wajib diisi.');
        router.patch(`/admin/verifications/${id}/reject`, { admin_notes: notes });
        setRejectId(null);
        setNotes('');
    }

    return (
        <AppLayout>
            <Head title="Verifikasi Penjual" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Verifikasi Penjual Olahan</h1>

                {verifications.length > 0 ? (
                    <div className="space-y-4">
                        {verifications.map((v) => (
                            <div key={v.id} className="bg-white rounded-xl border border-gray-100 p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">{v.user.name}</p>
                                        <p className="text-sm text-gray-500">{v.user.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[v.status]}`}>
                                        {v.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                    <div className="p-3 bg-gray-50 rounded">
                                        <p className="text-gray-500">Tipe dokumen</p>
                                        <p className="font-medium uppercase">{v.document_type}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded">
                                        <p className="text-gray-500">Tanggal pengajuan</p>
                                        <p className="font-medium">{new Date(v.created_at).toLocaleDateString('id-ID')}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mb-3">
                                    {v.document_photo && (
                                        <img
                                            src={`/storage/${v.document_photo}`}
                                            alt="Dokumen"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = '/image/image default.jpg';
                                            }}
                                            className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                                        />
                                    )}
                                    {v.production_photo && (
                                        <img
                                            src={`/storage/${v.production_photo}`}
                                            alt="Tempat produksi"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = '/image/image default.jpg';
                                            }}
                                            className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                                        />
                                    )}
                                </div>

                                {v.admin_notes && (
                                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3">Catatan: {v.admin_notes}</p>
                                )}

                                {v.status === 'pending' && (
                                    <div>
                                        {rejectId === v.id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Alasan penolakan..."
                                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                                    rows={2}
                                                />
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleReject(v.id)} className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg">Tolak</button>
                                                    <button onClick={() => setRejectId(null)} className="px-4 py-2 bg-gray-100 text-sm rounded-lg">Batal</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.patch(`/admin/verifications/${v.id}/approve`)}
                                                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                                >
                                                    Setujui
                                                </button>
                                                <button
                                                    onClick={() => setRejectId(v.id)}
                                                    className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200"
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400">Tidak ada pengajuan verifikasi.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}