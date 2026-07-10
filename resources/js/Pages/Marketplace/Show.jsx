import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ product }) {
    const hoursLeft = Math.max(0, Math.floor((new Date(product.timeout_at) - new Date()) / (1000 * 60 * 60)));

    return (
        <AuthenticatedLayout>
            <Head title={product.title} />
            <div className="max-w-4xl mx-auto py-6 px-4">
                <Link href="/marketplace" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Kembali ke Marketplace
                </Link>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Foto Produk */}
                    <div className="h-72 bg-gray-200">
                        {product.photo ? (
                            <img src={`/storage/${product.photo}`} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                        )}
                    </div>

                    <div className="p-6">
                        {/* Badges */}
                        <div className="flex gap-2 mb-3">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                {product.condition.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                {product.category}
                            </span>
                            {product.transaction_mode.includes('barter') && (
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">Barter</span>
                            )}
                            {product.status === 'timeout_stage_1' && (
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Segera Habis!</span>
                            )}
                        </div>

                        {/* Judul & Harga */}
                        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                        {product.price && (
                            <div className="mb-3">
                                {product.discounted_price ? (
                                    <>
                                        <span className="text-2xl font-bold text-red-500">Rp {product.discounted_price.toLocaleString()}</span>
                                        <span className="text-gray-400 line-through ml-2">Rp {product.price.toLocaleString()}</span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-bold text-green-600">Rp {product.price.toLocaleString()}</span>
                                )}
                            </div>
                        )}

                        {/* Info */}
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                            <div className="p-3 bg-gray-50 rounded">
                                <span className="text-gray-500">Berat</span>
                                <p className="font-medium">{product.weight_grams}g</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                                <span className="text-gray-500">Lokasi</span>
                                <p className="font-medium">{product.desa}, {product.kecamatan}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                                <span className="text-gray-500">Mode</span>
                                <p className="font-medium capitalize">{product.transaction_mode.replace(/_/g, ' ')}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                                <span className="text-gray-500">Sisa Waktu</span>
                                <p className="font-medium">{hoursLeft} jam lagi</p>
                            </div>
                        </div>

                        {/* Barter Info */}
                        {product.barter_description && (
                            <div className="p-4 bg-purple-50 rounded mb-4">
                                <p className="font-medium text-purple-700 mb-1">Menerima barter:</p>
                                <p className="text-purple-600">{product.barter_description}</p>
                            </div>
                        )}

                        {/* Penjual */}
                        {product.user && (
                            <div className="p-4 bg-gray-50 rounded mb-4">
                                <p className="text-sm text-gray-500">Penjual</p>
                                <p className="font-medium">{product.user.name}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {(product.transaction_mode === 'sell' || product.transaction_mode === 'sell_and_barter') && (
                                <button className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                                    Beli Produk
                                </button>
                            )}
                            {(product.transaction_mode === 'barter' || product.transaction_mode === 'sell_and_barter') && (
                                <button className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                                    Ajukan Barter
                                </button>
                            )}
                            {product.transaction_mode === 'donate' && (
                                <button className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                                    Klaim Donasi
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center">TODO: tombol-tombol ini belum berfungsi, akan dikoneksikan ke TransactionController</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}