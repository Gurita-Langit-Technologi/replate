<?php

namespace App\Http\Controllers;

use App\Models\BarterOffer;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarterOfferController extends Controller
{
    /**
     * Form ajukan barter
     */
    public function create(Product $product)
    {
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

        // Tidak bisa barter produk sendiri
        if ($product->user_id === $user->id) {
            return back()->with('error', 'Tidak bisa membarter produk sendiri.');
        }

        // Produk harus aktif dan mode barter
        if (!in_array($product->status, ['active', 'timeout_stage_1'])) {
            return back()->with('error', 'Produk sudah tidak tersedia.');
        }

        if (!in_array($product->transaction_mode, ['barter', 'sell_and_barter'])) {
            return back()->with('error', 'Produk ini tidak menerima barter.');
        }

        $validated = $request->validate([
            'offer_description' => 'required|string',
            'offer_photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('offer_photo')) {
            $photoPath = $request->file('offer_photo')->store('barter-offers', 'public');
        }

        $offer = BarterOffer::create([
            'product_id' => $product->id,
            'offerer_id' => $user->id,
            'offer_description' => $validated['offer_description'],
            'offer_photo' => $photoPath,
            'status' => 'pending',
        ]);

        // Notifikasi ke penjual
        Notification::create([
            'user_id' => $product->user_id,
            'title' => 'Tawaran barter masuk!',
            'message' => "{$user->name} menawarkan \"{$validated['offer_description']}\" untuk \"{$product->title}\".",
            'type' => 'barter_offer',
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

        return redirect("/products/{$product->id}")
            ->with('success', 'Tawaran barter terkirim! Menunggu respon penjual.');
    }

    /**
     * Daftar tawaran barter untuk produk saya
     */
    public function index(Request $request)
    {
        $user = $request->user();

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

        if ($offer->status !== 'pending') {
            return back()->with('error', 'Tawaran sudah diproses.');
        }

        // Setujui tawaran ini
        $offer->update(['status' => 'accepted']);

        // Tolak tawaran lain untuk produk yang sama
        BarterOffer::where('product_id', $offer->product_id)
            ->where('id', '!=', $offer->id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

        // Buat transaksi barter
        $transaction = Transaction::create([
            'product_id' => $offer->product_id,
            'buyer_id' => $offer->offerer_id,
            'seller_id' => $user->id,
            'type' => 'barter',
            'status' => 'confirmed',
            'barter_notes' => $offer->offer_description,
        ]);

        // Notifikasi ke pembarter
        Notification::create([
            'user_id' => $offer->offerer_id,
            'title' => 'Barter disetujui!',
            'message' => "Tawaran barter Anda untuk \"{$offer->product->title}\" telah disetujui. Silakan tukar produk.",
            'type' => 'barter_offer',
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

        if ($offer->status !== 'pending') {
            return back()->with('error', 'Tawaran sudah diproses.');
        }

        $offer->update(['status' => 'rejected']);

        // Notifikasi ke pembarter
        Notification::create([
            'user_id' => $offer->offerer_id,
            'title' => 'Barter ditolak',
            'message' => "Tawaran barter Anda untuk \"{$offer->product->title}\" ditolak oleh penjual.",
            'type' => 'barter_offer',
            'related_id' => $offer->id,
            'related_type' => BarterOffer::class,
        ]);

        return back()->with('success', 'Tawaran ditolak.');
    }
}