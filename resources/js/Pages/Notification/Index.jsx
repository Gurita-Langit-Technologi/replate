import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Bell, ShoppingBasket, ArrowLeftRight, Clock, AlertTriangle, Shield } from 'lucide-react';

const typeConfig = {
    transaction: { icon: ShoppingBasket, color: 'bg-green-100 text-green-600' },
    barter_offer: { icon: ArrowLeftRight, color: 'bg-purple-100 text-purple-600' },
    timeout: { icon: Clock, color: 'bg-amber-100 text-amber-600' },
    report: { icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
    verification: { icon: Shield, color: 'bg-blue-100 text-blue-600' },
    partner_transfer: { icon: ArrowLeftRight, color: 'bg-orange-100 text-orange-600' },
};

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    return `${Math.floor(seconds / 86400)} hari lalu`;
}

export default function Index({ notifications }) {
    return (
        <AppLayout>
            <Head title="Notifikasi" />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifikasi</h1>

                {notifications.length > 0 ? (
                    <div className="space-y-2">
                        {notifications.map((notif) => {
                            const config = typeConfig[notif.type] || typeConfig.transaction;
                            const Icon = config.icon;

                            return (
                                <div
                                    key={notif.id}
                                    className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition
                                        ${notif.is_read ? 'border-gray-100' : 'border-green-200 bg-green-50/30'}`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.created_at)}</p>
                                    </div>
                                    {!notif.is_read && (
                                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                        <Bell size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400">Belum ada notifikasi</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}