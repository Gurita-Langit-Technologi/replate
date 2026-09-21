import { Head, Link, usePage } from '@inertiajs/react';
import NavbarLayout from '@/Layouts/NavbarLayout';
import {
    Trophy,
    Medal,
    Award,
    ArrowLeft,
    TrendingUp,
    Scale,
    Coins,
    Users,
    ChevronRight,
    Sparkles,
    Crown,
    Star,
    ArrowRight,
} from 'lucide-react';

function LeaderboardContent({ leaderboard = [], impactSummary, currentUserRank }) {
    const topThree = leaderboard.slice(0, 3);

    return (
        <div className="w-full space-y-8 md:space-y-10 py-2 sm:py-4">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 md:p-10 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-full mb-3.5 border border-amber-300 shadow-xs">
                            <Trophy size={14} className="text-amber-700" />
                            Pahlawan Pangan & Komunitas Desa
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Papan Peringkat Warga
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
                            Apresiasi untuk warga dan mitra desa dengan kontribusi tertinggi dalam menyelamatkan pangan dan mewujudkan ketahanan pangan lokal.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs sm:text-sm text-gray-800 bg-gray-100 px-4 py-2.5 rounded-xl font-bold border border-gray-200">
                            Total {leaderboard.length} Warga Terdaftar
                        </span>
                    </div>
                </div>
            </div>

            {/* Current User Position Card (if logged in) */}
            {currentUserRank && (
                <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-xs flex-shrink-0">
                            #{currentUserRank.rank}
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                                Posisi Anda di Desa
                            </span>
                            <p className="text-base sm:text-lg font-extrabold text-gray-900 mt-0.5">
                                {currentUserRank.stats.level_title}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
                        <div>
                            <span className="text-xs text-gray-500 font-semibold block">Terselamatkan</span>
                            <span className="text-base sm:text-lg font-extrabold text-green-800">
                                {currentUserRank.stats.weight_saved_kg} kg
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 font-semibold block">Lencana</span>
                            <span className="text-base sm:text-lg font-extrabold text-amber-800">
                                {currentUserRank.total_badges} Terbuka
                            </span>
                        </div>
                        <Link
                            href="/points"
                            className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-800 transition shadow-xs"
                        >
                            Lihat RePoin Saya
                        </Link>
                    </div>
                </div>
            )}

            {/* Top 3 Podium Showcase (if available) */}
            {topThree.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Rank 2 - Silver */}
                    <div className="order-2 md:order-1 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col items-center text-center justify-between hover:shadow-md transition">
                        <div className="w-full">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-300 mb-3">
                                🥈 Peringkat 2
                            </span>
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 border-2 border-slate-300 flex items-center justify-center font-extrabold text-2xl mx-auto my-3 shadow-xs">
                                {topThree[1]?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg truncate">
                                {topThree[1]?.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{topThree[1]?.desa}</p>
                        </div>
                        <div className="w-full mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                            <div>
                                <span className="text-[11px] text-gray-500 font-semibold block">Penyelamatan</span>
                                <span className="text-sm sm:text-base font-extrabold text-green-700">{topThree[1]?.weight_saved_kg} kg</span>
                            </div>
                            <div>
                                <span className="text-[11px] text-gray-500 font-semibold block">RePoin</span>
                                <span className="text-sm sm:text-base font-extrabold text-amber-700">{topThree[1]?.points} pts</span>
                            </div>
                        </div>
                    </div>

                    {/* Rank 1 - Gold (Elevated) */}
                    <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white rounded-3xl border-2 border-amber-300 p-6 sm:p-7 shadow-md flex flex-col items-center text-center justify-between scale-100 md:scale-105 z-10 hover:shadow-lg transition">
                        <div className="w-full">
                            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 bg-amber-200 px-3.5 py-1.5 rounded-full border border-amber-400 mb-3 shadow-xs">
                                <Crown size={14} className="text-amber-800" /> Juara 1 Desa
                            </span>
                            <div className="w-20 h-20 rounded-2xl bg-amber-100 text-amber-800 border-2 border-amber-400 flex items-center justify-center font-extrabold text-3xl mx-auto my-3 shadow-xs">
                                {topThree[0]?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl truncate">
                                {topThree[0]?.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-medium">{topThree[0]?.desa} · <span className="text-amber-700 font-bold">{topThree[0]?.level_title}</span></p>
                        </div>
                        <div className="w-full mt-4 pt-4 border-t border-amber-100 grid grid-cols-2 gap-2 text-center bg-white/80 p-2.5 rounded-2xl">
                            <div>
                                <span className="text-xs text-gray-600 font-bold block">Penyelamatan</span>
                                <span className="text-base sm:text-lg font-black text-green-800">{topThree[0]?.weight_saved_kg} kg</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-600 font-bold block">RePoin</span>
                                <span className="text-base sm:text-lg font-black text-amber-800">{topThree[0]?.points} pts</span>
                            </div>
                        </div>
                    </div>

                    {/* Rank 3 - Bronze */}
                    <div className="order-3 md:order-3 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col items-center text-center justify-between hover:shadow-md transition">
                        <div className="w-full">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-900 bg-orange-100 px-3 py-1 rounded-full border border-orange-300 mb-3">
                                🥉 Peringkat 3
                            </span>
                            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-800 border-2 border-orange-300 flex items-center justify-center font-extrabold text-2xl mx-auto my-3 shadow-xs">
                                {topThree[2]?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg truncate">
                                {topThree[2]?.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{topThree[2]?.desa}</p>
                        </div>
                        <div className="w-full mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                            <div>
                                <span className="text-[11px] text-gray-500 font-semibold block">Penyelamatan</span>
                                <span className="text-sm sm:text-base font-extrabold text-green-700">{topThree[2]?.weight_saved_kg} kg</span>
                            </div>
                            <div>
                                <span className="text-[11px] text-gray-500 font-semibold block">RePoin</span>
                                <span className="text-sm sm:text-base font-extrabold text-amber-700">{topThree[2]?.points} pts</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Leaderboard Table Card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 sm:py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div>
                        <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-gray-800">
                            Daftar Peringkat Lengkap
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Diperbarui secara otomatis berdasarkan aktivitas sirkularitas</p>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-green-800 bg-green-100 px-3 py-1 rounded-full border border-green-300 hidden sm:inline-block">
                        Real-time Live
                    </span>
                </div>

                {leaderboard.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {leaderboard.map((user) => {
                            const isTop1 = user.rank === 1;
                            const isTop2 = user.rank === 2;
                            const isTop3 = user.rank === 3;

                            let rankBadgeClass = 'bg-gray-100 text-gray-800 border border-gray-200';
                            if (isTop1) rankBadgeClass = 'bg-amber-200 text-amber-900 font-black border border-amber-400';
                            if (isTop2) rankBadgeClass = 'bg-slate-200 text-slate-900 font-black border border-slate-300';
                            if (isTop3) rankBadgeClass = 'bg-orange-200 text-orange-900 font-black border border-orange-300';

                            return (
                                <div
                                    key={user.id}
                                    className={`px-6 py-4 sm:py-5 flex items-center justify-between transition ${
                                        isTop1 ? 'bg-amber-50/50' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {/* Left: Rank & User Info */}
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm sm:text-base flex-shrink-0 font-bold ${rankBadgeClass}`}>
                                            {user.rank}
                                        </div>

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gray-100 border border-gray-300 flex items-center justify-center font-extrabold text-gray-700 text-sm sm:text-base flex-shrink-0">
                                            {user.name?.charAt(0).toUpperCase() || '?'}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
                                                    {user.name}
                                                </p>
                                                {isTop1 && (
                                                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 hidden sm:inline-block">
                                                        Top 1
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-0.5">
                                                <span className="font-semibold text-gray-700">{user.desa}</span>
                                                <span>•</span>
                                                <span className="text-gray-500">{user.level_title}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Metrics */}
                                    <div className="flex items-center gap-4 sm:gap-6 text-right flex-shrink-0">
                                        <div className="hidden md:block">
                                            <span className="text-xs text-gray-500 font-semibold block">Transaksi</span>
                                            <span className="text-sm sm:text-base font-bold text-gray-800">{user.completed_tx}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 font-semibold block">Diselamatkan</span>
                                            <span className="text-sm sm:text-base font-extrabold text-green-800 bg-green-50 px-2.5 sm:px-3 py-1 rounded-xl border border-green-200">
                                                {user.weight_saved_kg} kg
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 font-semibold block">RePoin</span>
                                            <span className="text-sm sm:text-base font-extrabold text-amber-800 bg-amber-50 px-2.5 sm:px-3 py-1 rounded-xl border border-amber-200">
                                                {user.points}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center text-sm text-gray-500">
                        Belum ada data peringkat tersimpan.
                    </div>
                )}
            </div>

            {/* Bottom info banner */}
            <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6 sm:p-8 text-sm text-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-gray-900">Bagaimana skor peringkat dihitung?</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed max-w-2xl">
                        Peringkat dihitung berdasarkan akumulasi kilogram food waste yang berhasil diselamatkan melalui transaksi jual beli murah, barter hasil bumi, dan donasi sosial.
                    </p>
                </div>
                <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-green-700 transition shadow-xs whitespace-nowrap flex-shrink-0"
                >
                    Mulai Berkontribusi <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}

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

