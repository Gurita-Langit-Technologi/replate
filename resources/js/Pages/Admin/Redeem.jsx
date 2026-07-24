import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Search, Coins, User, MapPin, Check } from 'lucide-react';

export default function Redeem({ foundUser, searchedCode }) {
    const searchForm = useForm({ code: searchedCode || '' });
    const redeemForm = useForm({ user_id: foundUser?.id || '', amount: '', description: '' });

    function handleSearch(e) {
        e.preventDefault();
        searchForm.post('/admin/redeem/search');
    }

    function handleRedeem(e) {
        e.preventDefault();
        if (confirm(`Tukar ${redeemForm.data.amount} poin milik ${foundUser.name}?`)) {
            redeemForm.post('/admin/redeem/process');
        }
    }

    return (
        <AppLayout>
            <Head title="Tukar RePoin" />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Tukar RePoin</h1>

                {/* Search by code */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
                    <p className="text-sm font-medium text-gray-900 mb-3">Cari warga berdasarkan kode</p>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchForm.data.code}
                                onChange={e => searchForm.setData('code', e.target.value.toUpperCase())}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                placeholder="RPT-XXXXX"
                                maxLength={9}
                            />
                        </div>
                        <button type="submit" disabled={searchForm.processing} className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 disabled:opacity-50">
                            Cari
                        </button>
                    </form>
                </div>

                {/* Found user */}
                {foundUser && (
                    <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                                {foundUser.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{foundUser.name}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin size={12} /> {foundUser.desa}
                                </p>
                                <p className="text-xs text-gray-400 font-mono">{foundUser.redeem_code}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1.5 text-amber-600">
                                    <Coins size={20} />
                                    <span className="text-2xl font-bold">{foundUser.points}</span>
                                </div>
                                <p className="text-xs text-gray-400">RePoin tersedia</p>
                            </div>
                        </div>

                        {foundUser.points > 0 ? (
                            <form onSubmit={handleRedeem} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Jumlah poin yang ditukar *</label>
                                    <input
                                        type="number"
                                        value={redeemForm.data.amount}
                                        onChange={e => redeemForm.setData('amount', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                        min="1"
                                        max={foundUser.points}
                                        placeholder={`Maksimal ${foundUser.points} poin`}
                                    />
                                    {redeemForm.errors.amount && <p className="text-red-500 text-xs mt-1">{redeemForm.errors.amount}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Ditukar untuk apa? *</label>
                                    <input
                                        type="text"
                                        value={redeemForm.data.description}
                                        onChange={e => redeemForm.setData('description', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                                        placeholder="Contoh: Potongan harga beras 5kg, Pupuk organik 2kg"
                                    />
                                    {redeemForm.errors.description && <p className="text-red-500 text-xs mt-1">{redeemForm.errors.description}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={redeemForm.processing}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition disabled:opacity-50"
                                >
                                    <Check size={18} />
                                    {redeemForm.processing ? 'Memproses...' : 'Konfirmasi penukaran'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-500">Warga ini belum memiliki RePoin.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Guide */}
                <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-sm font-medium text-gray-900 mb-3">Cara menukar RePoin</p>
                    <div className="space-y-3 text-sm text-gray-500">
                        <div className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                            <p>Warga datang ke BUMDes dan menyebutkan kode RePoin mereka</p>
                        </div>
                        <div className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                            <p>Petugas input kode di form di atas → muncul info warga + saldo poin</p>
                        </div>
                        <div className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                            <p>Petugas input jumlah poin yang ditukar + deskripsi barang yang diberikan</p>
                        </div>
                        <div className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                            <p>Konfirmasi → poin terpotong otomatis, warga terima barang</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}