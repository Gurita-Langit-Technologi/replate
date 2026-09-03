/**
 * Badge — Modern, high-craft badges with subtle border and optional dot indicators.
 * Clean, non-AI styling (inspired by Linear, Stripe, and modern GovTech).
 */

const colorMap = {
    green:  'bg-emerald-50  text-emerald-800 border-emerald-200/80  dot-emerald-500',
    violet: 'bg-violet-50   text-violet-800  border-violet-200/80   dot-violet-500',
    sky:    'bg-sky-50      text-sky-800     border-sky-200/80      dot-sky-500',
    amber:  'bg-amber-50    text-amber-800   border-amber-200/80    dot-amber-500',
    orange: 'bg-orange-50   text-orange-800  border-orange-200/80   dot-orange-500',
    red:    'bg-rose-50     text-rose-800    border-rose-200/80     dot-rose-500',
    gray:   'bg-slate-100   text-slate-700   border-slate-200       dot-slate-400',
    blue:   'bg-blue-50     text-blue-800    border-blue-200/80     dot-blue-500',
};

const dotColorMap = {
    green:  'bg-emerald-500',
    violet: 'bg-violet-500',
    sky:    'bg-sky-500',
    amber:  'bg-amber-500',
    orange: 'bg-orange-500',
    red:    'bg-rose-500',
    gray:   'bg-slate-400',
    blue:   'bg-blue-500',
};

export function Badge({ children, color = 'gray', size = 'sm', withDot = false, className = '' }) {
    const sizeClasses = {
        xs: 'text-[10px] px-2 py-0.5 font-medium',
        sm: 'text-xs px-2.5 py-0.5 font-semibold',
        md: 'text-xs px-3 py-1 font-semibold',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md border tracking-tight
                ${colorMap[color] ?? colorMap.gray}
                ${sizeClasses[size] ?? sizeClasses.sm}
                ${className}`}
        >
            {withDot && (
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColorMap[color] ?? 'bg-slate-400'}`} />
            )}
            {children}
        </span>
    );
}

// ============================================================
// Mode Transaksi Badges
// ============================================================

export const MODE_COLOR = {
    sell:           'green',
    barter:         'violet',
    sell_and_barter:'amber',
    donate:         'sky',
};

export const MODE_LABEL = {
    sell:           'Jual Beli',
    barter:         'Barter Pangan',
    sell_and_barter:'Jual & Barter',
    donate:         'Donasi Gratis',
};

export function ModeBadge({ mode, size = 'xs', withDot = false }) {
    return (
        <Badge color={MODE_COLOR[mode] ?? 'gray'} size={size} withDot={withDot}>
            {MODE_LABEL[mode] ?? mode}
        </Badge>
    );
}

// ============================================================
// Kondisi Produk Badges
// ============================================================

export const CONDITION_COLOR = {
    layak_konsumsi:      'green',
    layak_olah:          'amber',
    layak_pakan_kompos:  'orange',
};

export const CONDITION_LABEL = {
    layak_konsumsi:      'Siap Konsumsi',
    layak_olah:          'Perlu Diolah',
    layak_pakan_kompos:  'Pakan / Kompos',
};

export function ConditionBadge({ condition, size = 'xs', withDot = true }) {
    return (
        <Badge color={CONDITION_COLOR[condition] ?? 'gray'} size={size} withDot={withDot}>
            {CONDITION_LABEL[condition] ?? condition}
        </Badge>
    );
}

// ============================================================
// Status Produk & Transaksi Badges
// ============================================================

export const PRODUCT_STATUS_CONFIG = {
    active:          { label: 'Tayang Aktif',      color: 'green'  },
    timeout_stage_1: { label: 'Diskon 25%',        color: 'amber'  },
    timeout_stage_2: { label: 'Jalur Donasi',      color: 'sky'    },
    timeout_stage_3: { label: 'Dialihkan Mitra',   color: 'orange' },
    sold:            { label: 'Terjual',           color: 'blue'   },
    bartered:        { label: 'Terbarter',         color: 'violet' },
    donated:         { label: 'Terdonasi',         color: 'sky'    },
    transferred:     { label: 'Selesai Alih',      color: 'gray'   },
};

export const TXN_STATUS_CONFIG = {
    pending:         { label: 'Menunggu Konfirmasi', color: 'amber'  },
    confirmed:       { label: 'Dikonfirmasi',       color: 'blue'   },
    completed:       { label: 'Selesai',            color: 'green'  },
    cancelled:       { label: 'Dibatalkan',         color: 'red'    },
    dispute_spoiled: { label: 'Dalam Dispute',      color: 'orange' },
};

export function ProductStatusBadge({ status, size = 'xs', withDot = true }) {
    const cfg = PRODUCT_STATUS_CONFIG[status] ?? { label: status, color: 'gray' };
    return <Badge color={cfg.color} size={size} withDot={withDot}>{cfg.label}</Badge>;
}

export function TxnStatusBadge({ status, size = 'sm', withDot = true }) {
    const cfg = TXN_STATUS_CONFIG[status] ?? { label: status, color: 'gray' };
    return <Badge color={cfg.color} size={size} withDot={withDot}>{cfg.label}</Badge>;
}
