import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Coins, TrendingUp, TrendingDown } from 'lucide-react';

const typeLabels = {
    earned_sell: 'Jual produk',
    earned_barter: 'Barter produk',
    earned_donate: 'Donasi produk',
    earned_partner: 'Alih ke mitra',
    earned_upload: 'Upload produk',
    redeemed: 'Tukar poin',
};

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}j lalu`;
    return `${Math.floor(seconds / 86400)}h lalu`;
}

export default function Index({ points, history, redeemCode }) {
    return (
        <AppLayout>
            <Head title="RePoin Saya" />
            <div className="max-w-2xl mx-auto">
                {/* Saldo */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white">
                    <p className="text-sm text-amber-100">Saldo RePoin Anda</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-bold">{points}</span>
                        <span className="text-lg text-amber-200">RePoin</span>
                    </div>
                    <p className="text-xs text-amber-200 mt-2">
                        1 RePoin = 1 kg food waste tersalurkan. Tukarkan di unit BUMDes.
                    </p>
                    <div className="mt-4 pt-4 border-t border-amber-400/30">
                        <p className="text-xs text-amber-200">Kode penukaran Anda</p>
                        <p className="text-2xl font-mono font-bold text-white tracking-wider mt-1">{redeemCode}</p>
                        <p className="text-xs text-amber-200 mt-1">Sebutkan kode ini ke petugas BUMDes saat menukar poin</p>
                    </div>
                </div>

                {/* Formula */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Cara mendapat RePoin</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-green-50 rounded-lg">
                            <span className="text-gray-700">Layak konsumsi</span>
                            <span className="font-semibold text-green-700">3 poin/kg</span>
                        </div>
                        <div className="flex justify-between p-2 bg-amber-50 rounded-lg">
                            <span className="text-gray-700">Layak olah ulang</span>
                            <span className="font-semibold text-amber-700">2 poin/kg</span>
                        </div>
                        <div className="flex justify-between p-2 bg-red-50 rounded-lg">
                            <span className="text-gray-700">Layak pakan/kompos</span>
                            <span className="font-semibold text-red-700">1 poin/kg</span>
                        </div>
                    </div>
                </div>

                {/* Riwayat */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Riwayat RePoin</h2>
                {history.length > 0 ? (
                    <div className="space-y-2">
                        {history.map((h) => (
                            <div key={h.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${h.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {h.amount > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{typeLabels[h.type] || h.type}</p>
                                    <p className="text-xs text-gray-500 truncate">{h.description}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(h.created_at)}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className={`text-sm font-bold ${h.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {h.amount > 0 ? '+' : ''}{h.amount}
                                    </p>
                                    <p className="text-xs text-gray-400">Saldo: {h.balance_after}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Coins size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-500">Belum ada riwayat poin</p>
                        <p className="text-sm text-gray-400 mt-1">Upload dan salurkan produk untuk mendapat RePoin</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}