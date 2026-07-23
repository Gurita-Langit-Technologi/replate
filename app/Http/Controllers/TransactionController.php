<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Beli produk
     */
    public function buy(Request $request, Product $product)
    {
        $user = $request->user();

        // Tidak bisa beli produk sendiri
        if ($product->user_id === $user->id) {
            return back()->with('error', 'Tidak bisa membeli produk sendiri.');
        }

        // Produk harus masih aktif / timeout stage 1
        if (!in_array($product->status, ['active', 'timeout_stage_1'])) {
            return back()->with('error', 'Produk sudah tidak tersedia.');
        }

        // Produk harus mode jual
        if (!in_array($product->transaction_mode, ['sell', 'sell_and_barter'])) {
            return back()->with('error', 'Produk ini tidak dijual.');
        }

        // Cek apakah sudah ada transaksi pending untuk produk ini
        $existing = Transaction::where('product_id', $product->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return back()->with('error', 'Produk sedang dalam proses transaksi.');
        }

        // Buat transaksi
        $transaction = Transaction::create([
            'product_id' => $product->id,
            'buyer_id' => $user->id,
            'seller_id' => $product->user_id,
            'type' => 'sale',
            'status' => 'pending',
            'price' => $product->discounted_price ?? $product->price,
        ]);

        // Notifikasi ke penjual
        Notification::create([
            'user_id' => $product->user_id,
            'title' => 'Ada pesanan masuk!',
            'message' => "{$user->name} ingin membeli \"{$product->title}\".",
            'type' => 'transaction',
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return redirect("/transactions/{$transaction->id}");
    }

    /**
     * Penjual konfirmasi pesanan
     */
    public function confirm(Request $request, Transaction $transaction)
    {
        // Hanya penjual yang bisa konfirmasi
        if ($transaction->seller_id !== $request->user()->id) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        if ($transaction->status !== 'pending') {
            return back()->with('error', 'Transaksi tidak dalam status menunggu.');
        }

        $transaction->update(['status' => 'confirmed']);

        // Notifikasi ke pembeli
        Notification::create([
            'user_id' => $transaction->buyer_id,
            'title' => 'Pesanan dikonfirmasi!',
            'message' => "Penjual telah mengkonfirmasi pesanan \"{$transaction->product->title}\". Silakan ambil produk.",
            'type' => 'transaction',
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', 'Pesanan dikonfirmasi.');
    }

    /**
     * Pembeli konfirmasi terima barang
     */
    public function complete(Request $request, Transaction $transaction)
    {
        // Hanya pembeli yang bisa complete
        if ($transaction->buyer_id !== $request->user()->id) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        if ($transaction->status !== 'confirmed') {
            return back()->with('error', 'Transaksi belum dikonfirmasi penjual.');
        }

        $transaction->update(['status' => 'completed']);

        \App\Models\BarterOffer::where('product_id', $transaction->product_id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

        // Update status produk
        $transaction->product->update(['status' => 'sold']);

        // === REPOIN SYSTEM ===
        $product = $transaction->product;
        $points = \App\Models\PointHistory::calculatePoints($product);

        // Penjual/pendonor dapat poin
        \App\Models\PointHistory::awardPoints(
            $transaction->seller,
            $points,
            "Produk \"{$product->title}\" tersalurkan ({$product->weight_grams}g, {$product->condition})",
            match ($transaction->type) {
                'sale' => 'earned_sell',
                'barter' => 'earned_barter',
                'donation' => 'earned_donate',
                default => 'earned_sell',
            },
            $transaction
        );

        // Notifikasi poin
        \App\Models\Notification::create([
            'user_id' => $transaction->seller_id,
            'title' => "Dapat {$points} RePoin!",
            'message' => "Anda mendapat {$points} RePoin dari \"{$product->title}\". Saldo: {$transaction->seller->fresh()->points} poin.",
            'type' => 'transaction',
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        // Notifikasi ke penjual
        Notification::create([
            'user_id' => $transaction->seller_id,
            'title' => 'Transaksi selesai!',
            'message' => "Pembeli telah menerima \"{$transaction->product->title}\". Transaksi selesai.",
            'type' => 'transaction',
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', 'Transaksi selesai!');
    }

    /**
     * Batalkan transaksi
     */
    public function cancel(Request $request, Transaction $transaction)
    {
        // Pembeli atau penjual bisa batalkan
        if (!in_array($request->user()->id, [$transaction->buyer_id, $transaction->seller_id])) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        if (in_array($transaction->status, ['completed', 'cancelled'])) {
            return back()->with('error', 'Transaksi tidak bisa dibatalkan.');
        }

        $transaction->update(['status' => 'cancelled']);

        // Notifikasi ke pihak lain
        $notifyUserId = $request->user()->id === $transaction->buyer_id
            ? $transaction->seller_id
            : $transaction->buyer_id;

        Notification::create([
            'user_id' => $notifyUserId,
            'title' => 'Transaksi dibatalkan',
            'message' => "Transaksi untuk \"{$transaction->product->title}\" telah dibatalkan.",
            'type' => 'transaction',
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', 'Transaksi dibatalkan.');
    }

    /**
     * Partner konfirmasi pengambilan
     */
    public function partnerConfirm(Request $request, Transaction $transaction)
    {
        $user = $request->user();

        if ($transaction->partner_id !== $user->id) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        if ($transaction->status !== 'pending') {
            return back()->with('error', 'Transaksi sudah diproses.');
        }

        $transaction->update(['status' => 'completed']);
        $transaction->product->update(['status' => 'transferred']);

        // === REPOIN untuk penjual asli ===
        $product = $transaction->product;
        $points = \App\Models\PointHistory::calculatePoints($product);

        \App\Models\PointHistory::awardPoints(
            User::find($transaction->seller_id),
            $points,
            "Produk \"{$product->title}\" diterima oleh mitra pengolah",
            'earned_partner',
            $transaction
        );

        Notification::create([
            'user_id' => $transaction->seller_id,
            'title' => 'Produk diambil oleh partner',
            'message' => "Partner telah mengambil \"{$transaction->product->title}\".",
            'type' => 'partner_transfer',
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', 'Pengambilan dikonfirmasi.');
    }

    /**
     * Detail transaksi
     */
    public function show(Request $request, Transaction $transaction)
    {
        $user = $request->user();

        // Hanya pembeli, penjual, atau admin yang bisa lihat
        if (!in_array($user->id, [$transaction->buyer_id, $transaction->seller_id]) && !$user->isAdmin()) {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki akses.');
        }

        $transaction->load(['product', 'buyer', 'seller']);

        return Inertia::render('Transaction/Show', [
            'transaction' => $transaction,
            'isBuyer' => $user->id === $transaction->buyer_id,
            'isSeller' => $user->id === $transaction->seller_id,
        ]);
    }

    /**
     * Riwayat transaksi user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $transactions = Transaction::with(['product', 'buyer', 'seller'])
            ->where('buyer_id', $user->id)
            ->orWhere('seller_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Klaim donasi
     */
    public function claimDonation(Request $request, Product $product)
    {
        $user = $request->user();

        // Tidak bisa klaim donasi sendiri
        if ($product->user_id === $user->id) {
            return back()->with('error', 'Tidak bisa mengklaim donasi produk sendiri.');
        }

        // Produk harus mode donasi atau sudah masuk jalur donasi (timeout stage 2)
        $isDonation = $product->transaction_mode === 'donate' && in_array($product->status, ['active', 'timeout_stage_1']);
        $isTimeoutDonation = $product->status === 'timeout_stage_2';

        if (!$isDonation && !$isTimeoutDonation) {
            return back()->with('error', 'Produk ini tidak tersedia untuk donasi.');
        }

        // Cek apakah sudah ada klaim pending
        $existing = Transaction::where('product_id', $product->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return back()->with('error', 'Produk sudah diklaim oleh orang lain.');
        }

        // Buat transaksi donasi
        $transaction = Transaction::create([
            'product_id' => $product->id,
            'buyer_id' => $user->id,
            'seller_id' => $product->user_id,
            'type' => 'donation',
            'status' => 'pending',
        ]);

        // Notifikasi ke pendonor
        Notification::create([
            'user_id' => $product->user_id,
            'title' => 'Donasi Anda diklaim!',
            'message' => "{$user->name} ingin mengambil donasi \"{$product->title}\".",
            'type' => 'transaction',
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return redirect("/transactions/{$transaction->id}");
    }

}