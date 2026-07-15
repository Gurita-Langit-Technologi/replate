import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';

const roleLabels = { user: 'User', verified_seller: 'Penjual Olahan', partner: 'Partner' };
const roleColors = {
    user: 'bg-green-100 text-green-700',
    verified_seller: 'bg-purple-100 text-purple-700',
    partner: 'bg-blue-100 text-blue-700',
};

export default function Users({ users }) {
    return (
        <AppLayout>
            <Head title="Kelola Pengguna" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Pengguna</h1>

                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Nama</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Laporan</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-right px-4 py-3 font-medium text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleColors[u.role]}`}>
                                            {roleLabels[u.role]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{u.report_count}x</td>
                                    <td className="px-4 py-3">
                                        {u.is_blacklisted ? (
                                            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Ditangguhkan</span>
                                        ) : (
                                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Aktif</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => router.patch(`/admin/users/${u.id}/toggle-blacklist`)}
                                            className={`text-xs px-3 py-1 rounded-lg ${u.is_blacklisted ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                        >
                                            {u.is_blacklisted ? 'Aktifkan' : 'Tangguhkan'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}