import { Head, Link, usePage } from '@inertiajs/react';
import NavbarLayout from '@/Layouts/NavbarLayout';
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
    Sparkles,
    ArrowRight,
    Activity,
    ChevronRight,
} from 'lucide-react';

function StatWidget({ title, value, unit, subtitle, icon: Icon, theme = 'green' }) {
    const themes = {
        green: {
            text: 'text-green-600',
        },
        emerald: {
            text: 'text-emerald-600',
        },
        blue: {
            text: 'text-blue-600',
        },
        purple: {
            text: 'text-purple-600',
        },
    };
    const t = themes[theme] || themes.green;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-600">
                        {title}
                    </span>
                    <Icon size={24} className={`${t.text} flex-shrink-0`} />
                </div>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                        {value}
                    </span>
                    {unit && (
                        <span className="text-base sm:text-lg font-bold text-gray-500">
                            {unit}
                        </span>
                    )}
                </div>
            </div>
            {subtitle && (
                <p className="text-xs sm:text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100 font-medium leading-relaxed">
                    {subtitle}
                </p>
            )}
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
        sayur_buah: 'bg-green-600',
        bahan_pokok: 'bg-blue-600',
        produk_olahan: 'bg-amber-500',
        pakan_kompos: 'bg-emerald-600',
        mentah: 'bg-green-600',
        olahan: 'bg-amber-600',
        hasil_bumi: 'bg-blue-600',
    };

    return (
        <div className="w-full space-y-8 md:space-y-10 py-2 sm:py-4">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 md:p-10 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Transparansi & Dampak Lingkungan Desa
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-2.5 max-w-3xl leading-relaxed">
                            Agregasi data riil sirkulasi pangan, reduksi emisi gas rumah kaca, dan pemberdayaan ekonomi sirkular masyarakat desa secara transparan dan akuntabel.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                        <Link
                            href="/impact/report"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-sm font-bold rounded-xl transition shadow-xs"
                        >
                            <FileText size={17} className="text-emerald-700" /> Dokumen Laporan ESG
                        </Link>
                        <Link
                            href="/leaderboard"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition border border-gray-200 shadow-xs"
                        >
                            <Trophy size={17} className="text-amber-500" /> Peringkat Warga
                        </Link>
                    </div>
                </div>
            </div>

            {/* 4 Key Performance Metrics */}
            <div>
                <div className="mb-4">
                    <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                        Indikator Kinerja Utama (KPI) Sirkularitas
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Capaian kumulatif aksi penyelamatan bahan pangan di seluruh wilayah desa
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <StatWidget
                        title="Food Waste Dicegah"
                        value={impact?.total_weight_kg ?? 0}
                        unit="kg"
                        subtitle={`≈ ${(impact?.total_meals_saved ?? 0).toLocaleString('id-ID')} porsi makanan diselamatkan`}
                        icon={Scale}
                        theme="green"
                    />
                    <StatWidget
                        title="Reduksi Emisi CO₂"
                        value={impact?.total_co2_kg ?? 0}
                        unit="kg CO₂e"
                        subtitle="Standar perhitungan FAO (1 kg sisa ≈ 2.5 kg CO₂)"
                        icon={Leaf}
                        theme="emerald"
                    />
                    <StatWidget
                        title="Sirkulasi Ekonomi"
                        value={`Rp ${(impact?.total_economic_value ?? 0).toLocaleString('id-ID')}`}
                        subtitle={`${impact?.total_completed_tx ?? 0} transaksi berhasil diselesaikan`}
                        icon={TrendingUp}
                        theme="blue"
                    />
                    <StatWidget
                        title="Warga & Mitra Terlibat"
                        value={(impact?.total_users ?? 0) + (impact?.total_partners ?? 0)}
                        unit="Akun"
                        subtitle={`${impact?.total_partners ?? 0} mitra peternak & pengolah kompos desa`}
                        icon={Users}
                        theme="purple"
                    />
                </div>
            </div>

            {/* 2-Column: Category Breakdown & 4 Modes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <ShoppingBasket size={22} className="text-green-600 flex-shrink-0" />
                            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                                Penyelamatan per Kategori Bahan Pangan
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-6">
                            Proporsi jenis komoditas dan makanan yang berhasil diedarkan kembali
                        </p>

                        <div className="space-y-5">
                            {Object.entries(categories).length > 0 ? (
                                Object.entries(categories).map(([catKey, catData]) => (
                                    <div key={catKey} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                                            <span className="text-gray-800">{categoryNames[catKey] ?? catKey}</span>
                                            <span className="text-gray-900 font-extrabold">{catData.weight_kg} kg <span className="text-gray-500 font-semibold">({catData.percentage}%)</span></span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${categoryColors[catKey] ?? 'bg-green-600'}`}
                                                style={{ width: `${Math.max(catData.percentage, 5)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 block font-medium">{catData.transactions} transaksi selesai</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic py-6 text-center">Data kategori akan terakumulasi otomatis seiring transaksi.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4 Circular Modes */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <ArrowLeftRight size={22} className="text-blue-600 flex-shrink-0" />
                            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                                Efektivitas 4 Jalur Penyerapan
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-6">
                            Jumlah transaksi terverifikasi berdasarkan metode pemanfaatan sirkular
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 sm:p-5 bg-green-50 rounded-2xl border border-green-200">
                                <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Jual Beli Murah</span>
                                <p className="text-2xl sm:text-3xl font-extrabold text-green-900 mt-1.5 mb-1">{modes['sale']?.count ?? 0}</p>
                                <span className="text-xs text-green-700 font-medium">Pangan diskon cepat terserap warga</span>
                            </div>
                            <div className="p-4 sm:p-5 bg-purple-50 rounded-2xl border border-purple-200">
                                <span className="text-xs font-bold text-purple-800 uppercase tracking-wide">Barter Pangan</span>
                                <p className="text-2xl sm:text-3xl font-extrabold text-purple-900 mt-1.5 mb-1">{modes['barter']?.count ?? 0}</p>
                                <span className="text-xs text-purple-700 font-medium">Tukar hasil bumi tanpa uang tunai</span>
                            </div>
                            <div className="p-4 sm:p-5 bg-blue-50 rounded-2xl border border-blue-200">
                                <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Donasi Sosial</span>
                                <p className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-1.5 mb-1">{modes['donation']?.count ?? 0}</p>
                                <span className="text-xs text-blue-700 font-medium">Bantuan untuk keluarga prasejahtera</span>
                            </div>
                            <div className="p-4 sm:p-5 bg-amber-50 rounded-2xl border border-amber-200">
                                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Alih Mitra Pengolah</span>
                                <p className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1.5 mb-1">{modes['partner_transfer']?.count ?? 0}</p>
                                <span className="text-xs text-amber-700 font-medium">Pakan ternak & kompos ramah lingkungan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sebaran Data per Desa */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 md:p-10 shadow-xs">
                <div className="flex items-center gap-2.5 mb-1.5">
                    <Building size={22} className="text-emerald-600 flex-shrink-0" />
                    <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-gray-900">
                        Kontribusi Penyelamatan per Wilayah Desa
                    </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-6">
                    Akumulasi kilogram makanan yang berhasil dicegah terbuang berdasarkan wilayah administratif desa
                </p>

                {villages.length > 0 ? (
                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                        {villages.map((v, idx) => (
                            <div key={v.desa} className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 transition">
                                <div className="flex items-center gap-3.5">
                                    <span className="w-8 h-8 rounded-xl bg-green-100 text-green-800 font-bold text-xs sm:text-sm flex items-center justify-center border border-green-200">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm sm:text-base">{v.desa}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{v.count} aktivitas transaksi berhasil</p>
                                    </div>
                                </div>
                                <span className="font-extrabold text-green-800 text-sm sm:text-base bg-green-50 px-3.5 py-1.5 rounded-xl border border-green-200">
                                    {v.weight_kg} kg
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic py-8 text-center bg-gray-50 rounded-2xl">Belum ada data wilayah tersimpan.</p>
                )}
            </div>

            {/* Pilar Dampak Ekosistem Desa */}
            <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 sm:p-8 md:p-10 shadow-xs">
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Pilar Utama Dampak Sirkularitas Desa
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
                        Enam pilar keberlanjutan yang menjadi landasan platform Replate dalam mewujudkan ketahanan pangan desa.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <span className="text-3xl mb-3 block select-none">
                                🍚
                            </span>
                            <h3 className="font-bold text-gray-900 text-base mb-2">Ketahanan Pangan Warga</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Mendistribusikan kelebihan makanan layak santap ke keluarga rentan melalui donasi dan harga diskon terjangkau.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <span className="text-3xl mb-3 block select-none">
                                ⚡
                            </span>
                            <h3 className="font-bold text-gray-900 text-base mb-2">Sistem Sirkular Cepat</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Menerapkan teknologi timeout otomatis berjenjang agar pangan terserap maksimal sebelum kualitasnya menurun.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <span className="text-3xl mb-3 block select-none">
                                🌾
                            </span>
                            <h3 className="font-bold text-gray-900 text-base mb-2">Pakan Ternak & Pupuk Organik</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Sisa pangan yang tidak habis dialihkan ke mitra peternak & pengomposan untuk menyuburkan pertanian desa.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <span className="text-3xl mb-3 block select-none">
                                ♻️
                            </span>
                            <h3 className="font-bold text-gray-900 text-base mb-2">Desa Bebas Beban TPA</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Mengurangi volume sampah basah yang diangkut ke TPA melalui sirkulasi mandiri di tingkat RT dan RW.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <span className="text-3xl mb-3 block select-none">
                                🌍
                            </span>
                            <h3 className="font-bold text-gray-900 text-base mb-2">Pencegahan Emisi Karbon</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Mencegah terbentuknya gas metana berbahaya dari tumpukan sampah sisa makanan yang membusuk di alam terbuka.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <span className="text-3xl mb-3 block select-none">
                                🤝
                            </span>
                            <h3 className="font-bold text-gray-900 text-base mb-2">Ekonomi Mandiri & Gotong Royong</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Kolaborasi produktif antara warga, warung UMKM, kelompok tani, peternak lokal, dan pengelola BUMDes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Card */}
            <div className="bg-emerald-900 border border-emerald-800 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">
                    Mari Berkolaborasi Mewujudkan Desa Nol Sampah Pangan
                </h2>
                <p className="text-green-100 max-w-xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
                    Setiap transaksi dan partisipasi Anda tercatat secara transparan untuk masa depan lingkungan desa yang lebih asri.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/marketplace"
                        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-green-900 font-bold rounded-xl hover:bg-green-50 transition shadow-md text-sm sm:text-base"
                    >
                        Jelajahi Marketplace
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        href="/impact/report"
                        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700 transition border border-emerald-700 text-sm sm:text-base"
                    >
                        <FileText size={18} /> Unduh Laporan ESG
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Impact({ impact, topContributors = [] }) {
    return (
        <NavbarLayout>
            <Head title="Transparansi & Dampak Lingkungan — Replate" />
            <ImpactContent impact={impact} topContributors={topContributors} />
        </NavbarLayout>
    );
}
