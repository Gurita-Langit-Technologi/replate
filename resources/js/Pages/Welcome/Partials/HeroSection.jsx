import { Link } from '@inertiajs/react';
import { ArrowRight, Leaf } from 'lucide-react';

export default function HeroSection({ stats }) {
    return (
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
    );
}
