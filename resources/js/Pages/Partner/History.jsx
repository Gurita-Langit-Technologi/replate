import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    History as HistoryIcon,
    Search,
    Package,
    Leaf,
    MapPin,
    User,
    Calendar,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';

export default function History({ history, totalWeight }) {
    const [search, setSearch] = useState('');

    const filteredHistory = history.filter((item) => {
        const query = search.toLowerCase();
        const title = item.product?.title?.toLowerCase() || '';
        const sellerName = item.product?.user?.name?.toLowerCase() || '';
        const desa = item.product?.desa?.toLowerCase() || '';
        const kecamatan = item.product?.kecamatan?.toLowerCase() || '';
        return title.includes(query) || sellerName.includes(query) || desa.includes(query) || kecamatan.includes(query);
    });

    return (
        <AppLayout>
            <Head title="Riwayat Penerimaan - Partner" />
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link
                                href="/partner/dashboard"
                                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft size={14} />
                                <span>Kembali ke Tugas</span>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Riwayat Penerimaan Mitra</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Semua log alih fungsi makanan yang telah berhasil diambil dan diproses.
                        </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 flex items-center gap-3 self-start sm:self-auto">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                            <Leaf size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-green-700 font-medium">Total Terproses</p>
                            <p className="text-xl font-bold text-green-800">
                                {(totalWeight / 1000).toFixed(1)} <span className="text-xs font-normal">kg</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari berdasarkan nama produk, penjual, atau desa/kecamatan..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:bg-white transition"
                        />
                    </div>
                </div>

                {/* History List */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <HistoryIcon className="text-gray-500" size={20} />
                            <h2 className="text-base font-bold text-gray-900">Daftar Transaksi Selesai</h2>
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                            {filteredHistory.length} dari {history.length} transaksi
                        </span>
                    </div>

                    {filteredHistory.length > 0 ? (
                        <div className="space-y-4">
                            {filteredHistory.map((t) => {
                                const product = t.product;
                                const seller = product?.user;
                                const dateFormatted = new Date(t.updated_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <div
                                        key={t.id}
                                        className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition bg-white"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            {/* Photo & Info */}
                                            <div className="flex items-start gap-4 flex-1">
                                                {product?.photo ? (
                                                    <img
                                                        src={`/storage/${product.photo}`}
                                                        alt={product.title}
                                                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                                                        <Package size={24} />
                                                    </div>
                                                )}

                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-[11px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-md">
                                                            Selesai Diambil
                                                        </span>
                                                        <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium">
                                                            {product?.quantity} {product?.unit} {product?.weight_grams ? `(${product.weight_grams}g)` : ''}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 text-base">
                                                        {product?.title || 'Produk'}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 flex-wrap">
                                                        <span className="inline-flex items-center gap-1">
                                                            <User size={13} className="text-gray-400" />
                                                            Penjual: <strong>{seller?.name || 'Warga'}</strong>
                                                        </span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <MapPin size={13} className="text-gray-400" />
                                                            {product?.desa}, {product?.kecamatan}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1">
                                                            <Calendar size={13} className="text-gray-400" />
                                                            {dateFormatted}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Stamp */}
                                            <div className="flex md:flex-col items-end justify-between flex-shrink-0">
                                                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 text-xs font-bold">
                                                    <CheckCircle2 size={16} />
                                                    <span>Terverifikasi</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-3">
                                <Package size={24} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800">
                                {search ? 'Tidak ada hasil yang cocok' : 'Belum ada riwayat penerimaan'}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                                {search ? 'Coba gunakan kata kunci pencarian yang lain.' : 'Produk yang berhasil dikonfirmasi akan muncul di halaman ini.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
