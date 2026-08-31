import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, router } from '@inertiajs/react';

const reasonLabels = {
    tidak_sesuai_foto: 'Tidak sesuai foto',
    kondisi_buruk: 'Kondisi lebih buruk',
    produk_tidak_layak: 'Produk tidak layak',
    penipuan: 'Penipuan',
};

const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-green-100 text-green-700',
    dismissed: 'bg-gray-100 text-gray-700',
};

export default function Reports({ reports }) {
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    return (
        <AppLayout>
            <Head title="Moderasi Laporan" />

            <ConfirmModal
                show={confirmModal.show}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Hapus + Beri Warning"
                variant="danger"
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
            />

            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Moderasi Laporan Produk</h1>

                {reports.length > 0 ? (
                    <div className="space-y-4">
                        {reports.map((r) => (
                            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">{r.product?.title || 'Produk dihapus'}</p>
                                        <p className="text-sm text-gray-500">Dilaporkan oleh: {r.reporter?.name}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[r.status]}`}>
                                        {r.status}
                                    </span>
                                </div>

                                <div className="p-3 bg-red-50 rounded mb-3">
                                    <p className="text-sm font-medium text-red-700">{reasonLabels[r.reason] || r.reason}</p>
                                    {r.description && <p className="text-sm text-red-600 mt-1">{r.description}</p>}
                                </div>

                                {r.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setConfirmModal({
                                                    show: true,
                                                    title: 'Hapus Produk & Beri Warning',
                                                    message: `Apakah Anda yakin ingin menghapus produk "${r.product?.title}" dan memberikan peringatan pelanggaran kepada penjual?`,
                                                    onConfirm: () => router.patch(`/admin/reports/${r.id}/review`),
                                                });
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition font-medium"
                                        >
                                            Hapus produk + warning
                                        </button>
                                        <button
                                            onClick={() => router.patch(`/admin/reports/${r.id}/dismiss`)}
                                            className="px-4 py-2 bg-gray-100 text-sm rounded-lg hover:bg-gray-200 transition font-medium"
                                        >
                                            Abaikan laporan
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400">Tidak ada laporan produk.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}