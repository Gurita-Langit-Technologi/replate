import { Link } from '@inertiajs/react';
import { Package, Scale } from 'lucide-react';

export default function TransactionProductCard({ product, transaction }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Produk</p>
            <Link href={`/products/${product.id}`} className="flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {product.photo ? (
                        <img
                            src={`/storage/${product.photo}`}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package size={24} />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate group-hover:text-green-600 transition">
                        {product.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {product.category} · {product.condition}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-900">
                            <Scale size={13} className="text-gray-400" />
                            {transaction.quantity ? `${transaction.quantity} ${product.unit || 'unit'}` : '1 unit'}
                            {product.weight_grams ? ` (~${((product.weight_grams * (transaction.quantity || 1)) / 1000).toFixed(1)} kg)` : ''}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    {transaction.price ? (
                        <div>
                            <p className="text-base font-bold text-gray-900">
                                Rp {(transaction.price * (transaction.quantity || 1)).toLocaleString('id-ID')}
                            </p>
                            {(transaction.quantity || 1) > 1 && (
                                <p className="text-[10px] text-gray-400">
                                    Rp {Number(transaction.price).toLocaleString('id-ID')} / {product.unit || 'satuan'}
                                </p>
                            )}
                        </div>
                    ) : (
                        <span className="text-sm font-semibold text-sky-600">Gratis (Donasi)</span>
                    )}
                </div>
            </Link>

            {transaction.barter_notes && (
                <div className="mt-3 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                    <p className="text-xs text-violet-500 mb-0.5 font-medium">Catatan barter</p>
                    <p className="text-sm text-violet-700">{transaction.barter_notes}</p>
                </div>
            )}
        </div>
    );
}
