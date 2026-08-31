import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Upload,
    Image,
    Tag,
    Scale,
    ShoppingBasket,
    ArrowLeftRight,
    Heart,
    AlertTriangle,
    X,
    MapPin,
} from 'lucide-react';

const modeOptions = [
    { value: 'sell', label: 'Jual', icon: ShoppingBasket, desc: 'Jual dengan harga yang ditentukan', color: 'border-green-400 bg-green-50 text-green-700' },
    { value: 'barter', label: 'Barter', icon: ArrowLeftRight, desc: 'Tukar dengan barang lain', color: 'border-purple-400 bg-purple-50 text-purple-700' },
    { value: 'sell_and_barter', label: 'Jual & Barter', icon: Tag, desc: 'Bisa dijual atau dibarter', color: 'border-amber-400 bg-amber-50 text-amber-700' },
    { value: 'donate', label: 'Donasi', icon: Heart, desc: 'Berikan gratis untuk yang membutuhkan', color: 'border-blue-400 bg-blue-50 text-blue-700' },
];

const conditionOptions = [
    { value: 'layak_konsumsi', label: 'Layak Konsumsi / Siap Santap', desc: 'Makanan segar dan masih aman dikonsumsi langsung', color: 'border-green-400 bg-green-50' },
    { value: 'layak_olah', label: 'Bahan Olahan / Perlu Diolah', desc: 'Bahan pangan yang perlu dimasak/diolah kembali sebelum dikonsumsi', color: 'border-amber-400 bg-amber-50' },
    { value: 'layak_pakan_kompos', label: 'Pakan / Kompos', desc: 'Khusus untuk pakan ternak atau bahan kompos (tidak untuk manusia)', color: 'border-red-400 bg-red-50' },
];

export default function Create() {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        photo: null,
        category: 'mentah',
        condition: 'layak_konsumsi',
        weight_grams: '',
        quantity: 1,
        unit: 'porsi',
        transaction_mode: 'sell',
        price: '',
        barter_description: '',
        pickup_type: 'rumah',
        pickup_address: '',
        pickup_notes: '',
    });

    const [preview, setPreview] = useState(null);

    function handlePhoto(e) {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPreview(URL.createObjectURL(file));
        }
    }

    function removePhoto() {
        setData('photo', null);
        setPreview(null);
    }

    function handleUseProfileAddress() {
        if (!auth?.user) return;
        const parts = [
            auth.user.address,
            auth.user.desa ? `Desa ${auth.user.desa}` : '',
            auth.user.kecamatan ? `Kec. ${auth.user.kecamatan}` : '',
        ].filter(Boolean);
        const fullAddress = parts.join(', ');
        if (fullAddress) {
            setData('pickup_address', fullAddress);
        } else if (auth.user.desa || auth.user.kecamatan) {
            setData('pickup_address', `${auth.user.desa ? 'Desa ' + auth.user.desa : ''}, ${auth.user.kecamatan ? 'Kec. ' + auth.user.kecamatan : ''}`);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        post('/products');
    }

    return (
        <AppLayout>
            <Head title="Upload Produk" />

            <div className="max-w-2xl mx-auto">
                <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <ArrowLeft size={16} />
                    Kembali ke marketplace
                </Link>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Upload produk</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Bagikan food waste agar tidak terbuang sia-sia</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Foto */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                            <span className="flex items-center gap-2"><Image size={16} className="text-gray-400" /> Foto produk *</span>
                        </label>
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Preview" className="w-full h-56 object-cover rounded-xl" />
                                <button
                                    type="button"
                                    onClick={removePhoto}
                                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition">
                                <Upload size={28} className="text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">Klik untuk upload foto</p>
                                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG (maks. 2MB)</p>
                                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                            </label>
                        )}
                        {errors.photo && <p className="text-red-500 text-xs mt-2">{errors.photo}</p>}
                    </div>

                    {/* Info Produk */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                        <p className="text-sm font-medium text-gray-900">Informasi produk</p>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Judul produk *</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                placeholder="Contoh: Nasi Kotak Sisa Katering"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Deskripsi *</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                rows={3}
                                placeholder="Jelaskan kondisi, asal, dan kelayakan produk..."
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategori *</label>
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                            >
                                <option value="mentah">Mentah</option>
                                <option value="olahan">Olahan (Siap Santap / Produk Olahan)</option>
                                <option value="hasil_bumi">Hasil bumi</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Jumlah Stok *</label>
                                <input
                                    type="number"
                                    value={data.quantity}
                                    onChange={e => setData('quantity', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                    min="1"
                                    placeholder="1"
                                />
                                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Satuan Produk *</label>
                                <select
                                    value={data.unit}
                                    onChange={e => setData('unit', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                >
                                    <option value="porsi">Porsi</option>
                                    <option value="bungkus">Bungkus</option>
                                    <option value="kotak">Kotak / Box</option>
                                    <option value="pcs">Pcs / Buah</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="ikat">Ikat</option>
                                    <option value="liter">Liter</option>
                                    <option value="paket">Paket</option>
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1.5">
                                    <Scale size={12} /> Estimasi Berat (gram)
                                </label>
                                <input
                                    type="number"
                                    value={data.weight_grams}
                                    onChange={e => setData('weight_grams', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                    min="0"
                                    placeholder={data.unit === 'kg' && data.quantity ? `${(parseInt(data.quantity) || 1) * 1000}` : 'Otomatis dihitung'}
                                />
                                {errors.weight_grams ? (
                                    <p className="text-red-500 text-xs mt-1">{errors.weight_grams}</p>
                                ) : (
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {data.unit === 'kg'
                                            ? `Otomatis: ${data.quantity || 1} kg (${((parseInt(data.quantity) || 1) * 1000).toLocaleString()}g)`
                                            : 'Boleh dikosongkan (otomatis diestimasi)'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Kondisi */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-sm font-medium text-gray-900 mb-3">Kondisi produk *</p>
                        <div className="space-y-2">
                            {conditionOptions.map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                                        ${data.condition === opt.value ? opt.color + ' border-opacity-100' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <input
                                        type="radio"
                                        name="condition"
                                        value={opt.value}
                                        checked={data.condition === opt.value}
                                        onChange={e => setData('condition', e.target.value)}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                        ${data.condition === opt.value ? 'border-green-500' : 'border-gray-300'}`}>
                                        {data.condition === opt.value && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                                        <p className="text-xs text-gray-500">{opt.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Mode Transaksi */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-sm font-medium text-gray-900 mb-3">Mode transaksi *</p>
                        <div className="grid grid-cols-2 gap-2">
                            {modeOptions.map((opt) => {
                                const Icon = opt.icon;
                                const isSelected = data.transaction_mode === opt.value;
                                return (
                                    <label
                                        key={opt.value}
                                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 cursor-pointer transition text-center
                                            ${isSelected ? opt.color + ' border-opacity-100' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="transaction_mode"
                                            value={opt.value}
                                            checked={isSelected}
                                            onChange={e => setData('transaction_mode', e.target.value)}
                                            className="hidden"
                                        />
                                        <Icon size={22} className={isSelected ? '' : 'text-gray-400'} />
                                        <p className="text-sm font-medium">{opt.label}</p>
                                        <p className="text-[10px] text-gray-500 leading-tight">{opt.desc}</p>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Harga */}
                    {(data.transaction_mode === 'sell' || data.transaction_mode === 'sell_and_barter') && (
                        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Harga per satuan * <span className="text-xs text-gray-400 font-normal">(Rp / {data.unit || 'satuan'})</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                        min="0"
                                        placeholder="Contoh: 15000"
                                    />
                                </div>
                                {errors.price && <p className="text-red-500 text-xs mt-1.5">{errors.price}</p>}
                            </div>

                            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs space-y-1.5">
                                <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                                    💡 Ini adalah harga untuk 1 {data.unit || 'satuan'}, bukan total keseluruhan.
                                </p>
                                <p className="text-amber-700 leading-relaxed">
                                    Pembeli dapat menentukan jumlah yang ingin mereka beli (misal: 1 {data.unit || 'satuan'} atau seluruhnya).
                                </p>
                                {parseInt(data.price || 0) > 0 && (
                                    <div className="pt-2 mt-1.5 border-t border-amber-200 flex items-center justify-between font-medium text-amber-950">
                                        <span>Estimasi total ({data.quantity || 1} {data.unit}):</span>
                                        <span className="font-bold text-green-700 text-sm">
                                            Rp {(parseInt(data.price || 0) * (parseInt(data.quantity) || 1)).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Barter Description */}
                    {(data.transaction_mode === 'barter' || data.transaction_mode === 'sell_and_barter') && (
                        <div className="bg-white rounded-xl border border-purple-100 p-5">
                            <label className="flex items-center gap-2 text-sm font-medium text-purple-700 mb-3">
                                <ArrowLeftRight size={16} />
                                Menerima barter dalam bentuk *
                            </label>
                            <textarea
                                value={data.barter_description}
                                onChange={e => setData('barter_description', e.target.value)}
                                className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-purple-50/30"
                                rows={2}
                                placeholder="Contoh: Mau ditukar dengan telur, beras, singkong, atau hasil kebun lainnya"
                            />
                            {errors.barter_description && <p className="text-red-500 text-xs mt-2">{errors.barter_description}</p>}
                        </div>
                    )}

                    {/* Lokasi Pengambilan */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" /> Lokasi pengambilan
                        </p>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Tipe pengambilan *</label>
                            <div className="grid grid-cols-2 gap-2">
                                <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${data.pickup_type === 'rumah' ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="pickup_type"
                                        value="rumah"
                                        checked={data.pickup_type === 'rumah'}
                                        onChange={e => setData('pickup_type', e.target.value)}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.pickup_type === 'rumah' ? 'border-green-500' : 'border-gray-300'}`}>
                                        {data.pickup_type === 'rumah' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Ambil di rumah</p>
                                        <p className="text-[10px] text-gray-500">Pembeli datang ke alamat Anda</p>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${data.pickup_type === 'drop_point' ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="pickup_type"
                                        value="drop_point"
                                        checked={data.pickup_type === 'drop_point'}
                                        onChange={e => setData('pickup_type', e.target.value)}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.pickup_type === 'drop_point' ? 'border-green-500' : 'border-gray-300'}`}>
                                        {data.pickup_type === 'drop_point' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Drop Point BUMDes</p>
                                        <p className="text-[10px] text-gray-500">Titipkan di pos desa</p>
                                    </div>
                                </label>
                            </div>
                            {errors.pickup_type && <p className="text-red-500 text-xs mt-1.5">{errors.pickup_type}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-medium text-gray-500">Alamat lengkap *</label>
                                {auth?.user && (
                                    <button
                                        type="button"
                                        onClick={handleUseProfileAddress}
                                        className="text-xs font-semibold text-green-600 hover:text-green-700 hover:underline flex items-center gap-1 transition"
                                    >
                                        <MapPin size={12} />
                                        Gunakan Alamat Profil Saya
                                    </button>
                                )}
                            </div>
                            <textarea
                                value={data.pickup_address}
                                onChange={e => setData('pickup_address', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                rows={2}
                                placeholder="Contoh: Jl. Raya Desa No. 5, RT 03/RW 01, depan balai desa"
                            />
                            {errors.pickup_address && <p className="text-red-500 text-xs mt-1">{errors.pickup_address}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Catatan pengambilan</label>
                            <input
                                type="text"
                                value={data.pickup_notes}
                                onChange={e => setData('pickup_notes', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                placeholder="Contoh: Ambil sebelum jam 5 sore, hubungi WA dulu"
                            />
                            {errors.pickup_notes && <p className="text-red-500 text-xs mt-1">{errors.pickup_notes}</p>}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-amber-700 font-medium">Perhatian</p>
                            <p className="text-xs text-amber-600 mt-0.5">
                                Dengan mengunggah produk, Anda bertanggung jawab atas kondisi produk yang diunggah.
                                Produk yang berjamur, berlendir, atau tidak layak akan dihapus oleh admin.
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                    >
                        {processing ? (
                            'Mengunggah...'
                        ) : (
                            <>
                                <Upload size={18} />
                                Upload produk
                            </>
                        )}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}