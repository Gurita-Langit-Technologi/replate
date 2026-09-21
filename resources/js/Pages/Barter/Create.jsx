import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowLeftRight, Plus, Minus, Scale, Package, Image as ImageIcon } from 'lucide-react';

export default function Create({ product }) {
    const maxQty = Math.max(1, product.quantity || 1);

    const { data, setData, post, processing, errors } = useForm({
        quantity: maxQty > 1 ? 1 : 1,
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
            <div className="max-w-2xl mx-auto py-4">
                <Link href={`/products/${product.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition">
                    <ArrowLeft size={16} /> Kembali ke Produk
                </Link>

                {/* Info produk yang mau dibarter */}
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-6 shadow-sm">
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Produk yang Ingin Dibarter</p>
                    <div className="flex gap-4 items-start">
                        {product.photo ? (
                            <img
                                src={`/storage/${product.photo}`}
                                alt={product.title}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/image/image default.jpg';
                                }}
                                className="w-20 h-20 rounded-xl object-cover border border-purple-200"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 border border-purple-200">
                                <Package size={28} />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-lg text-gray-900 truncate">{product.title}</h2>
                            <p className="text-xs text-gray-600 mt-0.5">
                                Stok tersedia: <span className="font-semibold text-purple-700">{product.quantity || 1} {product.unit || 'satuan'}</span>
                                {product.weight_grams ? ` · ${(product.weight_grams / 1000).toFixed(1)} kg` : ''} · {product.desa}, {product.kecamatan}
                            </p>
                            {product.barter_description && (
                                <div className="mt-2.5 p-2.5 bg-white border border-purple-100 rounded-xl flex items-start gap-2">
                                    <ArrowLeftRight size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-purple-800">
                                        <span className="font-medium">Dicari penjual:</span> {product.barter_description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Ajukan Tawaran Barter</h1>
                    <p className="text-xs text-gray-500 mb-6">Tentukan berapa banyak produk yang ingin Anda ambil dan apa yang Anda berikan sebagai pengganti.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Pilihan Jumlah Barter */}
                        <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700">Jumlah yang Ingin Anda Barter *</label>
                                    <p className="text-[11px] text-gray-500">Tentukan kuantitas yang ingin Anda tukar dari total stok tersedia</p>
                                </div>
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                    Stok: {maxQty} {product.unit || 'satuan'}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setData('quantity', Math.max(1, (parseInt(data.quantity) || 1) - 1))}
                                        disabled={data.quantity <= 1}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <input
                                        type="number"
                                        value={data.quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            setData('quantity', Math.min(maxQty, Math.max(1, val)));
                                        }}
                                        min={1}
                                        max={maxQty}
                                        className="w-16 text-center font-bold text-sm border-none p-0 focus:ring-0"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setData('quantity', Math.min(maxQty, (parseInt(data.quantity) || 1) + 1))}
                                        disabled={data.quantity >= maxQty}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                    {product.unit || 'satuan'} ({data.quantity === maxQty ? 'Ambil Semua Stok' : `${data.quantity} dari ${maxQty}`})
                                </span>
                            </div>
                            {errors.quantity && <p className="text-red-500 text-xs mt-1.5">{errors.quantity}</p>}
                        </div>

                        {/* Tawaran */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Apa yang Anda tawarkan? *</label>
                            <textarea
                                value={data.offer_description}
                                onChange={e => setData('offer_description', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                                rows={3}
                                placeholder="Contoh: Saya punya 2 kg singkong segar / 3 botol minyak goreng, ingin ditukar dengan produk ini..."
                            />
                            {errors.offer_description && <p className="text-red-500 text-xs mt-1">{errors.offer_description}</p>}
                        </div>

                        {/* Foto Tawaran */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Foto barang yang ditawarkan (opsional)</label>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 transition">
                                    <ImageIcon size={16} className="text-gray-500" />
                                    <span>{data.offer_photo ? 'Ganti Foto' : 'Pilih Foto Barang'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setData('offer_photo', e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                                {data.offer_photo && (
                                    <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                        {data.offer_photo.name}
                                    </span>
                                )}
                            </div>
                            {errors.offer_photo && <p className="text-red-500 text-xs mt-1">{errors.offer_photo}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                        >
                            <ArrowLeftRight size={18} />
                            {processing ? 'Mengirim...' : 'Kirim Tawaran Barter'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
