export default function ImpactTicker({ stats }) {
    return (
        <section className="bg-green-700 text-white shadow-md my-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="p-2">
                        <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                            {stats.weightKg} kg
                        </p>
                        <p className="text-xs md:text-sm text-green-100 mt-2 font-semibold">
                            Food Waste Dicegah
                        </p>
                    </div>
                    <div className="p-2">
                        <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                            {stats.co2Kg} kg
                        </p>
                        <p className="text-xs md:text-sm text-green-100 mt-2 font-semibold">
                            Emisi CO₂ Ekuivalen Ditekan
                        </p>
                    </div>
                    <div className="p-2">
                        <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                            {stats.meals}
                        </p>
                        <p className="text-xs md:text-sm text-green-100 mt-2 font-semibold">
                            Porsi Pangan Tersalurkan
                        </p>
                    </div>
                    <div className="p-2">
                        <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                            {stats.totalUsers}
                        </p>
                        <p className="text-xs md:text-sm text-green-100 mt-2 font-semibold">
                            Warga & Mitra Terlibat
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
