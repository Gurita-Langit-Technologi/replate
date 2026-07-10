import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Halo, {auth.user.name}!
                </h1>
                <p className="text-gray-500 mb-6">
                    Role: <span className="capitalize font-medium">{auth.user.role}</span>
                </p>

                {/* Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Produk Aktif Saya</p>
                        <p className="text-3xl font-bold text-green-600">{stats.myProducts}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Total Transaksi</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalTransactions}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Food Waste Terselamatkan</p>
                        <p className="text-3xl font-bold text-purple-600">
                            {(stats.totalWeightSaved / 1000).toFixed(1)} kg
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/marketplace"
                        className="bg-white p-5 rounded-lg shadow hover:shadow-md transition text-center"
                    >
                        <div className="text-3xl mb-2">🛒</div>
                        <p className="font-semibold text-gray-800">Marketplace</p>
                        <p className="text-sm text-gray-500">Jelajahi produk</p>
                    </Link>
                    <Link
                        href="/products/create"
                        className="bg-white p-5 rounded-lg shadow hover:shadow-md transition text-center"
                    >
                        <div className="text-3xl mb-2">📦</div>
                        <p className="font-semibold text-gray-800">Upload Produk</p>
                        <p className="text-sm text-gray-500">Jual atau barter</p>
                    </Link>
                    <Link
                        href="/my-products"
                        className="bg-white p-5 rounded-lg shadow hover:shadow-md transition text-center"
                    >
                        <div className="text-3xl mb-2">📋</div>
                        <p className="font-semibold text-gray-800">Produk Saya</p>
                        <p className="text-sm text-gray-500">Kelola produk</p>
                    </Link>
                    <Link
                        href="/profile"
                        className="bg-white p-5 rounded-lg shadow hover:shadow-md transition text-center"
                    >
                        <div className="text-3xl mb-2">👤</div>
                        <p className="font-semibold text-gray-800">Profil</p>
                        <p className="text-sm text-gray-500">Edit data diri</p>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}