import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
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
    Users,
    Search,
    Mail,
    Phone,
    MapPin,
    Calendar,
    RefreshCw,
    Building2,
    DollarSign,
    ExternalLink,
    CheckCheck,
    Wheat,
    CookingPot,
    Sprout,
    Flower2,
    Egg,
    Heart,
    Medal,
    Utensils,
    ChefHat,
    Recycle
} from 'lucide-react';
import ShareableImpactCard from '@/Components/ShareableImpactCard';

function getRewardIcon(iconName) {
    switch (iconName) {
        case 'wheat':
            return <Wheat className="text-amber-600" size={24} />;
        case 'cooking_pot':
            return <CookingPot className="text-orange-600" size={24} />;
        case 'sprout':
            return <Sprout className="text-emerald-600" size={24} />;
        case 'flower':
            return <Flower2 className="text-rose-600" size={24} />;
        case 'egg':
            return <Egg className="text-amber-500" size={24} />;
        case 'ticket':
            return <Ticket className="text-blue-600" size={24} />;
        case 'shopping_bag':
            return <ShoppingBag className="text-teal-600" size={24} />;
        default:
            return <Gift className="text-emerald-600" size={24} />;
    }
}

function getBadgeIcon(iconName, unlocked) {
    const colorClass = unlocked ? 'text-emerald-600' : 'text-gray-400';
    switch (iconName) {
        case 'leaf':
            return <Leaf className={colorClass} size={22} />;
        case 'medal_bronze':
            return <Medal className={unlocked ? 'text-amber-700' : 'text-gray-400'} size={22} />;
        case 'medal_silver':
            return <Medal className={unlocked ? 'text-slate-500' : 'text-gray-400'} size={22} />;
        case 'medal_gold':
            return <Trophy className={unlocked ? 'text-amber-500' : 'text-gray-400'} size={22} />;
        case 'refresh_cw':
            return <RefreshCw className={colorClass} size={22} />;
        case 'heart':
            return <Heart className={unlocked ? 'text-rose-500' : 'text-gray-400'} size={22} />;
        case 'shopping_bag':
            return <ShoppingBag className={colorClass} size={22} />;
        default:
            return <Award className={colorClass} size={22} />;
    }
}

const TYPE_CONFIG = {
    earned_sell:    { label: 'Penjualan Pangan',  color: 'text-green-600 bg-green-50' },
    earned_barter:  { label: 'Barter Selesai',    color: 'text-purple-600 bg-purple-50' },
    earned_donate:  { label: 'Donasi Pangan',     color: 'text-blue-600 bg-blue-50' },
    earned_partner: { label: 'Alih Fungsi Mitra', color: 'text-amber-600 bg-amber-50' },
    earned_upload:  { label: 'Upload Produk',     color: 'text-green-600 bg-green-50' },
    redeemed:       { label: 'Penukaran Hadiah',  color: 'text-red-600 bg-red-50' },
};

const ROLE_LABELS = {
    admin: 'Admin BUMDes',
    verified_seller: 'Penjual Terverifikasi',
    partner: 'Mitra Pengolah',
    user: 'Warga / Pengguna',
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
    allUsers = [],
}) {
    const { auth } = usePage().props;
    const currentUser = auth?.user;

    const [tab, setTab] = useState('points'); // 'points' | 'rewards' | 'badges' | 'directory' | 'circular'
    const [copied, setCopied] = useState(false);
    const [copiedUserId, setCopiedUserId] = useState(null);
    const [searchUserQuery, setSearchUserQuery] = useState('');
    const [selectedReward, setSelectedReward] = useState(null);
    const [isRedeeming, setIsRedeeming] = useState(false);

    const handleCopyCode = (code = redeemCode, id = null) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        if (id) {
            setCopiedUserId(id);
            setTimeout(() => setCopiedUserId(null), 2000);
        } else {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
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

    const filteredUsers = useMemo(() => {
        if (!searchUserQuery.trim()) return allUsers;
        const q = searchUserQuery.toLowerCase();
        return allUsers.filter(u =>
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.redeem_code && u.redeem_code.toLowerCase().includes(q)) ||
            (u.desa && u.desa.toLowerCase().includes(q)) ||
            (u.whatsapp_number && u.whatsapp_number.includes(q))
        );
    }, [allUsers, searchUserQuery]);

    const totalCommunityPoints = useMemo(() => {
        return allUsers.reduce((sum, u) => sum + (Number(u.points) || 0), 0);
    }, [allUsers]);

    return (
        <AppLayout>
            <Head title="RePoin & Lencana — Replate" />

            <div className="max-w-4xl mx-auto space-y-5">
                {/* Top Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Program RePoin & Lencana Warga</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Apresiasi poin reward dan transparansi ekonomi sirkular penyelamatan pangan desa
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShareableImpactCard
                            user={currentUser}
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
                <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar gap-1">
                    <button
                        onClick={() => setTab('points')}
                        className={`pb-3 px-3.5 text-xs font-semibold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
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
                        className={`pb-3 px-3.5 text-xs font-semibold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                            tab === 'rewards'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Gift size={15} />
                        Katalog Hadiah
                    </button>
                    <button
                        onClick={() => setTab('badges')}
                        className={`pb-3 px-3.5 text-xs font-semibold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                            tab === 'badges'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Award size={15} />
                        Lencana ({totalUnlocked}/{totalBadges})
                    </button>
                    {currentUser?.role === 'admin' && (
                        <button
                            onClick={() => setTab('directory')}
                            className={`pb-3 px-3.5 text-xs font-semibold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                                tab === 'directory'
                                    ? 'border-green-600 text-green-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <Users size={15} />
                            Direktori Kode Warga ({allUsers.length})
                        </button>
                    )}
                    <button
                        onClick={() => setTab('circular')}
                        className={`pb-3 px-3.5 text-xs font-semibold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                            tab === 'circular'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <RefreshCw size={15} />
                        Sumber Dana Reward
                    </button>
                </div>

                {/* TAB 1: Saldo & Riwayat */}
                {tab === 'points' && (
                    <div className="space-y-5">
                        {/* Member Card Digital Warga */}
                        {currentUser && (
                            <div className="bg-emerald-900 rounded-2xl p-5 sm:p-6 text-white border border-emerald-800 relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-2xl shrink-0">
                                            {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="space-y-1">
                                            <div>
                                                <h2 className="text-lg font-bold tracking-tight">{currentUser.name}</h2>
                                            </div>
                                            <p className="text-xs text-emerald-100/80 flex items-center gap-1">
                                                <Mail size={12} /> {currentUser.email}
                                                {currentUser.desa && (
                                                    <>
                                                        <span className="text-emerald-400/40">•</span>
                                                        <MapPin size={12} /> Desa {currentUser.desa}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Kode & Saldo Poin Highlight */}
                                    <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/10 self-start md:self-auto">
                                        <div className="border-r border-white/10 pr-3 text-right">
                                            <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">Kode Penukaran</p>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyCode(redeemCode)}
                                                className="font-mono text-sm font-bold text-white tracking-wider hover:text-emerald-300 transition flex items-center gap-1.5 mt-0.5"
                                                title="Salin Kode Penukaran"
                                            >
                                                <span>{redeemCode || 'RPT-XXXXX'}</span>
                                                {copied ? <CheckCheck size={13} className="text-emerald-300" /> : <Copy size={13} className="text-white/60" />}
                                            </button>
                                        </div>
                                        <div className="pl-1 text-right">
                                            <p className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">Saldo RePoin</p>
                                            <p className="text-xl font-black text-amber-400 leading-tight">{points} <span className="text-xs font-normal text-white/70">Poin</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Balance Stats & How Points Work */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Food Waste Dicegah</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{userStats?.weight_saved_kg ?? 0} <span className="text-xs font-normal text-gray-500">kg</span></p>
                                <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                                    <Leaf size={11} className="text-emerald-500" /> Mencegah emisi gas metana di TPA
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Peringkat Warga Desa</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">#{userRank}</p>
                                <p className="text-[11px] text-gray-500 mt-1">Level: <strong className="text-emerald-700">{userStats?.level_title || 'Pejuang Pangan'}</strong></p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Koleksi Lencana</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{totalUnlocked} / {totalBadges}</p>
                                <p className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
                                    <Award size={11} className="text-amber-500" /> Selesaikan aksi untuk klaim lencana
                                </p>
                            </div>
                        </div>

                        {/* Nilai Konversi / Petunjuk Perolehan */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Tabel Perolehan Poin per Kilogram</h2>
                                <button
                                    onClick={() => setTab('circular')}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                                >
                                    Dari mana dana reward? <ArrowRight size={12} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                                        <Utensils size={14} className="text-emerald-600" />
                                        <span>Makanan Layak Konsumsi</span>
                                    </div>
                                    <p className="text-base font-bold text-emerald-700">3 RePoin / kg</p>
                                    <span className="text-[10px] text-gray-500 block">Sisa katering, hidangan warung, kue siap makan</span>
                                </div>
                                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
                                    <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                                        <ChefHat size={14} className="text-amber-600" />
                                        <span>Bahan Perlu Diolah</span>
                                    </div>
                                    <p className="text-base font-bold text-amber-700">2 RePoin / kg</p>
                                    <span className="text-[10px] text-gray-500 block">Sayuran layu, buah overripe, ampas tahu bersih</span>
                                </div>
                                <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 space-y-1">
                                    <div className="flex items-center gap-1.5 text-orange-800 font-medium">
                                        <Recycle size={14} className="text-orange-600" />
                                        <span>Bahan Pakan & Kompos</span>
                                    </div>
                                    <p className="text-base font-bold text-orange-700">1 RePoin / kg</p>
                                    <span className="text-[10px] text-gray-500 block">Kulit buah, sisa makanan basah, sisa panen</span>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat Mutasi Poin */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                            <h2 className="text-sm font-bold text-gray-900 mb-3">Riwayat Transaksi Poin Anda</h2>
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
                                <p className="text-xs text-gray-400 text-center py-6">
                                    Belum ada riwayat perolehan poin. Mulai salurkan food waste atau lakukan transaksi pangan!
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: Katalog Hadiah */}
                {tab === 'rewards' && (
                    <div className="space-y-4">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                            <Sparkles className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                            <div className="text-xs text-emerald-900 space-y-1">
                                <p>
                                    <strong>Katalog Penukaran RePoin BUMDes:</strong> Pilih hadiah sembako atau pupuk di bawah ini. Saldo poin Anda akan otomatis dipotong dan tiket verifikasi dibuat untuk posko desa.
                                </p>
                                <p className="text-emerald-700">
                                    Saldo Anda saat ini: <strong className="font-bold">{points} RePoin</strong>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {rewards.map((reward) => {
                                const canAfford = points >= reward.points;
                                return (
                                    <div
                                        key={reward.id}
                                        className={`bg-white rounded-2xl border p-4 shadow-2xs flex flex-col justify-between transition ${
                                            canAfford ? 'border-gray-200 hover:border-emerald-300' : 'border-gray-200 opacity-80'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                                    {getRewardIcon(reward.icon)}
                                                </div>
                                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                                    {reward.points} RePoin
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-sm">{reward.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{reward.description}</p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-[11px] text-gray-400">Stok: {reward.stock} unit</span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedReward(reward)}
                                                disabled={!canAfford}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                                                    canAfford
                                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {canAfford ? 'Tukar Poin' : 'Poin Kurang'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 3: Lencana Prestasi */}
                {tab === 'badges' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {badges.map((b) => (
                                <div
                                    key={b.id}
                                    className={`p-4 rounded-xl border transition ${
                                        b.unlocked
                                            ? 'bg-white border-green-200 shadow-2xs'
                                            : 'bg-gray-50/60 border-gray-200 opacity-70'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                                            b.unlocked ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-100 border-gray-200'
                                        }`}>
                                            {getBadgeIcon(b.icon, b.unlocked)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <h3 className="text-xs font-bold text-gray-900 truncate">{b.title}</h3>
                                                {b.unlocked ? (
                                                    <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                                                        Terbuka
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-0.5">
                                                        <Lock size={10} /> Kunci
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{b.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 4: Direktori Kode Warga (Admin Only) */}
                {tab === 'directory' && currentUser?.role === 'admin' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-sm font-bold text-gray-900">Direktori Kode Penukaran & Poin Warga</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Daftar seluruh akun warga dengan kode verifikasi unik RePoin masing-masing.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                                    <Coins size={14} className="text-amber-600" />
                                    <span>Total Poin Beredar: <strong>{totalCommunityPoints} RePoin</strong></span>
                                </div>
                            </div>

                            {/* Search bar */}
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchUserQuery}
                                    onChange={e => setSearchUserQuery(e.target.value)}
                                    placeholder="Cari berdasarkan nama, email, desa, kode penukaran (RPT-XXXXX)..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                />
                            </div>

                            {/* User Table / Cards */}
                            {filteredUsers.length > 0 ? (
                                <div className="divide-y divide-gray-100 overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
                                                <th className="py-2.5 px-2">Warga / Pengguna</th>
                                                <th className="py-2.5 px-2">Peran</th>
                                                <th className="py-2.5 px-2">Wilayah</th>
                                                <th className="py-2.5 px-2 text-right">Saldo RePoin</th>
                                                <th className="py-2.5 px-2 text-right">Kode Penukaran</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredUsers.map((u) => (
                                                <tr key={u.id} className="hover:bg-gray-50/80 transition">
                                                    <td className="py-3 px-2">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                                                                {u.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                                                                <p className="text-[11px] text-gray-400 truncate">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2 whitespace-nowrap">
                                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                                            {ROLE_LABELS[u.role] || u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2 whitespace-nowrap text-gray-500">
                                                        {u.desa ? `Desa ${u.desa}` : '-'}
                                                    </td>
                                                    <td className="py-3 px-2 text-right whitespace-nowrap font-bold text-amber-600">
                                                        {u.points} <span className="text-[10px] text-gray-400 font-normal">Poin</span>
                                                    </td>
                                                    <td className="py-3 px-2 text-right whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyCode(u.redeem_code, u.id)}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 font-mono text-[11px] font-bold transition"
                                                            title="Salin Kode"
                                                        >
                                                            <span>{u.redeem_code}</span>
                                                            {copiedUserId === u.id ? (
                                                                <CheckCheck size={11} className="text-emerald-600" />
                                                            ) : (
                                                                <Copy size={11} className="text-gray-400" />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-8">
                                    Tidak ada warga yang sesuai dengan pencarian '{searchUserQuery}'.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 5: Sumber Dana & Model Ekonomi Sirkular (NEW) */}
                {tab === 'circular' && (
                    <div className="space-y-4">
                        <div className="bg-emerald-950 rounded-2xl p-6 text-white border border-emerald-900 shadow-xs space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                                <RefreshCw size={13} /> Transparansi Model Finansial
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Dari Mana Sumber Dana Hadiah RePoin?</h2>
                            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-2xl">
                                Replate tidak membebankan anggaran belanja desa (APBDes). Sistem reward RePoin didesain dengan prinsip <strong>Ekonomi Sirkular Berkelanjutan (Closed-Loop Economy)</strong>, di mana sampah organik dimonetisasi menjadi bahan baku bernilai tinggi.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Pilar 1 */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-2.5">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                    <Building2 size={20} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">1. Pembelian Bahan Baku oleh Mitra Off-Taker</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Bagi rumah tangga sisa makanan adalah limbah, tetapi bagi <strong>Budidaya Maggot BSF</strong> dan <strong>Pengolah Kompos</strong>, sampah organik adalah <em>feedstock</em> bernilai tinggi. Mitra membeli bahan baku basah per kilogram (Rp 300 - Rp 800/kg). Dana pembelian bahan baku inilah yang dialokasikan ke <strong>Pool Dana RePoin</strong>.
                                </p>
                            </div>

                            {/* Pilar 2 */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-2.5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                    <Leaf size={20} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">2. Closed-Loop Produk BUMDes Sendiri</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Hadiah yang ditukarkan (seperti <strong>Pupuk Kompos Organik</strong> dan <strong>Bibit Tanaman</strong>) diproduksi langsung oleh unit usaha BUMDes dari hasil olahan sampah pangan yang disetor warga. Biaya produksinya mendekati nol selain tenaga kerja, sehingga desa tidak perlu membeli barang dari luar.
                                </p>
                            </div>

                            {/* Pilar 3 */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-2.5">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    <DollarSign size={20} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">3. Penghematan Retribusi Angkutan TPA</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Setiap 1 ton food waste yang selesai di tingkat desa <strong>menghemat biaya solar armada truk dan tipping fee TPA kabupaten</strong> (sekitar Rp 50.000 - Rp 150.000/ton). Efisiensi anggaran kebersihan ini dialihkan sebagai insentif warga yang aktif memilah sampah.
                                </p>
                            </div>

                            {/* Pilar 4 */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-2.5">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                                    <Sparkles size={20} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">4. Kemitraan CSR & Margin Marketplace</h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Program reduksi gas metana Replate memiliki metrik terukur yang didanai melalui hibah ESG & program CSR kemitraan lingkungan (BUMN / Bank), serta komisi mikro (1-3%) dari transaksi jual-beli makanan diskon di marketplace.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Redeem Confirmation Modal */}
                {selectedReward && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                    {getRewardIcon(selectedReward.icon)}
                                </div>
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