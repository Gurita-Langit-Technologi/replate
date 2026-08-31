import Modal from '@/Components/Modal';
import { AlertCircle, HelpCircle, CheckCircle2, Trash2 } from 'lucide-react';

export default function ConfirmModal({
    show = false,
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin ingin melanjutkan?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    variant = 'primary', // 'primary' | 'danger' | 'success'
    onConfirm = () => {},
    onClose = () => {},
}) {
    const variantStyles = {
        primary: {
            icon: HelpCircle,
            iconBg: 'bg-emerald-50 text-emerald-600',
            btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        },
        danger: {
            icon: Trash2,
            iconBg: 'bg-red-50 text-red-600',
            btnBg: 'bg-red-600 hover:bg-red-700 text-white',
        },
        success: {
            icon: CheckCircle2,
            iconBg: 'bg-green-50 text-green-600',
            btnBg: 'bg-green-600 hover:bg-green-700 text-white',
        },
    };

    const style = variantStyles[variant] || variantStyles.primary;
    const Icon = style.icon;

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6 text-center">
                <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${style.iconBg}`}>
                    <Icon size={28} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    {message}
                </p>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition shadow-sm ${style.btnBg}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
