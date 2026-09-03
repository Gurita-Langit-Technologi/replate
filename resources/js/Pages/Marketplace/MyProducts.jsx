import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { ProductStatusBadge, ConditionBadge, ModeBadge } from '@/Components/ui/Badge';
import { EmptyState, SectionHeader } from '@/Components/ui/Layout';
import ProductImage from '@/Components/ui/ProductImage';
import { formatTimeLeftShort } from '@/Utils/time';
import { Head, Link, router } from '@inertiajs/react';
import {
    Package,
    Clock,
    Eye,
    Pencil,
    Trash2,
    Plus,
    Scale,
    ArrowLeftRight,
} from 'lucide-react';

function ProductCard({ product, onDelete }) {
    const isActive = ['active', 'timeout_stage_1'].includes(product.status);
    const isDone   = ['sold', 'bartered', 'donated', 'transferred'].includes(product.status);

    const priceDisplay = () => {
        if (product.transaction_mode === 'donate') return <span className="text-sm font-bold text-sky-600">Donasi</span>;
        if (!product.price) return <span className="text-sm font-bold text-violet-600">Barter</span>;
        if (product.discounted_price) return (
            <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-amber-600">Rp {product.discounted_price.toLocaleString('id-ID')}</span>
                <span className="text-xs text-gray-400 font-normal">/{product.unit || 'satuan'}</span>
                <span className="text-xs text-gray-400 line-through">Rp {product.price.toLocaleString('id-ID')}</span>
            </div>
        );
        return (
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-green-700">Rp {product.price.toLocaleString('id-ID')}</span>
                <span className="text-xs text-gray-400 font-normal">/{product.unit || 'satuan'}</span>
            </div>
        );
    };

    return (
        <div className={`bg-white rounded-xl border overflow-hidden transition hover:shadow-sm ${isDone ? 'border-gray-200 opacity-70' : 'border-gray-200'}`}>
            <div className="flex">
                {/* Thumbnail */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-slate-100">
                    <ProductImage
                        src={product.photo}
                        title={product.title}
                        category={product.category}
                        alt={product.title}
                        aspect="aspect-square"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 truncate hover:text-green-600 transition text-sm">
                                {product.title}
                            </Link>
                            <ProductStatusBadge status={product.status} />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <ConditionBadge condition={product.condition} size="xs" />
                            <ModeBadge mode={product.transaction_mode} size="xs" />
                            <span className="text-[11px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100">
                                Stok: {product.quantity || 1} {product.unit || 'satuan'}
                            </span>
                            {product.weight_grams > 0 && (
                                <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                                    <Scale size={10} />
                                    {(product.weight_grams / 1000).toFixed(1)} kg
                                </span>
                            )}
                            {isActive && (
                                <span className="text-[11px] text-amber-600 flex items-center gap-0.5 font-medium">
                                    <Clock size={10} />
                                    {formatTimeLeftShort(product.timeout_at)}
                                </span>
                            )}
                        </div>

                        {priceDisplay()}

                        {product.barter_description && (
                            <p className="text-xs text-violet-500 mt-1.5 truncate flex items-center gap-1">
                                <ArrowLeftRight size={10} />
                                {product.barter_description}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-2.5">
                        <Link
                            href={`/products/${product.id}`}
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-100 transition font-medium"
                        >
                            <Eye size={12} /> Lihat
                        </Link>
                        {product.status === 'active' && (
                            <>
                                <Link
                                    href={`/products/${product.id}/edit`}
                                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 border border-blue-100 transition font-medium"
                                >
                                    <Pencil size={12} /> Edit
                                </Link>
                                <button
                                    onClick={() => onDelete(product)}
                                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-100 transition font-medium"
                                >
                                    <Trash2 size={12} /> Hapus
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MyProducts({ products }) {
    const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: () => {} });

    function handleDelete(product) {
        setConfirmModal({
            show: true,
            title: 'Hapus Produk',
            message: `Yakin ingin menghapus produk "${product.title}"?`,
            onConfirm: () => router.delete(`/products/${product.id}`),
        });
    }

    const activeProducts = products.filter((p) => ['active', 'timeout_stage_1', 'timeout_stage_2'].includes(p.status));
    const doneProducts   = products.filter((p) => ['sold', 'bartered', 'donated', 'transferred', 'timeout_stage_3'].includes(p.status));

    return (
        <AppLayout>
            <Head title="Produk Saya" />
            <ConfirmModal
                show={confirmModal.show}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Hapus Produk"
                variant="danger"
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
            />

            <div className="max-w-4xl mx-auto">
                <SectionHeader
                    title="Produk Saya"
                    subtitle={`${products.length} produk total`}
                    action={
                        <Link href="/products/create" className="btn-primary">
                            <Plus size={16} /> Upload Produk
                        </Link>
                    }
                />

                {products.length > 0 ? (
                    <div className="space-y-8">
                        {activeProducts.length > 0 && (
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                    Sedang Tayang ({activeProducts.length})
                                </p>
                                <div className="space-y-3">
                                    {activeProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} onDelete={handleDelete} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {doneProducts.length > 0 && (
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                    Selesai ({doneProducts.length})
                                </p>
                                <div className="space-y-3">
                                    {doneProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} onDelete={handleDelete} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon={Package}
                        title="Belum ada produk diunggah"
                        description="Mulai kurangi food waste dengan upload produk pertama"
                        action={
                            <Link href="/products/create" className="btn-primary">
                                <Plus size={16} /> Upload Produk Pertama
                            </Link>
                        }
                    />
                )}
            </div>
        </AppLayout>
    );
}