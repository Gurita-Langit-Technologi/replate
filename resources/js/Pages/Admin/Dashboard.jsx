import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, Shield, Users, Package, TrendingUp, Leaf, Recycle, HeartHandshake } from 'lucide-react';

const COLORS = ['#16a34a', '#9333ea', '#2563eb', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444'];
const IMPACT_COLORS = ['#16a34a', '#f59e0b'];

function StatCard({ icon: Icon, label, value, unit, color, href }) {
    const Wrapper = href ? Link : 'div';
    const colorClasses = {
        green: 'bg-green-50 text-green-700 border-green-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        red: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
        <Wrapper href={href || undefined} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3.5 mb-3.5">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon size={22} />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-gray-900">{value}</span>
                {unit && <span className="text-sm font-semibold text-gray-600">{unit}</span>}
            </div>
        </Wrapper>
    );
}

export default function Dashboard({ stats, villageImpactMetrics, transactionsByType, productsByStatus }) {
    const impact = villageImpactMetrics || {
        totalVillageImpactKg: (stats.totalWeightSaved / 1000).toFixed(1),
        directSavedKg: (stats.totalWeightSaved / 1000).toFixed(1),
        partnerSavedKg: 0,
        directRatio: 100,
        partnerRatio: 0,
        chartData: [
            { name: 'Penyelamatan Langsung', weightKg: (stats.totalWeightSaved / 1000).toFixed(1), percentage: 100 },
            { name: 'Alih Fungsi Mitra', weightKg: 0, percentage: 0 },
        ],
    };

    return (
        <AppLayout>
            <Head title="Admin BUMDes Dashboard" />
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Admin BUMDes</h1>
                    <p className="text-sm text-gray-600 mt-1">Ringkasan aktivitas platform, metrik dampak lingkungan, dan moderasi desa.</p>
                </div>

                {/* Alert cards */}
                {(stats.pendingVerifications > 0 || stats.pendingReports > 0) && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        {stats.pendingVerifications > 0 && (
                            <Link href="/admin/verifications" className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border border-amber-300 rounded-xl text-sm font-semibold text-amber-800 hover:bg-amber-100 transition shadow-xs">
                                <Shield size={18} className="text-amber-700" />
                                {stats.pendingVerifications} pengajuan verifikasi menunggu
                            </Link>
                        )}
                        {stats.pendingReports > 0 && (
                            <Link href="/admin/reports" className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-300 rounded-xl text-sm font-semibold text-red-800 hover:bg-red-100 transition shadow-xs">
                                <AlertTriangle size={18} className="text-red-700" />
                                {stats.pendingReports} laporan produk menunggu review
                            </Link>
                        )}
                    </div>
                )}

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <StatCard icon={Users} label="Total pengguna" value={stats.totalUsers} color="blue" href="/admin/users" />
                    <StatCard icon={Package} label="Produk aktif" value={stats.activeProducts} color="green" href="/marketplace" />
                    <StatCard icon={TrendingUp} label="Transaksi selesai" value={stats.completedTransactions} color="purple" href="/admin/transactions" />
                    <StatCard icon={Leaf} label="Total dampak desa" value={impact.totalVillageImpactKg} unit="kg" color="amber" href="/impact" />
                </div>

                {/* BUMDes Village Impact Section */}
                <div className="bg-emerald-950 border border-emerald-800 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center gap-3.5 mb-6">
                        <div className="p-3 bg-emerald-800/80 rounded-xl border border-emerald-700">
                            <Recycle size={28} className="text-emerald-300" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Metrik Dampak Desa Replate (BUMDes)</h2>
                            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">Analisis rasio sampah makanan yang terselamatkan secara langsung vs dialihkan ke mitra pengolah</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15">
                            <p className="text-xs sm:text-sm text-emerald-200 font-medium mb-1">Penyelamatan Langsung (Jual/Barter/Donasi)</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-white">{impact.directSavedKg} <span className="text-sm font-semibold text-emerald-300">kg</span></p>
                            <span className="inline-block mt-2.5 px-3 py-1 bg-emerald-500/30 text-emerald-200 text-xs font-semibold rounded-full border border-emerald-500/40">
                                {impact.directRatio}% dari total
                            </span>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15">
                            <p className="text-xs sm:text-sm text-emerald-200 font-medium mb-1">Alih Fungsi Mitra (UMKM/Pakan/Kompos)</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-white">{impact.partnerSavedKg} <span className="text-sm font-semibold text-amber-300">kg</span></p>
                            <span className="inline-block mt-2.5 px-3 py-1 bg-amber-500/30 text-amber-200 text-xs font-semibold rounded-full border border-amber-500/40">
                                {impact.partnerRatio}% dari total
                            </span>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15">
                            <p className="text-xs sm:text-sm text-emerald-200 font-medium mb-1">Total Sampah Makanan Terselamatkan</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-white">{impact.totalVillageImpactKg} <span className="text-sm font-semibold text-emerald-300">kg</span></p>
                            <span className="inline-block mt-2.5 px-3 py-1 bg-blue-500/30 text-blue-200 text-xs font-semibold rounded-full border border-blue-500/40">
                                100% Dampak Bersih
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Transaksi per jenis</h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={transactionsByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({ name, value }) => `${name}: ${value}`}>
                                    {transactionsByType.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Produk per status</h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={productsByStatus}>
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/admin/verifications" className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-400 hover:shadow-sm transition text-center group">
                        <Shield size={26} className="mx-auto text-amber-600 mb-2 group-hover:scale-110 transition" />
                        <p className="text-sm font-bold text-gray-900">Verifikasi penjual</p>
                    </Link>
                    <Link href="/admin/reports" className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-400 hover:shadow-sm transition text-center group">
                        <AlertTriangle size={26} className="mx-auto text-red-600 mb-2 group-hover:scale-110 transition" />
                        <p className="text-sm font-bold text-gray-900">Moderasi laporan</p>
                    </Link>
                    <Link href="/admin/partners" className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-400 hover:shadow-sm transition text-center group">
                        <Users size={26} className="mx-auto text-emerald-600 mb-2 group-hover:scale-110 transition" />
                        <p className="text-sm font-bold text-gray-900">Kelola partner</p>
                    </Link>
                    <Link href="/admin/users" className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-400 hover:shadow-sm transition text-center group">
                        <Users size={26} className="mx-auto text-blue-600 mb-2 group-hover:scale-110 transition" />
                        <p className="text-sm font-bold text-gray-900">Kelola pengguna</p>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}