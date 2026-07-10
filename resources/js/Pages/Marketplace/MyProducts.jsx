import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function MyProducts({ products }) {
    function handleDelete(id) {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            router.delete(`/products/${id}`);
        }
    }

    const statusLabel = {
        active: 'Aktif',
        timeout_stage_1: 'Diskon Otomatis',
        timeout_stage_2: 'Jalur Donasi',
        timeout_stage_3: 'Dialihkan ke Partner',
        sold: 'Terjual',
        bartered: 'Terbarter',
        donated: 'Terdonasi',
        transferred: 'Dialihkan',
    };

    const statusColor = {
        active: 'bg-green-100 text-green-700',
        timeout_stage_1: 'bg-yellow-100 text-yellow-700',
        timeout_stage_2: 'bg-orange-100 text-orange-700',
        timeout_stage_3: 'bg-red-100 text-red-700',
        sold: 'bg-blue-100 text-blue-700',
        bartered: 'bg-purple-100 text-purple-700',
        donated: 'bg-pink-100 text-pink-700',
        transferred: 'bg-gray-100 text-gray-700',
    };

    return (
        <AuthenticatedLayout>
            <Head title="Produk Saya" />
            <div className="max-w-4xl mx-auto py-6 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Produk Saya</h1>
                    <Link href="/products/create" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        + Upload Produk
                    </Link>
                </div>

                {products.length > 0 ? (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold">{product.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded ${statusColor[product.status] || 'bg-gray-100'}`}>
                                            {statusLabel[product.status] || product.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {product.weight_grams}g · {product.category} · {product.condition.replace(/_/g, ' ')}
                                        {product.price && ` · Rp ${product.price.toLocaleString()}`}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/products/${product.id}`} className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
                                        Lihat
                                    </Link>
                                    {product.status === 'active' && (
                                        <>
                                            <Link href={`/products/${product.id}/edit`} className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(product.id)} className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                                                Hapus
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 mb-4">Belum ada produk yang diunggah.</p>
                        <Link href="/products/create" className="text-green-600 hover:underline">Upload produk pertama →</Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}