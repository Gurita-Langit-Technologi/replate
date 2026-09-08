import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, useForm, router } from '@inertiajs/react';
import { Search, Coins, User, MapPin, Check, History, Package, Calendar } from 'lucide-react';

export default function Redeem({ foundUser, searchedCode, recentRedemptions = [] }) {
    const searchForm = useForm({ code: searchedCode || '' });
    const redeemForm = useForm({ user_id: foundUser?.id || '', amount: '', description: '' });

    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    function handleSearch(e) {
        e.preventDefault();
        searchForm.post('/admin/redeem/search');
    }

    function handleRedeem(e) {
        e.preventDefault();
        setConfirmModal({
            show: true,
            title: 'Konfirmasi Penukaran Poin',
            message: `Tukar ${redeemForm.data.amount} RePoin milik ${foundUser?.name} untuk reward ini?`,
            confirmText: 'Proses Penukaran',
            variant: 'success',
            onConfirm: () => redeemForm.post('/admin/redeem/process'),
        });
    }

    return (
        <AppLayout>
            <Head title="Tukar RePoin — Admin BUMDes" />

            <ConfirmModal
                show={confirmModal.show}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
            />
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tukar RePoin Warga</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Layani penukaran poin hasil penyelamatan makanan dengan sembako atau produk BUMDes.
                    </p>
                </div>

                {/* Search by code */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Cari Warga Berdasarkan Kode Penukaran</p>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchForm.data.code}
                                onChange={e => searchForm.setData('code', e.target.value.toUpperCase())}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                placeholder="RPT-XXXXX"
                                maxLength={9}
                            />
                        </div>
                        <button type="submit" disabled={searchForm.processing} className="px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50">
                            Cari Warga
                        </button>
                    </form>
                </div>

                {/* Found user */}
                {foundUser && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                                {foundUser.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900">{foundUser.name}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                    <MapPin size={12} /> Desa {foundUser.desa}
                                </p>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{foundUser.redeem_code}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1.5 text-amber-600 justify-end">
                                    <Coins size={20} />
                                    <span className="text-2xl font-bold">{foundUser.points}</span>
                                </div>
                                <p className="text-xs text-gray-400">RePoin tersedia</p>
                            </div>
                        </div>

                        {foundUser.points > 0 ? (
                            <form onSubmit={handleRedeem} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jumlah Poin yang Ditukar *</label>
                                    <input
                                        type="number"
                                        value={redeemForm.data.amount}
                                        onChange={e => redeemForm.setData('amount', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                        min="1"
                                        max={foundUser.points}
                                        placeholder={`Maksimal ${foundUser.points} poin`}
                                        required
                                    />
                                    {redeemForm.errors.amount && <p className="text-red-500 text-xs mt-1">{redeemForm.errors.amount}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Barang / Paket Sembako yang Diberikan *</label>
                                    <input
                                        type="text"
                                        value={redeemForm.data.description}
                                        onChange={e => redeemForm.setData('description', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                        placeholder="Contoh: Paket Beras 5kg, Minyak Goreng 2L, Pupuk Kompos 5kg"
                                        required
                                    />
                                    {redeemForm.errors.description && <p className="text-red-500 text-xs mt-1">{redeemForm.errors.description}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={redeemForm.processing}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition disabled:opacity-50"
                                >
                                    <Check size={18} />
                                    {redeemForm.processing ? 'Memproses...' : 'Konfirmasi Penukaran Poin'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500">Warga ini belum memiliki saldo RePoin.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Redemptions Log */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
                    <div className="flex items-center gap-2 mb-4">
                        <History size={18} className="text-green-600" />
                        <h2 className="text-sm font-bold text-gray-900">Riwayat Penukaran Sembako Terakhir</h2>
                    </div>

                    {recentRedemptions && recentRedemptions.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {recentRedemptions.map((log) => (
                                <div key={log.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                                            <Package size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {log.user?.name || 'Warga'}
                                            </p>
                                            <p className="text-gray-500 truncate">{log.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="font-bold text-red-600">
                                            -{Math.abs(log.points)} Poin
                                        </span>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 text-center py-6">
                            Belum ada riwayat penukaran poin warga.
                        </p>
                    )}
                </div>

                {/* Guide */}
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">SOP Pelayanan Penukaran Sembako</p>
                    <div className="space-y-2.5 text-xs text-gray-500">
                        <div className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                            <p>Warga datang ke Kantor BUMDes dan menunjukkan kode penukaran dari aplikasi (format: <code>RPT-XXXXX</code>).</p>
                        </div>
                        <div className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                            <p>Petugas BUMDes memasukkan kode untuk memverifikasi nama warga dan saldo RePoin yang tersedia.</p>
                        </div>
                        <div className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                            <p>Petugas menginput nominal poin yang dipotong dan jenis paket sembako fisik yang diserahkan.</p>
                        </div>
                        <div className="flex gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</span>
                            <p>Klik konfirmasi, saldo warga berkurang seketika, dan log penukaran tercatat otomatis di atas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}