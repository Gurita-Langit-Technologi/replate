import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        offer_description: '',
        offer_photo: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(`/products/${product.id}/barter`);
    }

    return (
        <AppLayout>
            <Head title="Ajukan Barter" />
            <div className="max-w-2xl mx-auto py-6 px-4">
                <Link href={`/products/${product.id}`} className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Kembali ke Produk
                </Link>

                {/* Info produk yang mau dibarter */}
                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-purple-600 mb-1">Anda ingin membarter:</p>
                    <p className="font-bold text-lg">{product.title}</p>
                    <p className="text-sm text-gray-600">{product.weight_grams}g · {product.desa}, {product.kecamatan}</p>
                    {product.barter_description && (
                        <div className="mt-2 p-2 bg-white rounded">
                            <p className="text-sm text-purple-700">Penjual menerima: {product.barter_description}</p>
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold mb-4">Ajukan Tawaran Barter</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Apa yang Anda tawarkan? *</label>
                        <textarea
                            value={data.offer_description}
                            onChange={e => setData('offer_description', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                            rows={3}
                            placeholder="Contoh: Saya punya 2 kg singkong segar, mau tukar dengan nasi kering ini"
                        />
                        {errors.offer_description && <p className="text-red-500 text-sm mt-1">{errors.offer_description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Foto barang yang ditawarkan (opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setData('offer_photo', e.target.files[0])}
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Tawaran Barter'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
