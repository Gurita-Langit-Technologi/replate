import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ShoppingBasket,
    ArrowLeftRight,
    Heart,
    Handshake,
    Clock,
    BarChart3,
    ArrowRight,
    ChevronRight,
    Home,
    UtensilsCrossed,
    Sprout,
    Users,
    Store,
    Building,
    Leaf,
    Scale,
    Shield,
    MapPin,
    Trophy,
    Award,
    Download,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';

function FeatureCard({ icon: Icon, title, description, color }) {
    const colors = {
        green:  'bg-green-50  text-green-700  border-green-100',
        violet: 'bg-violet-50 text-violet-700 border-violet-100',
        sky:    'bg-sky-50    text-sky-700    border-sky-100',
        amber:  'bg-amber-50  text-amber-700  border-amber-100',
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

function StepCard({ number, title, description }) {
    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md shadow-green-600/20">
                {number}
            </div>
            <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function TargetCard({ icon: Icon, title, desc }) {
    return (
        <div className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-700 flex-shrink-0 border border-green-100">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-bold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
        </div>
    );
}

export default function Welcome({ auth, impact }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallApp = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstallable(false);
        }
        setDeferredPrompt(null);
    };

    const stats = {
        weightKg: impact?.total_weight_kg ?? 0,
        co2Kg: impact?.total_co2_kg ?? 0,
        meals: impact?.total_meals_saved ?? 0,
        completedTx: impact?.total_completed_tx ?? 0,
        totalUsers: (impact?.total_users ?? 0) + (impact?.total_partners ?? 0),
        economicValue: impact?.total_economic_value ?? 0,
    };

    return (
        <>
            <Head title="Replate — Dari Sisa Menjadi Sinergi | Digitalisasi Pangan Desa Berkelanjutan" />

            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <img src="/image/logo(2).png" alt="Replate" className="w-auto h-11 rounded-lg object-cover" />
                        </div>

                        {/* Menu Navigasi Tengah */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#cara-kerja" className="text-sm font-medium text-gray-600 hover:text-green-600 transition">Cara Kerja</a>
                            <Link href="/marketplace" className="text-sm font-medium text-gray-600 hover:text-green-600 transition">Marketplace</Link>
                            <Link href="/impact" className="text-sm font-medium text-gray-600 hover:text-green-600 transition flex items-center gap-1">
                                <Leaf size={14} className="text-green-600" />
                                Dampak Desa
                            </Link>
                            <Link href="/leaderboard" className="text-sm font-medium text-gray-600 hover:text-green-600 transition flex items-center gap-1">
                                <Trophy size={14} className="text-amber-500" />
                                Peringkat Warga
                            </Link>
                            <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-green-600 transition">FAQ</Link>
                        </div>

                        <div className="flex items-center gap-3">
                            {isInstallable && (
                                <button
                                    onClick={handleInstallApp}
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-xl border border-green-200 hover:bg-green-100 transition"
                                >
                                    <Download size={14} /> Install App
                                </button>
                            )}

                            {auth?.user ? (
                                <Link href="/dashboard" className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition shadow-sm">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                                        Masuk
                                    </Link>
                                    <Link href="/register" className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition shadow-sm">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gray-50/70 border-b border-gray-100">
                    <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Text */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-6 border border-green-200 shadow-sm">
                                    <Sparkles size={13} className="text-green-700" />
                                    Platform Digital Circular Economy & Nol Sampah Desa
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                                    Dari Sisa <span className="text-green-600">Menjadi Sinergi</span>
                                </h1>
                                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
                                    Replate menghubungkan rumah tangga, warung makan, petani, dan BUMDes dalam satu ekosistem
                                    digital untuk mencegah sampah makanan melalui **Jual Beli Murah, Barter Hasil Bumi, Donasi,
                                    dan Pengalihan Pakan Kompos**.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link href="/register" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/20 active:scale-[0.98]">
                                        Mulai Sekarang
                                        <ArrowRight size={18} />
                                    </Link>
                                    <Link href="/marketplace" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition active:scale-[0.98]">
                                        Jelajahi Marketplace
                                    </Link>
                                    <Link href="/impact" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-50 text-emerald-800 font-semibold rounded-xl border border-emerald-200 hover:bg-emerald-100 transition active:scale-[0.98]">
                                        <Leaf size={16} /> Data Transparansi
                                    </Link>
                                </div>
                            </div>

                            {/* Right App Mockup / Card */}
                            <div className="hidden lg:block">
                                <div className="bg-white rounded-3xl shadow-2xl shadow-green-900/10 border border-gray-100 p-6 space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-red-400" />
                                            <span className="w-3 h-3 rounded-full bg-amber-400" />
                                            <span className="w-3 h-3 rounded-full bg-green-400" />
                                            <span className="text-xs font-semibold text-gray-600 ml-2">Transparansi Desa Live</span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Real-time
                                        </span>
                                    </div>

                                    {/* Preview mini metrics */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                                            <p className="text-xs text-green-700 font-medium">Food Waste Terselamatkan</p>
                                            <p className="text-2xl font-black text-green-800 mt-1">{stats.weightKg} kg</p>
                                            <p className="text-[10px] text-green-600 mt-0.5">≈ {stats.meals} porsi makanan</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                                            <p className="text-xs text-sky-700 font-medium">Emisi CO₂ Dicegah</p>
                                            <p className="text-2xl font-black text-sky-800 mt-1">{stats.co2Kg} kg</p>
                                            <p className="text-[10px] text-sky-600 mt-0.5">Reduksi gas metana TPA</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                                            <p className="text-xs text-violet-700 font-medium">Komunitas Aktif</p>
                                            <p className="text-2xl font-black text-violet-800 mt-1">{stats.totalUsers} Warga</p>
                                            <p className="text-[10px] text-violet-600 mt-0.5">Rumah tangga, warung & mitra</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                            <p className="text-xs text-amber-700 font-medium">Transaksi Sukses</p>
                                            <p className="text-2xl font-black text-amber-800 mt-1">{stats.completedTx}</p>
                                            <p className="text-[10px] text-amber-600 mt-0.5">Jual, barter & donasi</p>
                                        </div>
                                    </div>

                                    <Link href="/impact" className="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-800 transition">
                                        Lihat Laporan Lengkap Dampak Desa <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-time Impact Banner */}
                <section className="bg-green-700 text-white shadow-inner">
                    <div className="max-w-6xl mx-auto px-4 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-3xl md:text-4xl font-extrabold tracking-tight">{stats.weightKg} kg</p>
                                <p className="text-xs md:text-sm text-green-100 mt-1 font-medium">Food Waste Dicegah</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-extrabold tracking-tight">{stats.co2Kg} kg</p>
                                <p className="text-xs md:text-sm text-green-100 mt-1 font-medium">Emisi CO₂ Ekuivalen Ditekan</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-extrabold tracking-tight">{stats.meals}</p>
                                <p className="text-xs md:text-sm text-green-100 mt-1 font-medium">Porsi Pangan Tersalurkan</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-extrabold tracking-tight">{stats.totalUsers}</p>
                                <p className="text-xs md:text-sm text-green-100 mt-1 font-medium">Warga & Mitra Terlibat</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4 Jalur Pemanfaatan */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Empat Jalur Penyelamatan Pangan</h2>
                        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
                            Setiap bahan makanan memiliki jalurnya masing-masing untuk menjamin zero food waste di tingkat desa.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <FeatureCard
                            icon={ShoppingBasket}
                            title="Jual-Beli Murah"
                            description="Pangan berlebih yang masih sangat layak dijual dengan potongan harga hingga 25% agar cepat terserap."
                            color="green"
                        />
                        <FeatureCard
                            icon={ArrowLeftRight}
                            title="Barter Digital"
                            description="Tukar hasil kebun, panen berlebih, atau sembako dengan tetangga tanpa menggunakan uang tunai."
                            color="violet"
                        />
                        <FeatureCard
                            icon={Heart}
                            title="Donasi Kemanusiaan"
                            description="Salurkan makanan berlebih secara gratis langsung kepada keluarga yang membutuhkan atau panti asuhan."
                            color="sky"
                        />
                        <FeatureCard
                            icon={Handshake}
                            title="Alih Fungsi Mitra"
                            description="Sisa makanan yang melewati batas waktu otomatis dialihkan ke peternak (pakan) dan pembudidaya maggot/kompos."
                            color="amber"
                        />
                    </div>
                </section>

                {/* Cara Kerja Timeout Otomatis */}
                <section id="cara-kerja" className="bg-gray-50/80 border-y border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Mekanisme Timeout Otomatis</h2>
                            <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
                                Sistem berbasis waktu menjamin makanan tidak membusuk sia-sia
                            </p>
                        </div>
                        <div className="max-w-2xl mx-auto space-y-6">
                            <StepCard number="1" title="Upload Produk & Penentuan Kondisi" description="Warga mengunggah foto makanan, memilih kondisi (Siap Konsumsi / Perlu Diolah / Pakan Ternak), dan sistem mulai menghitung masa aman." />
                            <div className="ml-5 h-5 border-l-2 border-dashed border-green-300" />
                            <StepCard number="2" title="Diskon Otomatis (Stage 1)" description="Jika mendekati masa kadaluwarsa belum laku, sistem otomatis mendiskon harga 25% untuk mempercepat penyerapan." />
                            <div className="ml-5 h-5 border-l-2 border-dashed border-amber-300" />
                            <StepCard number="3" title="Jalur Donasi Cepat (Stage 2)" description="Jika masih belum terserap, produk beralih ke jalur donasi gratis yang bisa langsung diklaim warga prasejahtera." />
                            <div className="ml-5 h-5 border-l-2 border-dashed border-orange-300" />
                            <StepCard number="4" title="Alih Fungsi ke Peternak & Kompos (Stage 3)" description="Produk yang melewati batas aman manusia otomatis dialihkan sebagai pakan ternak / bahan baku kompos mitra desa." />
                        </div>
                    </div>
                </section>

                {/* Target Stakeholders */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Ekosistem Kolaboratif Desa</h2>
                        <p className="text-gray-500 max-w-xl mx-auto text-sm">
                            Menghubungkan seluruh elemen masyarakat dalam satu platform sirkular terpadu
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <TargetCard icon={Home} title="Rumah Tangga" desc="Jual atau barter sisa belanjaan dapur yang masih layak" />
                        <TargetCard icon={UtensilsCrossed} title="Warung & Katering" desc="Salurkan porsi makanan berlebih harian agar bermanfaat" />
                        <TargetCard icon={Store} title="Toko Kelontong" desc="Jual produk mendekati masa kedaluwarsa dengan diskon" />
                        <TargetCard icon={Sprout} title="Petani Lokal" desc="Tukar hasil panen melimpah dengan kebutuhan dapur tetangga" />
                        <TargetCard icon={Users} title="Peternak & Pembudidaya" desc="Dapatkan pasokan pakan ternak dan maggot tanpa biaya" />
                        <TargetCard icon={Building} title="Pemerintah Desa & BUMDes" desc="Pantau transparansi sirkularitas dan data ketahanan pangan desa" />
                    </div>
                </section>

                {/* Dampak Nyata Komunitas */}
                <section className="max-w-6xl mx-auto px-4 py-16">
                    <div className="bg-emerald-50/50 rounded-3xl border border-emerald-200/80 p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                                    Manfaat Nyata untuk Desa
                                </span>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">Dampak Nyata Ekonomi & Lingkungan</h2>
                            </div>
                            <Link href="/impact" className="btn-primary flex-shrink-0">
                                <Leaf size={16} /> Lihat Analisis Lengkap Dampak
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm mb-2">🍽️</div>
                                <p className="font-bold text-gray-900 text-sm">Ketahanan Pangan</p>
                                <p className="text-xs text-gray-500 mt-1">Menyalurkan kelebihan makanan layak santap langsung ke warga yang membutuhkan.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm mb-2">🌱</div>
                                <p className="font-bold text-gray-900 text-sm">Pakan & Pupuk Alami</p>
                                <p className="text-xs text-gray-500 mt-1">Sisa pangan diolah jadi pakan ternak gratis & kompos penyubur tanaman kebun.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm mb-2">♻️</div>
                                <p className="font-bold text-gray-900 text-sm">Desa Bebas Sampah TPA</p>
                                <p className="text-xs text-gray-500 mt-1">Mengurangi beban timbunan sampah organik di desa melalui sirkulasi mandiri.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2">🌍</div>
                                <p className="font-bold text-gray-900 text-sm">Cegah Emisi Metana</p>
                                <p className="text-xs text-gray-500 mt-1">Mencegah gas rumah kaca berbahaya dari pembusukan sampah di tempat pembuangan.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Bergabung */}
                <section className="max-w-6xl mx-auto px-4 py-16">
                    <div className="bg-emerald-900 border border-emerald-800 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden shadow-md">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Mari Jadi Bagian dari Desa Nol Sampah Makanan</h2>
                        <p className="text-green-100 max-w-xl mx-auto text-sm md:text-base mb-8">
                            Kumpulkan RePoin dari setiap aksi penyelamatan makanan dan jadilah Pahlawan Pangan di desamu.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition shadow-lg">
                                Daftar Sebagai Warga
                                <ChevronRight size={18} />
                            </Link>
                            <Link href="/leaderboard" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-750 transition border border-emerald-700">
                                <Trophy size={18} className="text-amber-300" /> Lihat Peringkat Warga
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white border-t border-gray-800">
                    <div className="max-w-6xl mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div className="md:col-span-2">
                                <img src="/image/logo(2).png" alt="Replate" className="h-9 rounded-lg object-cover mb-3" />
                                <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                                    Platform digital circular economy untuk digitalisasi pengelolaan sumber daya pangan desa menuju kemandirian berkelanjutan.
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Eksplorasi</p>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <Link href="/marketplace" className="block hover:text-green-400 transition">Marketplace Pangan</Link>
                                    <Link href="/impact" className="block hover:text-green-400 transition">Portal Dampak Desa</Link>
                                    <Link href="/leaderboard" className="block hover:text-green-400 transition">Papan Peringkat Warga</Link>
                                    <Link href="/faq" className="block hover:text-green-400 transition">Pusat Bantuan & FAQ</Link>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Inovasi Desa</p>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Terintegrasi dengan sistem timeout otomatis, mitigasi risiko dispute, barter digital, dan keterlibatan BUMDes lokal.
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
                            © 2026 Replate — Platform Digitalisasi Pemanfaatan Sumber Daya & Food Waste Desa.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}