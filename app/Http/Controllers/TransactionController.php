<?php

namespace App\Http\Controllers;

use App\Enums\BarterOfferStatus;
use App\Enums\NotificationType;
use App\Enums\ProductStatus;
use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Enums\TransactionMode;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\BarterOffer;
use App\Models\Notification;
use App\Models\PartnerProfile;
use App\Models\PointHistory;
use App\Models\Product;
use App\Models\Report;
use App\Models\Review;
use App\Models\Transaction;
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
        if (!in_array($product->status, [ProductStatus::ACTIVE, ProductStatus::TIMEOUT_STAGE_1])) {
            return back()->with('error', 'Produk sudah tidak tersedia.');
        }

        // Produk harus mode jual
        if (!in_array($product->transaction_mode, [TransactionMode::SELL, TransactionMode::SELL_AND_BARTER])) {
            return back()->with('error', 'Produk ini tidak dijual.');
        }

        // Cek apakah sudah ada transaksi pending untuk produk ini
        $existing = Transaction::where('product_id', $product->id)
            ->where('status', TransactionStatus::PENDING)
            ->first();

        if ($existing) {
            return back()->with('error', 'Produk sedang dalam proses transaksi.');
        }

        // Buat transaksi
        $transaction = Transaction::create([
            'product_id' => $product->id,
            'buyer_id' => $user->id,
            'seller_id' => $product->user_id,
            'type' => TransactionType::SALE,
            'status' => TransactionStatus::PENDING,
            'price' => $product->discounted_price ?? $product->price,
        ]);

        // Notifikasi ke penjual
        Notification::create([
            'user_id' => $product->user_id,
            'title' => 'Ada pesanan masuk!',
            'message' => "{$user->name} ingin membeli \"{$product->title}\".",
            'type' => NotificationType::TRANSACTION,
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

        if ($transaction->status !== TransactionStatus::PENDING) {
            return back()->with('error', 'Transaksi tidak dalam status menunggu.');
        }

        $transaction->update(['status' => TransactionStatus::CONFIRMED]);

        // Notifikasi ke pembeli
        Notification::create([
            'user_id' => $transaction->buyer_id,
            'title' => 'Pesanan dikonfirmasi!',
            'message' => "Penjual telah mengkonfirmasi pesanan \"{$transaction->product->title}\". Silakan ambil produk.",
            'type' => NotificationType::TRANSACTION,
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

        if ($transaction->status !== TransactionStatus::CONFIRMED) {
            return back()->with('error', 'Transaksi belum dikonfirmasi penjual.');
        }

        $transaction->update(['status' => TransactionStatus::COMPLETED]);

        BarterOffer::where('product_id', $transaction->product_id)
            ->where('status', BarterOfferStatus::PENDING)
            ->update(['status' => BarterOfferStatus::REJECTED]);

        // Update status produk sesuai tipe transaksi
        $newProductStatus = match ($transaction->type) {
            TransactionType::DONATION, TransactionType::DONATION->value => ProductStatus::DONATED,
            TransactionType::BARTER, TransactionType::BARTER->value => ProductStatus::BARTERED,
            default => ProductStatus::SOLD,
        };
        $transaction->product->update(['status' => $newProductStatus]);

        // === REPOIN SYSTEM ===
        $product = $transaction->product;
        $points = PointHistory::calculatePoints($product);

        // Penjual/pendonor dapat poin
        PointHistory::awardPoints(
            $transaction->seller,
            $points,
            "Produk \"{$product->title}\" tersalurkan ({$product->weight_grams}g, {$product->condition})",
            match ($transaction->type) {
                TransactionType::SALE, TransactionType::SALE->value => 'earned_sell',
                TransactionType::BARTER, TransactionType::BARTER->value => 'earned_barter',
                TransactionType::DONATION, TransactionType::DONATION->value => 'earned_donate',
                default => 'earned_sell',
            },
            $transaction
        );

        // Notifikasi poin
        Notification::create([
            'user_id' => $transaction->seller_id,
            'title' => "Dapat {$points} RePoin!",
            'message' => "Anda mendapat {$points} RePoin dari \"{$product->title}\". Saldo: {$transaction->seller->fresh()->points} poin.",
            'type' => NotificationType::TRANSACTION,
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        // Notifikasi ke penjual
        Notification::create([
            'user_id' => $transaction->seller_id,
            'title' => 'Transaksi selesai!',
            'message' => "Pembeli telah menerima \"{$transaction->product->title}\". Transaksi selesai.",
            'type' => NotificationType::TRANSACTION,
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', 'Transaksi selesai!');
    }

    /**
     * Pembeli melaporkan produk basi/rusak (Dispute)
     */
    public function dispute(Request $request, Transaction $transaction)
    {
        // Hanya pembeli yang bisa dispute
        if ($transaction->buyer_id !== $request->user()->id) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        if ($transaction->status !== TransactionStatus::CONFIRMED) {
            return back()->with('error', 'Transaksi belum dikonfirmasi penjual atau sudah selesai.');
        }

        $transaction->update(['status' => TransactionStatus::DISPUTE_SPOILED]);
        $product = $transaction->product;
        $product->update(['status' => ProductStatus::DIALIHKAN_KE_MITRA]);

        // Auto-route ke partner berdasarkan kondisi produk & sisa kuota harian
        $partnerType = match ($product->condition) {
            'layak_konsumsi' => ['umkm', 'kompos'],
            'layak_olah' => ['umkm', 'kompos'],
            'layak_pakan_kompos' => ['peternak', 'kompos', 'maggot'],
            default => ['kompos'],
        };

        $weightKg = ($product->weight_grams > 0) ? round($product->weight_grams / 1000) : $product->quantity;

        $partner = PartnerProfile::where('is_active', true)
            ->whereIn('partner_type', $partnerType)
            ->whereRaw('today_received_kg + ? <= daily_capacity_kg', [$weightKg])
            ->first();

        if (!$partner) {
            $partner = PartnerProfile::where('is_active', true)
                ->whereIn('partner_type', $partnerType)
                ->first();
        }

        if ($partner) {
            $partner->increment('today_received_kg', $weightKg);

            Transaction::create([
                'product_id' => $product->id,
                'buyer_id' => $partner->user_id,
                'seller_id' => $product->user_id,
                'type' => TransactionType::PARTNER_TRANSFER,
                'status' => TransactionStatus::PENDING,
                'partner_id' => $partner->user_id,
                'notes' => 'Dialihkan ke mitra akibat produk basi/rusak (DISPUTE_SPOILED)',
            ]);

            Notification::create([
                'user_id' => $partner->user_id,
                'title' => 'Produk Dispute Dialihkan ke Anda',
                'message' => "\"{$product->title}\" ({$weightKg}kg) dialihkan ke Anda setelah dilaporkan basi/rusak.",
                'type' => NotificationType::PARTNER_TRANSFER,
                'related_id' => $product->id,
                'related_type' => Product::class,
            ]);
        }

        // Buat Report otomatis
        Report::create([
            'reporter_id' => $request->user()->id,
            'product_id' => $transaction->product_id,
            'reason' => ReportReason::DISPUTE_SPOILED,
            'status' => ReportStatus::PENDING,
        ]);

        // Notifikasi ke penjual
        Notification::create([
            'user_id' => $transaction->seller_id,
            'title' => 'Transaksi Di-Dispute',
            'message' => "Pembeli melaporkan bahwa \"{$transaction->product->title}\" basi/rusak. Produk dialihkan ke mitra pengolah dan admin akan meninjau.",
            'type' => NotificationType::TRANSACTION,
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', 'Keluhan berhasil dilaporkan. Produk telah dialihkan ke mitra pengolah.');
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

        if (in_array($transaction->status, [TransactionStatus::COMPLETED, TransactionStatus::CANCELLED])) {
            return back()->with('error', 'Transaksi tidak bisa dibatalkan.');
        }

        $transaction->update(['status' => TransactionStatus::CANCELLED]);

        // Notifikasi ke pihak lain
        $notifyUserId = $request->user()->id === $transaction->buyer_id
            ? $transaction->seller_id
            : $transaction->buyer_id;

        Notification::create([
            'user_id' => $notifyUserId,
            'title' => 'Transaksi dibatalkan',
            'message' => "Transaksi untuk \"{$transaction->product->title}\" telah dibatalkan.",
            'type' => NotificationType::TRANSACTION,
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

        if ($transaction->status !== TransactionStatus::PENDING) {
            return back()->with('error', 'Transaksi sudah diproses.');
        }

        $transaction->update(['status' => TransactionStatus::COMPLETED]);
        $transaction->product->update(['status' => ProductStatus::TRANSFERRED]);

        // === REPOIN untuk penjual asli ===
        $product = $transaction->product;
        $points = PointHistory::calculatePoints($product);

        PointHistory::awardPoints(
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
            'type' => NotificationType::PARTNER_TRANSFER,
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

        $transaction->load(['product', 'buyer', 'seller', 'reviews.reviewer']);

        $hasReviewed = Review::where('transaction_id', $transaction->id)
            ->where('reviewer_id', $user->id)
            ->exists();

        return Inertia::render('Transaction/Show', [
            'transaction' => $transaction,
            'isBuyer' => $user->id === $transaction->buyer_id,
            'isSeller' => $user->id === $transaction->seller_id,
            'hasReviewed' => $hasReviewed,
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
        $isDonation = $product->transaction_mode === TransactionMode::DONATE && in_array($product->status, [ProductStatus::ACTIVE, ProductStatus::TIMEOUT_STAGE_1]);
        $isTimeoutDonation = $product->status === ProductStatus::TIMEOUT_STAGE_2;

        if (!$isDonation && !$isTimeoutDonation) {
            return back()->with('error', 'Produk ini tidak tersedia untuk donasi.');
        }

        // Cek apakah sudah ada klaim pending
        $existing = Transaction::where('product_id', $product->id)
            ->where('status', TransactionStatus::PENDING)
            ->first();

        if ($existing) {
            return back()->with('error', 'Produk sudah diklaim oleh orang lain.');
        }

        // Buat transaksi donasi
        $transaction = Transaction::create([
            'product_id' => $product->id,
            'buyer_id' => $user->id,
            'seller_id' => $product->user_id,
            'type' => TransactionType::DONATION,
            'status' => TransactionStatus::PENDING,
        ]);

        // Notifikasi ke pendonor
        Notification::create([
            'user_id' => $product->user_id,
            'title' => 'Donasi Anda diklaim!',
            'message' => "{$user->name} ingin mengambil donasi \"{$product->title}\".",
            'type' => NotificationType::TRANSACTION,
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return redirect("/transactions/{$transaction->id}");
    }

    /**
     * Pendonor menyetujui klaim donasi
     */
    public function acceptDonation(Request $request, Transaction $transaction)
    {
        if ($transaction->seller_id !== $request->user()->id) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        if ($transaction->type !== TransactionType::DONATION && $transaction->type !== TransactionType::DONATION->value) {
            return back()->with('error', 'Transaksi ini bukan transaksi donasi.');
        }

        if ($transaction->status !== TransactionStatus::PENDING) {
            return back()->with('error', 'Klaim donasi tidak dalam status menunggu konfirmasi.');
        }

        $transaction->update(['status' => TransactionStatus::CONFIRMED]);

        Notification::create([
            'user_id' => $transaction->buyer_id,
            'title' => 'Klaim Donasi Disetujui!',
            'message' => "Pendonor telah menyetujui klaim donasi \"{$transaction->product->title}\". Silakan ambil produk di lokasi.",
            'type' => NotificationType::TRANSACTION,
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', 'Klaim donasi telah disetujui.');
    }

    /**
     * Pendonor menolak klaim donasi
     */
    public function rejectDonation(Request $request, Transaction $transaction)
    {
        if ($transaction->seller_id !== $request->user()->id) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        if ($transaction->type !== TransactionType::DONATION && $transaction->type !== TransactionType::DONATION->value) {
            return back()->with('error', 'Transaksi ini bukan transaksi donasi.');
        }

        if ($transaction->status !== TransactionStatus::PENDING) {
            return back()->with('error', 'Klaim donasi tidak dalam status menunggu konfirmasi.');
        }

        $transaction->update(['status' => TransactionStatus::CANCELLED]);

        // Reset status produk agar bisa diklaim penerima lain
        $product = $transaction->product;
        $restoredStatus = ($product->timeout_at && $product->timeout_at <= now())
            ? ProductStatus::TIMEOUT_STAGE_2
            : ProductStatus::ACTIVE;
        $product->update(['status' => $restoredStatus]);

        Notification::create([
            'user_id' => $transaction->buyer_id,
            'title' => 'Klaim Donasi Ditolak',
            'message' => "Pendonor menolak klaim Anda untuk \"{$transaction->product->title}\". Produk telah kembali tayang.",
            'type' => NotificationType::TRANSACTION,
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', 'Klaim donasi ditolak. Produk telah kembali tayang.');
    }

    /**
     * Unggah foto bukti transaksi
     */
    public function uploadProofPhoto(Request $request, Transaction $transaction)
    {
        $user = $request->user();

        if (!in_array($user->id, [$transaction->buyer_id, $transaction->seller_id]) && !$user->isAdmin()) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        $request->validate([
            'proof_photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        $path = $request->file('proof_photo')->store('proofs', 'public');
        $transaction->update(['proof_photo' => $path]);

        return back()->with('success', 'Foto bukti transaksi berhasil diunggah.');
    }
}