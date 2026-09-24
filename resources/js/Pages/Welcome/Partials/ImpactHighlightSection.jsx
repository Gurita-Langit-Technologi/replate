import { Link } from '@inertiajs/react';
import { Leaf } from 'lucide-react';

export default function ImpactHighlightSection() {
    return (
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
    );
}
