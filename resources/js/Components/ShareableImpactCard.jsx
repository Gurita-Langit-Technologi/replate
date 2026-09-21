import { useState, useRef } from 'react';
import { Sparkles, Download, Copy, Check, X, Trophy, Leaf, Flame, HeartHandshake, Award, Coins } from 'lucide-react';

export default function ShareableImpactCard({ user, userStats, badges = [], rank = '-', points = 0 }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const canvasRef = useRef(null);

    const unlockedBadges = badges.filter((b) => b.unlocked);
    const weightKg = userStats?.weight_saved_kg || 0;
    const co2Kg = userStats?.co2_saved_kg || (weightKg * 2.5).toFixed(1);
    const meals = Math.floor((weightKg * 1000) / 350);
    const levelTitle = userStats?.level_title || 'Penyelamat Pangan Desa';

    const handleCopyText = () => {
        const text = `🌱 *KARTU KONTRIBUSI PENYELAMAT PANGAN REPLATE*
Nama: ${user?.name || 'Warga Replate'}
Peringkat Desa: #${rank} (${levelTitle})
━━━━━━━━━━━━━━━━━━━━━
✅ Makanan Surplus Diselamatkan: ${weightKg} kg
📉 Reduksi Jejak Karbon: ${co2Kg} kg CO2e
🍲 Porsi Pangan Tersalurkan: ~${meals} porsi
⭐ Saldo RePoin Aktif: ${points} Poin

Mari bersama kurangi food waste & dukung ekonomi sirkular desa bersama Replate!`;
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
        const height = 1040;
        canvas.width = width;
        canvas.height = height;

        // Background: Warm Natural Cream
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);

        // Main Card Container with Subtle Shadow & Border
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(40, 40, 720, 960, 24);
        ctx.fill();
        ctx.stroke();

        // Header Accent Banner (Forest Green)
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.roundRect(40, 40, 720, 150, [24, 24, 0, 0]);
        ctx.fill();

        // Branding Tag
        ctx.fillStyle = '#a7f3d0';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('REPLATE • GERAKAN PANGAN SIRKULAR DESA', 70, 85);

        // Header Subtitle
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('Kartu Apresiasi Penyelamat Pangan', 70, 125);

        // User Avatar Circle
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(120, 240, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        const initial = (user?.name || 'U').charAt(0).toUpperCase();
        ctx.textAlign = 'center';
        ctx.fillText(initial, 120, 252);
        ctx.textAlign = 'left';

        // User Name & Info
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(user?.name || 'Warga Replate', 185, 235);

        ctx.fillStyle = '#059669';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`${levelTitle} • Peringkat #${rank} di Desa`, 185, 265);

        // Divider
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(70, 310);
        ctx.lineTo(730, 310);
        ctx.stroke();

        // 4 Clean Metric Cards
        // Stat 1: Kg Saved (Emerald Green)
        ctx.fillStyle = '#f0fdf4';
        ctx.strokeStyle = '#bbf7d0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(70, 340, 310, 130, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#15803d';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(`${weightKg} kg`, 95, 400);
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('Makanan Diselamatkan', 95, 435);
        ctx.fillStyle = '#6b7280';
        ctx.font = '13px sans-serif';
        ctx.fillText('Surplus pangan desa', 95, 455);

        // Stat 2: CO2 Reduction (Teal/Forest)
        ctx.fillStyle = '#f0fdfa';
        ctx.strokeStyle = '#99f6e4';
        ctx.beginPath();
        ctx.roundRect(420, 340, 310, 130, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f766e';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(`${co2Kg} kg`, 445, 400);
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('Reduksi Emisi Karbon', 445, 435);
        ctx.fillStyle = '#6b7280';
        ctx.font = '13px sans-serif';
        ctx.fillText('Setara gas rumah kaca CO2e', 445, 455);

        // Stat 3: Meals Saved (Warm Amber)
        ctx.fillStyle = '#fffbeb';
        ctx.strokeStyle = '#fde68a';
        ctx.beginPath();
        ctx.roundRect(70, 490, 310, 130, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(`~${meals}`, 95, 550);
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('Porsi Tersalurkan', 95, 585);
        ctx.fillStyle = '#6b7280';
        ctx.font = '13px sans-serif';
        ctx.fillText('Manfaat bagi sesama', 95, 605);

        // Stat 4: RePoin (Sky / Soft Indigo)
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.roundRect(420, 490, 310, 130, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(`${points}`, 445, 550);
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('Saldo RePoin Warga', 445, 585);
        ctx.fillStyle = '#6b7280';
        ctx.font = '13px sans-serif';
        ctx.fillText('Poin reward sirkular', 445, 605);

        // Badges Title
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`Lencana Penghargaan (${unlockedBadges.length} Terbuka)`, 70, 670);

        let badgeX = 70;
        unlockedBadges.slice(0, 4).forEach((b) => {
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.roundRect(badgeX, 690, 150, 70, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#d97706';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText('🏅 ' + (b.title || 'Lencana'), badgeX + 12, 722);

            ctx.fillStyle = '#64748b';
            ctx.font = '11px sans-serif';
            ctx.fillText('Terverifikasi Desa', badgeX + 14, 744);

            badgeX += 165;
        });

        // Footer Tagline & Validation
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.roundRect(70, 790, 660, 90, 16);
        ctx.fill();

        ctx.fillStyle = '#047857';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('“Makan Habis, Petani Berdaya, Desa Berkelanjutan.”', 95, 830);

        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.fillText('Diterbitkan melalui Platform Pengelolaan Ketahanan Pangan Replate', 95, 855);

        // Watermark Footer Bottom
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Dicetak pada ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 70, 960);

        // Trigger Download
        setTimeout(() => {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `kartu-dampak-${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'replate'}.png`;
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
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl shadow-xs transition active:scale-95"
            >
                <Sparkles size={14} className="text-emerald-600" />
                Bagikan Kartu Dampak
            </button>

            {/* Hidden Canvas for High-Resolution Export */}
            <canvas ref={canvasRef} className="hidden" />

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="relative w-full max-w-lg bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-700 rounded-full bg-white/80 hover:bg-white shadow-xs transition"
                        >
                            <X size={18} />
                        </button>

                        {/* Top Header Card Banner */}
                        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 px-6 pt-6 pb-8 text-white relative">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-[11px] font-semibold text-emerald-200 mb-3">
                                <Leaf size={12} className="text-emerald-300" />
                                Kartu Apresiasi Warga Replate
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-600 border-2 border-white/20 flex items-center justify-center text-white text-xl font-extrabold shadow-sm shrink-0">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{user?.name || 'Warga Replate'}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-emerald-200 font-medium">
                                            {levelTitle}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold">
                                            Peringkat #{rank} Desa
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-6 space-y-4 -mt-3 bg-white rounded-t-3xl border-t border-gray-100">
                            {/* 4 Stat Boxes (Clean, Natural & Readable) */}
                            <div className="grid grid-cols-2 gap-3 text-left">
                                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100/90 rounded-2xl">
                                    <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                                        <Leaf size={13} className="text-emerald-600" />
                                        Diselamatkan
                                    </div>
                                    <div className="text-2xl font-extrabold text-emerald-900 mt-1">{weightKg} kg</div>
                                    <div className="text-[10px] text-gray-500">Makanan surplus desa</div>
                                </div>

                                <div className="p-3.5 bg-teal-50/70 border border-teal-100/90 rounded-2xl">
                                    <div className="text-[11px] font-semibold text-teal-800 flex items-center gap-1.5">
                                        <Flame size={13} className="text-teal-600" />
                                        Cegah Emisi
                                    </div>
                                    <div className="text-2xl font-extrabold text-teal-900 mt-1">{co2Kg} kg</div>
                                    <div className="text-[10px] text-gray-500">Setara reduksi CO2e</div>
                                </div>

                                <div className="p-3.5 bg-amber-50/70 border border-amber-100/90 rounded-2xl">
                                    <div className="text-[11px] font-semibold text-amber-800 flex items-center gap-1.5">
                                        <HeartHandshake size={13} className="text-amber-600" />
                                        Porsi Makanan
                                    </div>
                                    <div className="text-2xl font-extrabold text-amber-900 mt-1">~{meals}</div>
                                    <div className="text-[10px] text-gray-500">Porsi tersalurkan</div>
                                </div>

                                <div className="p-3.5 bg-sky-50/70 border border-sky-100/90 rounded-2xl">
                                    <div className="text-[11px] font-semibold text-sky-800 flex items-center gap-1.5">
                                        <Coins size={13} className="text-sky-600" />
                                        Saldo RePoin
                                    </div>
                                    <div className="text-2xl font-extrabold text-sky-900 mt-1">{points}</div>
                                    <div className="text-[10px] text-gray-500">Poin reward sirkular</div>
                                </div>
                            </div>

                            {/* Unlocked Badges Preview */}
                            {unlockedBadges.length > 0 && (
                                <div className="pt-1 text-left">
                                    <div className="text-[11px] font-bold text-gray-600 mb-2 flex items-center justify-between">
                                        <span>Lencana Penghargaan ({unlockedBadges.length})</span>
                                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                                            Terverifikasi
                                        </span>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {unlockedBadges.map((b) => (
                                            <div
                                                key={b.id}
                                                className="px-3 py-2 bg-gray-50 border border-gray-200/80 rounded-xl text-center min-w-[90px] shrink-0"
                                            >
                                                <Award size={18} className="text-amber-500 mx-auto mb-1" />
                                                <div className="text-[10px] font-bold text-gray-800 truncate max-w-[85px]">
                                                    {b.title}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-2 flex items-center gap-3">
                                <button
                                    onClick={handleCopyText}
                                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition active:scale-95"
                                >
                                    {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                                    {copied ? 'Tersalin ke Clipboard!' : 'Salin Ringkasan'}
                                </button>
                                <button
                                    onClick={handleDownloadImage}
                                    disabled={isDownloading}
                                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
                                >
                                    <Download size={16} />
                                    {isDownloading ? 'Menyimpan Gambar...' : 'Unduh Kartu (PNG)'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
