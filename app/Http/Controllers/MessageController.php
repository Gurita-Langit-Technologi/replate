<?php

namespace App\Http\Controllers;

use App\Enums\NotificationType;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Inbox — daftar percakapan
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Ambil percakapan unik (grouped by partner + product)
        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($msg) use ($userId) {
                $partnerId = $msg->sender_id === $userId ? $msg->receiver_id : $msg->sender_id;
                $productId = $msg->product_id ?? 0;
                return $partnerId . '-' . $productId;
            })
            ->map(function ($messages) use ($userId) {
                $latest = $messages->first();
                $partnerId = $latest->sender_id === $userId ? $latest->receiver_id : $latest->sender_id;
                $partner = User::find($partnerId);
                $product = $latest->product_id ? Product::find($latest->product_id) : null;
                $unread = $messages->where('receiver_id', $userId)->where('is_read', false)->count();

                return [
                    'partner' => $partner,
                    'product' => $product,
                    'latest_message' => $latest->body,
                    'latest_time' => $latest->created_at,
                    'unread' => $unread,
                    'partner_id' => $partnerId,
                    'product_id' => $latest->product_id,
                ];
            })
            ->values();

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Percakapan dengan user tertentu (opsional: tentang produk tertentu)
     */
    public function show(Request $request, User $partner, ?Product $product = null)
    {
        $userId = $request->user()->id;
        $productId = $product?->id;

        $query = Message::where(function ($q) use ($userId, $partner) {
                $q->where('sender_id', $userId)->where('receiver_id', $partner->id);
            })
            ->orWhere(function ($q) use ($userId, $partner) {
                $q->where('sender_id', $partner->id)->where('receiver_id', $userId);
            });

        if ($productId) {
            $query->where('product_id', $productId);
        }

        $messages = $query->orderBy('created_at', 'asc')->get()->load('sender');

        // Tandai pesan sebagai dibaca
        Message::where('sender_id', $partner->id)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->when($productId, fn($q) => $q->where('product_id', $productId))
            ->update(['is_read' => true]);

        return Inertia::render('Chat/Show', [
            'partner' => $partner,
            'product' => $product,
            'messages' => $messages,
        ]);
    }

    /**
     * Kirim pesan
     */
    public function store(Request $request, User $partner)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:1000',
            'product_id' => 'nullable|exists:products,id',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $partner->id,
            'product_id' => $validated['product_id'] ?? null,
            'body' => $validated['body'],
        ]);

        // Notifikasi ke penerima
        Notification::create([
            'user_id' => $partner->id,
            'title' => 'Pesan baru',
            'message' => "{$request->user()->name}: " . substr($validated['body'], 0, 50) . (strlen($validated['body']) > 50 ? '...' : ''),
            'type' => NotificationType::TRANSACTION,
            'related_id' => $message->id,
            'related_type' => Message::class,
        ]);

        $productParam = $validated['product_id'] ? "/{$validated['product_id']}" : '';
        return redirect("/chat/{$partner->id}{$productParam}");
    }

    /**
     * Mulai chat dari halaman produk
     */
    public function startFromProduct(Request $request, Product $product)
    {
        if ($product->user_id === $request->user()->id) {
            return back()->with('error', 'Tidak bisa chat dengan diri sendiri.');
        }

        return redirect("/chat/{$product->user_id}/{$product->id}");
    }
}