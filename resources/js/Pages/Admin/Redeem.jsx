import { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Search,
    Coins,
    User,
    MapPin,
    Check,
    History,
    Package,
    Calendar,
    Mail,
    Phone,
    Copy,
    CheckCheck,
    ExternalLink,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Scale,
    Users,
    Gift,
    ArrowRight,
    Edit3,
} from 'lucide-react';

const ROLE_LABELS = {
    admin: 'Admin BUMDes',
    verified_seller: 'Penjual Olahan',
    partner: 'Mitra Pengolah',
    user: 'Warga / Pengguna',
};

export default function Redeem({
    foundUser,
    searchedCode,
    recentRedemptions = [],
    allUsers = [],
    userRedemptions = [],
    predefinedRewards = []
}) {
    const [activeTab, setActiveTab] = useState('redeem'); // 'redeem' | 'users' | 'history'
    const [userDirectorySearch, setUserDirectorySearch] = useState('');
    const [copiedCode, setCopiedCode] = useState(null);

    const searchForm = useForm({ code: searchedCode || '' });
    const redeemForm = useForm({
        user_id: foundUser?.id || '',
        amount: '',
        description: '',
        selected_reward_id: '',
    });

    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    function handleSearch(e) {
        e.preventDefault();
        searchForm.post('/admin/redeem/search', {
            onSuccess: () => setActiveTab('redeem'),
        });
    }

    function handleSelectUser(code) {
        searchForm.setData('code', code);
        router.post('/admin/redeem/search', { code }, {
            onSuccess: () => setActiveTab('redeem'),
        });
    }

    function handleCopyCode(code, id = 'main') {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    }

    function handleSelectReward(reward) {
        if (reward === 'custom') {
            redeemForm.setData({
                ...redeemForm.data,
                user_id: foundUser?.id || '',
                amount: '',
                description: '',
                selected_reward_id: 'custom',
            });
            return;
        }

        redeemForm.setData({
            ...redeemForm.data,
            user_id: foundUser?.id || '',
            amount: String(reward.points),
            description: `${reward.title} (${reward.category})`,
            selected_reward_id: reward.id,
        });
    }

    function handleRedeem(e) {
        e.preventDefault();
        setConfirmModal({
            show: true,
            title: 'Konfirmasi Penukaran Poin',
            message: `Tukar ${redeemForm.data.amount} RePoin milik ${foundUser?.name} untuk "${redeemForm.data.description}"?`,
            confirmText: 'Proses Penukaran',
            variant: 'success',
            onConfirm: () => redeemForm.post('/admin/redeem/process'),
        });
    }

    // Filter direktori warga
    const filteredUsers = useMemo(() => {
        if (!userDirectorySearch.trim()) return allUsers;
        const q = userDirectorySearch.toLowerCase();
        return allUsers.filter(u =>
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.redeem_code && u.redeem_code.toLowerCase().includes(q)) ||
            (u.desa && u.desa.toLowerCase().includes(q)) ||
            (u.whatsapp_number && u.whatsapp_number.includes(q))
        );
    }, [allUsers, userDirectorySearch]);

    // User dengan saldo poin untuk quick selection
    const usersWithPoints = useMemo(() => {
        return allUsers.filter(u => u.points > 0);
    }, [allUsers]);

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

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Page */}
                <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Layanan Penukaran RePoin Warga</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Verifikasi kode penukaran, cek data warga, dan serahkan paket reward sembako / pupuk BUMDes.
                    </p>
                </div>

                {/* Tab Navigasi Admin */}
                <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('redeem')}
                        className={`pb-3.5 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'redeem'
                                ? 'border-emerald-600 text-emerald-800'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Coins size={18} className={activeTab === 'redeem' ? 'text-emerald-700' : 'text-gray-500'} />
                        Layani Penukaran Poin
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('users')}
                        className={`pb-3.5 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'users'
                                ? 'border-emerald-600 text-emerald-800'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Users size={18} className={activeTab === 'users' ? 'text-emerald-700' : 'text-gray-500'} />
                        Daftar Pengguna & Kode ({allUsers.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        className={`pb-3.5 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'history'
                                ? 'border-emerald-600 text-emerald-800'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <History size={18} className={activeTab === 'history' ? 'text-emerald-700' : 'text-gray-500'} />
                        Riwayat Penukaran Sembako ({recentRedemptions.length})
                    </button>
                </div>

                {/* TAB 1: FORM PENUKARAN */}
                {activeTab === 'redeem' && (
                    <div className="space-y-6">
                        {/* Search Warga */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                            <h2 className="text-base font-bold text-gray-900 mb-1">Cari Data Warga</h2>
                            <p className="text-xs sm:text-sm text-gray-600 mb-4">
                                Masukkan Kode Penukaran (contoh: <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-bold">RPT-XXXXX</code>), Nama, Email, atau Nomor WhatsApp warga.
                            </p>
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={searchForm.data.code}
                                        onChange={e => searchForm.setData('code', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-600 focus:ring-0"
                                        placeholder="Ketik RPT-XXXXX / Nama / Email / No. HP..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={searchForm.processing || !searchForm.data.code.trim()}
                                    className="px-6 py-3 bg-emerald-700 text-white text-sm font-bold rounded-xl hover:bg-emerald-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
                                >
                                    <Search size={16} />
                                    {searchForm.processing ? 'Mencari...' : 'Cari Warga'}
                                </button>
                            </form>

                            {/* Quick Select Chips */}
                            {usersWithPoints.length > 0 && (
                                <div className="mt-5 pt-4 border-t border-gray-100">
                                    <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <Users size={16} className="text-emerald-700" />
                                        Pilih Cepat Warga dengan Saldo Poin:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {usersWithPoints.map((u) => (
                                             <button
                                                key={u.id}
                                                type="button"
                                                onClick={() => handleSelectUser(u.redeem_code)}
                                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                                                    foundUser?.id === u.id
                                                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                                                        : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800'
                                                }`}
                                            >
                                                <span>{u.name}</span>
                                                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
                                                    {u.points} Poin
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profil User yang Ditemukan */}
                        {foundUser ? (
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-6">
                                {/* Profil Header */}
                                <div className="p-6 bg-gray-50/80 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-xs">
                                                {foundUser.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    <h2 className="text-xl font-bold text-gray-900">{foundUser.name}</h2>
                                                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-gray-200 text-gray-800 border border-gray-300">
                                                        {ROLE_LABELS[foundUser.role] || foundUser.role}
                                                    </span>
                                                    {foundUser.is_blacklisted ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                                                            <ShieldAlert size={14} /> Blacklisted
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                            <ShieldCheck size={14} /> Akun Aktif
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyCode(foundUser.redeem_code, 'found')}
                                                        className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-800 bg-white border border-gray-300 px-2.5 py-1 rounded-lg hover:bg-gray-50 transition shadow-2xs"
                                                        title="Salin Kode Penukaran"
                                                    >
                                                        <span>{foundUser.redeem_code}</span>
                                                        {copiedCode === 'found' ? <CheckCheck size={14} className="text-emerald-700" /> : <Copy size={14} className="text-gray-500" />}
                                                    </button>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                                                        <Calendar size={14} className="text-gray-500" /> Bergabung: {foundUser.joined_at}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Box Saldo Poin */}
                                        <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-300 text-right flex-shrink-0 self-start md:self-auto shadow-2xs">
                                            <p className="text-xs uppercase font-extrabold text-amber-900 tracking-wider">Saldo RePoin Tersedia</p>
                                            <p className="text-3xl font-black text-amber-700">{foundUser.points} <span className="text-sm font-bold text-amber-800">Poin</span></p>
                                        </div>
                                    </div>

                                    {/* Grid Kontak & Domisili */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5 pt-5 border-t border-gray-200">
                                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                                            <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mb-1">
                                                <Mail size={14} className="text-gray-500" /> Email
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{foundUser.email || '-'}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                                            <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mb-1">
                                                <Phone size={14} className="text-gray-500" /> WhatsApp
                                            </p>
                                            {foundUser.whatsapp_number ? (
                                                <a
                                                    href={`https://wa.me/${foundUser.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1.5"
                                                >
                                                    {foundUser.whatsapp_number}
                                                    <ExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <p className="text-sm font-medium text-gray-700">-</p>
                                            )}
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                                            <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mb-1">
                                                <MapPin size={14} className="text-gray-500" /> Domisili Desa
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {foundUser.desa ? `Desa ${foundUser.desa}` : '-'} {foundUser.kecamatan ? `, Kec. ${foundUser.kecamatan}` : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {foundUser.address && (
                                        <div className="mt-3.5 p-3.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800">
                                            <span className="font-bold text-gray-700">Alamat: </span>
                                            {foundUser.address}
                                        </div>
                                    )}
                                </div>

                                {/* Form Eksekusi Penukaran & Pilihan Reward Terstandar */}
                                <div className="p-6 pt-0 space-y-5">
                                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <Gift size={20} className="text-emerald-700" />
                                        Pilih Paket Hadiah / Input Penukaran
                                    </h3>

                                    {foundUser.points > 0 ? (
                                        <form onSubmit={handleRedeem} className="space-y-5">
                                            {/* Pilihan Paket Hadiah Standar */}
                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2.5">
                                                    Pilihan Reward BUMDes (Klik untuk memilih otomatis):
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                    {predefinedRewards.map((reward) => {
                                                        const isSelected = redeemForm.data.selected_reward_id === reward.id;
                                                        const isAffordable = foundUser.points >= reward.points;
                                                        return (
                                                            <button
                                                                key={reward.id}
                                                                type="button"
                                                                onClick={() => handleSelectReward(reward)}
                                                                className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between shadow-2xs ${
                                                                    isSelected
                                                                        ? 'bg-emerald-50/90 border-emerald-600 shadow-xs'
                                                                        : isAffordable
                                                                        ? 'bg-white hover:bg-gray-50 border-gray-200'
                                                                        : 'bg-gray-50 border-gray-200 opacity-75'
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-1">
                                                                    <span className="text-2xl">{reward.icon}</span>
                                                                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                                                                        {reward.points} Poin
                                                                    </span>
                                                                </div>
                                                                <div className="mt-3">
                                                                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{reward.title}</p>
                                                                    <p className="text-xs font-semibold text-gray-600 mt-0.5">{reward.category}</p>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}

                                                    {/* Opsi Custom */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectReward('custom')}
                                                        className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between shadow-2xs ${
                                                            redeemForm.data.selected_reward_id === 'custom'
                                                                ? 'bg-emerald-50/90 border-emerald-600 shadow-xs'
                                                                : 'bg-white hover:bg-gray-50 border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-1">
                                                            <Edit3 size={22} className="text-gray-800 mt-0.5" />
                                                            <span className="text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2.5 py-1 rounded-lg">
                                                                Bebas
                                                            </span>
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-sm font-bold text-gray-900">Custom Reward</p>
                                                            <p className="text-xs font-semibold text-gray-600 mt-0.5">Input jumlah & nama barang manual</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Input Detail Form */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                                        Jumlah Poin Dipotong *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={redeemForm.data.amount}
                                                        onChange={e => redeemForm.setData({
                                                            ...redeemForm.data,
                                                            amount: e.target.value,
                                                            selected_reward_id: 'custom'
                                                        })}
                                                        min="1"
                                                        max={foundUser.points}
                                                        placeholder={`Maks ${foundUser.points}`}
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:ring-0"
                                                        required
                                                    />
                                                    {redeemForm.errors.amount && (
                                                        <p className="text-red-600 text-xs font-semibold mt-1">{redeemForm.errors.amount}</p>
                                                    )}
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                                                        Rincian Barang / Hadiah Sembako Diserahkan *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={redeemForm.data.description}
                                                        onChange={e => redeemForm.setData({
                                                            ...redeemForm.data,
                                                            description: e.target.value,
                                                            selected_reward_id: 'custom'
                                                        })}
                                                        placeholder="Contoh: Beras Organik Desa 2.5 kg, Pupuk Kompos 5 kg"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-600 focus:ring-0"
                                                        required
                                                    />
                                                    {redeemForm.errors.description && (
                                                        <p className="text-red-600 text-xs font-semibold mt-1">{redeemForm.errors.description}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={redeemForm.processing || !redeemForm.data.amount || !redeemForm.data.description}
                                                className="w-full py-3.5 bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl hover:bg-emerald-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
                                            >
                                                <Check size={20} />
                                                {redeemForm.processing ? 'Memproses...' : `Konfirmasi Penukaran (${redeemForm.data.amount || 0} Poin)`}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-200">
                                            <p className="text-sm font-bold text-gray-800">Warga ini memiliki saldo 0 RePoin.</p>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Tidak ada saldo poin yang dapat dipotong saat ini.</p>
                                        </div>
                                    )}

                                    {/* Riwayat Penukaran Warga Terpilih Ini */}
                                    <div className="pt-5 border-t border-gray-200">
                                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <History size={16} className="text-emerald-700" />
                                            Riwayat Penukaran Sebelumnya Milik {foundUser.name}
                                        </h4>
                                        {userRedemptions && userRedemptions.length > 0 ? (
                                            <div className="divide-y divide-gray-200 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                                                {userRedemptions.map((log) => (
                                                    <div key={log.id} className="p-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0">
                                                                <Package size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">{log.description}</p>
                                                                <p className="text-xs font-medium text-gray-600 mt-0.5">
                                                                    {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="font-bold text-red-700 bg-white border border-red-200 px-2.5 py-1 rounded-lg text-xs sm:text-sm">
                                                            -{Math.abs(log.points)} Poin
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs sm:text-sm text-gray-600 italic py-2">
                                                Warga ini belum pernah melakukan penukaran sembako sebelumnya.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center bg-white rounded-2xl border border-gray-200 space-y-3">
                                <Search size={36} className="mx-auto text-gray-400" />
                                <p className="text-base font-bold text-gray-800">Silakan Cari atau Pilih Data Warga</p>
                                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                                    Gunakan kolom pencarian di atas atau buka tab <strong>"Daftar Pengguna & Kode"</strong> untuk melihat daftar lengkap warga desa.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: DAFTAR SEMUA PENGGUNA & KODE PENUKARAN */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Daftar Pengguna & Kode Penukaran Warga</h2>
                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                    Pilih warga secara langsung untuk memproses penukaran sembako di loket posko desa.
                                </p>
                            </div>
                            <span className="text-xs sm:text-sm font-bold px-3 py-1.5 bg-gray-100 text-gray-800 rounded-xl border border-gray-200 self-start sm:self-auto">
                                Total: {allUsers.length} Pengguna
                            </span>
                        </div>

                        {/* Search Filter */}
                        <div className="relative">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={userDirectorySearch}
                                onChange={e => setUserDirectorySearch(e.target.value)}
                                placeholder="Cari nama, email, desa, atau kode penukaran (RPT-XXXXX)..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-600 focus:ring-0"
                            />
                        </div>

                        {/* Tabel Direktori Pengguna */}
                        {filteredUsers.length > 0 ? (
                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead>
                                        <tr className="text-gray-700 font-bold uppercase text-xs tracking-wider border-b border-gray-200 bg-gray-50">
                                            <th className="py-3.5 px-4">Nama & Email</th>
                                            <th className="py-3.5 px-4">Peran</th>
                                            <th className="py-3.5 px-4">Domisili</th>
                                            <th className="py-3.5 px-4">No. WhatsApp</th>
                                            <th className="py-3.5 px-4 text-right">Saldo RePoin</th>
                                            <th className="py-3.5 px-4 text-center">Kode Penukaran</th>
                                            <th className="py-3.5 px-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50/80 transition">
                                                <td className="py-3.5 px-4">
                                                    <div className="font-bold text-gray-900">{u.name}</div>
                                                    <div className="text-xs text-gray-600">{u.email}</div>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-800">
                                                        {ROLE_LABELS[u.role] || u.role}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap text-gray-800 font-medium">
                                                    {u.desa ? `Desa ${u.desa}` : '-'}
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    {u.whatsapp_number ? (
                                                        <a
                                                            href={`https://wa.me/${u.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-emerald-700 hover:underline flex items-center gap-1 font-mono text-xs font-bold"
                                                        >
                                                            {u.whatsapp_number}
                                                            <ExternalLink size={11} />
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-500 font-medium">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <span className="font-extrabold text-amber-700 text-sm">{u.points}</span>
                                                    <span className="text-xs font-semibold text-gray-600 ml-1">Poin</span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyCode(u.redeem_code, u.id)}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-mono text-xs font-bold text-emerald-800 transition shadow-2xs"
                                                        title="Salin Kode"
                                                    >
                                                        <span>{u.redeem_code}</span>
                                                        {copiedCode === u.id ? <CheckCheck size={13} className="text-emerald-700" /> : <Copy size={13} className="text-gray-500" />}
                                                    </button>
                                                </td>
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectUser(u.redeem_code)}
                                                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-2xs"
                                                    >
                                                        Pilih & Tukar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 text-center py-8">
                                Tidak ada data pengguna yang cocok dengan pencarian '{userDirectorySearch}'.
                            </p>
                        )}
                    </div>
                )}

                {/* TAB 3: SEMUA RIWAYAT PENUKARAN */}
                {activeTab === 'history' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Semua Riwayat Penukaran Sembako Warga</h2>
                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                    Catatan audit serah-terima barang reward fisik dan pemotongan poin warga desa.
                                </p>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-xl border border-gray-200 self-start sm:self-auto">
                                Total {recentRedemptions.length} Catatan
                            </span>
                        </div>

                        {recentRedemptions && recentRedemptions.length > 0 ? (
                            <div className="divide-y divide-gray-200 border-t border-gray-200 pt-1">
                                {recentRedemptions.map((log) => (
                                    <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
                                                <Package size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-900 truncate">
                                                        {log.user?.name || 'Warga'}
                                                    </p>
                                                    {log.user?.desa && (
                                                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                                                            Desa {log.user.desa}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 truncate mt-0.5 font-medium">{log.description}</p>
                                            </div>
                                        </div>
                                        <div className="sm:text-right flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
                                            <span className="font-extrabold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg text-xs sm:text-sm">
                                                -{Math.abs(log.points)} Poin
                                            </span>
                                            <p className="text-xs font-semibold text-gray-600 sm:mt-1">
                                                {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 text-center py-8">
                                Belum ada riwayat penukaran poin warga di sistem.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}