import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { Package, Leaf, Check } from 'lucide-react';

export default function Dashboard({ pending, completed, totalWeight }) {
    return (
        <AppLayout>
            <Head title="Partner Dashboard" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Partner</h1>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                <Package size={20} />
                            </div>
                            <span className="text-sm text-gray-500">Menunggu diambil</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">{pending.length}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                <Leaf size={20} />
                            </div>
                            <span className="text-sm text-gray-500">Total diterima</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">{(totalWeight / 1000).toFixed(1)}</span>
                            <span className="text-sm text-gray-400">kg</span>
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Produk menunggu pengambilan</h2>
                    {pending.length > 0 ? (
                        <div className="space-y-3">
                            {pending.map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                                    <div>
                                        <p className="font-medium text-gray-900">{t.product.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {t.product.weight_grams}g · {t.product.condition.replace(/_/g, ' ')} · {t.product.desa}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => router.patch(`/partner/transactions/${t.id}/confirm`)}
                                        className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                    >
                                        <Check size={16} />
                                        Konfirmasi ambil
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-6">Belum ada produk yang dialihkan.</p>
                    )}
                </div>

                {/* Completed */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Riwayat penerimaan</h2>
                    {completed.length > 0 ? (
                        <div className="space-y-2">
                            {completed.map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{t.product.title}</p>
                                        <p className="text-xs text-gray-400">{t.product.weight_grams}g · {new Date(t.updated_at).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Selesai</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-6">Belum ada riwayat.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}