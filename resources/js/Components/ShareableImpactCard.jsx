import { useState, useRef } from 'react';
import { Sparkles, Download, Copy, Check, Share2, X, Trophy, Leaf, Flame, HeartHandshake, Award, Coins, Scale } from 'lucide-react';

export default function ShareableImpactCard({ user, userStats, badges = [], rank = '-', points = 0 }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const canvasRef = useRef(null);

    const unlockedBadges = badges.filter(b => b.unlocked);
    const weightKg = userStats?.weight_saved_kg || 0;
    const co2Kg = userStats?.co2_saved_kg || (weightKg * 2.5).toFixed(1);
    const meals = Math.floor((weightKg * 1000) / 350);
    const levelTitle = userStats?.level_title || 'Penyelamat Pangan Aktif';

    const handleCopyText = () => {
        const text = `*KONTRIBUSI DAMPAK LINGKUNGAN REPLATE*
Nama: ${user?.name || 'Warga Replate'}
Peringkat Desa: #${rank} (${levelTitle})
Makanan Diselamatkan: ${weightKg} kg
Reduksi Emisi CO2: ${co2Kg} kg CO2e
Porsi Makan Terselamatkan: ~${meals} porsi
Saldo RePoin: ${points} Poin

Mari bersama kurangi food waste & dukung circular economy desa bersama Replate!`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleDownloadImage = () => {
        setIsDownloading(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = 800;
        const height = 1000;
        canvas.width = width;
        canvas.height = height;

        // Background Solid Professional Emerald Dark Theme
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, width, height);

        // Header Logo / Branding
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('REPLATE', 60, 90);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '18px sans-serif';
        ctx.fillText('Desa Sirkular & Penyelamatan Food Waste', 60, 125);

        // Card Container Inner
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(50, 160, 700, 750, 24);
        ctx.fill();
        ctx.stroke();

        // User Avatar Circle & Name
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(120, 240, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        const initial = (user?.name || 'U').charAt(0).toUpperCase();
        ctx.textAlign = 'center';
        ctx.fillText(initial, 120, 252);
        ctx.textAlign = 'left';

        // User Name & Desa
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(user?.name || 'Warga Replate', 185, 235);

        ctx.fillStyle = '#34d399';
        ctx.font = '18px sans-serif';
        ctx.fillText(`${user?.desa ? `Desa ${user.desa}` : 'Komunitas Desa'} • ${levelTitle}`, 185, 265);

        // Divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.moveTo(80, 310);
        ctx.lineTo(720, 310);
        ctx.stroke();

        // Grid Stats
        // Stat 1: Kg Saved
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.beginPath();
        ctx.roundRect(80, 340, 300, 130, 16);
        ctx.fill();
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`${weightKg} kg`, 105, 405);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px sans-serif';
        ctx.fillText('Makanan Diselamatkan', 105, 440);

        // Stat 2: CO2 Reduction
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.beginPath();
        ctx.roundRect(420, 340, 300, 130, 16);
        ctx.fill();
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`${co2Kg} kg`, 445, 405);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px sans-serif';
        ctx.fillText('Reduksi Emisi CO2e', 445, 440);

        // Stat 3: Meals Saved
        ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.beginPath();
        ctx.roundRect(80, 490, 300, 130, 16);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`~${meals}`, 105, 555);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px sans-serif';
        ctx.fillText('Porsi Makan Tersalurkan', 105, 590);

        // Stat 4: RePoin
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.beginPath();
        ctx.roundRect(420, 490, 300, 130, 16);
        ctx.fill();
        ctx.fillStyle = '#60a5fa';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`${points}`, 445, 555);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px sans-serif';
        ctx.fillText('Saldo RePoin Warga', 445, 590);

        // Badges Section
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`Lencana Terbuka (${unlockedBadges.length} Lencana)`, 80, 670);

        let badgeX = 80;
        unlockedBadges.slice(0, 5).forEach((b) => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.roundRect(badgeX, 690, 110, 80, 12);
            ctx.fill();

            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText('Lencana', badgeX + 15, 730);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px sans-serif';
            ctx.fillText((b.title || '').substring(0, 14), badgeX + 10, 755);

            badgeX += 125;
        });

        // Footer Tagline & Watermark
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 16px sans-serif';
        ctx.fillText('“Makan Habis, Petani Berdaya, Desa Berkelanjutan.”', 80, 830);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('replate.local • Aplikasi Penyelamat Food Waste', 80, 865);

        // Trigger download
        setTimeout(() => {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `replate-impact-${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'card'}.png`;
            link.href = dataUrl;
            link.click();
            setIsDownloading(false);
        }, 300);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-sm transition active:scale-95"
            >
                <Sparkles size={14} className="text-green-200" />
                Bagikan Kartu Dampak
            </button>

            {/* Hidden Canvas for High-Resolution Export */}
            <canvas ref={canvasRef} className="hidden" />

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-md bg-gray-900 text-white rounded-3xl p-6 shadow-2xl border border-gray-800 overflow-hidden">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
                        >
                            <X size={18} />
                        </button>

                        {/* Card Preview */}
                        <div className="text-center space-y-4 pt-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[11px] font-semibold text-emerald-400">
                                <Leaf size={12} />
                                Replate Zero Waste Hero Card
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">{user?.name || 'Warga Replate'}</h3>
                                <p className="text-xs text-emerald-400 font-medium">
                                    {levelTitle} • #{rank} di Peringkat Desa
                                </p>
                            </div>

                            {/* Stat Boxes */}
                            <div className="grid grid-cols-2 gap-2.5 pt-2 text-left">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Leaf size={11} className="text-emerald-400" />
                                        Terselamatkan
                                    </div>
                                    <div className="text-xl font-extrabold text-emerald-400 mt-1">{weightKg} kg</div>
                                    <div className="text-[10px] text-gray-400">makanan surplus</div>
                                </div>

                                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Flame size={11} className="text-teal-400" />
                                        Cegah Emisi
                                    </div>
                                    <div className="text-xl font-extrabold text-teal-300 mt-1">{co2Kg} kg</div>
                                    <div className="text-[10px] text-gray-400">setara emisi CO2e</div>
                                </div>

                                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <HeartHandshake size={11} className="text-amber-400" />
                                        Porsi Makanan
                                    </div>
                                    <div className="text-xl font-extrabold text-amber-400 mt-1">~{meals}</div>
                                    <div className="text-[10px] text-gray-400">porsi tersalurkan</div>
                                </div>

                                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Coins size={11} className="text-sky-400" />
                                        Saldo Poin
                                    </div>
                                    <div className="text-xl font-extrabold text-sky-400 mt-1">{points}</div>
                                    <div className="text-[10px] text-gray-400">RePoin aktif</div>
                                </div>
                            </div>

                            {/* Unlocked Badges Mini Preview */}
                            {unlockedBadges.length > 0 && (
                                <div className="pt-2 text-left">
                                    <div className="text-[11px] font-semibold text-gray-400 mb-2 flex items-center justify-between">
                                        <span>Lencana Diraih ({unlockedBadges.length})</span>
                                        <span className="text-[10px] text-emerald-400 font-bold">Terverifikasi</span>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {unlockedBadges.map((b) => (
                                            <div
                                                key={b.id}
                                                className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-center min-w-[70px] shrink-0"
                                            >
                                                <Award size={16} className="text-amber-400 mx-auto mb-0.5" />
                                                <div className="text-[9px] text-gray-300 truncate max-w-[60px]">
                                                    {b.title}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={handleCopyText}
                                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-2xl border border-white/10 transition"
                                >
                                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                    {copied ? 'Tersalin!' : 'Salin Teks'}
                                </button>
                                <button
                                    onClick={handleDownloadImage}
                                    disabled={isDownloading}
                                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-2xl shadow-lg transition disabled:opacity-50"
                                >
                                    <Download size={16} />
                                    {isDownloading ? 'Menyimpan...' : 'Unduh Gambar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
