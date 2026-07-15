import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, Shield, Users, Package, TrendingUp, Leaf } from 'lucide-react';

const COLORS = ['#16a34a', '#9333ea', '#2563eb', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444'];

function StatCard({ icon: Icon, label, value, unit, color, href }) {
    const Wrapper = href ? Link : 'div';
    const colorClasses = {
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600',
    };
    return (
        <Wrapper href={href || undefined} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon size={20} />
                </div>
                <span className="text-sm text-gray-500">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{value}</span>
                {unit && <span className="text-sm text-gray-400">{unit}</span>}
            </div>
        </Wrapper>
    );
}

export default function Dashboard({ stats, transactionsByType, productsByStatus }) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h1>

                {/* Alert cards */}
                {(stats.pendingVerifications > 0 || stats.pendingReports > 0) && (
                    <div className="flex gap-3 mb-6">
                        {stats.pendingVerifications > 0 && (
                            <Link href="/admin/verifications" className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 hover:bg-amber-100 transition">
                                <Shield size={16} />
                                {stats.pendingVerifications} pengajuan verifikasi menunggu
                            </Link>
                        )}
                        {stats.pendingReports > 0 && (
                            <Link href="/admin/reports" className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 hover:bg-red-100 transition">
                                <AlertTriangle size={16} />
                                {stats.pendingReports} laporan produk menunggu review
                            </Link>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={Users} label="Total pengguna" value={stats.totalUsers} color="blue" />
                    <StatCard icon={Package} label="Produk aktif" value={stats.activeProducts} color="green" />
                    <StatCard icon={TrendingUp} label="Transaksi selesai" value={stats.completedTransactions} color="purple" />
                    <StatCard icon={Leaf} label="Waste terselamatkan" value={(stats.totalWeightSaved / 1000).toFixed(1)} unit="kg" color="amber" />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Transaksi per jenis</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={transactionsByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                                    {transactionsByType.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Produk per status</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={productsByStatus}>
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/admin/verifications" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-green-200 transition text-center">
                        <Shield size={24} className="mx-auto text-amber-500 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Verifikasi penjual</p>
                    </Link>
                    <Link href="/admin/reports" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-green-200 transition text-center">
                        <AlertTriangle size={24} className="mx-auto text-red-500 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Moderasi laporan</p>
                    </Link>
                    <Link href="/admin/partners" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-green-200 transition text-center">
                        <Users size={24} className="mx-auto text-green-500 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Kelola partner</p>
                    </Link>
                    <Link href="/admin/users" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-green-200 transition text-center">
                        <Users size={24} className="mx-auto text-blue-500 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Kelola pengguna</p>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}