import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { MessageCircle, Package } from 'lucide-react';

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}j lalu`;
    return `${Math.floor(seconds / 86400)}h lalu`;
}

export default function Index({ conversations: initialConversations }) {
    const { auth } = usePage().props;
    const [conversations, setConversations] = useState(initialConversations);

    // Dengarkan pesan baru via Echo — update unread count & preview secara real-time
    useEffect(() => {
        if (!auth?.user?.id) return;

        const channel = window.Echo.private(`chat.${auth.user.id}`)
            .listen('.MessageSent', (e) => {
                const msg = e.message ?? e;
                setConversations((prev) => {
                    const key = `${msg.sender_id}-${msg.product_id ?? 0}`;
                    const existingIdx = prev.findIndex(
                        (c) =>
                            c.partner_id === msg.sender_id &&
                            String(c.product_id ?? 0) === String(msg.product_id ?? 0)
                    );

                    if (existingIdx !== -1) {
                        // Update conversation yang sudah ada
                        const updated = [...prev];
                        updated[existingIdx] = {
                            ...updated[existingIdx],
                            latest_message: msg.body,
                            latest_time: msg.created_at,
                            unread: (updated[existingIdx].unread || 0) + 1,
                        };
                        // Pindahkan ke posisi paling atas
                        const [conv] = updated.splice(existingIdx, 1);
                        return [conv, ...updated];
                    }

                    // Tambahkan conversation baru
                    return [
                        {
                            partner: msg.sender,
                            partner_id: msg.sender_id,
                            product_id: msg.product_id,
                            product: null,
                            latest_message: msg.body,
                            latest_time: msg.created_at,
                            unread: 1,
                        },
                        ...prev,
                    ];
                });
            });

        return () => {
            channel.stopListening('.MessageSent');
            window.Echo.leave(`chat.${auth.user.id}`);
        };
    }, [auth?.user?.id]);

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
                                    key={`${conv.partner_id}-${conv.product_id ?? 0}`}
                                    href={url}
                                    className={`flex items-center gap-4 p-4 bg-white rounded-xl border transition hover:shadow-sm ${
                                        conv.unread > 0
                                            ? 'border-emerald-200 bg-emerald-50/30'
                                            : 'border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold flex-shrink-0 relative">
                                        {conv.partner?.name?.charAt(0) || '?'}
                                        {conv.unread > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm ${conv.unread > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>
                                                {conv.partner?.name}
                                            </p>
                                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                                {timeAgo(conv.latest_time)}
                                            </span>
                                        </div>
                                        {conv.product && (
                                            <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                                                <Package size={10} /> {conv.product.title}
                                            </p>
                                        )}
                                        <p className={`text-sm truncate mt-0.5 ${conv.unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                                            {conv.latest_message}
                                        </p>
                                    </div>

                                    {conv.unread > 0 && (
                                        <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                            {conv.unread > 9 ? '9+' : conv.unread}
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
