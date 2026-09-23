import { Head, Link } from '@inertiajs/react';
import NavbarLayout from '@/Layouts/NavbarLayout';
import {
    Trophy,
    Crown,
    ArrowRight,
    Flame,
    Leaf,
    Star,
    Medal,
} from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────── */
const MEDAL = {
    1: { emoji: '🥇', label: 'Emas',   ring: 'ring-amber-400',  bg: 'bg-amber-50',  text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
    2: { emoji: '🥈', label: 'Perak',  ring: 'ring-slate-400',  bg: 'bg-slate-50',  text: 'text-slate-900', badge: 'bg-slate-100 text-slate-700 border-slate-300' },
    3: { emoji: '🥉', label: 'Perunggu', ring: 'ring-orange-400', bg: 'bg-orange-50', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-800 border-orange-300' },
};

function Avatar({ name = '?', size = 'md', ring = '' }) {
    const sizes = { sm: 'w-9 h-9 text-sm', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl', xl: 'w-20 h-20 text-2xl' };
    const letter = name.charAt(0).toUpperCase();
    // derive a soft deterministic hue from name
    const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1 % name.length) * 13) % 360;
    return (
        <div
            className={`rounded-full flex items-center justify-center font-extrabold select-none flex-shrink-0 ring-2 ${ring || 'ring-gray-200'} ${sizes[size]}`}
            style={{ background: `hsl(${hue},55%,88%)`, color: `hsl(${hue},60%,32%)` }}
        >
            {letter}
        </div>
    );
}

/* ─── Podium (top 3) ──────────────────────────────────── */
function PodiumCard({ user, rank }) {
    const m = MEDAL[rank];
    const isFirst = rank === 1;

    return (
        <div
            className={`flex flex-col items-center gap-0 ${isFirst ? 'order-2 md:order-2' : rank === 2 ? 'order-1 md:order-1' : 'order-3'}`}
        >
            {/* Card body */}
            <div
                className={`w-full rounded-2xl border px-4 pt-5 pb-4 flex flex-col items-center text-center shadow-sm transition hover:shadow-md ${
                    isFirst
                        ? 'border-amber-300 bg-gradient-to-b from-amber-50 to-white ring-1 ring-amber-200'
                        : 'border-gray-200 bg-white'
                }`}
            >
                {/* Medal badge */}
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border mb-3 ${m.badge}`}>
                    {m.emoji} {isFirst ? <Crown size={11} className="inline" /> : null} {m.label}
                </span>

                <Avatar name={user.name} size={isFirst ? 'xl' : 'lg'} ring={m.ring} />

                <p className={`mt-3 font-extrabold text-gray-900 leading-tight ${isFirst ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} truncate w-full`}>
                    {user.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate w-full">{user.desa}</p>
                {isFirst && (
                    <span className="mt-2 text-[11px] font-bold text-amber-700">{user.level_title}</span>
                )}

                {/* Stats row */}
                <div className={`w-full mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-center ${isFirst ? 'border-amber-100' : 'border-gray-100'}`}>
                    <div>
                        <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold block">Diselamatkan</span>
                        <span className={`text-sm font-extrabold ${isFirst ? 'text-green-800 text-base' : 'text-green-700'}`}>
                            {user.weight_saved_kg} kg
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold block">RePoin</span>
                        <span className={`text-sm font-extrabold ${isFirst ? 'text-amber-800 text-base' : 'text-amber-700'}`}>
                            {user.points}
                        </span>
                    </div>
                </div>
            </div>

            {/* Podium platform */}
            <div
                className={`w-full rounded-b-xl flex items-center justify-center text-xs font-black tracking-widest text-white shadow-inner ${
                    isFirst
                        ? 'h-14 bg-gradient-to-b from-amber-400 to-amber-600'
                        : rank === 2
                        ? 'h-10 bg-gradient-to-b from-slate-300 to-slate-500'
                        : 'h-7  bg-gradient-to-b from-orange-300 to-orange-500'
                }`}
            >
                #{rank}
            </div>
        </div>
    );
}

/* ─── Table row ───────────────────────────────────────── */
function RankRow({ user }) {
    const { rank } = user;
    const isTop1 = rank === 1;
    const isTop2 = rank === 2;
    const isTop3 = rank === 3;

    const rankStyle = isTop1
        ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
        : isTop2
        ? 'bg-slate-100 text-slate-800 border-slate-300 font-black'
        : isTop3
        ? 'bg-orange-100 text-orange-800 border-orange-300 font-black'
        : 'bg-gray-100 text-gray-600 border-gray-200 font-bold';

    const rowBg = isTop1 ? 'bg-amber-50/40' : '';

    return (
        <div className={`px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition ${rowBg}`}>
            {/* Rank number */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm border flex-shrink-0 ${rankStyle}`}>
                {rank}
            </div>

            {/* Avatar */}
            <Avatar name={user.name} size="sm" ring={isTop1 ? 'ring-amber-300' : isTop2 ? 'ring-slate-300' : isTop3 ? 'ring-orange-300' : 'ring-gray-200'} />

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-gray-900 truncate">{user.name}</span>
                    {isTop1 && <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 hidden sm:inline">🏆 No. 1</span>}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <span className="font-semibold text-gray-700 truncate">{user.desa}</span>
                    <span>·</span>
                    <span className="truncate">{user.level_title}</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0 text-right">
                <div className="hidden md:block">
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold block">Transaksi</span>
                    <span className="text-sm font-bold text-gray-800">{user.completed_tx}</span>
                </div>
                <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold block">Diselamatkan</span>
                    <span className="text-sm font-extrabold text-green-700">{user.weight_saved_kg} kg</span>
                </div>
                <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold block">RePoin</span>
                    <span className="text-sm font-extrabold text-amber-700">{user.points}</span>
                </div>
            </div>
        </div>
    );
}

/* ─── Main content ─────────────────────────────────────── */
function LeaderboardContent({ leaderboard = [], currentUserRank }) {
    const topThree = leaderboard.slice(0, 3);
    const hasPodium = topThree.length >= 3;

    // Order for visual podium display: 2 - 1 - 3
    const podiumOrder = hasPodium ? [topThree[1], topThree[0], topThree[2]] : [];
    const podiumRanks = [2, 1, 3];

    return (
        <div className="w-full space-y-7 py-2 sm:py-4">

            {/* ── Page header ── */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 md:p-10 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Trophy size={20} className="text-amber-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Papan Peringkat</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            Peringkat Warga Desa
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-2xl leading-relaxed">
                            Apresiasi untuk warga dan mitra desa dengan kontribusi tertinggi dalam menyelamatkan pangan dan mewujudkan ketahanan pangan lokal.
                        </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <span className="text-2xl sm:text-3xl font-black text-gray-900 block">{leaderboard.length}</span>
                        <span className="text-xs text-gray-500 font-semibold">Warga Terdaftar</span>
                    </div>
                </div>
            </div>

            {/* ── Current user banner ── */}
            {currentUserRank && (
                <div className="bg-emerald-50 rounded-2xl border border-emerald-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-base flex-shrink-0">
                            #{currentUserRank.rank}
                        </div>
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Posisi Anda Saat Ini</span>
                            <span className="text-sm sm:text-base font-extrabold text-gray-900">{currentUserRank.stats.level_title}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-5">
                        <div>
                            <span className="text-[11px] text-gray-500 font-semibold block">Terselamatkan</span>
                            <span className="text-sm font-extrabold text-green-800">{currentUserRank.stats.weight_saved_kg} kg</span>
                        </div>
                        <div>
                            <span className="text-[11px] text-gray-500 font-semibold block">Lencana</span>
                            <span className="text-sm font-extrabold text-amber-800">{currentUserRank.total_badges} Terbuka</span>
                        </div>
                        <Link
                            href="/points"
                            className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition"
                        >
                            Lihat RePoin Saya
                        </Link>
                    </div>
                </div>
            )}

            {/* ── Podium ── */}
            {hasPodium && (
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">🏅 3 Besar Warga Terbaik</p>
                    {/* grid: 2 - 1 - 3 visually */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end">
                        {podiumOrder.map((user, i) => (
                            <PodiumCard key={user.id} user={user} rank={podiumRanks[i]} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Full table ── */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                {/* Table header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                    <div>
                        <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">Daftar Lengkap</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Diperbarui otomatis berdasarkan aktivitas sirkularitas</p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full hidden sm:inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                        Real-time
                    </span>
                </div>

                {/* Column labels */}
                <div className="px-5 py-2.5 grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center border-b border-gray-100 bg-gray-50/40">
                    <span className="w-9" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Warga</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:block text-right">Transaksi</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Diselamatkan</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">RePoin</span>
                </div>

                {leaderboard.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {leaderboard.map((user) => (
                            <RankRow key={user.id} user={user} />
                        ))}
                    </div>
                ) : (
                    <div className="p-14 text-center text-sm text-gray-400">
                        Belum ada data peringkat tersimpan.
                    </div>
                )}
            </div>

            {/* ── Footer info ── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Leaf size={18} className="text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-gray-900">Bagaimana skor dihitung?</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed max-w-xl">
                            Peringkat dihitung berdasarkan akumulasi kilogram food waste yang berhasil diselamatkan melalui jual-beli murah, barter hasil bumi, dan donasi sosial.
                        </p>
                    </div>
                </div>
                <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-green-700 transition shadow-xs whitespace-nowrap flex-shrink-0"
                >
                    Mulai Berkontribusi <ArrowRight size={15} />
                </Link>
            </div>

        </div>
    );
}

/* ─── Page export ──────────────────────────────────────── */
export default function Index({ leaderboard, impactSummary, currentUserRank }) {
    return (
        <NavbarLayout>
            <Head title="Peringkat Warga — Replate" />
            <LeaderboardContent
                leaderboard={leaderboard}
                impactSummary={impactSummary}
                currentUserRank={currentUserRank}
            />
        </NavbarLayout>
    );
}
