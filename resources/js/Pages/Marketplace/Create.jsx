import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        photo: null,
        category: 'mentah',
        condition: 'layak_konsumsi',
        weight_grams: '',
        transaction_mode: 'sell',
        price: '',
        barter_description: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/products');
    }

    return (
        <AuthenticatedLayout>
            <Head title="Upload Produk" />
            <div className="max-w-2xl mx-auto py-6 px-4">
                <Link href="/marketplace" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Kembali ke Marketplace
                </Link>
                <h1 className="text-2xl font-bold mb-6">Upload Produk</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Judul Produk *</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Contoh: Nasi Kotak Sisa Katering"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Deskripsi *</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                            rows={3}
                            placeholder="Jelaskan kondisi produk..."
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Foto */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Foto Produk *</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setData('photo', e.target.files[0])}
                            className="w-full border rounded-lg px-4 py-2"
                        />
                        {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
                    </div>

                    {/* Kategori & Kondisi */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Kategori *</label>
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2"
                            >
                                <option value="mentah">Mentah</option>
                                <option value="olahan">Olahan</option>
                                <option value="hasil_bumi">Hasil Bumi</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Kondisi *</label>
                            <select
                                value={data.condition}
                                onChange={e => setData('condition', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2"
                            >
                                <option value="layak_konsumsi">Layak Konsumsi</option>
                                <option value="layak_olah">Layak Olah Ulang</option>
                                <option value="layak_pakan_kompos">Layak Pakan/Kompos</option>
                            </select>
                        </div>
                    </div>

                    {/* Berat */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Berat (gram) * min. 500g</label>
                        <input
                            type="number"
                            value={data.weight_grams}
                            onChange={e => setData('weight_grams', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                            min="500"
                            placeholder="Contoh: 1000"
                        />
                        {errors.weight_grams && <p className="text-red-500 text-sm mt-1">{errors.weight_grams}</p>}
                    </div>

                    {/* Mode Transaksi */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Mode Transaksi *</label>
                        <select
                            value={data.transaction_mode}
                            onChange={e => setData('transaction_mode', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                        >
                            <option value="sell">Jual</option>
                            <option value="barter">Barter</option>
                            <option value="sell_and_barter">Jual & Barter</option>
                            <option value="donate">Donasi</option>
                        </select>
                    </div>

                    {/* Harga (muncul jika jual) */}
                    {(data.transaction_mode === 'sell' || data.transaction_mode === 'sell_and_barter') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Harga (Rp) *</label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2"
                                min="0"
                                placeholder="Contoh: 25000"
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                    )}

                    {/* Deskripsi Barter (muncul jika barter) */}
                    {(data.transaction_mode === 'barter' || data.transaction_mode === 'sell_and_barter') && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Menerima Barter Dalam Bentuk *</label>
                            <textarea
                                value={data.barter_description}
                                onChange={e => setData('barter_description', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2"
                                rows={2}
                                placeholder="Contoh: Mau ditukar dengan telur, beras, atau singkong"
                            />
                            {errors.barter_description && <p className="text-red-500 text-sm mt-1">{errors.barter_description}</p>}
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="p-3 bg-yellow-50 rounded text-sm text-yellow-700">
                        Dengan mengunggah produk, Anda bertanggung jawab atas kondisi produk yang diunggah.
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {processing ? 'Mengunggah...' : 'Upload Produk'}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}