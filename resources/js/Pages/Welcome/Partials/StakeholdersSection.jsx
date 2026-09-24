import { Home, UtensilsCrossed, Store, Sprout, Users, Building } from 'lucide-react';

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

export default function StakeholdersSection() {
    return (
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
    );
}
