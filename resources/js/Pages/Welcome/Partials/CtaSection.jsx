import { Link } from '@inertiajs/react';
import { ChevronRight, Trophy } from 'lucide-react';

export default function CtaSection() {
    return (
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
    );
}
