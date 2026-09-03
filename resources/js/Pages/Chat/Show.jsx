import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Package } from 'lucide-react';

function timeFormat(dateString) {
    const d = new Date(dateString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function dateLabel(dateString) {
    const d = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Hari ini';
    if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
}

export default function Show({ partner, product, messages: initialMessages }) {
    const { auth } = usePage().props;
    const bottomRef = useRef(null);

    // State lokal untuk messages — bisa diupdate tanpa reload halaman
    const [messages, setMessages] = useState(initialMessages);
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);

    // Scroll ke bawah setiap ada pesan baru
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Subscribe ke channel private chat milik user yang sedang login
    // Akan menerima pesan baru secara real-time dari siapa pun yang mengirim
    useEffect(() => {
        const channel = window.Echo.private(`chat.${auth.user.id}`)
            .listen('.MessageSent', (e) => {
                const msg = e.message ?? e;

                // Hanya tampilkan pesan yang relevan dengan percakapan ini
                // (dari partner yang sama dan produk yang sama)
                const samePartner =
                    msg.sender_id === partner.id || msg.receiver_id === partner.id;
                const sameProduct = product
                    ? String(msg.product_id) === String(product.id)
                    : !msg.product_id;

                if (samePartner && sameProduct) {
                    setMessages((prev) => {
                        // Hindari duplikasi jika pesan sudah ada
                        if (prev.some((m) => m.id === msg.id)) return prev;
                        return [...prev, msg];
                    });
                }
            });

        return () => {
            channel.stopListening('.MessageSent');
            window.Echo.leave(`chat.${auth.user.id}`);
        };
    }, [auth.user.id, partner.id, product?.id]);

    // Kirim pesan via axios (AJAX) — tidak reload halaman
    async function handleSubmit(e) {
        e.preventDefault();
        if (!body.trim() || sending) return;

        setSending(true);
        const trimmedBody = body.trim();
        setBody('');

        // Optimistic UI: tambahkan pesan langsung di UI sebelum response dari server
        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            body: trimmedBody,
            sender_id: auth.user.id,
            receiver_id: partner.id,
            product_id: product?.id || null,
            created_at: new Date().toISOString(),
            sender: { id: auth.user.id, name: auth.user.name },
            isOptimistic: true,
        };
        setMessages((prev) => [...prev, optimisticMsg]);

        try {
            const res = await window.axios.post(
                `/chat/${partner.id}`,
                {
                    body: trimmedBody,
                    product_id: product?.id || null,
                },
                {
                    headers: { Accept: 'application/json' },
                }
            );

            // Ganti optimistic message dengan yang asli dari server
            const realMsg = res.data.message;
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === optimisticMsg.id ? { ...realMsg, sender: optimisticMsg.sender } : m
                )
            );
        } catch {
            // Hapus optimistic message jika gagal
            setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
            setBody(trimmedBody);
        } finally {
            setSending(false);
        }
    }

    // Group messages by date
    let lastDate = null;

    return (
        <AppLayout>
            <Head title={`Chat — ${partner.name}`} />
            <div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
                {/* Header */}
                <div className="bg-white rounded-t-xl border border-gray-100 p-4 flex items-center gap-3 flex-shrink-0">
                    <Link href="/chat" className="text-gray-400 hover:text-gray-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                        {partner.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{partner.name}</p>
                        {product && (
                            <Link href={`/products/${product.id}`} className="text-xs text-green-600 flex items-center gap-1 hover:underline">
                                <Package size={10} /> {product.title}
                            </Link>
                        )}
                    </div>
                    {/* Indikator koneksi real-time */}
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-green-600 font-medium">Live</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-gray-50 border-x border-gray-100 p-4 space-y-3">
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-sm text-gray-400">Mulai percakapan dengan {partner.name}</p>
                        </div>
                    )}

                    {messages.map((msg) => {
                        const isMine = msg.sender_id === auth.user.id;
                        const msgDate = dateLabel(msg.created_at);
                        let showDate = false;
                        if (msgDate !== lastDate) {
                            lastDate = msgDate;
                            showDate = true;
                        }

                        return (
                            <div key={msg.id}>
                                {showDate && (
                                    <div className="text-center my-4">
                                        <span className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
                                            {msgDate}
                                        </span>
                                    </div>
                                )}
                                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl transition-opacity ${
                                        msg.isOptimistic ? 'opacity-60' : 'opacity-100'
                                    } ${
                                        isMine
                                            ? 'bg-green-600 text-white rounded-br-md'
                                            : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{msg.body}</p>
                                        <p className={`text-[10px] mt-1 ${isMine ? 'text-green-200' : 'text-gray-400'}`}>
                                            {timeFormat(msg.created_at)}
                                            {msg.isOptimistic && ' · Mengirim...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="bg-white rounded-b-xl border border-gray-100 p-3 flex gap-2 flex-shrink-0">
                    <input
                        type="text"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={sending || !body.trim()}
                        className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}