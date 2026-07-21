<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\Notification;
use App\Models\PartnerProfile;
use App\Models\Transaction;
use App\Models\BarterOffer;
use Illuminate\Console\Command;

class ProcessProductTimeout extends Command
{
    protected $signature = 'products:process-timeout';
    protected $description = 'Proses timeout otomatis: diskon → donasi → partner + auto-cancel transaksi gantung';

    public function handle()
    {
        $this->processExpiredPauses();
        $this->processStaleTransactions();
        $this->processStage1();
        $this->processStage2();
        $this->processStage3();

        $this->info('Timeout processing selesai.');
    }

    /**
     * Unpause timer yang sudah lebih dari 12 jam
     */
    private function processExpiredPauses()
    {
        $expired = Product::where('timer_paused', true)
            ->where('timer_paused_at', '<=', now()->subHours(12))
            ->get();

        foreach ($expired as $product) {
            $product->update([
                'timer_paused' => false,
                'timer_paused_at' => null,
            ]);

            // Auto-reject semua barter offers yang masih pending
            BarterOffer::where('product_id', $product->id)
                ->where('status', 'pending')
                ->update(['status' => 'rejected']);

            Notification::create([
                'user_id' => $product->user_id,
                'title' => 'Negosiasi barter expired',
                'message' => "Waktu negosiasi untuk \"{$product->title}\" telah habis. Timer kembali berjalan.",
                'type' => 'timeout',
                'related_id' => $product->id,
                'related_type' => Product::class,
            ]);
        }

        $this->info("Expired pauses: {$expired->count()} di-unpause.");
    }

    /**
     * Auto-cancel transaksi yang menggantung
     */
    private function processStaleTransactions()
    {
        // Pending lebih dari 24 jam → cancel
        $stalePending = Transaction::where('status', 'pending')
            ->where('type', '!=', 'partner_transfer')
            ->where('created_at', '<=', now()->subHours(24))
            ->get();

        foreach ($stalePending as $transaction) {
            $transaction->update(['status' => 'cancelled']);

            Notification::create([
                'user_id' => $transaction->buyer_id,
                'title' => 'Transaksi otomatis dibatalkan',
                'message' => "Transaksi \"{$transaction->product->title}\" dibatalkan karena tidak dikonfirmasi dalam 24 jam.",
                'type' => 'transaction',
                'related_id' => $transaction->id,
                'related_type' => Transaction::class,
            ]);

            Notification::create([
                'user_id' => $transaction->seller_id,
                'title' => 'Transaksi otomatis dibatalkan',
                'message' => "Transaksi \"{$transaction->product->title}\" dibatalkan karena tidak dikonfirmasi dalam 24 jam.",
                'type' => 'transaction',
                'related_id' => $transaction->id,
                'related_type' => Transaction::class,
            ]);
        }

        // Confirmed lebih dari 48 jam (belum complete) → cancel
        $staleConfirmed = Transaction::where('status', 'confirmed')
            ->where('updated_at', '<=', now()->subHours(48))
            ->get();

        foreach ($staleConfirmed as $transaction) {
            $transaction->update(['status' => 'cancelled']);

            Notification::create([
                'user_id' => $transaction->buyer_id,
                'title' => 'Transaksi expired',
                'message' => "Transaksi \"{$transaction->product->title}\" dibatalkan karena tidak diselesaikan dalam 48 jam.",
                'type' => 'transaction',
                'related_id' => $transaction->id,
                'related_type' => Transaction::class,
            ]);

            Notification::create([
                'user_id' => $transaction->seller_id,
                'title' => 'Transaksi expired',
                'message' => "Transaksi \"{$transaction->product->title}\" dibatalkan karena tidak diselesaikan dalam 48 jam.",
                'type' => 'transaction',
                'related_id' => $transaction->id,
                'related_type' => Transaction::class,
            ]);
        }

        $total = $stalePending->count() + $staleConfirmed->count();
        $this->info("Stale transactions: {$total} dibatalkan.");
    }

    /**
     * TAHAP 1: Produk mendekati timeout → harga turun 25%
     */
    private function processStage1()
    {
        $products = Product::where('status', 'active')
            ->where('timer_paused', false)
            ->whereNotNull('timeout_stage1_at')
            ->where('timeout_stage1_at', '<=', now())
            ->get();

        foreach ($products as $product) {
            if ($product->price) {
                $product->discounted_price = (int) ($product->price * 0.75);
            }

            $product->status = 'timeout_stage_1';
            $product->save();

            Notification::create([
                'user_id' => $product->user_id,
                'title' => 'Produk mendekati batas waktu',
                'message' => "Produk \"{$product->title}\" mendekati batas waktu. Harga telah diturunkan otomatis.",
                'type' => 'timeout',
                'related_id' => $product->id,
                'related_type' => Product::class,
            ]);
        }

        $this->info("Tahap 1: {$products->count()} produk didiskon.");
    }

    /**
     * TAHAP 2: Timeout habis → masuk jalur donasi
     */
    private function processStage2()
    {
        $products = Product::whereIn('status', ['active', 'timeout_stage_1'])
            ->where('timer_paused', false)
            ->where('timeout_at', '<=', now())
            ->get();

        foreach ($products as $product) {
            $product->status = 'timeout_stage_2';
            $product->save();

            // Auto-reject semua barter offers yang pending
            BarterOffer::where('product_id', $product->id)
                ->where('status', 'pending')
                ->update(['status' => 'rejected']);

            Notification::create([
                'user_id' => $product->user_id,
                'title' => 'Produk masuk jalur donasi',
                'message' => "Produk \"{$product->title}\" tidak terjual dan kini tersedia sebagai donasi.",
                'type' => 'timeout',
                'related_id' => $product->id,
                'related_type' => Product::class,
            ]);
        }

        $this->info("Tahap 2: {$products->count()} produk masuk donasi.");
    }

    /**
     * TAHAP 3: 24 jam setelah masuk donasi, tidak diklaim → alihkan ke partner (cek kuota)
     */
    private function processStage3()
    {
        $products = Product::where('status', 'timeout_stage_2')
            ->where('timer_paused', false)
            ->where('timeout_at', '<=', now()->subHours(24))
            ->get();

        foreach ($products as $product) {
            $partnerType = match ($product->condition) {
                'layak_konsumsi' => ['umkm', 'kompos'],
                'layak_olah' => ['umkm', 'kompos'],
                'layak_pakan_kompos' => ['peternak', 'kompos', 'maggot'],
                default => ['kompos'],
            };

            $weightKg = ($product->weight_grams > 0) ? round($product->weight_grams / 1000) : $product->quantity;

            // Cari partner yang aktif DAN masih punya kuota
            $partner = PartnerProfile::where('is_active', true)
                ->whereIn('partner_type', $partnerType)
                ->whereRaw('today_received_kg + ? <= daily_capacity_kg', [$weightKg])
                ->first();

            // Fallback: cari partner tanpa cek kuota kalau semua penuh
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
                    'type' => 'partner_transfer',
                    'status' => 'pending',
                    'partner_id' => $partner->user_id,
                ]);

                $product->status = 'timeout_stage_3';
                $product->save();

                $sisaKuota = $partner->daily_capacity_kg - $partner->today_received_kg;
                Notification::create([
                    'user_id' => $partner->user_id,
                    'title' => 'Produk dialihkan kepada Anda',
                    'message' => "\"{$product->title}\" ({$weightKg}kg) dialihkan. Sisa kuota hari ini: {$sisaKuota}kg.",
                    'type' => 'partner_transfer',
                    'related_id' => $product->id,
                    'related_type' => Product::class,
                ]);

                Notification::create([
                    'user_id' => $product->user_id,
                    'title' => 'Produk dialihkan ke mitra',
                    'message' => "\"{$product->title}\" dialihkan ke {$partner->user->name}.",
                    'type' => 'partner_transfer',
                    'related_id' => $product->id,
                    'related_type' => Product::class,
                ]);
            } else {
                $product->status = 'transferred';
                $product->save();
            }
        }

        $this->info("Tahap 3: {$products->count()} produk dialihkan ke partner.");
    }
}