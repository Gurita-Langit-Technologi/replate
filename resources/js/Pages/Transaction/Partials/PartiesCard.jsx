import { Link } from '@inertiajs/react';
import { User, MapPin, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';

export default function PartiesCard({ transaction, product, isBuyer, isSeller, hasReviewed }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Pihak terlibat</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-xl ${isSeller ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <User size={14} className="text-gray-400" />
                        <p className="text-xs text-gray-400">Penjual / Pendonor</p>
                        {isSeller && <span className="text-[10px] px-1.5 py-0.5 bg-green-200 text-green-700 rounded font-medium">Anda</span>}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{transaction.seller?.name}</p>
                    {transaction.seller?.desa && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin size={11} className="text-gray-400" /> Desa {transaction.seller.desa}
                        </p>
                    )}
                    {!isSeller && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex flex-wrap gap-2">
                            <Link
                                href={`/chat/${transaction.seller?.id}/${product.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 hover:border-green-300 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition"
                            >
                                <MessageSquare size={13} className="text-green-600" />
                                Chat In-App
                            </Link>
                            {transaction.seller?.whatsapp_number && (
                                <a
                                    href={`https://wa.me/${transaction.seller.whatsapp_number.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo kak ${transaction.seller.name}, saya pembeli produk "${product.title}" di Replate (Transaksi #${transaction.id}). Mau konfirmasi penjemputan barang ya kak.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
                                >
                                    <Phone size={13} />
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className={`p-4 rounded-xl ${isBuyer ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <User size={14} className="text-gray-400" />
                        <p className="text-xs text-gray-400">Pembeli / Penerima</p>
                        {isBuyer && <span className="text-[10px] px-1.5 py-0.5 bg-green-200 text-green-700 rounded font-medium">Anda</span>}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{transaction.buyer?.name}</p>
                    {transaction.buyer?.desa && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin size={11} className="text-gray-400" /> Desa {transaction.buyer.desa}
                        </p>
                    )}
                    {!isBuyer && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex flex-wrap gap-2">
                            <Link
                                href={`/chat/${transaction.buyer?.id}/${product.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 hover:border-green-300 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition"
                            >
                                <MessageSquare size={13} className="text-green-600" />
                                Chat In-App
                            </Link>
                            {transaction.buyer?.whatsapp_number && (
                                <a
                                    href={`https://wa.me/${transaction.buyer.whatsapp_number.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo kak ${transaction.buyer.name}, saya penjual produk "${product.title}" di Replate (Transaksi #${transaction.id}). Mengenai pesanan kakak, silakan info jika ingin konfirmasi pengambilan ya kak.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
                                >
                                    <Phone size={13} />
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {hasReviewed ? (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Anda telah memberikan ulasan untuk transaksi ini.
                </p>
            ) : isBuyer ? (
                <p className="text-xs text-gray-400 mt-2">Beri bintang dan feedback untuk penjual guna membangun reputasi desa.</p>
            ) : null}
        </div>
    );
}
