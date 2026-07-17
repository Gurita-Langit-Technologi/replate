import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { ArrowLeft, Send, Package, RefreshCw } from 'lucide-react';

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

export default function Show({ partner, product, messages }) {
    const { auth } = usePage().props;
    const bottomRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        body: '',
        product_id: product?.id || null,
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!data.body.trim()) return;
        post(`/chat/${partner.id}`, {
            onSuccess: () => reset('body'),
            preserveScroll: true,
        });
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
                    <Link
                        href={product ? `/chat/${partner.id}/${product.id}` : `/chat/${partner.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-gray-50 border-x border-gray-100 p-4 space-y-3">
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-sm text-gray-400">Mulai percakapan dengan {partner.name}</p>
                        </div>
                    )}

                    {messages.map((msg, i) => {
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
                                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                                        isMine
                                            ? 'bg-green-600 text-white rounded-br-md'
                                            : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{msg.body}</p>
                                        <p className={`text-[10px] mt-1 ${isMine ? 'text-green-200' : 'text-gray-400'}`}>
                                            {timeFormat(msg.created_at)}
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
                        value={data.body}
                        onChange={e => setData('body', e.target.value)}
                        placeholder="Ketik pesan..."
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={processing || !data.body.trim()}
                        className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}