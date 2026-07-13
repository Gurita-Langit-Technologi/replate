import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ incoming, outgoing }) {
    const statusLabel = {
        pending: 'Menunggu',
        accepted: 'Disetujui',
        rejected: 'Ditolak',
        cancelled: 'Dibatalkan',
    };

    const statusColor = {
        pending: 'bg-yellow-100 text-yellow-700',
        accepted: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        cancelled: 'bg-gray-100 text-gray-700',
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tawaran Barter" />
            <div className="max-w-4xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold mb-6">Tawaran Barter</h1>

                {/* Tawaran Masuk */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">Tawaran Masuk (untuk produk saya)</h2>
                    {incoming.length > 0 ? (
                        <div className="space-y-3">
                            {incoming.map((offer) => (
                                <div key={offer.id} className="bg-white rounded-lg shadow p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Untuk: <span className="font-medium text-gray-800">{offer.product.title}</span></p>
                                            <p className="mt-1">
                                                <span className="font-medium">{offer.offerer.name}</span> menawarkan:
                                            </p>
                                            <p className="text-purple-700 bg-purple-50 p-2 rounded mt-1">{offer.offer_description}</p>
                                            {offer.offer_photo && (
                                                <img src={`/storage/${offer.offer_photo}`} alt="Foto tawaran" className="mt-2 w-32 h-32 object-cover rounded" />
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[offer.status]}`}>
                                            {statusLabel[offer.status]}
                                        </span>
                                    </div>

                                    {offer.status === 'pending' && (
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => router.patch(`/barter/${offer.id}/accept`)}
                                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                            >
                                                Setujui Barter
                                            </button>
                                            <button
                                                onClick={() => router.patch(`/barter/${offer.id}/reject`)}
                                                className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200"
                                            >
                                                Tolak
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 bg-white rounded-lg shadow p-4">Belum ada tawaran masuk.</p>
                    )}
                </div>

                {/* Tawaran Keluar */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Tawaran Saya</h2>
                    {outgoing.length > 0 ? (
                        <div className="space-y-3">
                            {outgoing.map((offer) => (
                                <div key={offer.id} className="bg-white rounded-lg shadow p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Untuk: <span className="font-medium text-gray-800">{offer.product.title}</span> milik {offer.product.user.name}</p>
                                            <p className="text-purple-700 bg-purple-50 p-2 rounded mt-1">{offer.offer_description}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[offer.status]}`}>
                                            {statusLabel[offer.status]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 bg-white rounded-lg shadow p-4">Belum ada tawaran yang dikirim.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}