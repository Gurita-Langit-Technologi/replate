import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

function ProductCard({ product }) {
    const isTimeout = product.status === 'timeout_stage_1';
    const timeLeft = new Date(product.timeout_at) - new Date();
    const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));

    return (
        <Link href={`/products/${product.id}`} className="block border rounded-lg overflow-hidden hover:shadow-lg transition bg-white">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                {product.photo ? (
                    <img src={`/storage/${product.photo}`} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400">No Image</span>
                )}
            </div>
            <div className="p-4">
                <div className="flex gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        {product.condition.replace('_', ' ')}
                    </span>
                    {product.transaction_mode.includes('barter') && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            Barter
                        </span>
                    )}
                    {isTimeout && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                            Segera Habis!
                        </span>
                    )}
                </div>
                <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.weight_grams}g · {product.desa}</p>
                <div className="mt-2 flex items-center justify-between">
                    {product.price ? (
                        <div>
                            {product.discounted_price ? (
                                <>
                                    <span className="text-red-500 font-bold">Rp {product.discounted_price.toLocaleString()}</span>
                                    <span className="text-xs text-gray-400 line-through ml-1">Rp {product.price.toLocaleString()}</span>
                                </>
                            ) : (
                                <span className="text-green-600 font-bold">Rp {product.price.toLocaleString()}</span>
                            )}
                        </div>
                    ) : (
                        <span className="text-blue-600 font-semibold">
                            {product.transaction_mode === 'donate' ? 'Donasi' : 'Barter'}
                        </span>
                    )}
                    <span className="text-xs text-gray-400">{hoursLeft}j lagi</span>
                </div>
            </div>
        </Link>
    );
}

export default function Index({ products, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    function handleFilter(key, value) {
        router.get('/marketplace', { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleSearch(e) {
        e.preventDefault();
        handleFilter('search', search);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Marketplace" />

            <div className="max-w-7xl mx-auto py-6 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
                    <Link
                        href="/products/create"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        + Upload Produk
                    </Link>
                </div>

                {/* Search & Filters */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari produk..."
                            className="flex-1 border rounded-lg px-4 py-2"
                        />
                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg">
                            Cari
                        </button>
                    </form>
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={filters.category || ''}
                            onChange={(e) => handleFilter('category', e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                        >
                            <option value="">Semua Kategori</option>
                            <option value="mentah">Mentah</option>
                            <option value="olahan">Olahan</option>
                            <option value="hasil_bumi">Hasil Bumi</option>
                        </select>
                        <select
                            value={filters.condition || ''}
                            onChange={(e) => handleFilter('condition', e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                        >
                            <option value="">Semua Kondisi</option>
                            <option value="layak_konsumsi">Layak Konsumsi</option>
                            <option value="layak_olah">Layak Olah</option>
                            <option value="layak_pakan_kompos">Pakan/Kompos</option>
                        </select>
                        <select
                            value={filters.mode || ''}
                            onChange={(e) => handleFilter('mode', e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                        >
                            <option value="">Semua Mode</option>
                            <option value="sell">Jual</option>
                            <option value="barter">Barter</option>
                            <option value="sell_and_barter">Jual & Barter</option>
                            <option value="donate">Donasi</option>
                        </select>
                        <select
                            value={filters.sort || 'newest'}
                            onChange={(e) => handleFilter('sort', e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                        >
                            <option value="newest">Terbaru</option>
                            <option value="price_low">Harga Terendah</option>
                            <option value="price_high">Harga Tertinggi</option>
                            <option value="timeout">Mendekati Timeout</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                {products.data.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Belum ada produk yang tersedia.
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

