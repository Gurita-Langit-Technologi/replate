import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Leaf,
    Scale,
    Heart,
    ArrowLeftRight,
    ShoppingBasket,
    Handshake,
    Users,
    TrendingUp,
    Globe,
    Building,
    Trophy,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    Coins,
    FileText,
} from 'lucide-react';

function StatWidget({ title, value, unit, subtitle, icon: Icon }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</span>
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
                    <Icon size={16} />
                </div>
            </div>
            <div>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</span>
                    {unit && <span className="text-sm font-semibold text-gray-500">{unit}</span>}
                </div>
                {subtitle && <p className="text-xs text-gray-500 mt-1.5 font-medium">{subtitle}</p>}
            </div>
        </div>
    );
}

function ImpactContent({ impact, topContributors = [] }) {
    const categories = impact?.categories ?? {};
    const modes = impact?.modes ?? {};
    const villages = impact?.villages ?? [];

    const categoryNames = {
        siap_santap: 'Makanan Siap Santap & Katering',
        sayur_buah: 'Sayur, Buah & Hasil Kebun Segar',
        bahan_pokok: 'Bahan Pangan Pokok & Mentah',
        produk_olahan: 'Produk Olahan & Olah Ulang',
        pakan_kompos: 'Pakan Ternak & Kompos Organik',
        mentah: 'Bahan Pangan Mentah',
        olahan: 'Makanan Olahan',
        hasil_bumi: 'Hasil Bumi & Pertanian',
    };

    const categoryColors = {
        siap_santap: 'bg-red-500',
        sayur_buah: 'bg-green-500',
        bahan_pokok: 'bg-blue-500',
        produk_olahan: 'bg-amber-500',
        pakan_kompos: 'bg-emerald-600',
        mentah: 'bg-green-600',
        olahan: 'bg-amber-600',
        hasil_bumi: 'bg-blue-600',
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Transparansi & Dampak Lingkungan Desa</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Agregasi data riil sirkulasi pangan, reduksi emisi gas rumah kaca, dan pemberdayaan ekonomi sirkular
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/impact/report"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg transition"
                    >
                        <FileText size={14} className="text-emerald-600" /> Dokumen Laporan ESG
                    </Link>
                    <Link
                        href="/leaderboard"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                    >
                        <Trophy size={14} className="text-amber-500" /> Peringkat Warga
                    </Link>
                </div>
            </div>

            {/* 4 Key Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatWidget
                    title="Food Waste Dicegah"
                    value={impact?.total_weight_kg ?? 0}
                    unit="kg"
                    subtitle={`≈ ${(impact?.total_meals_saved ?? 0).toLocaleString('id-ID')} porsi makanan diselamatkan`}
                    icon={Scale}
                />
                <StatWidget
                    title="Reduksi Emisi CO₂"
                    value={impact?.total_co2_kg ?? 0}
                    unit="kg CO₂e"
                    subtitle="Standar perhitungan FAO (1 kg waste ≈ 2.5 kg CO₂)"
                    icon={Leaf}
                />
                <StatWidget
                    title="Sirkulasi Ekonomi"
                    value={`Rp ${(impact?.total_economic_value ?? 0).toLocaleString('id-ID')}`}
                    subtitle={`${impact?.total_completed_tx ?? 0} transaksi berhasil diselesaikan`}
                    icon={TrendingUp}
                />
                <StatWidget
                    title="Warga & Mitra Terlibat"
                    value={(impact?.total_users ?? 0) + (impact?.total_partners ?? 0)}
                    unit="Akun"
                    subtitle={`${impact?.total_partners ?? 0} mitra peternak & pengolah kompos desa`}
                    icon={Users}
                />
            </div>

            {/* 2-Column: Category Breakdown & 4 Modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <ShoppingBasket size={16} className="text-gray-600" />
                        Penyelamatan per Kategori Bahan Pangan
                    </h2>
                    <p className="text-xs text-gray-400 mb-4">Proporsi jenis makanan yang berhasil diedarkan kembali</p>

                    <div className="space-y-4">
                        {Object.entries(categories).length > 0 ? (
                            Object.entries(categories).map(([catKey, catData]) => (
                                <div key={catKey}>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-gray-800">{categoryNames[catKey] ?? catKey}</span>
                                        <span className="text-gray-900 font-bold">{catData.weight_kg} kg ({catData.percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${categoryColors[catKey] ?? 'bg-green-600'}`}
                                            style={{ width: `${Math.max(catData.percentage, 5)}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-0.5 block">{catData.transactions} transaksi selesai</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic py-4 text-center">Data kategori akan terakumulasi otomatis.</p>
                        )}
                    </div>
                </div>

                {/* 4 Circular Modes */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <ArrowLeftRight size={16} className="text-gray-600" />
                        Efektivitas 4 Jalur Penyerapan
                    </h2>
                    <p className="text-xs text-gray-400 mb-4">Jumlah transaksi berdasarkan metode sirkular</p>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                            <span className="text-gray-500 font-medium">Jual Beli Murah</span>
                            <p className="text-xl font-bold text-gray-900 mt-1">{modes['sale']?.count ?? 0}</p>
                            <span className="text-[10px] text-gray-400">Pangan diskon terjangkau</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                            <span className="text-gray-500 font-medium">Barter Pangan</span>
                            <p className="text-xl font-bold text-gray-900 mt-1">{modes['barter']?.count ?? 0}</p>
                            <span className="text-[10px] text-gray-400">Tukar hasil bumi lokal</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                            <span className="text-gray-500 font-medium">Donasi Sosial</span>
                            <p className="text-xl font-bold text-gray-900 mt-1">{modes['donation']?.count ?? 0}</p>
                            <span className="text-[10px] text-gray-400">Bantuan warga prasejahtera</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                            <span className="text-gray-500 font-medium">Alih Mitra Pengolah</span>
                            <p className="text-xl font-bold text-gray-900 mt-1">{modes['partner_transfer']?.count ?? 0}</p>
                            <span className="text-[10px] text-gray-400">Pakan ternak & kompos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sebaran Data per Desa */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Building size={16} className="text-gray-600" />
                    Kontribusi Penyelamatan per Wilayah Desa
                </h2>
                <p className="text-xs text-gray-400 mb-4">Akumulasi kilogram makanan yang dicegah terbuang per desa</p>

                {villages.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {villages.map((v, idx) => (
                            <div key={v.desa} className="py-2.5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3">
                                    <span className="w-5 h-5 rounded bg-gray-100 text-gray-700 font-bold text-[11px] flex items-center justify-center">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900">{v.desa}</p>
                                        <p className="text-[10px] text-gray-400">{v.count} aktivitas transaksi</p>
                                    </div>
                                </div>
                                <span className="font-bold text-green-700 text-xs sm:text-sm">
                                    {v.weight_kg} kg
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic py-4 text-center">Belum ada data wilayah tersimpan.</p>
                )}
            </div>

            {/* Pilar Dampak Ekosistem Desa */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        Manfaat Komunitas & Lingkungan
                    </span>
                    <h2 className="text-base font-bold text-gray-900 mt-2">Pilar Utama Dampak Sirkularitas Desa</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-xs">🍚</span>
                            <span>Ketahanan Pangan Warga</span>
                        </div>
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                            Mendistribusikan kelebihan makanan layak santap ke keluarga rentan melalui donasi dan harga diskon terjangkau.
                        </p>
                    </div>

                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">⚡</span>
                            <span>Sistem Sirkular Cepat</span>
                        </div>
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                            Menerapkan teknologi timeout otomatis berjenjang agar pangan terserap sebelum kualitasnya menurun.
                        </p>
                    </div>

                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span className="w-6 h-6 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs">🌾</span>
                            <span>Pakan Ternak & Pupuk Organik</span>
                        </div>
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                            Sisa pangan yang tidak habis dialihkan ke mitra peternak & pengomposan untuk mendukung pertanian desa.
                        </p>
                    </div>

                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">♻️</span>
                            <span>Desa Bebas Beban TPA</span>
                        </div>
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                            Mengurangi volume sampah basah yang diangkut ke TPA melalui pemanfaatan langsung di tingkat RT/RW.
                        </p>
                    </div>

                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs">🌍</span>
                            <span>Pencegahan Emisi Karbon</span>
                        </div>
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                            Mengurangi pembentukan gas metana berbahaya dari tumpukan sampah makanan yang membusuk di alam terbuka.
                        </p>
                    </div>

                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">🤝</span>
                            <span>Ekonomi Mandiri & Gotong Royong</span>
                        </div>
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                            Kolaborasi produktif antara warga, warung UMKM, kelompok peternak, dan pengelola BUMDes desa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Index({ impact, topContributors }) {
    const { auth } = usePage().props;

    if (auth?.user) {
        return (
            <AppLayout>
                <Head title="Transparansi & Dampak Lingkungan — Replate" />
                <ImpactContent impact={impact} topContributors={topContributors} />
            </AppLayout>
        );
    }

    return (
        <>
            <Head title="Transparansi & Dampak Lingkungan — Replate" />
            <div className="min-h-screen bg-gray-50">
                <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/image/logo(2).png" alt="Replate" className="w-auto h-9 object-cover" />
                        </Link>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                                <ArrowLeft size={14} /> Beranda
                            </Link>
                            <Link href="/leaderboard" className="text-gray-600 hover:text-green-600">
                                Peringkat Warga
                            </Link>
                            <Link href="/marketplace" className="text-gray-600 hover:text-green-600">
                                Marketplace
                            </Link>
                            <Link href="/register" className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                                Gabung Sekarang
                            </Link>
                        </div>
                    </div>
                </nav>

                <main className="px-4 py-6">
                    <ImpactContent impact={impact} topContributors={topContributors} />
                </main>
            </div>
        </>
    );
}
