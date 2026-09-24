import { useState } from 'react';
import { router } from '@inertiajs/react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export default function DisputeModal({ transactionId, onClose }) {
    const [loading, setLoading] = useState(false);

    const handleDispute = () => {
        setLoading(true);
        router.patch(`/transactions/${transactionId}/dispute`, {}, {
            onFinish: () => {
                setLoading(false);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4 text-orange-600">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 text-center mb-1">
                    Lapor Makanan Basi/Rusak?
                </h2>
                <p className="text-sm text-gray-500 text-center mb-5">
                    Tindakan ini akan mengalihkan produk ke mitra pengolah dan membuat laporan dispute untuk ditinjau admin.
                </p>
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl mb-5">
                    <p className="text-xs text-orange-700 text-center font-medium flex items-center justify-center gap-1.5">
                        <AlertCircle size={14} /> Produk akan otomatis dialihkan ke Mitra Alih Fungsi
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Kembali
                    </button>
                    <button
                        onClick={handleDispute}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        )}
                        {loading ? 'Mengirim...' : 'Ya, Lapor Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    );
}
