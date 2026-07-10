import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ transferredProducts }) {
    return (
        <AuthenticatedLayout>
            <Head title="Partner Dashboard" />
            <div className="max-w-4xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Partner</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="font-semibold mb-4">Produk yang Dialihkan kepada Anda</h2>
                    {transferredProducts.length > 0 ? (
                        <div className="space-y-3">
                            {transferredProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">{product.title}</p>
                                        <p className="text-sm text-gray-500">{product.weight_grams}g · {product.condition.replace(/_/g, ' ')}</p>
                                    </div>
                                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                        Konfirmasi Pengambilan
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Belum ada produk yang dialihkan.</p>
                    )}
                </div>

                <p className="text-gray-400 text-sm">TODO: riwayat penerimaan, jadwal pengambilan</p>
            </div>
        </AuthenticatedLayout>
    );
}