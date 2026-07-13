import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ transactions }) {
    const statusLabel = {
        pending: 'Menunggu',
        confirmed: 'Dikonfirmasi',
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
            <Head title="Riwayat Transaksi" />
            <div className="max-w-4xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

                {transactions.length > 0 ? (
                    <div className="space-y-3">
                        {transactions.map((t) => (
                            <Link key={t.id} href={`/transactions/${t.id}`} className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{t.product.title}</p>
                                        <p className="text-sm text-gray-500 capitalize">
                                            {t.type.replace('_', ' ')} · {t.product.weight_grams}g
                                            {t.price && ` · Rp ${t.price.toLocaleString()}`}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[t.status]}`}>
                                        {statusLabel[t.status]}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">Belum ada transaksi.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}