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
    Check,
    TrendingUp,
    Menu,
    X,
    Receipt,
    HelpCircle,
} from 'lucide-react';

function FeatureCard({ icon: Icon, title, description, color }) {
    const colors = {
        green: { text: 'text-green-600' },
        violet: { text: 'text-purple-600' },
        sky: { text: 'text-blue-600' },
        amber: { text: 'text-amber-600' },
    };
    const c = colors[color] || colors.green;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 hover:shadow-lg hover:border-gray-300 transition-all flex flex-col justify-between">
            <div>
                <div className="mb-4">
                    <Icon size={28} className={c.text} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2.5">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function StepCard({ number, title, description }) {
    return (
        <div className="flex gap-4 sm:gap-5 items-start bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs hover:border-green-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm">
                {number}
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function TargetCard({ icon: Icon, title, desc }) {
    return (
        <div className="flex items-start gap-3.5 p-5 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
            <Icon size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-base font-bold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

export default function Welcome({ auth, impact }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const navLinks = [
        { label: 'Beranda', href: '/' },
        { label: 'Marketplace', href: '/marketplace', icon: ShoppingBasket },
        { label: 'Dampak Desa', href: '/impact', icon: Leaf },
        { label: 'Laporan ESG', href: '/impact/report', icon: Receipt },
        { label: 'Peringkat Warga', href: '/leaderboard', icon: Trophy },
        { label: 'FAQ', href: '/faq', icon: HelpCircle },
    ];

    return (
        <>
            <Head title="Replate — Dari Sisa Menjadi Sinergi | Digitalisasi Pangan Desa Berkelanjutan" />

            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs print:hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <img
                                    src="/image/logo(2).png"
                                    alt="Replate"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = '/image/logo.png';
                                    }}
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
                            {navLinks.map((link) => {
                                const active = link.href === '/';
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-sm transition-colors duration-150 flex items-center gap-1.5 py-1 ${
                                            active
                                                ? 'text-emerald-700 font-bold'
                                                : 'text-gray-600 hover:text-emerald-600 font-medium'
                                        }`}
                                    >
                                        {link.icon && (
                                            <link.icon
                                                size={16}
                                                className={active ? 'text-emerald-700' : 'text-gray-400'}
                                            />
                                        )}
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center gap-4">
                            {isInstallable && (
                                <button
                                    onClick={handleInstallApp}
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-emerald-50 transition"
                                >
                                    <Download size={14} /> Install App
                                </button>
                            )}

                            {auth?.user ? (
                                <div className="flex items-center gap-3">
                                    {auth.user.points > 0 && (
                                        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200">
                                            🪙 {auth.user.points} RePoin
                                        </span>
                                    )}
                                    <Link
                                        href="/dashboard"
                                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition shadow-xs"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        className="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition-colors py-1"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition shadow-xs"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Dropdown Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 bg-white px-5 pt-3 pb-4 space-y-2 shadow-md">
                            {navLinks.map((link) => {
                                const active = link.href === '/';
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block py-1.5 text-sm transition-colors ${
                                            active
                                                ? 'text-emerald-700 font-bold'
                                                : 'text-gray-700 hover:text-emerald-600 font-medium'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gray-50 border-b border-gray-200">
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Left Text */}
                            <div className="lg:col-span-7">
                                <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                                    Dari Sisa <span className="text-green-600">Menjadi Sinergi</span>
                                </h1>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                                    Replate menghubungkan rumah tangga, warung makan, petani lokal, dan BUMDes dalam satu ekosistem
                                    digital terpadu untuk mencegah sampah makanan melalui inovasi <strong className="text-gray-900 font-bold">Jual Beli Murah</strong>, <strong className="text-gray-900 font-bold">Barter Hasil Bumi</strong>, <strong className="text-gray-900 font-bold">Donasi Cepat</strong>, dan <strong className="text-gray-900 font-bold">Pengalihan Pakan & Kompos</strong>.
                                </p>
                                <div className="flex flex-wrap gap-3.5">
                                    <Link href="/register" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-md active:scale-[0.98]">
                                        Mulai Sekarang
                                        <ArrowRight size={18} />
                                    </Link>
                                    <Link href="/marketplace" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-800 font-bold rounded-xl border border-gray-300 hover:bg-gray-100 transition active:scale-[0.98]">
                                        Jelajahi Marketplace
                                    </Link>
                                    <Link href="/impact" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-100 text-emerald-900 font-bold rounded-xl border border-emerald-300 hover:bg-emerald-200 transition active:scale-[0.98]">
                                        <Leaf size={17} className="text-emerald-700" /> Data Transparansi
                                    </Link>
                                </div>
                            </div>

                            {/* Right App Mockup / Card */}
                            <div className="lg:col-span-5">
                                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-7 space-y-5">
                                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-red-500" />
                                            <span className="w-3 h-3 rounded-full bg-amber-500" />
                                            <span className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="text-xs font-bold text-gray-800 ml-2">Transparansi Desa Terintegrasi</span>
                                        </div>
                                    </div>

                                    {/* Preview mini metrics with clean solid styling */}
                                    <div className="grid grid-cols-2 gap-3.5">
                                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                            <p className="text-xs text-gray-600 font-bold">Food Waste Dicegah</p>
                                            <p className="text-2xl font-extrabold text-green-800 mt-1">{stats.weightKg} kg</p>
                                            <p className="text-xs text-gray-500 mt-1">≈ {stats.meals} porsi makanan</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                            <p className="text-xs text-gray-600 font-bold">Emisi CO₂ Ditekan</p>
                                            <p className="text-2xl font-extrabold text-blue-800 mt-1">{stats.co2Kg} kg</p>
                                            <p className="text-xs text-gray-500 mt-1">Reduksi gas metana TPA</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                            <p className="text-xs text-gray-600 font-bold">Komunitas Aktif</p>
                                            <p className="text-2xl font-extrabold text-purple-800 mt-1">{stats.totalUsers} Warga</p>
                                            <p className="text-xs text-gray-500 mt-1">Rumah tangga & mitra</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                            <p className="text-xs text-gray-600 font-bold">Transaksi Sukses</p>
                                            <p className="text-2xl font-extrabold text-amber-800 mt-1">{stats.completedTx}</p>
                                            <p className="text-xs text-gray-500 mt-1">Jual, barter & donasi</p>
                                        </div>
                                    </div>

                                    <Link href="/impact" className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-sm">
                                        Lihat Laporan Lengkap Dampak Desa <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-time Impact Banner with Spacious Margin & Solid Palette */}
                <section className="bg-green-700 text-white shadow-md my-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="p-2">
                                <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">{stats.weightKg} kg</p>
                                <p className="text-xs md:text-sm text-green-100 mt-2 font-semibold">Food Waste Dicegah</p>
                            </div>
                            <div className="p-2">
                                <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">{stats.co2Kg} kg</p>
                                <p className="text-xs md:text-sm text-green-100 mt-2 font-semibold">Emisi CO₂ Ekuivalen Ditekan</p>
                            </div>
                            <div className="p-2">
                                <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">{stats.meals}</p>
                                <p className="text-xs md:text-sm text-green-100 mt-2 font-semibold">Porsi Pangan Tersalurkan</p>
                            </div>
                            <div className="p-2">
                                <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">{stats.totalUsers}</p>
                                <p className="text-xs md:text-sm text-green-100 mt-2 font-semibold">Warga & Mitra Terlibat</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4 Jalur Pemanfaatan */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <div className="mb-10 text-left">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            Empat Jalur Penyelamatan Pangan
                        </h2>
                        <p className="text-gray-600 max-w-2xl text-sm md:text-base leading-relaxed">
                            Setiap bahan makanan memiliki jalurnya masing-masing untuk menjamin zero food waste di tingkat desa secara berkelanjutan.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={ShoppingBasket}
                            title="Jual-Beli Murah"
                            description="Pangan berlebih yang masih sangat layak dijual dengan potongan harga hingga 25% agar cepat terserap warga."
                            color="green"
                        />
                        <FeatureCard
                            icon={ArrowLeftRight}
                            title="Barter Digital"
                            description="Tukar hasil kebun, panen berlebih, atau sembako dengan tetangga tanpa memerlukan transaksi uang tunai."
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
                            description="Sisa makanan yang melewati batas waktu aman otomatis dialihkan ke peternak (pakan) dan budidaya maggot/kompos."
                            color="amber"
                        />
                    </div>
                </section>

                {/* Cara Kerja Timeout Otomatis */}
                <section id="cara-kerja" className="bg-gray-50 border-y border-gray-200 py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                            <div className="lg:col-span-5 text-left">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                                    Mekanisme Timeout Otomatis
                                </h2>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                                    Sistem berbasis waktu cerdas yang menjamin makanan tidak membusuk sia-sia di tempat sampah melalui penurunan harga berkala dan alih fungsi cepat.
                                </p>
                                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-green-600 flex-shrink-0" size={20} />
                                        <span className="text-sm font-bold text-gray-900">Perhitungan Waktu Presisi</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Setiap produk yang diunggah diberi batas waktu aman. Jika mendekati kedaluwarsa, alur otomatis langsung mengaktifkan diskon, donasi, hingga pakan ternak.
                                    </p>
                                </div>
                            </div>
                            <div className="lg:col-span-7 space-y-4">
                                <StepCard
                                    number="1"
                                    title="Unggah Produk & Penentuan Kondisi"
                                    description="Warga mengunggah foto makanan, memilih kondisi (Siap Konsumsi / Perlu Diolah / Pakan Ternak), dan sistem mulai menghitung masa aman konsumsi."
                                />
                                <div className="ml-8 h-3 border-l-2 border-dashed border-green-400" />
                                <StepCard
                                    number="2"
                                    title="Diskon Otomatis (Tahap 1)"
                                    description="Jika mendekati masa kedaluwarsa produk belum laku, sistem otomatis memotong harga 25% untuk mempercepat penyerapan warga lokal."
                                />
                                <div className="ml-8 h-3 border-l-2 border-dashed border-amber-400" />
                                <StepCard
                                    number="3"
                                    title="Jalur Donasi Cepat (Tahap 2)"
                                    description="Jika masih belum terserap, produk beralih otomatis ke jalur donasi gratis yang bisa langsung diklaim warga prasejahtera."
                                />
                                <div className="ml-8 h-3 border-l-2 border-dashed border-orange-400" />
                                <StepCard
                                    number="4"
                                    title="Alih Fungsi ke Peternak & Kompos (Tahap 3)"
                                    description="Produk yang telah melewati batas aman konsumsi manusia otomatis dialihkan sebagai pakan ternak atau bahan kompos mitra desa."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Target Stakeholders */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <div className="mb-10 text-left">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            Ekosistem Kolaboratif Desa
                        </h2>
                        <p className="text-gray-600 max-w-2xl text-sm md:text-base leading-relaxed">
                            Menghubungkan seluruh elemen masyarakat dalam satu rantai sirkular terpadu yang saling menguntungkan.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <TargetCard icon={Home} title="Rumah Tangga" desc="Jual atau barter sisa belanjaan dapur yang masih layak tanpa terbuang sia-sia." />
                        <TargetCard icon={UtensilsCrossed} title="Warung & Katering" desc="Salurkan porsi makanan berlebih harian agar tetap bernilai ekonomis atau berfaedah." />
                        <TargetCard icon={Store} title="Toko Kelontong" desc="Jual produk mendekati masa kedaluwarsa dengan diskon sebelum mengalami kerugian." />
                        <TargetCard icon={Sprout} title="Petani Lokal" desc="Tukar hasil panen melimpah dengan aneka kebutuhan dapur tetangga secara adil." />
                        <TargetCard icon={Users} title="Peternak & Pembudidaya" desc="Dapatkan pasokan pakan ternak dan maggot organik secara konsisten tanpa biaya mahal." />
                        <TargetCard icon={Building} title="Pemerintah Desa & BUMDes" desc="Pantau transparansi sirkularitas dan metrik ketahanan pangan desa secara real-time." />
                    </div>
                </section>

                {/* Bagian Dampak Desa - Margin & Spacing yang Luas, Rapi, Tanpa Opacity Berlebih */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 py-12 md:py-16">
                    <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-8 sm:p-12 md:p-16 shadow-sm">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                            <div className="text-left">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                                    Dampak Nyata Ekonomi & Lingkungan
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
                                    Sinergi digitalisasi pangan desa menciptakan dampak terukur pada ketahanan pangan, reduksi emisi, dan peningkatan ekonomi warga.
                                </p>
                            </div>
                            <Link
                                href="/impact"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition shadow-sm flex-shrink-0"
                            >
                                <Leaf size={16} /> Lihat Analisis Lengkap Dampak
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col items-start text-left justify-between">
                                <div className="w-full text-left">
                                    <span className="text-4xl mb-4 block select-none">
                                        🍽️
                                    </span>
                                    <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-2">Ketahanan Pangan</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Menyalurkan kelebihan makanan layak santap langsung ke warga yang membutuhkan secara cepat dan tepat sasaran.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col items-start text-left justify-between">
                                <div className="w-full text-left">
                                    <span className="text-4xl mb-4 block select-none">
                                        🌱
                                    </span>
                                    <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-2">Pakan & Pupuk Alami</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Sisa pangan diolah jadi pakan ternak gratis & kompos penyubur tanaman kebun warga serta kelompok tani.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col items-start text-left justify-between">
                                <div className="w-full text-left">
                                    <span className="text-4xl mb-4 block select-none">
                                        ♻️
                                    </span>
                                    <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-2">Desa Bebas Sampah TPA</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Mengurangi beban timbunan sampah organik di desa melalui sistem sirkulasi mandiri antarwarga dan mitra.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col items-start text-left justify-between">
                                <div className="w-full text-left">
                                    <span className="text-4xl mb-4 block select-none">
                                        🌍
                                    </span>
                                    <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-2">Cegah Emisi Metana</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Mencegah pelepasan gas rumah kaca berbahaya akibat pembusukan sampah makanan yang menumpuk di pembuangan terbuka.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Bergabung */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <div className="bg-emerald-900 border border-emerald-800 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-lg">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
                            Mari Jadi Bagian dari Desa Nol Sampah Makanan
                        </h2>
                        <p className="text-green-100 max-w-xl mx-auto text-sm md:text-base mb-8 leading-relaxed">
                            Kumpulkan RePoin dari setiap aksi penyelamatan makanan dan jadilah Pahlawan Pangan di desamu.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-green-900 font-bold rounded-xl hover:bg-green-50 transition shadow-md">
                                Daftar Sebagai Warga
                                <ChevronRight size={18} />
                            </Link>
                            <Link href="/leaderboard" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700 transition border border-emerald-700">
                                <Trophy size={18} className="text-amber-300" /> Lihat Peringkat Warga
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                            <div className="md:col-span-2">
                                <Link href="/">
                                    <img
                                        src="/image/logo(2).png"
                                        alt="Replate"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = '/image/logo.png';
                                        }}
                                        className="h-10 rounded-lg object-contain mb-4"
                                    />
                                </Link>
                                <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
                                    Platform digital circular economy untuk digitalisasi pengelolaan sumber daya pangan desa menuju kemandirian pangan dan lingkungan berkelanjutan.
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Eksplorasi</p>
                                <div className="space-y-2.5 text-sm text-gray-300">
                                    <Link href="/marketplace" className="block hover:text-green-400 transition">Marketplace Pangan</Link>
                                    <Link href="/impact" className="block hover:text-green-400 transition">Portal Dampak Desa</Link>
                                    <Link href="/impact/report" className="block hover:text-green-400 transition">Laporan ESG</Link>
                                    <Link href="/leaderboard" className="block hover:text-green-400 transition">Papan Peringkat Warga</Link>
                                    <Link href="/faq" className="block hover:text-green-400 transition">Pusat Bantuan & FAQ</Link>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Inovasi Desa</p>
                                <p className="text-xs text-gray-300 leading-relaxed">
                                    Terintegrasi dengan sistem timeout otomatis, mitigasi risiko dispute, barter digital, serta keterlibatan aktif kelompok tani dan BUMDes lokal.
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-400">
                            © 2026 Replate — Platform Digitalisasi Pemanfaatan Sumber Daya & Food Waste Desa.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}