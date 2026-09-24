import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    <div className="md:col-span-2">
                        <Link href="/">
                            <img
                                src="/image/logo(2).png"
                                alt="Replate"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/image/logo.png';
                                }}
                                className="h-10 rounded-lg object-contain mb-4"
                            />
                        </Link>
                        <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
                            Platform digital circular economy untuk digitalisasi pengelolaan sumber daya pangan desa menuju kemandirian pangan dan lingkungan berkelanjutan.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Eksplorasi</p>
                        <div className="space-y-2.5 text-sm text-gray-300">
                            <Link href="/marketplace" className="block hover:text-green-400 transition">Marketplace Pangan</Link>
                            <Link href="/impact" className="block hover:text-green-400 transition">Portal Dampak Desa</Link>
                            <Link href="/impact/report" className="block hover:text-green-400 transition">Laporan ESG</Link>
                            <Link href="/leaderboard" className="block hover:text-green-400 transition">Papan Peringkat Warga</Link>
                            <Link href="/faq" className="block hover:text-green-400 transition">Pusat Bantuan & FAQ</Link>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Inovasi Desa</p>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            Terintegrasi dengan sistem timeout otomatis, mitigasi risiko dispute, barter digital, serta keterlibatan aktif kelompok tani dan BUMDes lokal.
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-400">
                    © 2026 Replate — Platform Digitalisasi Pemanfaatan Sumber Daya & Food Waste Desa.
                </div>
            </div>
        </footer>
    );
}
