/**
 * SectionHeader — Header halaman yang konsisten di seluruh app
 *
 * Usage:
 *   <SectionHeader title="Marketplace" subtitle="14 produk tersedia" />
 *   <SectionHeader title="Produk Saya" action={<Link href="...">Upload</Link>} />
 */
export function SectionHeader({ title, subtitle, action, className = '' }) {
    return (
        <div className={`flex items-start justify-between mb-6 ${className}`}>
            <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
                {subtitle && (
                    <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
                )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}

/**
 * PageContainer — Wrapper max-width konsisten
 */
export function PageContainer({ children, className = '' }) {
    return (
        <div className={`max-w-5xl mx-auto ${className}`}>
            {children}
        </div>
    );
}

/**
 * EmptyState — State kosong yang konsisten
 */
export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            {Icon && <Icon size={40} className="mx-auto text-gray-200 mb-3" strokeWidth={1.5} />}
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            {description && <p className="text-xs text-gray-400">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

/**
 * InfoRow — Baris info dengan icon, label, value yang konsisten
 * Dipakai di Product Show, Transaction Show, dll
 */
export function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
            </div>
        </div>
    );
}

/**
 * StatCard — Card statistik untuk Dashboard
 */
export function StatCard({ icon: Icon, label, value, unit, color = 'green' }) {
    const colorMap = {
        green:  'bg-green-50  text-green-600',
        blue:   'bg-blue-50   text-blue-600',
        violet: 'bg-violet-50 text-violet-600',
        amber:  'bg-amber-50  text-amber-600',
        sky:    'bg-sky-50    text-sky-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition">
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color] ?? colorMap.green}`}>
                    <Icon size={20} />
                </div>
                <span className="text-sm text-gray-500 leading-tight">{label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
                {unit && <span className="text-sm text-gray-400">{unit}</span>}
            </div>
        </div>
    );
}
