import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const typeLabels = { peternak: 'Peternak', kompos: 'Kompos', maggot: 'Maggot', umkm: 'UMKM' };

export default function Partners({ partners }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', whatsapp_number: '',
        desa: '', kecamatan: '', partner_type: 'peternak', capacity_description: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/admin/partners', { onSuccess: () => { reset(); setShowForm(false); } });
    }

    return (
        <AppLayout>
            <Head title="Kelola Partner" />
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Partner</h1>
                    <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                        {showForm ? 'Tutup form' : '+ Tambah partner'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-5 mb-6 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama *</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password *</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                                <input type="text" value={data.whatsapp_number} onChange={e => setData('whatsapp_number', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Desa</label>
                                <input type="text" value={data.desa} onChange={e => setData('desa', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Kecamatan</label>
                                <input type="text" value={data.kecamatan} onChange={e => setData('kecamatan', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Jenis partner *</label>
                                <select value={data.partner_type} onChange={e => setData('partner_type', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                                    <option value="peternak">Peternak</option>
                                    <option value="kompos">Kompos</option>
                                    <option value="maggot">Maggot</option>
                                    <option value="umkm">UMKM</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Kapasitas</label>
                                <input type="text" value={data.capacity_description} onChange={e => setData('capacity_description', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Misal: max 50kg/minggu" />
                            </div>
                        </div>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan partner'}
                        </button>
                    </form>
                )}

                {partners.length > 0 ? (
                    <div className="space-y-3">
                        {partners.map((p) => (
                            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">{p.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {p.partner_profile ? typeLabels[p.partner_profile.partner_type] : '-'}
                                        {p.desa && ` · ${p.desa}, ${p.kecamatan}`}
                                        {p.partner_profile?.capacity_description && ` · ${p.partner_profile.capacity_description}`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => router.patch(`/admin/partners/${p.partner_profile?.id}/toggle`)}
                                    className={`px-3 py-1 text-sm rounded-lg ${p.partner_profile?.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    {p.partner_profile?.is_active ? 'Aktif' : 'Nonaktif'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400">Belum ada partner.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}