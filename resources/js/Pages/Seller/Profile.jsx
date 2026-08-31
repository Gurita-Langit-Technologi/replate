import AppLayout from '@/Layouts/AppLayout';
import { formatTimeLeftShort } from '@/Utils/time';
import { Head, Link } from '@inertiajs/react';
import { User, Package, Scale, TrendingUp, Clock, MapPin } from 'lucide-react';

export default function Profile({ seller, products, stats }) {
    return (
        <AppLayout>
            <Head title={`${seller.name}`} />
            <div className="max-w-4xl mx-auto">
                {/* Seller Info */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                            {seller.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{seller.name}</h1>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin size={14} />
                                {seller.desa}, {seller.kecamatan}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-gray-900">{stats.totalProducts}</p>
                            <p className="text-xs text-gray-500">Produk aktif</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-gray-900">{stats.totalSold}</p>
                            <p className="text-xs text-gray-500">Transaksi selesai</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-gray-900">{(stats.totalWeight / 1000).toFixed(1)}kg</p>
                            <p className="text-xs text-gray-500">Waste tersalurkan</p>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Produk dari {seller.name}</h2>
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {products.map((product) => {
                            const hoursLeft = Math.max(0, Math.floor((new Date(product.timeout_at) - new Date()) / (1000 * 60 * 60)));
                            return (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition"
                                >
                                    <div className="aspect-[4/3] bg-gray-100">
                                        {product.photo ? (
                                            <img src={`/storage/${product.photo}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package size={28} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                            <span>{product.quantity} {product.unit}</span>
                                            <span>·</span>
                                            <span className="flex items-center gap-0.5">
                                                <Clock size={10} />
                                                {formatTimeLeftShort(product.timeout_at)}
                                            </span>
                                        </p>
                                        {product.price ? (
                                            <p className="text-sm font-bold text-green-600 mt-1">
                                                Rp {product.price.toLocaleString()}
                                                <span className="text-[11px] text-gray-400 font-normal">/{product.unit || 'satuan'}</span>
                                            </p>
                                        ) : (
                                            <p className="text-sm font-bold text-purple-600 mt-1">
                                                {product.transaction_mode === 'donate' ? 'Donasi' : 'Barter'}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Package size={32} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-gray-400">Belum ada produk aktif dari penjual ini</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}