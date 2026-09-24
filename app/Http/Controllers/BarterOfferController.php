<?php

namespace App\Http\Controllers;

use App\Enums\BarterOfferStatus;
use App\Enums\NotificationType;
use App\Enums\ProductStatus;
use App\Enums\TransactionMode;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\BarterOffer;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Transaction;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarterOfferController extends Controller
{
    public function __construct(
        protected EmailNotificationService $emailService
    ) {}
    /**
     * Form ajukan barter
     */
    public function create(Request $request, Product $product)
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        if ($user->isPartner()) {
            return redirect()->route('partner.dashboard');
        }

        return Inertia::render('Barter/Create', [
            'product' => $product->load('user'),
        ]);
    }

    /**
     * Simpan tawaran barter
     */
    public function store(Request $request, Product $product)
    {
        $user = $request->user();

        if ($user->isAdmin() || $user->isPartner()) {
            return back()->with('error', 'Akun admin atau mitra tidak dapat mengajukan barter.');
        }

        // Tidak bisa barter produk sendiri
        if ($product->user_id === $user->id) {
            return back()->with('error', 'Tidak bisa membarter produk sendiri.');
        }

        $statusValue = $product->status instanceof \BackedEnum ? $product->status->value : (string) $product->status;
        if (!in_array($statusValue, [ProductStatus::ACTIVE->value, ProductStatus::TIMEOUT_STAGE_1->value, 'active', 'timeout_stage_1'])) {
            return back()->with('error', 'Produk sudah tidak tersedia.');
        }

        $modeValue = $product->transaction_mode instanceof \BackedEnum ? $product->transaction_mode->value : (string) $product->transaction_mode;
        if (!in_array($modeValue, ['barter', 'sell_and_barter', TransactionMode::BARTER->value, TransactionMode::SELL_AND_BARTER->value])) {
            return back()->with('error', 'Produk ini tidak menerima barter.');
        }

        $availableQty = max(1, (int) ($product->quantity ?? 1));
        $validated = $request->validate([
            'quantity' => 'nullable|integer|min:1|max:' . $availableQty,
            'offer_description' => 'required|string',
            'offer_photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('offer_photo')) {
            $photoPath = $request->file('offer_photo')->store('barter-offers', 'public');
        }

        $barterQty = (int) ($validated['quantity'] ?? 1);

        $offer = BarterOffer::create([
            'product_id' => $product->id,
            'offerer_id' => $user->id,
            'quantity' => $barterQty,
            'offer_description' => $validated['offer_description'],
            'offer_photo' => $photoPath,
            'status' => BarterOfferStatus::PENDING,
        ]);

        // Notifikasi ke penjual
        Notification::create([
            'user_id' => $product->user_id,
            'title' => 'Tawaran barter masuk!',
            'message' => "{$user->name} menawarkan \"{$validated['offer_description']}\" untuk barter {$barterQty} {$product->unit} \"{$product->title}\".",
            'type' => NotificationType::BARTER_OFFER,
            'related_id' => $offer->id,
            'related_type' => BarterOffer::class,
        ]);

        // Pause timer produk selama negosiasi (max 12 jam)
        if (!$product->timer_paused) {
            $product->update([
                'timer_paused' => true,
                'timer_paused_at' => now(),
            ]);
        }

        $this->emailService->sendBarterOfferReceived($offer);

        return redirect("/products/{$product->id}")
            ->with('success', 'Tawaran barter terkirim! Menunggu respon penjual.');
    }

    /**
     * Daftar tawaran barter untuk produk saya
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

        // Tawaran yang masuk ke produk saya
        $incoming = BarterOffer::with(['product', 'offerer'])
            ->whereHas('product', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // Tawaran yang saya kirim
        $outgoing = BarterOffer::with(['product', 'product.user'])
            ->where('offerer_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Barter/Index', [
            'incoming' => $incoming,
            'outgoing' => $outgoing,
        ]);
    }

    /**
     * Penjual setujui barter
     */
    public function accept(Request $request, BarterOffer $offer)
    {
        $user = $request->user();

        // Hanya pemilik produk yang bisa setujui
        if ($offer->product->user_id !== $user->id) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        if ($offer->status !== BarterOfferStatus::PENDING) {
            return back()->with('error', 'Tawaran sudah diproses.');
        }

        $product = $offer->product;
        $barterQty = max(1, (int) ($offer->quantity ?? 1));
        $availableQty = max(1, (int) ($product->quantity ?? 1));

        // Setujui tawaran ini
        $offer->update(['status' => BarterOfferStatus::ACCEPTED]);

        // Perbarui stok produk
        if ($barterQty >= $availableQty) {
            $product->update([
                'quantity' => 0,
                'status' => ProductStatus::BARTERED,
            ]);

            // Tolak semua tawaran pending lain untuk produk ini
            BarterOffer::where('product_id', $offer->product_id)
                ->where('id', '!=', $offer->id)
                ->where('status', BarterOfferStatus::PENDING)
                ->update(['status' => BarterOfferStatus::REJECTED]);
        } else {
            $newQty = $availableQty - $barterQty;
            $newWeight = ($product->weight_grams > 0)
                ? max(0, (int) round(($product->weight_grams / $availableQty) * $newQty))
                : 0;

            $product->update([
                'quantity' => $newQty,
                'weight_grams' => $newWeight,
            ]);

            // Tolak tawaran pending lain yang meminta jumlah melebihi sisa stok
            BarterOffer::where('product_id', $offer->product_id)
                ->where('id', '!=', $offer->id)
                ->where('status', BarterOfferStatus::PENDING)
                ->where('quantity', '>', $newQty)
                ->update(['status' => BarterOfferStatus::REJECTED]);
        }

        // Buat transaksi barter
        $transaction = Transaction::create([
            'product_id' => $offer->product_id,
            'buyer_id' => $offer->offerer_id,
            'seller_id' => $user->id,
            'type' => TransactionType::BARTER,
            'status' => TransactionStatus::CONFIRMED,
            'quantity' => $barterQty,
            'notes' => "Jumlah barter: {$barterQty} {$product->unit}",
            'barter_notes' => $offer->offer_description,
        ]);

        // Notifikasi ke pembarter
        Notification::create([
            'user_id' => $offer->offerer_id,
            'title' => 'Barter disetujui!',
            'message' => "Tawaran barter Anda ({$barterQty} {$product->unit}) untuk \"{$product->title}\" telah disetujui. Silakan tukar produk.",
            'type' => NotificationType::BARTER_OFFER,
            'related_id' => $transaction->id,
            'related_type' => Transaction::class,
        ]);

        return redirect("/transactions/{$transaction->id}");
    }

    /**
     * Penjual tolak barter
     */
    public function reject(Request $request, BarterOffer $offer)
    {
        if ($offer->product->user_id !== $request->user()->id) {
            return back()->with('error', 'Anda tidak memiliki akses.');
        }

        if ($offer->status !== BarterOfferStatus::PENDING) {
            return back()->with('error', 'Tawaran sudah diproses.');
        }

        $offer->update(['status' => BarterOfferStatus::REJECTED]);

        // Notifikasi ke pembarter
        Notification::create([
            'user_id' => $offer->offerer_id,
            'title' => 'Barter ditolak',
            'message' => "Tawaran barter Anda untuk \"{$offer->product->title}\" ditolak oleh penjual.",
            'type' => NotificationType::BARTER_OFFER,
            'related_id' => $offer->id,
            'related_type' => BarterOffer::class,
        ]);

        return back()->with('success', 'Tawaran ditolak.');
    }
}