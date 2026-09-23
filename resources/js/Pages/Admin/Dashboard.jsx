import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
    AlertTriangle, Shield, Users, Package,
    TrendingUp, Leaf, Recycle, HeartHandshake,
    ArrowUpRight, ChevronRight,
} from 'lucide-react';

/* ── Palette ────────────────────────────────────────────── */
const PIE_COLORS  = ['#16a34a', '#7c3aed', '#2563eb', '#f59e0b', '#ec4899', '#06b6d4'];
const BAR_COLOR   = '#16a34a';

/* ── Tooltip skins ─────────────────────────────────────── */
function ChartTip({ active, payload }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 shadow-lg text-xs font-semibold text-gray-800">
            {payload[0].name}: <span className="text-gray-900 font-extrabold">{payload[0].value}</span>
        </div>
    );
}

/* ── Quick-action card ──────────────────────────────────── */
function ActionCard({ href, icon: Icon, label, sub, color }) {
    const palette = {
        amber:   'text-amber-600  bg-amber-50  group-hover:bg-amber-100',
        red:     'text-red-600    bg-red-50    group-hover:bg-red-100',
        emerald: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100',
        blue:    'text-blue-600   bg-blue-50   group-hover:bg-blue-100',
    };
    return (
        <Link
            href={href}
            className="group bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:border-gray-300 hover:shadow-sm transition"
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition ${palette[color]}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-tight">{label}</p>
                {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition flex-shrink-0" />
        </Link>
    );
}

/* ── Main dashboard ─────────────────────────────────────── */
export default function Dashboard({ stats, villageImpactMetrics, transactionsByType, productsByStatus }) {
    const impact = villageImpactMetrics || {
        totalVillageImpactKg: (stats.totalWeightSaved / 1000).toFixed(1),
        directSavedKg: (stats.totalWeightSaved / 1000).toFixed(1),
        partnerSavedKg: 0,
        directRatio: 100,
        partnerRatio: 0,
    };

    return (
        <AppLayout>
            <Head title="Admin BUMDes Dashboard" />

            <div className="max-w-6xl mx-auto space-y-7">

                {/* ── Page title ── */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">BUMDes · Replate</p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Admin</h1>
                </div>

                {/* ── Alert banners ── */}
                {(stats.pendingVerifications > 0 || stats.pendingReports > 0) && (
                    <div className="flex flex-col sm:flex-row gap-2.5">
                        {stats.pendingVerifications > 0 && (
                            <Link
                                href="/admin/verifications"
                                className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-800 hover:bg-amber-100 transition"
                            >
                                <Shield size={16} className="text-amber-600 flex-shrink-0" />
                                {stats.pendingVerifications} pengajuan verifikasi menunggu
                                <ArrowUpRight size={14} className="ml-auto text-amber-500" />
                            </Link>
                        )}
                        {stats.pendingReports > 0 && (
                            <Link
                                href="/admin/reports"
                                className="flex items-center gap-2.5 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-800 hover:bg-red-100 transition"
                            >
                                <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                                {stats.pendingReports} laporan produk menunggu review
                                <ArrowUpRight size={14} className="ml-auto text-red-400" />
                            </Link>
                        )}
                    </div>
                )}

                {/* ── Stats row ── */}
                <div className="bg-white rounded-2xl border border-gray-200 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
                    {[
                        { icon: Users,       label: 'Total pengguna',     value: stats.totalUsers,              unit: null,  href: '/admin/users',         accent: '#2563eb' },
                        { icon: Package,     label: 'Produk aktif',       value: stats.activeProducts,          unit: null,  href: '/marketplace',         accent: '#16a34a' },
                        { icon: TrendingUp,  label: 'Transaksi selesai',  value: stats.completedTransactions,   unit: null,  href: '/admin/transactions',  accent: '#7c3aed' },
                        { icon: Leaf,        label: 'Dampak desa',        value: impact.totalVillageImpactKg,   unit: 'kg',  href: '/impact',              accent: '#d97706' },
                    ].map(({ icon: Icon, label, value, unit, href, accent }) => (
                        <Link
                            key={label}
                            href={href}
                            className="p-6 flex flex-col gap-3 hover:bg-gray-50 transition group"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
                                <Icon size={15} style={{ color: accent }} className="opacity-60 group-hover:opacity-100 transition" />
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-gray-900 tabular-nums">{value}</span>
                                {unit && <span className="text-sm font-bold text-gray-500">{unit}</span>}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── Village Impact ── */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                    {/* header */}
                    <div className="px-7 pt-7 pb-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <Recycle size={16} className="text-emerald-600" />
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Metrik Dampak Desa</span>
                            </div>
                            <h2 className="text-lg font-extrabold text-gray-900">Sirkularitas Pangan Replate</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Rasio penyelamatan langsung vs alih fungsi mitra pengolah</p>
                        </div>
                        <Link
                            href="/impact"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition shrink-0 self-start sm:self-auto"
                        >
                            Lihat detail <ArrowUpRight size={13} />
                        </Link>
                    </div>

                    {/* 3 stat cells */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {[
                            {
                                label: 'Penyelamatan Langsung',
                                sub: 'Jual · Barter · Donasi',
                                value: impact.directSavedKg,
                                pct: impact.directRatio,
                                valueColor: 'text-emerald-600',
                                pctColor: 'text-emerald-700',
                                bar: 'bg-emerald-500',
                            },
                            {
                                label: 'Alih Fungsi Mitra',
                                sub: 'UMKM · Pakan · Kompos',
                                value: impact.partnerSavedKg,
                                pct: impact.partnerRatio,
                                valueColor: 'text-amber-600',
                                pctColor: 'text-amber-700',
                                bar: 'bg-amber-500',
                            },
                            {
                                label: 'Total Terselamatkan',
                                sub: 'Dampak bersih desa',
                                value: impact.totalVillageImpactKg,
                                pct: 100,
                                valueColor: 'text-gray-900',
                                pctColor: 'text-gray-500',
                                bar: 'bg-gray-400',
                                total: true,
                            },
                        ].map(({ label, sub, value, pct, valueColor, pctColor, bar, total }) => (
                            <div key={label} className={`px-7 py-6 ${total ? 'md:bg-gray-50/60' : ''}`}>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                                <p className="text-[11px] text-gray-500 mb-4">{sub}</p>
                                <p className={`text-3xl sm:text-4xl font-black tabular-nums leading-none ${valueColor}`}>
                                    {value}
                                    <span className="text-base font-bold ml-1 text-gray-400">kg</span>
                                </p>
                                {/* progress bar */}
                                <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${bar} transition-all`}
                                        style={{ width: `${Math.min(pct, 100)}%` }}
                                    />
                                </div>
                                <p className={`mt-2 text-xs font-bold tabular-nums ${pctColor}`}>{pct}% dari total</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Charts ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-sm font-extrabold text-gray-900 mb-1">Transaksi per jenis</h2>
                        <p className="text-xs text-gray-400 mb-5">Distribusi jenis transaksi yang diselesaikan</p>
                        <ResponsiveContainer width="100%" height={230}>
                            <PieChart>
                                <Pie
                                    data={transactionsByType}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={3}
                                >
                                    {transactionsByType.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* legend */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                            {transactionsByType.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                    <span className="text-xs text-gray-600 font-medium">{item.name}</span>
                                    <span className="text-xs font-bold text-gray-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-sm font-extrabold text-gray-900 mb-1">Produk per status</h2>
                        <p className="text-xs text-gray-400 mb-5">Jumlah listing berdasarkan status saat ini</p>
                        <ResponsiveContainer width="100%" height={230}>
                            <BarChart data={productsByStatus} barCategoryGap="40%">
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<ChartTip />} cursor={{ fill: '#f9fafb' }} />
                                <Bar dataKey="value" fill={BAR_COLOR} radius={[6, 6, 3, 3]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── Quick actions ── */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Aksi cepat</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <ActionCard
                            href="/admin/verifications"
                            icon={Shield}
                            label="Verifikasi penjual"
                            sub={stats.pendingVerifications > 0 ? `${stats.pendingVerifications} menunggu` : 'Semua bersih'}
                            color="amber"
                        />
                        <ActionCard
                            href="/admin/reports"
                            icon={AlertTriangle}
                            label="Moderasi laporan"
                            sub={stats.pendingReports > 0 ? `${stats.pendingReports} laporan baru` : 'Tidak ada laporan'}
                            color="red"
                        />
                        <ActionCard
                            href="/admin/partners"
                            icon={HeartHandshake}
                            label="Kelola mitra"
                            sub="Peternak, maggot, kompos"
                            color="emerald"
                        />
                        <ActionCard
                            href="/admin/users"
                            icon={Users}
                            label="Kelola pengguna"
                            sub={`${stats.totalUsers} warga terdaftar`}
                            color="blue"
                        />
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}