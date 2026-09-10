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
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function __construct(
        protected ImageService $imageService
    ) {}
    /**
     * Beli produk
     */
    public function buy(Request $request, Product $product)
    {
        $user = $request->user();

        if ($user->isAdmin() || $user->isPartner()) {
            return back()->with('error', 'Akun admin atau mitra tidak dapat melakukan pembelian.');
        }

        // Tidak bisa beli produk sendiri
        if ($product->user_id === $user->id) {
            return back()->with('error', 'Tidak bisa membeli produk sendiri.');
        }

        // Produk harus masih aktif / timeout stage 1
        $statusValue = $product->status instanceof \BackedEnum ? $product->status->value : (string) $product->status;
        if (!in_array($statusValue, [ProductStatus::ACTIVE->value, ProductStatus::TIMEOUT_STAGE_1->value, 'active', 'timeout_stage_1'])) {
            return back()->with('error', 'Produk sudah tidak tersedia.');
        }

        // Produk harus mode jual
        $modeValue = $product->transaction_mode instanceof \BackedEnum ? $product->transaction_mode->value : (string) $product->transaction_mode;
        if (!in_array($modeValue, [TransactionMode::SELL->value, TransactionMode::SELL_AND_BARTER->value, 'sell', 'sell_and_barter'])) {
            return back()->with('error', 'Produk ini tidak dijual.');
        }

        // Hitung sisa stok yang tersedia (dikurangi transaksi pending/confirmed)
        $reservedQty = (int) Transaction::where('product_id', $product->id)
            ->whereIn('status', [TransactionStatus::PENDING, TransactionStatus::CONFIRMED])
            ->sum('quantity');

        $totalStock = (int) ($product->quantity ?? 1);
        $availableQty = max(0, $totalStock - $reservedQty);

        if ($availableQty <= 0) {
            return back()->with('error', "Seluruh stok produk \"{$product->title}\" ({$totalStock} {$product->unit}) sedang dalam proses transaksi oleh pembeli lain.");
        }

        $requestQty = (int) $request->input('quantity', 1);
        if ($requestQty < 1) {
            $requestQty = 1;
        } elseif ($requestQty > $availableQty) {
            return back()->with('error', "Jumlah yang diminta ({$requestQty} {$product->unit}) melebihi sisa stok yang tersedia ({$availableQty} {$product->unit}).");
        }

        $unitPrice = (int) ($product->discounted_price ?? $product->price ?? 0);
        $totalPrice = (int) round($unitPrice * $requestQty);

        $transaction = DB::transaction(function () use ($product, $user, $requestQty, $totalPrice, $availableQty, $totalStock) {
            // Buat transaksi
            $tx = Transaction::create([
                'product_id' => $product->id,
                'buyer_id' => $user->id,
                'seller_id' => $product->user_id,
                'type' => TransactionType::SALE,
                'status' => TransactionStatus::PENDING,
                'price' => $totalPrice,
                'quantity' => $requestQty,
                'notes' => "Jumlah: {$requestQty} {$product->unit}",
            ]);

            $remainingAfter = $availableQty - $requestQty;
            $remainingInfo = $remainingAfter > 0
                ? " Sisa stok tersedia untuk pembeli lain: {$remainingAfter} {$product->unit}."
                : " Seluruh stok ({$totalStock} {$product->unit}) kini telah dipesan.";

            // Notifikasi informatif ke penjual
            Notification::create([
                'user_id' => $product->user_id,
                'title' => "Pesanan Masuk ({$requestQty} {$product->unit})",
                'message' => "{$user->name} memesan {$requestQty} {$product->unit} \"{$product->title}\" seharga Rp " . number_format($totalPrice, 0, ',', '.') . ".{$remainingInfo}",
                'type' => NotificationType::TRANSACTION,
                'related_id' => $tx->id,
                'related_type' => Transaction::class,
            ]);

            // Notifikasi informatif ke pembeli
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Pesanan Berhasil Diajukan',
                'message' => "Pesanan Anda untuk {$requestQty} {$product->unit} \"{$product->title}\" (Rp " . number_format($totalPrice, 0, ',', '.') . ") telah dikirim ke penjual. Menunggu konfirmasi penjual.",
                'type' => NotificationType::TRANSACTION,
                'related_id' => $tx->id,
                'related_type' => Transaction::class,
            ]);

            return $tx;
        });

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

        $qtyStr = $transaction->quantity ? "{$transaction->quantity} {$transaction->product->unit} " : "";

        // Notifikasi informatif ke pembeli
        Notification::create([
            'user_id' => $transaction->buyer_id,
            'title' => 'Pesanan Dikonfirmasi Penjual!',
            'message' => "Penjual telah mengkonfirmasi pesanan {$qtyStr}\"{$transaction->product->title}\". Silakan hubungi penjual untuk pengambilan produk.",
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

        // Update stok produk
        $product = $transaction->product;
        $boughtQty = max(1, (int) ($transaction->quantity ?? 1));
        if ($boughtQty <= 1 && preg_match('/Jumlah:\s*(\d+)/i', $transaction->notes ?? '', $matches)) {
            $boughtQty = max(1, (int) $matches[1]);
        }

        $currentQty = max(0, (int) ($product->quantity ?? 1));
        if ($boughtQty >= $currentQty) {
            $newProductStatus = match ($transaction->type) {
                TransactionType::DONATION, TransactionType::DONATION->value => ProductStatus::DONATED,
                TransactionType::BARTER, TransactionType::BARTER->value => ProductStatus::BARTERED,
                default => ProductStatus::SOLD,
            };
            $product->update([
                'quantity' => 0,
                'status' => $newProductStatus,
            ]);

            BarterOffer::where('product_id', $transaction->product_id)
                ->where('status', BarterOfferStatus::PENDING)
                ->update(['status' => BarterOfferStatus::REJECTED]);
        } else {
            $newQty = $currentQty - $boughtQty;
            $newWeight = ($product->weight_grams > 0)
                ? max(0, (int) round(($product->weight_grams / $currentQty) * $newQty))
                : 0;
            $product->update([
                'quantity' => $newQty,
                'weight_grams' => $newWeight,
            ]);

            // Tolak barter offer yang meminta melebihi stok yang tersisa
            BarterOffer::where('product_id', $transaction->product_id)
                ->where('status', BarterOfferStatus::PENDING)
                ->where('quantity', '>', $newQty)
                ->update(['status' => BarterOfferStatus::REJECTED]);
        }

        // === REPOIN SYSTEM ===
        $product = $transaction->product;
        $points = PointHistory::calculatePoints($product);

        // Penjual/pendonor dapat poin
        $condStr = $product->condition instanceof \BackedEnum ? $product->condition->value : (string) $product->condition;
        PointHistory::awardPoints(
            $transaction->seller,
            $points,
            "Produk \"{$product->title}\" tersalurkan ({$product->weight_grams}g, {$condStr})",
            match ($transaction->type) {
                TransactionType::SALE, TransactionType::SALE->value => 'earned_sell',
                TransactionType::BARTER, TransactionType::BARTER->value => 'earned_barter',
                TransactionType::DONATION, TransactionType::DONATION->value => 'earned_donate',
                default => 'earned_sell',
            },
            $transaction
        );

        $remainMsg = $currentQty > $boughtQty
            ? " Sisa stok produk di marketplace: " . ($currentQty - $boughtQty) . " {$product->unit}."
            : " Seluruh stok telah berhasil disalurkan.";

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
            'title' => 'Transaksi Selesai!',
            'message' => "Pembeli telah menerima {$boughtQty} {$product->unit} \"{$transaction->product->title}\".{$remainMsg}",
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

        $product = $transaction->product;
        $desaName = $product->desa ?? 'Replate';
        $ticketCode = "DROP-TX{$transaction->id}";
        $dropAddress = "Pos Drop-Off BUMDes Desa {$desaName}, Jl. Desa No. 1";

        $transaction->update([
            'status' => TransactionStatus::DISPUTE_SPOILED,
            'notes' => "Dispute Makanan Basi. Tiket Drop-Off: {$ticketCode} | Lokasi: {$dropAddress}",
        ]);

        $product->update([
            'status' => ProductStatus::DIALIHKAN_KE_MITRA,
            'pickup_type' => 'drop_point',
            'pickup_address' => $dropAddress,
            'pickup_notes' => "Tiket: {$ticketCode}. Wajib kemasan tertutup rapat. Serahkan ke Petugas Pos BUMDes.",
        ]);

        // Auto-route ke partner berdasarkan kondisi produk & sisa kuota harian
        $conditionVal = $product->condition instanceof \BackedEnum ? $product->condition->value : (string) $product->condition;
        $partnerType = match ($conditionVal) {
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
                'notes' => "Tiket: {$ticketCode} | Pengambilan di {$dropAddress} (Bulk Pickup)",
            ]);

            Notification::create([
                'user_id' => $partner->user_id,
                'title' => "Produk Dispute Masuk ke Pos Drop-Off ({$weightKg}kg)",
                'message' => "\"{$product->title}\" ({$weightKg}kg) dialihkan ke Pos Drop-Off BUMDes (Tiket: {$ticketCode}). Silakan ambil di Pos Drop-Off saat jadwal pengangkutan.",
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
            'description' => "Dispute makanan basi. Tiket Drop-Off: {$ticketCode} ke Pos BUMDes.",
        ]);

        // Notifikasi ke penjual
        Notification::create([
            'user_id' => $transaction->seller_id,
            'title' => 'Transaksi Di-Dispute (Alih ke Pos BUMDes)',
            'message' => "Pembeli melaporkan bahwa \"{$transaction->product->title}\" basi/rusak. Silakan antarkan sisa makanan dalam kemasan tertutup ke Pos Drop-Off BUMDes dengan Tiket: {$ticketCode}.",
            'type' => NotificationType::TRANSACTION,
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return back()->with('success', "Keluhan berhasil dilaporkan. Tiket Drop-Off: {$ticketCode}. Produk dialihkan ke Pos Drop-Off BUMDes untuk diolah mitra.");
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
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        if ($user->isPartner()) {
            return redirect()->route('partner.dashboard');
        }

        $period = $request->input('period', 'all');
        if (!in_array($period, ['all', 'week', 'month', 'year'])) {
            $period = 'all';
        }

        $query = Transaction::with(['product', 'buyer', 'seller'])
            ->where(function ($q) use ($user) {
                $q->where('buyer_id', $user->id)
                  ->orWhere('seller_id', $user->id);
            });

        if ($period === 'week') {
            $query->whereBetween('transactions.created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($period === 'month') {
            $query->whereBetween('transactions.created_at', [now()->startOfMonth(), now()->endOfMonth()]);
        } elseif ($period === 'year') {
            $query->whereBetween('transactions.created_at', [now()->startOfYear(), now()->endOfYear()]);
        }

        $transactions = $query->orderBy('transactions.created_at', 'desc')->get();

        $allQuery = Transaction::where(function ($q) use ($user) {
            $q->where('transactions.buyer_id', $user->id)
              ->orWhere('transactions.seller_id', $user->id);
        });

        $periodCounts = [
            'all' => (clone $allQuery)->count(),
            'week' => (clone $allQuery)->whereBetween('transactions.created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'month' => (clone $allQuery)->whereBetween('transactions.created_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
            'year' => (clone $allQuery)->whereBetween('transactions.created_at', [now()->startOfYear(), now()->endOfYear()])->count(),
        ];

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions,
            'currentPeriod' => $period,
            'periodCounts' => $periodCounts,
        ]);
    }

    /**
     * Klaim donasi dengan kuantitas yang bisa dipilih
     */
    public function claimDonation(Request $request, Product $product)
    {
        $user = $request->user();

        if ($user->isAdmin() || $user->isPartner()) {
            return back()->with('error', 'Akun admin atau mitra tidak dapat mengklaim donasi.');
        }

        // Tidak bisa klaim donasi sendiri
        if ($product->user_id === $user->id) {
            return back()->with('error', 'Tidak bisa mengklaim donasi produk sendiri.');
        }

        $modeValue = $product->transaction_mode instanceof \BackedEnum ? $product->transaction_mode->value : (string) $product->transaction_mode;
        $statusValue = $product->status instanceof \BackedEnum ? $product->status->value : (string) $product->status;

        // Produk harus mode donasi atau sudah masuk jalur donasi (timeout stage 2)
        $isDonation = in_array($modeValue, ['donate', TransactionMode::DONATE->value]) && in_array($statusValue, ['active', 'timeout_stage_1', ProductStatus::ACTIVE->value, ProductStatus::TIMEOUT_STAGE_1->value]);
        $isTimeoutDonation = in_array($statusValue, ['timeout_stage_2', ProductStatus::TIMEOUT_STAGE_2->value]);

        if (!$isDonation && !$isTimeoutDonation) {
            return back()->with('error', 'Produk ini tidak tersedia untuk donasi.');
        }

        // Hitung sisa stok yang tersedia (dikurangi transaksi pending/confirmed)
        $reservedQty = (int) Transaction::where('product_id', $product->id)
            ->whereIn('status', [TransactionStatus::PENDING, TransactionStatus::CONFIRMED])
            ->sum('quantity');

        $totalStock = (int) ($product->quantity ?? 1);
        $availableQty = max(0, $totalStock - $reservedQty);

        if ($availableQty <= 0) {
            return back()->with('error', "Seluruh stok donasi \"{$product->title}\" ({$totalStock} {$product->unit}) sedang dalam proses klaim oleh pengguna lain.");
        }

        // Validasi kuantitas yang diminta
        $requestQty = (int) $request->input('quantity', 1);
        if ($requestQty <= 0) {
            return back()->with('error', 'Jumlah donasi yang diambil minimal 1 ' . ($product->unit || 'satuan') . '.');
        } elseif ($requestQty > $availableQty) {
            return back()->with('error', "Jumlah yang diminta ({$requestQty} {$product->unit}) melebihi sisa donasi yang tersedia ({$availableQty} {$product->unit}).");
        }

        // Buat transaksi donasi dengan kuantitas yang dipilih dalam DB transaction
        $transaction = DB::transaction(function () use ($product, $user, $requestQty, $availableQty, $totalStock) {
            $tx = Transaction::create([
                'product_id' => $product->id,
                'buyer_id' => $user->id,
                'seller_id' => $product->user_id,
                'type' => TransactionType::DONATION,
                'status' => TransactionStatus::PENDING,
                'quantity' => $requestQty,
                'notes' => "Klaim donasi: {$requestQty} {$product->unit}",
            ]);

            $remainingAfter = $availableQty - $requestQty;
            $remainingInfo = $remainingAfter > 0
                ? " Sisa donasi tersedia untuk warga lain: {$remainingAfter} {$product->unit}."
                : " Seluruh stok donasi ({$totalStock} {$product->unit}) kini telah habis diklaim.";

            // Notifikasi ke pendonor
            Notification::create([
                'user_id' => $product->user_id,
                'title' => "Klaim Donasi Masuk ({$requestQty} {$product->unit})",
                'message' => "{$user->name} ingin mengambil {$requestQty} {$product->unit} donasi \"{$product->title}\".{$remainingInfo}",
                'type' => NotificationType::TRANSACTION,
                'related_id' => $tx->id,
                'related_type' => Transaction::class,
            ]);

            // Notifikasi ke penerima donasi
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Pengajuan Donasi Berhasil',
                'message' => "Permintaan klaim {$requestQty} {$product->unit} donasi \"{$product->title}\" telah dikirim ke pendonor. Menunggu konfirmasi pendonor.",
                'type' => NotificationType::TRANSACTION,
                'related_id' => $tx->id,
                'related_type' => Transaction::class,
            ]);

            return $tx;
        });

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

        $path = $this->imageService->storeOptimized($request->file('proof_photo'), 'proofs');
        $transaction->update(['proof_photo' => $path]);

        return back()->with('success', 'Foto bukti transaksi berhasil diunggah.');
    }
}