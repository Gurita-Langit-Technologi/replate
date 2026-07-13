import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ transaction, isBuyer, isSeller }) {
    const statusLabel = {
        pending: 'Menunggu Konfirmasi Penjual',
        confirmed: 'Dikonfirmasi — Menunggu Pengambilan',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
    };

    const statusColor = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <AuthenticatedLayout>
            <Head title="Detail Transaksi" />
            <div className="max-w-2xl mx-auto py-6 px-4">
                <Link href="/transactions" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Riwayat Transaksi
                </Link>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold">Transaksi #{transaction.id}</h1>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${statusColor[transaction.status]}`}>
                            {statusLabel[transaction.status]}
                        </span>
                    </div>

                    {/* Info Produk */}
                    <div className="p-4 bg-gray-50 rounded mb-4">
                        <p className="font-medium">{transaction.product.title}</p>
                        <p className="text-sm text-gray-500">{transaction.product.weight_grams}g</p>
                        {transaction.price && (
                            <p className="text-green-600 font-bold mt-1">Rp {transaction.price.toLocaleString()}</p>
                        )}
                    </div>

                    {/* Info Pihak */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-gray-500">Penjual</p>
                            <p className="font-medium">{transaction.seller.name}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-gray-500">Pembeli</p>
                            <p className="font-medium">{transaction.buyer.name}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {isSeller && transaction.status === 'pending' && (
                            <button
                                onClick={() => router.patch(`/transactions/${transaction.id}/confirm`)}
                                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Konfirmasi Pesanan
                            </button>
                        )}

                        {isBuyer && transaction.status === 'confirmed' && (
                            <button
                                onClick={() => router.patch(`/transactions/${transaction.id}/complete`)}
                                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Konfirmasi Barang Diterima
                            </button>
                        )}

                        {transaction.status !== 'completed' && transaction.status !== 'cancelled' && (
                            <button
                                onClick={() => {
                                    if (confirm('Yakin ingin membatalkan transaksi?')) {
                                        router.patch(`/transactions/${transaction.id}/cancel`);
                                    }
                                }}
                                className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                                Batalkan
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
