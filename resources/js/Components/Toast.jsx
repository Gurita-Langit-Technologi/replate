import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Check, X, AlertTriangle } from 'lucide-react';

export default function Toast() {
    const { flash, errors } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (flash?.success) {
            setMessage({ type: 'success', text: flash.success });
            setVisible(true);
        } else if (flash?.error) {
            setMessage({ type: 'error', text: flash.error });
            setVisible(true);
        } else if (errors && Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            setMessage({ type: 'error', text: firstError });
            setVisible(true);
        }
    }, [flash, errors]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const config = {
        success: { icon: Check, bg: 'bg-green-600' },
        error: { icon: AlertTriangle, bg: 'bg-red-600' },
    };

    const c = config[message.type] || config.error;
    const Icon = c.icon;

    return (
        <div className="fixed top-20 right-4 z-[100]" style={{ animation: 'slide-in 0.3s ease-out' }}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white max-w-sm ${c.bg}`}>
                <Icon size={18} className="flex-shrink-0" />
                <p className="text-sm font-medium">{message.text}</p>
                <button onClick={() => setVisible(false)} className="ml-2 text-white/70 hover:text-white flex-shrink-0">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}