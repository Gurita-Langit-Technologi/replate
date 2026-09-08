import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    FileText,
    Printer,
    ArrowLeft,
    Leaf,
    Flame,
    Droplets,
    HeartHandshake,
    Coins,
    Award,
    Building2,
    Calendar,
    ShieldCheck,
    CheckCircle2,
    Share2,
} from 'lucide-react';

export default function Report({ esg, globalImpact, currentPeriod = 'all' }) {
    const metrics = esg?.metrics || {};
    const standards = esg?.standards || {};

    const handlePeriodChange = (period) => {
        router.get('/impact/report', { period }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout>
            <Head title="Laporan Dampak ESG & CSR — Replate" />

            <div className="max-w-4xl mx-auto space-y-6 print:m-0 print:p-0 print:max-w-none">
                {/* Navigation & Header Controls (Hidden on print) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 print:hidden">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/impact"
                            className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText size={20} className="text-emerald-600" />
                                Laporan Dampak Keberlanjutan & CSR
                            </h1>
                            <p className="text-xs text-gray-500">
                                Dokumen audit transparansi lingkungan & circular economy desa berstandar UNEP / FAO
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Period Filter */}
                        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                            <button
                                onClick={() => handlePeriodChange('all')}
                                className={`px-3 py-1.5 rounded-lg transition ${
                                    currentPeriod === 'all'
                                        ? 'bg-white text-emerald-700 shadow-2xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => handlePeriodChange('year')}
                                className={`px-3 py-1.5 rounded-lg transition ${
                                    currentPeriod === 'year'
                                        ? 'bg-white text-emerald-700 shadow-2xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Tahun Ini
                            </button>
                            <button
                                onClick={() => handlePeriodChange('month')}
                                className={`px-3 py-1.5 rounded-lg transition ${
                                    currentPeriod === 'month'
                                        ? 'bg-white text-emerald-700 shadow-2xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Bulan Ini
                            </button>
                        </div>

                        {/* Print / Save PDF Button */}
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition active:scale-95"
                        >
                            <Printer size={15} />
                            Cetak / PDF
                        </button>
                    </div>
                </div>

                {/* Formal Printable Document Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
                    {/* Document Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-emerald-600">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-black tracking-tight text-emerald-800">🌱 REPLATE</span>
                                <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold uppercase">
                                    ESG REPORT
                                </span>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mt-2">
                                Laporan Metrik Dampak Lingkungan & Tanggung Jawab Sosial (CSR)
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Platform Penyelamatan Makanan Surplus Desa Terintegrasi
                            </p>
                        </div>
                        <div className="text-right text-xs text-gray-500 space-y-1">
                            <div>
                                Dokumen ID: <strong className="text-gray-800 font-mono">RPT-ESG-{new Date().getFullYear()}</strong>
                            </div>
                            <div>
                                Waktu Terbit: <span className="text-gray-800">{esg?.generated_at}</span>
                            </div>
                            <div>
                                Cakupan: <span className="font-semibold text-emerald-700 capitalize">{currentPeriod === 'all' ? 'Seluruh Periode Operasional' : currentPeriod === 'year' ? 'Tahun Berjalan' : 'Bulan Berjalan'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed">
                        <strong className="font-bold text-emerald-900">Ringkasan Eksekutif:</strong> Melalui ekosistem circular economy Replate, inisiatif penyelamatan makanan surplus telah berhasil mengalihkan potensi sampah organik dari tempat pembuangan akhir (TPA), menekan emisi gas rumah kaca, dan mendistribusikan nutrisi layak konsumsi bagi warga serta bahan baku kompos untuk mitra tani desa.
                    </div>

                    {/* Key Metrics Grid */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                            1. Indikator Kinerja Dampak Lingkungan (Environmental Metrics)
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Leaf size={14} className="text-emerald-600" />
                                    Food Rescued
                                </div>
                                <div className="text-2xl font-black text-gray-900 mt-2">
                                    {metrics.total_food_rescued_kg?.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-500">kg</span>
                                </div>
                                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                                    ~{metrics.total_food_rescued_tons} Ton Metric
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Flame size={14} className="text-teal-600" />
                                    Reduksi CO₂e
                                </div>
                                <div className="text-2xl font-black text-emerald-700 mt-2">
                                    {metrics.co2_avoided_kg?.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-500">kg</span>
                                </div>
                                <div className="text-[11px] text-gray-500 mt-0.5">
                                    Emisi TPA Dicegah
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Droplets size={14} className="text-blue-600" />
                                    Jejak Air (Water)
                                </div>
                                <div className="text-2xl font-black text-blue-700 mt-2">
                                    {(metrics.water_footprint_saved_liters / 1000)?.toFixed(1)} <span className="text-xs font-normal text-gray-500">kL</span>
                                </div>
                                <div className="text-[11px] text-gray-500 mt-0.5">
                                    {metrics.water_footprint_saved_liters?.toLocaleString('id-ID')} Liter Air
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Flame size={14} className="text-amber-600" />
                                    Gas Metana (CH₄)
                                </div>
                                <div className="text-2xl font-black text-amber-700 mt-2">
                                    {metrics.methane_avoided_kg?.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-500">kg</span>
                                </div>
                                <div className="text-[11px] text-gray-500 mt-0.5">
                                    CH₄ Organik Dicegah
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social & Economic Metrics */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                            2. Manfaat Sosial & Ekonomi Warga (Social & Governance)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                                    <HeartHandshake size={14} className="text-red-500" />
                                    Porsi Makanan Tersalurkan
                                </div>
                                <div className="text-xl font-bold text-gray-900 mt-1.5">
                                    ~{metrics.meals_distributed?.toLocaleString('id-ID')} Porsi
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">Berdasarkan porsi makan rata-rata 350g</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                                    <Coins size={14} className="text-green-600" />
                                    Perputaran Ekonomi Sirkular
                                </div>
                                <div className="text-xl font-bold text-green-700 mt-1.5">
                                    Rp {metrics.economic_circular_value?.toLocaleString('id-ID')}
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">Nilai transaksi pangan terfasilitasi</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                                    <Building2 size={14} className="text-indigo-600" />
                                    Mitra & Komunitas Terlibat
                                </div>
                                <div className="text-xl font-bold text-indigo-700 mt-1.5">
                                    {globalImpact?.total_users || 0} Warga & {globalImpact?.total_partners || 0} Mitra
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">Jaringan pengolah limbah & UMKM desa</p>
                            </div>
                        </div>
                    </div>

                    {/* Circular Flow Ratio Breakdown */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                            3. Aliran Sirkularitas Material Pangan
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-700">Konsumsi Manusia (Jual, Barter, Donasi)</span>
                                <span className="font-bold text-emerald-700">{metrics.human_consumption_kg} kg</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-emerald-600 h-full rounded-full"
                                    style={{
                                        width: `${metrics.total_food_rescued_kg > 0 ? (metrics.human_consumption_kg / metrics.total_food_rescued_kg) * 100 : 0}%`,
                                    }}
                                />
                            </div>

                            <div className="flex justify-between items-center text-xs pt-1">
                                <span className="font-semibold text-gray-700">Alih Fungsi Pakan Ternak & Kompos Mitra</span>
                                <span className="font-bold text-amber-700">{metrics.compost_feed_kg} kg</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-amber-500 h-full rounded-full"
                                    style={{
                                        width: `${metrics.total_food_rescued_kg > 0 ? (metrics.compost_feed_kg / metrics.total_food_rescued_kg) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Scientific Standards & Compliance Note */}
                    <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800">
                            <ShieldCheck size={16} className="text-emerald-600" />
                            Standar Perhitungan & Metodologi Ilmiah
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-600 pl-1">
                            <li><strong>Kerangka Kerja:</strong> {standards.framework}</li>
                            <li><strong>Faktor Emisi Karbon:</strong> {standards.emission_factor}</li>
                            <li><strong>Faktor Reduksi Gas Metana:</strong> {standards.methane_factor}</li>
                            <li><strong>Jejak Air Virtual:</strong> {standards.water_factor}</li>
                        </ul>
                    </div>

                    {/* Signature / Validation Footer for Audit */}
                    <div className="pt-8 border-t border-dashed border-gray-300 grid grid-cols-2 text-center text-xs text-gray-600">
                        <div>
                            <p className="font-medium text-gray-500">Diverifikasi Sistem</p>
                            <p className="mt-8 font-bold text-gray-900">Replate Automated Engine</p>
                            <p className="text-[10px] text-gray-400">Verifikasi Terdesentralisasi</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500">Disahkan Oleh</p>
                            <p className="mt-8 font-bold text-gray-900">Admin & Pengelola BUMDes</p>
                            <p className="text-[10px] text-gray-400">Posko Sirkular Pangan</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
