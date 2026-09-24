import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search, ChevronUp, ChevronDown, ChevronsUpDown,
    Users as UsersIcon, ShieldCheck, Handshake, UserX, UserCheck,
    X, AlertTriangle, Coins,
} from 'lucide-react';

/* ── Constants ──────────────────────────────────────────── */
const ROLE_META = {
    user:            { label: 'User',             color: 'bg-green-100  text-green-700  border-green-200'  },
    verified_seller: { label: 'Penjual Olahan',   color: 'bg-violet-100 text-violet-700 border-violet-200' },
    partner:         { label: 'Mitra Pengolah',   color: 'bg-sky-100    text-sky-700    border-sky-200'    },
};

const SORT_OPTIONS = [
    { value: 'created_at', label: 'Tanggal daftar' },
    { value: 'name',       label: 'Nama (A–Z)'     },
    { value: 'points',     label: 'RePoin'         },
    { value: 'report_count', label: 'Laporan'       },
];

/* ── Helpers ─────────────────────────────────────────────── */
function SortButton({ column, current, direction, onSort }) {
    const active = current === column;
    return (
        <button
            onClick={() => onSort(column)}
            className="inline-flex items-center gap-1 group"
        >
            {active ? (
                direction === 'asc'
                    ? <ChevronUp size={13} className="text-emerald-600" />
                    : <ChevronDown size={13} className="text-emerald-600" />
            ) : (
                <ChevronsUpDown size={13} className="text-gray-300 group-hover:text-gray-500" />
            )}
        </button>
    );
}

/* ── Tab pill ────────────────────────────────────────────── */
function RoleTab({ role, label, icon: Icon, count, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                active
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
            <Icon size={14} />
            {label}
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold tabular-nums ${
                active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
                {count}
            </span>
        </button>
    );
}

/* ── Main page ───────────────────────────────────────────── */
export default function Users({ users, filters = {}, roleCounts = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const activeRole      = filters.role      || '';
    const activeStatus    = filters.status    || '';
    const activeSort      = filters.sort      || 'created_at';
    const activeDirection = filters.direction || 'desc';

    function navigate(overrides) {
        const params = {
            role:      activeRole,
            status:    activeStatus,
            sort:      activeSort,
            direction: activeDirection,
            search:    search,
            ...overrides,
        };
        // remove empty keys
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        router.get('/admin/users', params, { preserveState: true, preserveScroll: true });
    }

    function handleSearch(e) {
        e.preventDefault();
        navigate({ search });
    }

    function handleSort(column) {
        const newDir = activeSort === column && activeDirection === 'desc' ? 'asc' : 'desc';
        navigate({ sort: column, direction: newDir });
    }

    function clearFilters() {
        setSearch('');
        router.get('/admin/users', {}, { preserveState: true });
    }

    const hasActiveFilters = activeRole || activeStatus || filters.search;

    return (
        <AppLayout>
            <Head title="Kelola Pengguna — Admin" />

            <div className="max-w-6xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Admin BUMDes</p>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Pengguna</h1>
                        <p className="text-sm text-gray-500 mt-1">{users.length} pengguna ditampilkan dari {roleCounts.all ?? 0} total terdaftar</p>
                    </div>
                </div>

                {/* ── Role tabs ── */}
                <div className="flex flex-wrap gap-2">
                    <RoleTab
                        role=""
                        label="Semua"
                        icon={UsersIcon}
                        count={roleCounts.all ?? 0}
                        active={!activeRole}
                        onClick={() => navigate({ role: '' })}
                    />
                    <RoleTab
                        role="user"
                        label="User"
                        icon={UsersIcon}
                        count={roleCounts.user ?? 0}
                        active={activeRole === 'user'}
                        onClick={() => navigate({ role: 'user' })}
                    />
                    <RoleTab
                        role="verified_seller"
                        label="Penjual Olahan"
                        icon={ShieldCheck}
                        count={roleCounts.verified_seller ?? 0}
                        active={activeRole === 'verified_seller'}
                        onClick={() => navigate({ role: 'verified_seller' })}
                    />
                    <RoleTab
                        role="partner"
                        label="Mitra Pengolah"
                        icon={Handshake}
                        count={roleCounts.partner ?? 0}
                        active={activeRole === 'partner'}
                        onClick={() => navigate({ role: 'partner' })}
                    />
                </div>

                {/* ── Toolbar: search + sort + status ── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 shadow-xs">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau email..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-400"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition">
                            Cari
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="hidden sm:block w-px bg-gray-200" />

                    {/* Status filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Status:</span>
                        {[
                            { value: '',          label: 'Semua' },
                            { value: 'active',    label: 'Aktif' },
                            { value: 'suspended', label: 'Ditangguhkan' },
                        ].map((s) => (
                            <button
                                key={s.value}
                                onClick={() => navigate({ status: s.value })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                                    activeStatus === s.value
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block w-px bg-gray-200" />

                    {/* Sort select */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Urutkan:</span>
                        <select
                            value={activeSort}
                            onChange={(e) => navigate({ sort: e.target.value })}
                            className="text-xs font-semibold border border-gray-200 rounded-xl px-2.5 py-2 text-gray-700 focus:outline-none focus:border-emerald-500 bg-white cursor-pointer"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => navigate({ direction: activeDirection === 'asc' ? 'desc' : 'asc' })}
                            title={activeDirection === 'asc' ? 'Ascending' : 'Descending'}
                            className="p-2 border border-gray-200 rounded-xl hover:border-gray-300 text-gray-500 transition"
                        >
                            {activeDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>

                    {/* Reset */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition whitespace-nowrap"
                        >
                            <X size={13} /> Reset
                        </button>
                    )}
                </div>

                {/* ── Table ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">

                    {/* Column headers */}
                    <div className="grid grid-cols-[1fr_1.5fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3 bg-gray-50 border-b border-gray-100">
                        <button
                            onClick={() => handleSort('name')}
                            className={`text-[11px] font-bold uppercase tracking-widest text-left flex items-center gap-1 ${activeSort === 'name' ? 'text-emerald-700' : 'text-gray-400'}`}
                        >
                            Pengguna <SortButton column="name" current={activeSort} direction={activeDirection} onSort={handleSort} />
                        </button>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Email</span>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Role</span>
                        <button
                            onClick={() => handleSort('points')}
                            className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 ${activeSort === 'points' ? 'text-emerald-700' : 'text-gray-400'}`}
                        >
                            RePoin <SortButton column="points" current={activeSort} direction={activeDirection} onSort={handleSort} />
                        </button>
                        <button
                            onClick={() => handleSort('report_count')}
                            className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 ${activeSort === 'report_count' ? 'text-emerald-700' : 'text-gray-400'}`}
                        >
                            Laporan <SortButton column="report_count" current={activeSort} direction={activeDirection} onSort={handleSort} />
                        </button>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 text-right">Aksi</span>
                    </div>

                    {/* Rows */}
                    {users.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {users.map((u) => {
                                const role    = ROLE_META[u.role?.value ?? u.role] ?? ROLE_META.user;
                                const reports = u.report_count ?? 0;
                                const hue     = u.name ? ((u.name.charCodeAt(0) * 37) % 360) : 200;

                                return (
                                    <div
                                        key={u.id}
                                        className={`grid grid-cols-[1fr_1.5fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-gray-50 transition ${u.is_blacklisted ? 'opacity-60' : ''}`}
                                    >
                                        {/* Name + avatar */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0"
                                                style={{ background: `hsl(${hue},50%,88%)`, color: `hsl(${hue},55%,32%)` }}
                                            >
                                                {u.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-1.5">
                                                    {u.name}
                                                    {u.is_blacklisted && (
                                                        <span className="text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">Ditangguhkan</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{u.desa || '—'}</p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <p className="text-xs text-gray-600 truncate">{u.email}</p>

                                        {/* Role */}
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap ${role.color}`}>
                                            {role.label}
                                        </span>

                                        {/* RePoin */}
                                        <div className="flex items-center gap-1 justify-end">
                                            <Coins size={12} className="text-amber-500" />
                                            <span className="text-xs font-bold text-amber-700 tabular-nums">{u.points ?? 0}</span>
                                        </div>

                                        {/* Reports */}
                                        <div className="flex items-center gap-1 justify-end">
                                            {reports > 0 ? (
                                                <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                                                    <AlertTriangle size={12} /> {reports}x
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => router.patch(`/admin/users/${u.id}/toggle-blacklist`)}
                                                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition border ${
                                                    u.is_blacklisted
                                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                                }`}
                                            >
                                                {u.is_blacklisted
                                                    ? <><UserCheck size={13} /> Aktifkan</>
                                                    : <><UserX size={13} /> Tangguhkan</>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <Users size={36} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-sm font-bold text-gray-500">Tidak ada pengguna ditemukan</p>
                            <p className="text-xs text-gray-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}