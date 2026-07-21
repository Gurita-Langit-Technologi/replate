import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    MapPin,
    Scale,
    Clock,
    Tag,
    ShoppingBasket,
    ArrowLeftRight,
    Heart,
    Flag,
    User,
    MessageCircle,
} from 'lucide-react';

function Badge({ children, color = 'gray' }) {
    const colors = {
        green: 'bg-green-50 text-green-700 border-green-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        red: 'bg-red-50 text-red-700 border-red-200',
        gray: 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return (
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${colors[color]}`}>
            {children}
        </span>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-gray-400" />
            </div>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
}

export default function Show({ product }) {
    const { auth } = usePage().props;
    const isOwner = auth.user.id === product.user_id;

    const timeLeft = new Date(product.timeout_at) - new Date();
    const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
    const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

    const conditionLabels = {
        layak_konsumsi: 'Layak konsumsi',
        layak_olah: 'Layak olah ulang',
        layak_pakan_kompos: 'Pakan / kompos',
    };

    const conditionColors = {
        layak_konsumsi: 'green',
        layak_olah: 'amber',
        layak_pakan_kompos: 'red',
    };

    const modeLabels = {
        sell: 'Jual',
        barter: 'Barter',
        sell_and_barter: 'Jual & barter',
        donate: 'Donasi',
    };

    const categoryLabels = {
        mentah: 'Mentah',
        olahan: 'Olahan',
        hasil_bumi: 'Hasil bumi',
    };

    function handleReport() {
        const reasons = [
            { value: 'tidak_sesuai_foto', label: 'Tidak sesuai foto' },
            { value: 'kondisi_buruk', label: 'Kondisi lebih buruk dari deskripsi' },
            { value: 'produk_tidak_layak', label: 'Produk tidak layak' },
            { value: 'penipuan', label: 'Penipuan' },
        ];
        const choice = prompt(
            'Pilih alasan laporan (ketik angka):\n' +
            reasons.map((r, i) => `${i + 1}. ${r.label}`).join('\n')
        );
        const idx = parseInt(choice) - 1;
        if (idx >= 0 && idx < reasons.length) {
            router.post(`/products/${product.id}/report`, { reason: reasons[idx].value });
        }
    }

    return (
        <AppLayout>
            <Head title={product.title} />

            <div className="max-w-5xl mx-auto">
                {/* Back button */}
                <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <ArrowLeft size={16} />
                    Kembali ke marketplace
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT: Foto */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                            {product.photo ? (
                                <img
                                    src={`/storage/${product.photo}`}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ShoppingBasket size={64} />
                                </div>
                            )}
                        </div>

                        {/* Timeout warning (mobile visible, desktop below foto) */}
                        {product.status === 'timeout_stage_1' && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                                <Clock size={16} className="text-red-500" />
                                <p className="text-sm text-red-700 font-medium">Segera habis masa tayang!</p>
                            </div>
                        )}

                        {product.status === 'timeout_stage_2' && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2">
                                <Heart size={16} className="text-blue-500" />
                                <p className="text-sm text-blue-700 font-medium">Produk ini tersedia sebagai donasi</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Info */}
                    <div>
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge color={conditionColors[product.condition]}>
                                {conditionLabels[product.condition]}
                            </Badge>
                            <Badge>{categoryLabels[product.category]}</Badge>
                            <Badge color="purple">{modeLabels[product.transaction_mode]}</Badge>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>

                        {/* Price */}
                        {product.price ? (
                            <div className="mb-4">
                                {product.discounted_price ? (
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-red-500">
                                            Rp {product.discounted_price.toLocaleString()}
                                        </span>
                                        <span className="text-lg text-gray-400 line-through">
                                            Rp {product.price.toLocaleString()}
                                        </span>
                                        <Badge color="red">-25%</Badge>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-green-600">
                                        Rp {product.price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-blue-600">
                                    {product.transaction_mode === 'donate' ? 'Donasi gratis' : 'Barter'}
                                </span>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-4" />

                        {/* Info items */}
                        <div className="divide-y divide-gray-50">
                            <InfoItem icon={Scale} label="Jumlah" value={`${product.quantity} ${product.unit}${product.weight_grams ? ` (${(product.weight_grams / 1000).toFixed(1)}kg)` : ''}`} />
                            <InfoItem icon={MapPin} label="Lokasi" value={`${product.desa}, ${product.kecamatan}`} />
                            <InfoItem icon={Clock} label="Sisa waktu" value={hoursLeft > 0 ? `${hoursLeft} jam ${minutesLeft} menit lagi` : `${minutesLeft} menit lagi`} />
                            <InfoItem icon={Tag} label="Kategori" value={`${categoryLabels[product.category]} · ${conditionLabels[product.condition]}`} />
                        </div>

                        {/* Barter description */}
                        {product.barter_description && (
                            <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <ArrowLeftRight size={14} className="text-purple-600" />
                                    <p className="text-sm font-medium text-purple-700">Menerima barter</p>
                                </div>
                                <p className="text-sm text-purple-600">{product.barter_description}</p>
                            </div>
                        )}

                        {/* Seller info */}
                        {product.user && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Penjual</p>
                                    <p className="text-sm font-medium text-gray-900">{product.user.name}</p>
                                </div>
                            </div>
                        )}

                        {/* Lokasi Pengambilan */}
                        {(product.pickup_address || product.pickup_notes) && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin size={14} className="text-gray-500" />
                                    <p className="text-xs text-gray-400">Lokasi pengambilan</p>
                                </div>
                                {product.pickup_address && (
                                    <p className="text-sm text-gray-700">{product.pickup_address}</p>
                                )}
                                {product.pickup_notes && (
                                    <p className="text-xs text-gray-500 mt-1">📝 {product.pickup_notes}</p>
                                )}
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-4" />

                        {/* Description */}
                        <div className="mb-4">
                            <p className="text-xs text-gray-400 mb-1">Deskripsi</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Action Buttons */}
                        {!isOwner && (
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    {(product.transaction_mode === 'sell' || product.transaction_mode === 'sell_and_barter') &&
                                     ['active', 'timeout_stage_1'].includes(product.status) && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Yakin ingin membeli produk ini?')) {
                                                    router.post(`/products/${product.id}/buy`);
                                                }
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
                                        >
                                            <ShoppingBasket size={18} />
                                            Beli produk
                                        </button>
                                    )}

                                    {(product.transaction_mode === 'barter' || product.transaction_mode === 'sell_and_barter') &&
                                     ['active', 'timeout_stage_1'].includes(product.status) && (
                                        <Link
                                            href={`/products/${product.id}/barter`}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
                                        >
                                            <ArrowLeftRight size={18} />
                                            Ajukan barter
                                        </Link>
                                    )}
                                </div>

                                {(product.transaction_mode === 'donate' || product.status === 'timeout_stage_2') && (
                                    <button
                                        onClick={() => {
                                            if (confirm('Yakin ingin mengklaim donasi ini?')) {
                                                router.post(`/products/${product.id}/claim-donation`);
                                            }
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                                    >
                                        <Heart size={18} />
                                        Klaim donasi
                                    </button>
                                )}

                                <Link
                                    href={`/products/${product.id}/chat`}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                                >
                                    <MessageCircle size={16} />
                                    Chat dengan penjual
                                </Link>

                                <button
                                    onClick={handleReport}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                                >
                                    <Flag size={14} />
                                    Laporkan produk
                                </button>
                            </div>
                        )}

                        {isOwner && (
                            <div className="flex gap-3">
                                <Link
                                    href={`/products/${product.id}/edit`}
                                    className="flex-1 py-3.5 text-center bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                                >
                                    Edit produk
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm('Yakin ingin menghapus produk ini?')) {
                                            router.delete(`/products/${product.id}`);
                                        }
                                    }}
                                    className="flex-1 py-3.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition"
                                >
                                    Hapus produk
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}