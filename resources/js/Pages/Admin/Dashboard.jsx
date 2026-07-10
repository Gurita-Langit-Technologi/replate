import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />
            <div className="max-w-7xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Total Produk</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Produk Aktif</p>
                        <p className="text-3xl font-bold text-green-600">{stats.activeProducts}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Total Transaksi</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalTransactions}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Total Pengguna</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
                    </div>
                </div>

                <p className="text-gray-400 text-sm">TODO: verifikasi penjual, moderasi produk, manajemen partner, chart dampak desa</p>
            </div>
        </AuthenticatedLayout>
    );
}