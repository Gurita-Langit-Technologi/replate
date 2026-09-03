import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
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
} from 'lucide-react';

function LeaderboardContent({ leaderboard = [], impactSummary, currentUserRank }) {
    return (
        <div className="max-w-4xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Peringkat Warga Penyelamat Pangan</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Daftar warga dan pegiat desa dengan kontribusi tertinggi dalam mencegah food waste
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-md font-medium">
                        Total {leaderboard.length} Warga Terdaftar
                    </span>
                </div>
            </div>

            {/* Current User Position Card (if logged in) */}
            {currentUserRank && (
                <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center font-bold text-green-700 text-sm">
                            #{currentUserRank.rank}
                        </div>
                        <div>
                            <span className="text-[11px] text-gray-400 font-medium">Posisi Anda di Desa</span>
                            <p className="text-sm font-bold text-gray-900">{currentUserRank.stats.level_title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-gray-600">
                        <div>
                            <span className="text-gray-400 block text-[10px]">Terselamatkan</span>
                            <span className="font-bold text-gray-900">{currentUserRank.stats.weight_saved_kg} kg</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block text-[10px]">Lencana</span>
                            <span className="font-bold text-gray-900">{currentUserRank.total_badges} Terbuka</span>
                        </div>
                        <Link
                            href="/points"
                            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-semibold hover:bg-green-700 transition"
                        >
                            Lihat Poin Saya
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Leaderboard Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Peringkat Komunitas Desa</span>
                    <span className="text-xs text-gray-400">Diperbarui otomatis secara real-time</span>
                </div>

                {leaderboard.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {leaderboard.map((user) => {
                            const isTop1 = user.rank === 1;
                            const isTop2 = user.rank === 2;
                            const isTop3 = user.rank === 3;

                            let rankBadgeClass = 'bg-gray-100 text-gray-700';
                            if (isTop1) rankBadgeClass = 'bg-amber-100 text-amber-800 font-bold border border-amber-300';
                            if (isTop2) rankBadgeClass = 'bg-slate-200 text-slate-800 font-bold border border-slate-300';
                            if (isTop3) rankBadgeClass = 'bg-orange-100 text-orange-800 font-bold border border-orange-300';

                            return (
                                <div
                                    key={user.id}
                                    className={`px-5 py-3.5 flex items-center justify-between transition ${
                                        isTop1 ? 'bg-amber-50/30' : 'hover:bg-gray-50/70'
                                    }`}
                                >
                                    {/* Left: Rank & User Info */}
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${rankBadgeClass}`}>
                                            {user.rank}
                                        </div>

                                        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs flex-shrink-0">
                                            {user.name?.charAt(0).toUpperCase() || '?'}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                {isTop1 && (
                                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                                        Juara 1
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                <span>{user.desa}</span>
                                                <span>•</span>
                                                <span className="text-gray-400">{user.level_title}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Metrics */}
                                    <div className="flex items-center gap-6 text-right flex-shrink-0">
                                        <div className="hidden sm:block">
                                            <span className="text-[10px] text-gray-400 block">Transaksi</span>
                                            <span className="text-xs font-medium text-gray-700">{user.completed_tx}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-400 block">Diselamatkan</span>
                                            <span className="text-xs sm:text-sm font-bold text-green-700">{user.weight_saved_kg} kg</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-400 block">RePoin</span>
                                            <span className="text-xs sm:text-sm font-bold text-amber-600">{user.points}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center text-xs text-gray-400">
                        Belum ada data peringkat tersimpan.
                    </div>
                )}
            </div>

            {/* Bottom info banner */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-xs text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <p className="font-semibold text-gray-800">Bagaimana skor peringkat dihitung?</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                        Peringkat dihitung berdasarkan akumulasi kilogram food waste yang berhasil diselamatkan melalui transaksi jual beli, barter, dan donasi.
                    </p>
                </div>
                <Link href="/marketplace" className="text-green-700 hover:text-green-800 font-semibold whitespace-nowrap flex items-center gap-1">
                    Mulai Berkontribusi →
                </Link>
            </div>
        </div>
    );
}

export default function Index({ leaderboard, impactSummary, currentUserRank }) {
    const { auth } = usePage().props;

    if (auth?.user) {
        return (
            <AppLayout>
                <Head title="Peringkat Warga — Replate" />
                <LeaderboardContent
                    leaderboard={leaderboard}
                    impactSummary={impactSummary}
                    currentUserRank={currentUserRank}
                />
            </AppLayout>
        );
    }

    return (
        <>
            <Head title="Peringkat Warga — Replate" />
            <div className="min-h-screen bg-gray-50">
                <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/image/logo(2).png" alt="Replate" className="w-auto h-9 object-cover" />
                        </Link>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                                <ArrowLeft size={14} /> Beranda
                            </Link>
                            <Link href="/impact" className="text-gray-600 hover:text-green-600">
                                Dampak Desa
                            </Link>
                            <Link href="/register" className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                                Daftar Akun
                            </Link>
                        </div>
                    </div>
                </nav>

                <main className="px-4 py-6">
                    <LeaderboardContent
                        leaderboard={leaderboard}
                        impactSummary={impactSummary}
                        currentUserRank={currentUserRank}
                    />
                </main>
            </div>
        </>
    );
}
