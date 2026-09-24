import { Clock } from 'lucide-react';

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

export default function TimeoutWorkflowSection() {
    return (
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
    );
}
