import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { MessageCircle, Package } from 'lucide-react';

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}j lalu`;
    return `${Math.floor(seconds / 86400)}h lalu`;
}

export default function Index({ conversations }) {
    return (
        <AppLayout>
            <Head title="Chat" />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Chat</h1>

                {conversations.length > 0 ? (
                    <div className="space-y-2">
                        {conversations.map((conv, i) => {
                            const url = conv.product_id
                                ? `/chat/${conv.partner_id}/${conv.product_id}`
                                : `/chat/${conv.partner_id}`;
                            return (
                                <Link
                                    key={i}
                                    href={url}
                                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm hover:border-gray-200 transition"
                                >
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold flex-shrink-0">
                                        {conv.partner?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-900">{conv.partner?.name}</p>
                                            <span className="text-xs text-gray-400">{timeAgo(conv.latest_time)}</span>
                                        </div>
                                        {conv.product && (
                                            <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                                                <Package size={10} /> {conv.product.title}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500 truncate mt-0.5">{conv.latest_message}</p>
                                    </div>
                                    {conv.unread > 0 && (
                                        <span className="w-5 h-5 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                            {conv.unread}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                        <MessageCircle size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-500 mb-1">Belum ada percakapan</p>
                        <p className="text-sm text-gray-400">Chat dimulai dari halaman detail produk</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
