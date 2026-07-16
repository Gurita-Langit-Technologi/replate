import { Head, Link } from '@inertiajs/react';
import {
    Leaf,
    ShoppingBasket,
    ArrowLeftRight,
    Heart,
    Handshake,
    Clock,
    Shield,
    BarChart3,
    ArrowRight,
    ChevronRight,
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

function StatItem({ value, label }) {
    return (
        <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-white">{value}</p>
            <p className="text-sm text-green-100 mt-1">{label}</p>
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
                            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900">Replate</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />
                    <div className="absolute top-20 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />

                    <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-6">
                                <Leaf size={14} />
                                Platform Sirkulasi Sumber Daya Desa
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Dari Sisa{' '}
                                <span className="text-green-600">Menjadi Sinergi</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-8 max-w-2xl">
                                Replate menghubungkan penghasil food waste dengan pihak yang dapat memanfaatkannya
                                melalui jual-beli, barter, donasi, dan kemitraan — memastikan tidak ada makanan
                                yang berakhir menjadi sampah.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/20"
                                >
                                    Mulai sekarang
                                    <ArrowRight size={18} />
                                </Link>
                                <a
                                    href="#cara-kerja"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                                >
                                    Pelajari lebih lanjut
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats bar */}
                <section className="bg-green-600">
                    <div className="max-w-6xl mx-auto px-4 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <StatItem value="4" label="Jalur distribusi" />
                            <StatItem value="3" label="Tingkat klasifikasi" />
                            <StatItem value="0%" label="Target food waste terbuang" />
                            <StatItem value="∞" label="Potensi dampak" />
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
                        <FeatureCard
                            icon={ShoppingBasket}
                            title="Jual-beli"
                            description="Jual food waste yang masih memiliki nilai guna kepada yang membutuhkan dengan harga terjangkau."
                            color="green"
                        />
                        <FeatureCard
                            icon={ArrowLeftRight}
                            title="Barter"
                            description="Tukar food waste dengan hasil bumi atau produk lokal lainnya — tanpa perlu uang tunai."
                            color="purple"
                        />
                        <FeatureCard
                            icon={Heart}
                            title="Donasi"
                            description="Berikan makanan yang masih layak kepada yang membutuhkan secara gratis."
                            color="blue"
                        />
                        <FeatureCard
                            icon={Handshake}
                            title="Kemitraan"
                            description="Food waste yang tidak terjual otomatis disalurkan ke peternak, pengelola kompos, atau pembudidaya maggot."
                            color="amber"
                        />
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
                            <StepCard
                                number="1"
                                title="Upload produk"
                                description="Foto produk, pilih kondisi (layak konsumsi / layak olah / layak pakan-kompos), tentukan mode transaksi."
                            />
                            <div className="ml-5 h-6 border-l-2 border-dashed border-green-200" />
                            <StepCard
                                number="2"
                                title="Tayang di marketplace"
                                description="Produk tampil di marketplace berdasarkan filter lokasi desa/kecamatan. Timer timeout mulai berjalan."
                            />
                            <div className="ml-5 h-6 border-l-2 border-dashed border-green-200" />
                            <StepCard
                                number="3"
                                title="Transaksi atau barter"
                                description="Pembeli bisa membeli langsung, mengajukan barter, atau mengklaim donasi. Negosiasi barter melalui platform."
                            />
                            <div className="ml-5 h-6 border-l-2 border-dashed border-amber-200" />
                            <StepCard
                                number="4"
                                title="Timeout otomatis"
                                description="Mendekati batas waktu → harga turun otomatis. Habis waktu → masuk jalur donasi. Masih tidak diklaim → dialihkan ke mitra pengolah."
                            />
                            <div className="ml-5 h-6 border-l-2 border-dashed border-green-200" />
                            <StepCard
                                number="5"
                                title="Zero waste"
                                description="Setiap produk dijamin tersalurkan — tidak ada food waste yang berakhir menjadi sampah."
                            />
                        </div>
                    </div>
                </section>

                {/* Unique features */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Keunikan Replate</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                            <Clock size={28} className="text-amber-600 mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Timeout bertingkat</h3>
                            <p className="text-sm text-gray-600">
                                Tiga tahap jaring pengaman otomatis: diskon → donasi → mitra pengolah.
                                Produk tidak mungkin terbuang.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
                            <ArrowLeftRight size={28} className="text-purple-600 mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Barter digital</h3>
                            <p className="text-sm text-gray-600">
                                Mendigitalisasi tradisi tukar-menukar desa. Warga bisa berpartisipasi
                                tanpa bergantung pada uang tunai.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
                            <BarChart3 size={28} className="text-green-600 mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Dampak terukur</h3>
                            <p className="text-sm text-gray-600">
                                Dashboard dampak desa menampilkan kg food waste terselamatkan,
                                jumlah transaksi, dan rasio keberhasilan.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SDGs */}
                <section className="bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Kontribusi terhadap SDGs</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                                <p className="text-2xl font-bold text-green-600 mb-1">SDG 9</p>
                                <p className="text-xs text-gray-500">Industry, Innovation & Infrastructure</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                                <p className="text-2xl font-bold text-green-600 mb-1">SDG 11</p>
                                <p className="text-xs text-gray-500">Sustainable Cities & Communities</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                                <p className="text-2xl font-bold text-green-600 mb-1">SDG 12</p>
                                <p className="text-xs text-gray-500">Responsible Consumption & Production</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                                <p className="text-2xl font-bold text-green-600 mb-1">SDG 17</p>
                                <p className="text-xs text-gray-500">Partnerships for the Goals</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-6xl mx-auto px-4 py-20">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-10 md:p-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Mari kurangi food waste bersama
                        </h2>
                        <p className="text-green-100 mb-8 max-w-xl mx-auto">
                            Setiap makanan yang diselamatkan adalah langkah menuju desa yang lebih mandiri dan berkelanjutan.
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition shadow-lg"
                        >
                            Bergabung sekarang
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 py-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                    <Leaf className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-gray-900">Replate</span>
                                <span className="text-sm text-gray-400">· Sirkulasi Sumber Daya Desa</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Circular economy untuk kemandirian desa berkelanjutan
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}