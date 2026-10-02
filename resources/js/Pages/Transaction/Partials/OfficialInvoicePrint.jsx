import { Building2, User, Leaf, ShieldCheck, Coins, QrCode } from 'lucide-react';

export default function OfficialInvoicePrint({ transaction, product, status, type }) {
    return (
        <div className="hidden print:block max-w-4xl mx-auto p-8 bg-white text-gray-900 font-sans">
            {/* Header Kop Resmi Marketplace */}
            <div className="flex items-start justify-between pb-6 border-b-2 border-gray-900">
                <div className="flex items-center gap-3.5">
                    <img src="/image/logo(2).png" alt="Replate" className="w-auto h-12 rounded-lg object-contain" />
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-emerald-900 uppercase">REPLATE INDONESIA</h1>
                        <p className="text-xs font-semibold text-gray-600">Platform Marketplace & Hub Sirkular Pangan Desa</p>
                        <p className="text-[11px] text-gray-400">Pemberdayaan BUMDes, Rumah Tangga & Komunitas Nol Sampah Makanan</p>
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <span className="inline-block text-xs font-extrabold uppercase px-3 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                        BUKTI TRANSAKSI RESMI
                    </span>
                    <p className="text-xs font-bold text-gray-800 font-mono mt-1">
                        INV/RPL/{new Date(transaction.created_at || Date.now()).getFullYear()}/{String(transaction.id).padStart(6, '0')}
                    </p>
                    <p className="text-[11px] text-gray-500">
                        Waktu: {new Date(transaction.created_at || Date.now()).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                </div>
            </div>

            {/* Status Banner */}
            <div className="my-5 p-3.5 bg-gray-50 border border-gray-300 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700 uppercase tracking-wide">Status Transaksi:</span>
                    <span className="font-extrabold px-2.5 py-0.5 rounded bg-emerald-600 text-white uppercase text-[11px]">
                        {status.label}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-500">Metode Transaksi:</span>
                    <span className="font-bold text-gray-900 capitalize">{type.label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-500">Kode Unik:</span>
                    <span className="font-mono font-bold text-gray-900">TX-{transaction.id}</span>
                </div>
            </div>

            {/* 2-Column Info: Penjual & Pembeli */}
            <div className="grid grid-cols-2 gap-6 my-6 text-xs">
                {/* Data Penjual */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 uppercase tracking-wider text-[11px] pb-1 border-b border-gray-200">
                        <Building2 size={13} className="text-emerald-700" />
                        Informasi Penjual / Penyedia Pangan
                    </div>
                    <p className="text-sm font-bold text-gray-900 pt-1">{transaction.seller?.name || 'Warga Penyedia'}</p>
                    <p className="text-gray-600"><strong>Wilayah:</strong> Desa {transaction.seller?.desa || product.desa || '-'}, Kec. {transaction.seller?.kecamatan || product.kecamatan || '-'}</p>
                    <p className="text-gray-600"><strong>Kontak / WA:</strong> {transaction.seller?.whatsapp_number || '-'}</p>
                    <p className="text-gray-600"><strong>Alamat Penjemputan:</strong> {product.pickup_address || transaction.seller?.address || 'Alamat Terdaftar di Profil'}</p>
                    {product.pickup_notes && (
                        <p className="text-gray-500 italic text-[11px]"><strong>Catatan Lokasi:</strong> {product.pickup_notes}</p>
                    )}
                </div>

                {/* Data Pembeli */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 uppercase tracking-wider text-[11px] pb-1 border-b border-gray-200">
                        <User size={13} className="text-emerald-700" />
                        Informasi Pembeli / Penerima Manfaat
                    </div>
                    <p className="text-sm font-bold text-gray-900 pt-1">{transaction.buyer?.name || 'Warga Penerima'}</p>
                    <p className="text-gray-600"><strong>Email:</strong> {transaction.buyer?.email || '-'}</p>
                    <p className="text-gray-600"><strong>Wilayah:</strong> Desa {transaction.buyer?.desa || '-'}, Kec. {transaction.buyer?.kecamatan || '-'}</p>
                    <p className="text-gray-600"><strong>Kontak / WA:</strong> {transaction.buyer?.whatsapp_number || '-'}</p>
                    <p className="text-gray-600"><strong>Tipe Serah Terima:</strong> Diambil Langsung / Sesuai Kesepakatan</p>
                </div>
            </div>

            {/* Tabel Itemized Produk */}
            <div className="my-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Rincian Barang yang Ditransaksikan</h2>
                <table className="w-full border-collapse border border-gray-300 text-xs">
                    <thead>
                        <tr className="bg-gray-100 text-gray-800 uppercase font-bold text-[10px] tracking-wider">
                            <th className="border border-gray-300 p-2.5 text-center w-10">No</th>
                            <th className="border border-gray-300 p-2.5 text-left">Nama Produk Makanan</th>
                            <th className="border border-gray-300 p-2.5 text-left">Kategori & Kondisi</th>
                            <th className="border border-gray-300 p-2.5 text-center">Kuantitas</th>
                            <th className="border border-gray-300 p-2.5 text-center">Estimasi Berat</th>
                            <th className="border border-gray-300 p-2.5 text-right">Harga Satuan</th>
                            <th className="border border-gray-300 p-2.5 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-3 text-center font-bold">1</td>
                            <td className="border border-gray-300 p-3">
                                <p className="font-bold text-gray-900">{product.title}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">{product.description ? (product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description) : '-'}</p>
                            </td>
                            <td className="border border-gray-300 p-3">
                                <span className="capitalize">{product.category || 'Mentah'}</span> · <span className="capitalize">{product.condition?.replace(/_/g, ' ') || 'Layak'}</span>
                            </td>
                            <td className="border border-gray-300 p-3 text-center font-bold">
                                {transaction.quantity || 1} {product.unit || 'unit'}
                            </td>
                            <td className="border border-gray-300 p-3 text-center font-medium">
                                {product.weight_grams ? `${((product.weight_grams * (transaction.quantity || 1)) / 1000).toFixed(1)} kg` : '1.0 kg'}
                            </td>
                            <td className="border border-gray-300 p-3 text-right font-medium">
                                {transaction.price ? `Rp ${Number(product.discounted_price ?? product.price ?? Math.round(transaction.price / (transaction.quantity || 1))).toLocaleString('id-ID')}` : 'Gratis'}
                            </td>
                            <td className="border border-gray-300 p-3 text-right font-bold text-emerald-900">
                                {transaction.price ? `Rp ${Number(transaction.price).toLocaleString('id-ID')}` : 'Rp 0 (Donasi)'}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-50 font-bold">
                            <td colSpan="6" className="border border-gray-300 p-2.5 text-right uppercase text-[11px]">Subtotal Pembayaran:</td>
                            <td className="border border-gray-300 p-2.5 text-right text-emerald-900 text-xs">
                                {transaction.price ? `Rp ${Number(transaction.price).toLocaleString('id-ID')}` : 'Rp 0'}
                            </td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td colSpan="6" className="border border-gray-300 p-2 text-right text-[11px] text-gray-600">Biaya Fasilitasi Platform BUMDes:</td>
                            <td className="border border-gray-300 p-2 text-right text-green-700 text-xs font-semibold">Rp 0 (Subsidi Desa)</td>
                        </tr>
                        <tr className="bg-emerald-50 text-emerald-950 font-extrabold text-sm">
                            <td colSpan="6" className="border border-gray-300 p-3 text-right uppercase">TOTAL AKHIR TRANSAKSI:</td>
                            <td className="border border-gray-300 p-3 text-right text-base text-emerald-800">
                                {transaction.price ? `Rp ${Number(transaction.price).toLocaleString('id-ID')}` : 'Rp 0 (Donasi Sosial)'}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Dampak Sirkularitas & RePoin */}
            <div className="grid grid-cols-3 gap-3 my-5 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                    <Leaf size={16} className="text-emerald-700 shrink-0" />
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold">Pangan Diselamatkan</p>
                        <p className="font-extrabold text-emerald-900 text-sm">
                            {product.weight_grams ? `${((product.weight_grams * (transaction.quantity || 1)) / 1000).toFixed(1)} kg` : '1.0 kg'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 border-x border-emerald-200 px-3">
                    <ShieldCheck size={16} className="text-teal-700 shrink-0" />
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold">Cegah Emisi CO2</p>
                        <p className="font-extrabold text-teal-900 text-sm">
                            ~{product.weight_grams ? (((product.weight_grams * (transaction.quantity || 1)) / 1000) * 2.5).toFixed(1) : '2.5'} kg CO2e
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 pl-2">
                    <Coins size={16} className="text-amber-600 shrink-0" />
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold">Apresiasi RePoin</p>
                        <p className="font-extrabold text-amber-900 text-sm">
                            +{product.weight_grams ? Math.max(1, Math.round(((product.weight_grams * (transaction.quantity || 1)) / 1000) * (product.condition === 'layak_konsumsi' ? 3 : 2))) : 3} RePoin
                        </p>
                    </div>
                </div>
            </div>

            {/* Catatan & Ketentuan */}
            <div className="my-5 p-3.5 border border-gray-200 rounded-xl text-[11px] text-gray-600 space-y-1 bg-gray-50/30">
                <p className="font-bold text-gray-800 uppercase tracking-wide text-[10px]">Ketentuan & Kebijakan Transaksi Sirkular:</p>
                <p>1. Transaksi ini tercatat resmi dalam sistem audit sirkularitas pangan desa Replate terintegrasi BUMDes.</p>
                <p>2. Makanan yang telah diterima dianjurkan segera dikonsumsi atau diolah sesuai standar higienitas dapur.</p>
                <p>3. Apabila terjadi kendala kualitas (makanan basi), pengguna dapat memanfaatkan fasilitas tiket pos pengalihan mitra pengolah.</p>
            </div>

            {/* Tanda Tangan & QR Verification */}
            <div className="pt-6 border-t-2 border-dashed border-gray-300 grid grid-cols-3 text-center text-xs text-gray-700">
                <div>
                    <p className="font-medium text-gray-500">Pihak Penjual / Penyedia,</p>
                    <div className="h-16 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-gray-400">[Tanda Tangan Digital]</span>
                    </div>
                    <p className="font-bold text-gray-900 underline">{transaction.seller?.name || 'Penjual'}</p>
                    <p className="text-[10px] text-gray-400">ID: W-{transaction.seller?.id || '01'}</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border border-gray-400 rounded-lg flex flex-col items-center justify-center p-1 bg-white shadow-2xs mb-1">
                        <QrCode size={36} className="text-gray-900" />
                        <span className="text-[8px] font-mono font-bold mt-0.5">RPL-VERIFIED</span>
                    </div>
                    <p className="text-[9px] text-gray-500 font-mono">SEAL-TX-{transaction.id}</p>
                </div>

                <div>
                    <p className="font-medium text-gray-500">Pihak Pembeli / Penerima,</p>
                    <div className="h-16 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-gray-400">[Tanda Tangan Digital]</span>
                    </div>
                    <p className="font-bold text-gray-900 underline">{transaction.buyer?.name || 'Pembeli'}</p>
                    <p className="text-[10px] text-gray-400">ID: W-{transaction.buyer?.id || '02'}</p>
                </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-gray-400">
                Dokumen ini dicetak otomatis dari Replate Platform (Sistem Sirkular Pangan Desa Terintegrasi). Sah tanpa tanda tangan basah.
            </div>
        </div>
    );
}
