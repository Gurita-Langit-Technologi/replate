import { Head, Link } from '@inertiajs/react';
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
} from 'lucide-react';

function FeatureCard({ icon: Icon, title, description, color }) {
    const colors = {
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

function StepCard({ number, title, description }) {
    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {number}
            </div>
            <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
}

function TargetCard({ icon: Icon, title, desc }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </div>
    );
}

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Replate — Dari Sisa Menjadi Sinergi" />

            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <img src="/image/logo(2).png" alt="Replate" className="w-auto h-12 rounded-lg object-cover" />
                        </div>

                        {/* Tambah ini di tengah */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#cara-kerja" className="text-sm text-gray-500 hover:text-gray-900 transition">Cara kerja</a>
                            <Link href="/marketplace" className="text-sm text-gray-500 hover:text-gray-900 transition">Marketplace</Link>
                        </div>

                        <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link href="/dashboard" className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                                        Masuk
                                    </Link>
                                    <Link href="/register" className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                </nav>

                {/* Hero — Two Column */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />
                    <div className="absolute top-20 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />

                    <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left — Text */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-6">
                                    <img src="/image/logo.png" alt="" className="w-4 h-4 rounded object-cover" />
                                    Platform Circular Economy Food Waste
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                                    Dari Sisa{' '}
                                    <span className="text-green-600">Menjadi Sinergi</span>
                                </h1>
                                <p className="text-lg text-gray-500 leading-relaxed mb-8">
                                    Replate menghubungkan penghasil food waste dengan pihak yang dapat memanfaatkannya
                                    melalui jual-beli, barter, donasi, dan kemitraan — memastikan tidak ada makanan
                                    yang berakhir menjadi sampah.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/20">
                                        Mulai sekarang
                                        <ArrowRight size={18} />
                                    </Link>
                                    <Link href="/marketplace" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                                        Lihat marketplace
                                    </Link>
                                </div>
                            </div>

                            {/* Right — App Preview */}
                            <div className="hidden lg:block">
                                <div className="bg-white rounded-2xl shadow-2xl shadow-green-900/10 border border-gray-200 overflow-hidden">
                                    {/* Mock browser bar */}
                                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                            <div className="w-3 h-3 rounded-full bg-green-400" />
                                        </div>
                                        <div className="flex-1 text-center">
                                            <span className="text-xs text-gray-400 bg-white px-4 py-1 rounded-lg border border-gray-100">replate.id/marketplace</span>
                                        </div>
                                    </div>
                                    {/* Mock app content */}
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <div className="h-5 w-28 bg-gray-900 rounded" />
                                                <div className="h-3 w-20 bg-gray-200 rounded mt-1.5" />
                                            </div>
                                            <div className="h-8 w-24 bg-green-600 rounded-lg" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { title: 'Nasi Kotak', price: 'Rp 75.000', badge: '🔄 Barter', color: 'bg-purple-50 text-purple-600' },
                                                { title: 'Sayuran Layu', price: 'Rp 8.000', badge: '💰 Jual', color: 'bg-green-50 text-green-600' },
                                                { title: 'Singkong 10kg', price: 'Barter', badge: '🔄 Barter', color: 'bg-purple-50 text-purple-600' },
                                            ].map((item, i) => (
                                                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                                                    <div className="h-20 bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
                                                        <Leaf size={24} className="text-green-300" />
                                                    </div>
                                                    <div className="p-2.5">
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${item.color}`}>{item.badge}</span>
                                                        <p className="text-xs font-medium text-gray-900 mt-1 truncate">{item.title}</p>
                                                        <p className="text-xs font-bold text-green-600 mt-0.5">{item.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-7 flex-1 bg-gray-100 rounded-lg" />
                                            <div className="h-7 w-16 bg-gray-100 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats — Concrete Numbers */}
                <section className="bg-green-600">
                    <div className="max-w-6xl mx-auto px-4 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-white">20+</p>
                                <p className="text-sm text-green-100 mt-1">Pengguna terdaftar</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-white">14</p>
                                <p className="text-sm text-green-100 mt-1">Produk tersedia</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-white">15+</p>
                                <p className="text-sm text-green-100 mt-1">Transaksi selesai</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-white">45kg</p>
                                <p className="text-sm text-green-100 mt-1">Waste terselamatkan</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Empat jalur, satu tujuan</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Setiap food waste punya jalur pemanfaatan yang sesuai — tidak ada yang terbuang sia-sia
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <FeatureCard icon={ShoppingBasket} title="Jual-beli" description="Jual food waste yang masih memiliki nilai guna kepada yang membutuhkan dengan harga terjangkau." color="green" />
                        <FeatureCard icon={ArrowLeftRight} title="Barter" description="Tukar food waste dengan hasil bumi atau produk lokal lainnya — tanpa perlu uang tunai." color="purple" />
                        <FeatureCard icon={Heart} title="Donasi" description="Berikan makanan yang masih layak kepada yang membutuhkan secara gratis." color="blue" />
                        <FeatureCard icon={Handshake} title="Kemitraan" description="Food waste yang tidak terjual otomatis disalurkan ke peternak, pengelola kompos, atau pembudidaya maggot." color="amber" />
                    </div>
                </section>

                {/* How it works */}
                <section id="cara-kerja" className="bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Cara kerja</h2>
                            <p className="text-gray-500 max-w-xl mx-auto">
                                Sistem timeout otomatis bertingkat memastikan setiap produk tersalurkan
                            </p>
                        </div>
                        <div className="max-w-2xl mx-auto space-y-8">
                            <StepCard number="1" title="Upload produk" description="Foto produk, pilih kondisi (layak konsumsi / layak olah / layak pakan-kompos), tentukan jumlah, satuan, dan mode transaksi." />
                            <div className="ml-5 h-6 border-l-2 border-dashed border-green-200" />
                            <StepCard number="2" title="Tayang di marketplace" description="Produk tampil berdasarkan filter lokasi desa/kecamatan. Timer timeout mulai berjalan otomatis." />
                            <div className="ml-5 h-6 border-l-2 border-dashed border-green-200" />
                            <StepCard number="3" title="Transaksi, barter, atau donasi" description="Pembeli bisa membeli langsung, mengajukan barter via chat, atau mengklaim donasi. Negosiasi barter fleksibel — bisa campur uang + barang." />
                            <div className="ml-5 h-6 border-l-2 border-dashed border-amber-200" />
                            <StepCard number="4" title="Timeout otomatis bertingkat" description="Mendekati batas waktu → harga turun 25%. Habis waktu → masuk jalur donasi. 24 jam tidak diklaim → dialihkan ke mitra pengolah sesuai kuota." />
                            <div className="ml-5 h-6 border-l-2 border-dashed border-green-200" />
                            <StepCard number="5" title="Zero waste — tersalurkan" description="Setiap produk dijamin tersalurkan melalui salah satu dari empat jalur. Tidak ada food waste yang berakhir menjadi sampah." />
                        </div>
                    </div>
                </section>

                {/* Target Users */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Untuk siapa?</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Replate menghubungkan seluruh elemen masyarakat desa dalam satu ekosistem
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <TargetCard icon={Home} title="Rumah tangga" desc="Jual atau barter sisa makanan yang masih layak" />
                        <TargetCard icon={UtensilsCrossed} title="Warung & restoran" desc="Salurkan sisa masakan harian agar tidak terbuang" />
                        <TargetCard icon={Store} title="Toko & minimarket" desc="Jual produk mendekati expired dengan harga diskon" />
                        <TargetCard icon={Sprout} title="Petani" desc="Barter hasil bumi berlebih dengan kebutuhan dapur" />
                        <TargetCard icon={Users} title="Peternak & pengolah" desc="Terima pakan ternak dan bahan kompos gratis" />
                        <TargetCard icon={Building} title="BUMDes" desc="Kelola platform sebagai motor ekonomi desa" />
                    </div>
                </section>

                {/* Unique Features */}
                <section className="bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Keunikan Replate</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                                <Clock size={28} className="text-amber-600 mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">Timeout bertingkat</h3>
                                <p className="text-sm text-gray-600">Tiga tahap jaring pengaman: diskon → donasi → mitra. Produk tidak mungkin terbuang.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
                                <ArrowLeftRight size={28} className="text-purple-600 mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">Barter digital</h3>
                                <p className="text-sm text-gray-600">Digitalisasi tradisi tukar-menukar desa. Negosiasi fleksibel via chat, bisa campur uang.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
                                <MapPin size={28} className="text-green-600 mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">BUMDes drop point</h3>
                                <p className="text-sm text-gray-600">Titipkan di pos desa, ambil nanti. Tidak perlu janjian atau ketemu langsung.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                                <BarChart3 size={28} className="text-blue-600 mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">Dampak terukur</h3>
                                <p className="text-sm text-gray-600">Dashboard dampak desa: kg terselamatkan, transaksi, kuota mitra, rasio keberhasilan.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SDGs + Dampak */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Kontribusi terhadap SDGs</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Replate mendukung pencapaian Sustainable Development Goals melalui inovasi digital untuk desa
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-5">
                            <p className="text-2xl font-bold text-green-600 mb-1">SDG 9</p>
                            <p className="text-sm font-medium text-gray-900 mb-1">Inovasi & Infrastruktur</p>
                            <p className="text-xs text-gray-500">Pemanfaatan teknologi digital untuk desa</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-5">
                            <p className="text-2xl font-bold text-green-600 mb-1">SDG 11</p>
                            <p className="text-sm font-medium text-gray-900 mb-1">Komunitas Berkelanjutan</p>
                            <p className="text-xs text-gray-500">Pengelolaan lingkungan berbasis masyarakat</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-5">
                            <p className="text-2xl font-bold text-green-600 mb-1">SDG 12</p>
                            <p className="text-sm font-medium text-gray-900 mb-1">Konsumsi Bertanggung Jawab</p>
                            <p className="text-xs text-gray-500">Penerapan circular economy pada food waste</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-5">
                            <p className="text-2xl font-bold text-green-600 mb-1">SDG 17</p>
                            <p className="text-sm font-medium text-gray-900 mb-1">Kemitraan</p>
                            <p className="text-xs text-gray-500">Penguatan kemitraan antar pemangku kepentingan</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Mari kurangi food waste bersama
                            </h2>
                            <p className="text-green-100 mb-8 max-w-xl mx-auto">
                                Setiap makanan yang diselamatkan adalah langkah menuju desa yang lebih mandiri dan berkelanjutan.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition shadow-lg">
                                    Bergabung sekarang
                                    <ChevronRight size={18} />
                                </Link>
                                <Link href="/marketplace" className="inline-flex items-center gap-2 px-8 py-4 bg-green-700/50 text-white font-semibold rounded-xl hover:bg-green-700/70 transition border border-green-400/30">
                                    Jelajahi marketplace
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900">
                    <div className="max-w-6xl mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <img src="/image/logo.png" alt="Replate" className="w-8 h-8 rounded-lg object-cover" />
                                    <span className="font-bold text-white text-lg">Replate</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                                    Platform digital berbasis circular economy untuk mengoptimalkan pemanfaatan food waste dalam mendukung kemandirian desa berkelanjutan.
                                </p>
                            </div>

                            {/* Navigasi */}
                            <div>
                                <p className="text-sm font-semibold text-white mb-3">Platform</p>
                                <div className="space-y-2">
                                    <Link href="/marketplace" className="block text-sm text-gray-400 hover:text-green-400 transition">Marketplace</Link>
                                    <Link href="/register" className="block text-sm text-gray-400 hover:text-green-400 transition">Daftar akun</Link>
                                    <Link href="/login" className="block text-sm text-gray-400 hover:text-green-400 transition">Masuk</Link>
                                    <a href="#cara-kerja" className="block text-sm text-gray-400 hover:text-green-400 transition">Cara kerja</a>
                                </div>
                            </div>

                            {/* Info */}
                            <div>
                                <p className="text-sm font-semibold text-white mb-3">Kontribusi SDGs</p>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-400">SDG 9 — Inovasi</p>
                                    <p className="text-sm text-gray-400">SDG 11 — Komunitas</p>
                                    <p className="text-sm text-gray-400">SDG 12 — Konsumsi</p>
                                    <p className="text-sm text-gray-400">SDG 17 — Kemitraan</p>
                                </div>
                            </div>
                        </div>

                        {/* Divider + Copyright */}
                        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                            <p className="text-xs text-gray-500">
                                © 2026 Replate. Proyek inovasi kemandirian desa berkelanjutan.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}