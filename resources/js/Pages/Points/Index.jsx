import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Coins,
    TrendingUp,
    TrendingDown,
    Award,
    Trophy,
    Lock,
    CheckCircle2,
    Copy,
    Check,
    ArrowRight,
    QrCode,
    Sparkles,
    Shield,
    Leaf,
    Scale,
    Gift,
    HelpCircle,
    ShoppingBag,
    Ticket,
    AlertCircle,
} from 'lucide-react';
import ShareableImpactCard from '@/Components/ShareableImpactCard';

const TYPE_CONFIG = {
    earned_sell:    { label: 'Penjualan Pangan',  color: 'text-green-600 bg-green-50' },
    earned_barter:  { label: 'Barter Selesai',    color: 'text-purple-600 bg-purple-50' },
    earned_donate:  { label: 'Donasi Pangan',     color: 'text-blue-600 bg-blue-50' },
    earned_partner: { label: 'Alih Fungsi Mitra', color: 'text-amber-600 bg-amber-50' },
    earned_upload:  { label: 'Upload Produk',     color: 'text-green-600 bg-green-50' },
    redeemed:       { label: 'Penukaran Hadiah',  color: 'text-red-600 bg-red-50' },
};

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    return `${Math.floor(seconds / 86400)} hari lalu`;
}

export default function Index({
    points = 0,
    history = [],
    redeemCode = '',
    badges = [],
    totalUnlocked = 0,
    totalBadges = 0,
    userStats,
    userRank = '-',
    rewards = [],
}) {
    const { auth } = usePage().props;
    const [tab, setTab] = useState('points'); // 'points' | 'rewards' | 'badges'
    const [copied, setCopied] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [isRedeeming, setIsRedeeming] = useState(false);

    const handleCopyCode = () => {
        if (!redeemCode) return;
        navigator.clipboard.writeText(redeemCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmRedeem = () => {
        if (!selectedReward) return;
        setIsRedeeming(true);
        router.post('/points/redeem', {
            reward_id: selectedReward.id,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setIsRedeeming(false);
                setSelectedReward(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="RePoin & Lencana — Replate" />

            <div className="max-w-4xl mx-auto space-y-5">
                {/* Top Page Header with Shareable Impact Card trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Program RePoin & Lencana Warga</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Apresiasi poin dan penghargaan atas kontribusi penyelamatan food waste desa
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShareableImpactCard
                            user={auth?.user}
                            userStats={userStats}
                            badges={badges}
                            rank={userRank}
                            points={points}
                        />
                        <Link
                            href="/leaderboard"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                        >
                            <Trophy size={14} className="text-amber-500" />
                            Peringkat Desa
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setTab('points')}
                        className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
                            tab === 'points'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Coins size={15} />
                        Saldo & Riwayat
                    </button>
                    <button
                        onClick={() => setTab('rewards')}
                        className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
                            tab === 'rewards'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Gift size={15} />
                        Katalog Hadiah Sembako & Bibit
                    </button>
                    <button
                        onClick={() => setTab('badges')}
                        className={`pb-3 px-4 text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
                            tab === 'badges'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Award size={15} />
                        Lencana Prestasi ({totalUnlocked}/{totalBadges})
                    </button>
                </div>

                {/* TAB 1: Saldo & Riwayat */}
                {tab === 'points' && (
                    <div className="space-y-5">
                        {/* Balance Card & Redeem Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Saldo Poin Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Saldo RePoin</span>
                                        <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                            Aktif
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mt-3">
                                        <span className="text-4xl font-extrabold text-gray-900">{points.toLocaleString('id-ID')}</span>
                                        <span className="text-sm font-semibold text-gray-500">Poin</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Total food waste dicegah: <strong className="text-gray-900">{userStats?.weight_saved_kg ?? 0} kg</strong>
                                    </p>
                                </div>

                                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                    <span>Peringkat Desa: <strong>#{userRank}</strong></span>
                                    <span className="text-green-700 font-medium">{userStats?.level_title}</span>
                                </div>
                            </div>

                            {/* Kode Penukaran BUMDes / Posko */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Kode Akun Penukaran</span>
                                        <QrCode size={16} className="text-emerald-600" />
                                    </div>
                                    <p className="text-xs text-gray-500">Tunjukkan kode ini saat verifikasi klaim di posko / admin desa</p>

                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-between">
                                        <span className="font-mono text-xl font-bold tracking-wider text-gray-900">
                                            {redeemCode || 'BELUM-TERSEDIA'}
                                        </span>
                                        <button
                                            onClick={handleCopyCode}
                                            className="px-2.5 py-1.5 bg-white text-gray-700 hover:text-green-600 hover:border-green-300 border border-gray-200 text-xs font-semibold rounded shadow-xs transition flex items-center gap-1"
                                        >
                                            {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                                            {copied ? 'Tersalin' : 'Salin'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-gray-400">
                                    <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                                    <span>Penukaran dapat dilakukan langsung di tab Katalog Hadiah</span>
                                </div>
                            </div>
                        </div>

                        {/* Nilai Konversi / Petunjuk */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Tabel Perolehan Poin per Kilogram</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                                    <span className="text-gray-500 font-medium">Makanan Siap Konsumsi</span>
                                    <p className="text-base font-bold text-green-700 mt-0.5">3 Poin / kg</p>
                                    <span className="text-[10px] text-gray-400">Sisa katering, hidangan warung, kue</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                                    <span className="text-gray-500 font-medium">Bahan Perlu Diolah</span>
                                    <p className="text-base font-bold text-amber-700 mt-0.5">2 Poin / kg</p>
                                    <span className="text-[10px] text-gray-400">Sayuran layu, buah overripe, tempe</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                                    <span className="text-gray-500 font-medium">Bahan Pakan & Kompos</span>
                                    <p className="text-base font-bold text-orange-700 mt-0.5">1 Poin / kg</p>
                                    <span className="text-[10px] text-gray-400">Kulit buah, ampas tahu, sisa nasi</span>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat Mutasi Poin */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h2 className="text-sm font-bold text-gray-900 mb-3">Riwayat Transaksi Poin</h2>
                            {history && history.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {history.map((h) => {
                                        const isPositive = h.amount > 0;
                                        const typeInfo = TYPE_CONFIG[h.type] ?? { label: h.type, color: 'text-gray-600 bg-gray-50' };
                                        return (
                                            <div key={h.id} className="py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs font-semibold text-gray-900">{h.description || typeInfo.label}</p>
                                                            <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${typeInfo.color}`}>
                                                                {typeInfo.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(h.created_at)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                        {isPositive ? `+${h.amount}` : h.amount}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 block">Poin</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic text-center py-6">Belum ada riwayat perolehan atau penukaran poin.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: Katalog Hadiah Penukaran */}
                {tab === 'rewards' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                            <Gift className="text-emerald-600 mt-0.5 flex-shrink-0" size={18} />
                            <div className="text-xs text-emerald-900 leading-relaxed">
                                <strong className="font-semibold">Katalog Penukaran RePoin Mandiri:</strong> Pilih hadiah di bawah ini untuk menukarkan poin Anda. Setelah klaim berhasil, tiket penukaran akan otomatis dibuat dan dikonfirmasi oleh petugas posko desa.
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {rewards.map((reward) => {
                                const canAfford = points >= reward.points;
                                return (
                                    <div
                                        key={reward.id}
                                        className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-2xl p-2 bg-gray-50 rounded-xl border border-gray-100">{reward.icon}</span>
                                                    <div>
                                                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                            {reward.category}
                                                        </span>
                                                        <h3 className="text-xs font-bold text-gray-900 mt-1">{reward.title}</h3>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-extrabold text-emerald-700">{reward.points}</div>
                                                    <div className="text-[10px] text-gray-400">RePoin</div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed pt-1">{reward.description}</p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-[11px] text-gray-400">
                                                Stok Posko: <strong>{reward.stock} unit</strong>
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedReward(reward)}
                                                disabled={!canAfford}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                                    canAfford
                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {canAfford ? 'Tukar Hadiah' : 'Poin Kurang'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 3: Lencana Prestasi (Badges) */}
                {tab === 'badges' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {badges.map((b) => (
                                <div
                                    key={b.id}
                                    className={`p-4 rounded-xl border transition ${
                                        b.unlocked
                                            ? 'bg-white border-gray-200 shadow-xs'
                                            : 'bg-gray-50/60 border-gray-200 opacity-60'
                                    }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 border ${
                                            b.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200 text-gray-400'
                                        }`}>
                                            {b.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="text-xs font-bold text-gray-900">{b.title}</h3>
                                                {b.unlocked ? (
                                                    <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                                                        Terbuka
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                                                        <Lock size={10} /> Terkunci
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{b.description}</p>
                                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                                                <span>Progres Target</span>
                                                <span className="font-semibold text-gray-700">{b.progress}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Redeem Confirmation Modal */}
                {selectedReward && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
                            <div className="text-center space-y-2">
                                <span className="text-4xl">{selectedReward.icon}</span>
                                <h3 className="text-base font-bold text-gray-900">Konfirmasi Penukaran RePoin</h3>
                                <p className="text-xs text-gray-500">
                                    Anda akan menukar <strong className="text-emerald-600">{selectedReward.points} RePoin</strong> untuk <strong className="text-gray-900">{selectedReward.title}</strong>.
                                </p>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1.5 border border-gray-200">
                                <div className="flex justify-between text-gray-500">
                                    <span>Saldo Poin Anda:</span>
                                    <span>{points} Poin</span>
                                </div>
                                <div className="flex justify-between text-red-600 font-medium">
                                    <span>Biaya Penukaran:</span>
                                    <span>-{selectedReward.points} Poin</span>
                                </div>
                                <div className="flex justify-between text-gray-900 font-bold pt-1.5 border-t border-gray-200">
                                    <span>Sisa Poin:</span>
                                    <span>{points - selectedReward.points} Poin</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedReward(null)}
                                    disabled={isRedeeming}
                                    className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmRedeem}
                                    disabled={isRedeeming}
                                    className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition disabled:opacity-50"
                                >
                                    {isRedeeming ? 'Memproses...' : 'Ya, Tukar Sekarang'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}