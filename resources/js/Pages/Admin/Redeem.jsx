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

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Page */}
                <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Layanan Penukaran RePoin Warga</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Verifikasi kode penukaran, cek data warga, dan serahkan paket reward sembako / pupuk BUMDes.
                    </p>
                </div>

                {/* Tab Navigasi Admin */}
                <div className="flex border-b border-gray-200 gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('redeem')}
                        className={`pb-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                            activeTab === 'redeem'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <Coins size={15} />
                        Layani Penukaran Poin
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('users')}
                        className={`pb-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                            activeTab === 'users'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <Users size={15} />
                        Daftar Pengguna & Kode ({allUsers.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                            activeTab === 'history'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <History size={15} />
                        Riwayat Penukaran Sembako ({recentRedemptions.length})
                    </button>
                </div>

                {/* TAB 1: FORM PENUKARAN */}
                {activeTab === 'redeem' && (
                    <div className="space-y-6">
                        {/* Search Warga */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                            <h2 className="text-sm font-semibold text-gray-900 mb-1">Cari Data Warga</h2>
                            <p className="text-xs text-gray-500 mb-3">
                                Masukkan Kode Penukaran (contoh: <code>RPT-XXXXX</code>), Nama, Email, atau Nomor WhatsApp warga.
                            </p>
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 relative">
                                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchForm.data.code}
                                        onChange={e => searchForm.setData('code', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                                        placeholder="Ketik RPT-XXXXX / Nama / Email / No. HP..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={searchForm.processing || !searchForm.data.code.trim()}
                                    className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
                                    <Search size={15} />
                                    {searchForm.processing ? 'Mencari...' : 'Cari Warga'}
                                </button>
                            </form>

                            {/* Quick Select Chips */}
                            {usersWithPoints.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                                        <Users size={13} />
                                        Pilih Cepat Warga dengan Saldo Poin:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {usersWithPoints.map((u) => (
                                            <button
                                                key={u.id}
                                                type="button"
                                                onClick={() => handleSelectUser(u.redeem_code)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition ${
                                                    foundUser?.id === u.id
                                                        ? 'bg-green-50 border-green-400 text-green-800 font-semibold'
                                                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                                                }`}
                                            >
                                                <span>{u.name}</span>
                                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
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
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs space-y-6">
                                {/* Profil Header */}
                                <div className="p-5 bg-gray-50 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-13 h-13 rounded-xl bg-green-700 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                                                {foundUser.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="text-lg font-bold text-gray-900">{foundUser.name}</h2>
                                                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-200 text-gray-800">
                                                        {ROLE_LABELS[foundUser.role] || foundUser.role}
                                                    </span>
                                                    {foundUser.is_blacklisted ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-700">
                                                            <ShieldAlert size={11} /> Blacklisted
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-green-100 text-green-700">
                                                            <ShieldCheck size={11} /> Akun Aktif
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyCode(foundUser.redeem_code, 'found')}
                                                        className="inline-flex items-center gap-1 font-mono font-bold text-green-700 bg-white border border-gray-300 px-2 py-0.5 rounded hover:bg-gray-50"
                                                        title="Salin Kode Penukaran"
                                                    >
                                                        <span>{foundUser.redeem_code}</span>
                                                        {copiedCode === 'found' ? <CheckCheck size={12} className="text-green-600" /> : <Copy size={12} className="text-gray-400" />}
                                                    </button>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} /> Bergabung: {foundUser.joined_at}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Box Saldo Poin */}
                                        <div className="bg-white px-4 py-3 rounded-xl border border-amber-300 text-right flex-shrink-0 self-start md:self-auto">
                                            <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Saldo RePoin Tersedia</p>
                                            <p className="text-2xl font-black text-amber-600">{foundUser.points} <span className="text-xs font-normal text-gray-500">Poin</span></p>
                                        </div>
                                    </div>

                                    {/* Grid Kontak & Domisili */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200 text-xs">
                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                            <p className="text-gray-400 font-medium flex items-center gap-1 mb-0.5">
                                                <Mail size={12} className="text-gray-500" /> Email
                                            </p>
                                            <p className="font-semibold text-gray-800 truncate">{foundUser.email || '-'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                            <p className="text-gray-400 font-medium flex items-center gap-1 mb-0.5">
                                                <Phone size={12} className="text-gray-500" /> WhatsApp
                                            </p>
                                            {foundUser.whatsapp_number ? (
                                                <a
                                                    href={`https://wa.me/${foundUser.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-semibold text-green-700 hover:underline flex items-center gap-1"
                                                >
                                                    {foundUser.whatsapp_number}
                                                    <ExternalLink size={10} />
                                                </a>
                                            ) : (
                                                <p className="text-gray-600">-</p>
                                            )}
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                            <p className="text-gray-400 font-medium flex items-center gap-1 mb-0.5">
                                                <MapPin size={12} className="text-gray-500" /> Domisili Desa
                                            </p>
                                            <p className="font-semibold text-gray-800 truncate">
                                                {foundUser.desa ? `Desa ${foundUser.desa}` : '-'} {foundUser.kecamatan ? `, Kec. ${foundUser.kecamatan}` : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {foundUser.address && (
                                        <div className="mt-2.5 p-2.5 bg-white rounded-lg border border-gray-200 text-xs text-gray-700">
                                            <span className="font-semibold text-gray-500">Alamat: </span>
                                            {foundUser.address}
                                        </div>
                                    )}
                                </div>

                                {/* Form Eksekusi Penukaran & Pilihan Reward Terstandar */}
                                <div className="p-5 pt-0 space-y-4">
                                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <Gift size={16} className="text-green-600" />
                                        Pilih Paket Hadiah / Input Penukaran
                                    </h3>

                                    {foundUser.points > 0 ? (
                                        <form onSubmit={handleRedeem} className="space-y-4">
                                            {/* Pilihan Paket Hadiah Standar */}
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                                    Pilihan Reward BUMDes (Klik untuk memilih otomatis):
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                                    {predefinedRewards.map((reward) => {
                                                        const isSelected = redeemForm.data.selected_reward_id === reward.id;
                                                        const isAffordable = foundUser.points >= reward.points;
                                                        return (
                                                            <button
                                                                key={reward.id}
                                                                type="button"
                                                                onClick={() => handleSelectReward(reward)}
                                                                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                                                                    isSelected
                                                                        ? 'bg-green-50 border-green-600 ring-1 ring-green-600'
                                                                        : isAffordable
                                                                        ? 'bg-white hover:bg-gray-50 border-gray-200'
                                                                        : 'bg-gray-50 border-gray-200 opacity-60'
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-1">
                                                                    <span className="text-xl">{reward.icon}</span>
                                                                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                                                        {reward.points} Poin
                                                                    </span>
                                                                </div>
                                                                <div className="mt-2">
                                                                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{reward.title}</p>
                                                                    <p className="text-[11px] text-gray-500 mt-0.5">{reward.category}</p>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}

                                                    {/* Opsi Custom */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectReward('custom')}
                                                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                                                            redeemForm.data.selected_reward_id === 'custom'
                                                                ? 'bg-green-50 border-green-600 ring-1 ring-green-600'
                                                                : 'bg-white hover:bg-gray-50 border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-1">
                                                            <Edit3 size={18} className="text-gray-700 mt-0.5" />
                                                            <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                                                Bebas
                                                            </span>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="text-xs font-bold text-gray-900">Custom Reward</p>
                                                            <p className="text-[11px] text-gray-500 mt-0.5">Input jumlah & nama barang manual</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Input Detail Form */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
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
                                                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                                                        required
                                                    />
                                                    {redeemForm.errors.amount && (
                                                        <p className="text-red-500 text-xs mt-1">{redeemForm.errors.amount}</p>
                                                    )}
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Rincian Barang / Paket Sembako Diserahkan *
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
                                                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                                                        required
                                                    />
                                                    {redeemForm.errors.description && (
                                                        <p className="text-red-500 text-xs mt-1">{redeemForm.errors.description}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={redeemForm.processing || !redeemForm.data.amount || !redeemForm.data.description}
                                                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <Check size={18} />
                                                {redeemForm.processing ? 'Memproses...' : `Konfirmasi Penukaran (${redeemForm.data.amount || 0} Poin)`}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="text-center py-5 bg-gray-50 rounded-xl border border-gray-200">
                                            <p className="text-sm font-semibold text-gray-700">Warga ini memiliki saldo 0 RePoin.</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Tidak ada saldo poin yang dapat dipotong saat ini.</p>
                                        </div>
                                    )}

                                    {/* Riwayat Penukaran Warga Terpilih Ini */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <History size={14} className="text-gray-500" />
                                            Riwayat Penukaran Sebelumnya Milik {foundUser.name}
                                        </h4>
                                        {userRedemptions && userRedemptions.length > 0 ? (
                                            <div className="divide-y divide-gray-100 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                                {userRedemptions.map((log) => (
                                                    <div key={log.id} className="p-3 flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2.5">
                                                            <Package size={15} className="text-amber-600 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{log.description}</p>
                                                                <p className="text-[11px] text-gray-400">
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
                                                        <span className="font-bold text-red-600 bg-white border border-gray-200 px-2 py-0.5 rounded">
                                                            -{Math.abs(log.points)} Poin
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic py-2">
                                                Warga ini belum pernah melakukan penukaran sembako sebelumnya.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-white rounded-xl border border-gray-200 space-y-2">
                                <Search size={28} className="mx-auto text-gray-300" />
                                <p className="text-sm font-semibold text-gray-700">Silakan Cari atau Pilih Data Warga</p>
                                <p className="text-xs text-gray-500 max-w-md mx-auto">
                                    Gunakan kolom pencarian di atas atau buka tab <strong>"Daftar Pengguna & Kode"</strong> untuk melihat daftar lengkap warga desa.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: DAFTAR SEMUA PENGGUNA & KODE PENUKARAN */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-bold text-gray-900">Daftar Pengguna & Kode Penukaran Warga</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Pilih warga secara langsung untuk memproses penukaran sembako di loket posko desa.
                                </p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg self-start sm:self-auto">
                                Total: {allUsers.length} Pengguna
                            </span>
                        </div>

                        {/* Search Filter */}
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={userDirectorySearch}
                                onChange={e => setUserDirectorySearch(e.target.value)}
                                placeholder="Cari nama, email, desa, atau kode penukaran (RPT-XXXXX)..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                            />
                        </div>

                        {/* Tabel Direktori Pengguna */}
                        {filteredUsers.length > 0 ? (
                            <div className="divide-y divide-gray-200 overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200 bg-gray-50">
                                            <th className="py-2.5 px-3">Nama & Email</th>
                                            <th className="py-2.5 px-3">Peran</th>
                                            <th className="py-2.5 px-3">Domisili</th>
                                            <th className="py-2.5 px-3">No. WhatsApp</th>
                                            <th className="py-2.5 px-3 text-right">Saldo RePoin</th>
                                            <th className="py-2.5 px-3 text-center">Kode Penukaran</th>
                                            <th className="py-2.5 px-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50 transition">
                                                <td className="py-3 px-3">
                                                    <div className="font-semibold text-gray-900">{u.name}</div>
                                                    <div className="text-[11px] text-gray-500">{u.email}</div>
                                                </td>
                                                <td className="py-3 px-3 whitespace-nowrap">
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                                        {ROLE_LABELS[u.role] || u.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 whitespace-nowrap text-gray-600">
                                                    {u.desa ? `Desa ${u.desa}` : '-'}
                                                </td>
                                                <td className="py-3 px-3 whitespace-nowrap">
                                                    {u.whatsapp_number ? (
                                                        <a
                                                            href={`https://wa.me/${u.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-green-700 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                                        >
                                                            {u.whatsapp_number}
                                                            <ExternalLink size={9} />
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                                    <span className="font-bold text-amber-600">{u.points}</span>
                                                    <span className="text-[10px] text-gray-400 ml-1">Poin</span>
                                                </td>
                                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyCode(u.redeem_code, u.id)}
                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded font-mono text-[11px] font-bold text-gray-800 transition"
                                                        title="Salin Kode"
                                                    >
                                                        <span>{u.redeem_code}</span>
                                                        {copiedCode === u.id ? <CheckCheck size={11} className="text-green-600" /> : <Copy size={11} className="text-gray-400" />}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectUser(u.redeem_code)}
                                                        className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs rounded-lg transition"
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
                            <p className="text-xs text-gray-400 text-center py-8">
                                Tidak ada data pengguna yang cocok dengan pencarian '{userDirectorySearch}'.
                            </p>
                        )}
                    </div>
                )}

                {/* TAB 3: SEMUA RIWAYAT PENUKARAN */}
                {activeTab === 'history' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-gray-900">Semua Riwayat Penukaran Sembako Warga</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Catatan audit serah-terima barang reward fisik dan pemotongan poin warga desa.
                                </p>
                            </div>
                            <span className="text-xs text-gray-400">Total {recentRedemptions.length} Catatan</span>
                        </div>

                        {recentRedemptions && recentRedemptions.length > 0 ? (
                            <div className="divide-y divide-gray-100 border-t border-gray-100">
                                {recentRedemptions.map((log) => (
                                    <div key={log.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
                                                <Package size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-900 truncate">
                                                        {log.user?.name || 'Warga'}
                                                    </p>
                                                    {log.user?.desa && (
                                                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                                                            Desa {log.user.desa}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 truncate mt-0.5">{log.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs">
                                                -{Math.abs(log.points)} Poin
                                            </span>
                                            <p className="text-[11px] text-gray-400 mt-1">
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
                            <p className="text-xs text-gray-400 text-center py-8">
                                Belum ada riwayat penukaran poin warga di sistem.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}