import { ShoppingBasket, ArrowLeftRight, Heart, Handshake } from 'lucide-react';

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

export default function FourPillarsSection() {
    return (
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
    );
}
