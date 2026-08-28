<?php

namespace App\Http\Controllers;

use App\Enums\NotificationType;
use App\Enums\TransactionStatus;
use App\Models\Notification;
use App\Models\Review;
use App\Models\Transaction;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Kirim ulasan/review transaksi
     */
    public function store(Request $request, Transaction $transaction)
    {
        $user = $request->user();

        // Hanya pembeli atau penjual yang terlibat dalam transaksi
        if (!in_array($user->id, [$transaction->buyer_id, $transaction->seller_id])) {
            return back()->with('error', 'Anda tidak memiliki akses untuk memberikan review.');
        }

        // Transaksi harus sudah selesai
        if ($transaction->status !== TransactionStatus::COMPLETED) {
            return back()->with('error', 'Review hanya dapat diberikan untuk transaksi yang telah selesai.');
        }

        // Tentukan siapa yang dinilai (reviewee)
        $revieweeId = ($user->id === $transaction->buyer_id)
            ? $transaction->seller_id
            : $transaction->buyer_id;

        if (!$revieweeId) {
            return back()->with('error', 'Penerima ulasan tidak ditemukan.');
        }

        // Cek apakah sudah pernah memberikan review untuk transaksi ini
        $existing = Review::where('transaction_id', $transaction->id)
            ->where('reviewer_id', $user->id)
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah memberikan ulasan untuk transaksi ini.');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::create([
            'transaction_id' => $transaction->id,
            'reviewer_id' => $user->id,
            'reviewee_id' => $revieweeId,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        // Notifikasi ke penerima ulasan
        Notification::create([
            'user_id' => $revieweeId,
            'title' => 'Ulasan Baru Diterima',
            'message' => "{$user->name} memberikan ulasan {$validated['rating']} bintang untuk transaksi \"{$transaction->product->title}\".",
            'type' => NotificationType::TRANSACTION,
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', 'Ulasan berhasil dikirim! Terima kasih.');
    }
}
