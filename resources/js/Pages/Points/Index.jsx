import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
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
} from 'lucide-react';

const TYPE_CONFIG = {
    earned_sell:    { label: 'Penjualan Pangan',  color: 'text-green-600 bg-green-50' },
    earned_barter:  { label: 'Barter Selesai',    color: 'text-purple-600 bg-purple-50' },
    earned_donate:  { label: 'Donasi Pangan',     color: 'text-blue-600 bg-blue-50' },
    earned_partner: { label: 'Alih Fungsi Mitra', color: 'text-amber-600 bg-amber-50' },
    earned_upload:  { label: 'Upload Produk',     color: 'text-green-600 bg-green-50' },
    redeemed:       { label: 'Penukaran Sembako', color: 'text-red-600 bg-red-50' },
};

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    return `${Math.floor(seconds / 86400)} hari lalu`;
}

export default function Index({ points = 0, history = [], redeemCode = '', badges = [], totalUnlocked = 0, totalBadges = 0, userStats, userRank = '-' }) {
    const [tab, setTab] = useState('points'); // 'points' | 'badges'
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        if (!redeemCode) return;
        navigator.clipboard.writeText(redeemCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AppLayout>
            <Head title="RePoin & Lencana — Replate" />

            <div className="max-w-4xl mx-auto space-y-5">
                {/* Top Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Program RePoin & Lencana Warga</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Apresiasi poin dan penghargaan atas kontribusi penyelamatan food waste desa
                        </p>
                    </div>
                    <Link
                        href="/leaderboard"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                        <Trophy size={14} className="text-amber-500" />
                        Papan Peringkat Desa
                    </Link>
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
                        Saldo & Penukaran
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

                {/* TAB 1: Saldo & Penukaran */}
                {tab === 'points' && (
                    <div className="space-y-5">
                        {/* Balance Card & Redeem Code (Professional 2-col) */}
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

                            {/* Kode Penukaran BUMDes */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Kode Penukaran Sembako</span>
                                        <Gift size={16} className="text-amber-500" />
                                    </div>
                                    <p className="text-xs text-gray-500">Tunjukkan kode ini ke kasir atau petugas pos BUMDes</p>

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
                                    <span>Penukaran berlaku di seluruh jaringan unit usaha BUMDes</span>
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

                {/* TAB 2: Lencana Prestasi (Badges) */}
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
            </div>
        </AppLayout>
    );
}