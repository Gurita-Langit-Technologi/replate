import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: product.title,
        description: product.description,
        photo: null,
        category: product.category,
        condition: product.condition,
        weight_grams: product.weight_grams,
        transaction_mode: product.transaction_mode,
        price: product.price || '',
        barter_description: product.barter_description || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(`/products/${product.id}`);
    }

    return (
        <AppLayout>
            <Head title="Edit Produk" />
            <div className="max-w-2xl mx-auto py-6 px-4">
                <Link href="/my-products" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Kembali ke Produk Saya
                </Link>
                <h1 className="text-2xl font-bold mb-6">Edit Produk</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Judul Produk *</label>
                        <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full border rounded-lg px-4 py-2" />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Deskripsi *</label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full border rounded-lg px-4 py-2" rows={3} />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Ganti Foto (opsional)</label>
                        <input type="file" accept="image/*" onChange={e => setData('photo', e.target.files[0])} className="w-full border rounded-lg px-4 py-2" />
                        <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ingin mengganti foto</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Kategori *</label>
                            <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full border rounded-lg px-4 py-2">
                                <option value="mentah">Mentah</option>
                                <option value="olahan">Olahan</option>
                                <option value="hasil_bumi">Hasil Bumi</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Kondisi *</label>
                            <select value={data.condition} onChange={e => setData('condition', e.target.value)} className="w-full border rounded-lg px-4 py-2">
                                <option value="layak_konsumsi">Layak Konsumsi</option>
                                <option value="layak_olah">Layak Olah Ulang</option>
                                <option value="layak_pakan_kompos">Layak Pakan/Kompos</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Berat (gram) *</label>
                        <input type="number" value={data.weight_grams} onChange={e => setData('weight_grams', e.target.value)} className="w-full border rounded-lg px-4 py-2" min="500" />
                        {errors.weight_grams && <p className="text-red-500 text-sm mt-1">{errors.weight_grams}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Mode Transaksi *</label>
                        <select value={data.transaction_mode} onChange={e => setData('transaction_mode', e.target.value)} className="w-full border rounded-lg px-4 py-2">
                            <option value="sell">Jual</option>
                            <option value="barter">Barter</option>
                            <option value="sell_and_barter">Jual & Barter</option>
                            <option value="donate">Donasi</option>
                        </select>
                    </div>

                    {(data.transaction_mode === 'sell' || data.transaction_mode === 'sell_and_barter') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Harga (Rp) *</label>
                            <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full border rounded-lg px-4 py-2" min="0" />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                    )}

                    {(data.transaction_mode === 'barter' || data.transaction_mode === 'sell_and_barter') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Menerima Barter Dalam Bentuk *</label>
                            <textarea value={data.barter_description} onChange={e => setData('barter_description', e.target.value)} className="w-full border rounded-lg px-4 py-2" rows={2} />
                            {errors.barter_description && <p className="text-red-500 text-sm mt-1">{errors.barter_description}</p>}
                        </div>
                    )}

                    <button type="submit" disabled={processing} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}