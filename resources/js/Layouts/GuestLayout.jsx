 import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden" style={{ backgroundColor: '#065f46' }}>
                {/* Organic shapes instead of pattern */}
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/20" />
                <div className="absolute top-1/3 -right-16 w-64 h-64 rounded-full bg-green-400/10" />
                <div className="absolute -bottom-10 left-1/4 w-48 h-48 rounded-full bg-teal-500/15" />

                <div className="relative flex flex-col justify-between py-12 px-12 w-full">
                    {/* Top — Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <img src="/image/logo(2).png" alt="Replate" className="h-12 rounded-s object-cover" />
                    </Link>

                    {/* Middle — Message */}
                    <div>
                        <h1 className="text-3xl font-bold text-white leading-snug mb-3">
                            Makanan sisa<br />bukan berarti<br />tidak berguna.
                        </h1>
                        <p className="text-emerald-200 text-sm leading-relaxed max-w-xs">
                            Jual, barter, donasikan — atau biarkan sistem kami yang menyalurkan ke yang membutuhkan.
                        </p>
                    </div>

                    {/* Bottom — Testimonial-style */}
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-sm text-emerald-100 italic leading-relaxed">
                            "Sisa katering 25 kotak, tadinya mau dibuang. Lewat Replate, 2 jam langsung ada yang ambil."
                        </p>
                        <p className="text-xs text-emerald-300 mt-2">— Warga Sumbermulyo</p>
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-7/12 flex flex-col justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-md mx-auto">
                    {/* Logo for mobile */}
                    <div className="lg:hidden flex items-center mb-8">
                        <Link href="/">
                            <img src="/image/logo(2).png" alt="Replate" className="h-10 w-auto object-contain" />
                        </Link>
                    </div>

                    {children}

                    <p className="mt-8 text-center text-xs text-gray-400">
                        © 2026 Replate
                    </p>
                </div>
            </div>
        </div>
    );
}