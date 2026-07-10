<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\Notification;
use App\Models\PartnerProfile;
use App\Models\Transaction;
use Illuminate\Console\Command;

class ProcessProductTimeout extends Command
{
    protected $signature = 'products:process-timeout';
    protected $description = 'Proses timeout otomatis: diskon → donasi → partner';

    public function handle()
    {
        $this->processStage1();
        $this->processStage2();
        $this->processStage3();

        $this->info('Timeout processing selesai.');
    }

    /**
     * TAHAP 1: Produk mendekati timeout → harga turun 25%
     */
    private function processStage1()
    {
        $products = Product::where('status', 'active')
            ->whereNotNull('timeout_stage1_at')
            ->where('timeout_stage1_at', '<=', now())
            ->get();

        foreach ($products as $product) {
            // Diskon 25% kalau ada harga
            if ($product->price) {
                $product->discounted_price = (int) ($product->price * 0.75);
            }

            $product->status = 'timeout_stage_1';
            $product->save();

            // Notifikasi ke penjual
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
            ->where('timeout_at', '<=', now())
            ->get();

        foreach ($products as $product) {
            $product->status = 'timeout_stage_2';
            $product->save();

            // Notifikasi ke penjual
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
     * TAHAP 3: 24 jam setelah masuk donasi, tidak diklaim → alihkan ke partner
     */
    private function processStage3()
    {
        $products = Product::where('status', 'timeout_stage_2')
            ->where('timeout_at', '<=', now()->subHours(24))
            ->get();

        foreach ($products as $product) {
            // Cari partner yang cocok berdasarkan kondisi produk
            $partnerType = match ($product->condition) {
                'layak_konsumsi' => ['umkm', 'kompos'],
                'layak_olah' => ['umkm', 'kompos'],
                'layak_pakan_kompos' => ['peternak', 'kompos', 'maggot'],
                default => ['kompos'],
            };

            $partner = PartnerProfile::where('is_active', true)
                ->whereIn('partner_type', $partnerType)
                ->first();

            if ($partner) {
                // Buat transaksi transfer ke partner
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

                // Notifikasi ke partner
                Notification::create([
                    'user_id' => $partner->user_id,
                    'title' => 'Produk dialihkan kepada Anda',
                    'message' => "Produk \"{$product->title}\" ({$product->weight_grams}g) telah dialihkan kepada Anda untuk diambil.",
                    'type' => 'partner_transfer',
                    'related_id' => $product->id,
                    'related_type' => Product::class,
                ]);

                // Notifikasi ke penjual
                Notification::create([
                    'user_id' => $product->user_id,
                    'title' => 'Produk dialihkan ke mitra',
                    'message' => "Produk \"{$product->title}\" telah dialihkan ke mitra pengolah.",
                    'type' => 'partner_transfer',
                    'related_id' => $product->id,
                    'related_type' => Product::class,
                ]);
            } else {
                // Tidak ada partner → tetap tandai sebagai transferred
                $product->status = 'transferred';
                $product->save();
            }
        }

        $this->info("Tahap 3: {$products->count()} produk dialihkan ke partner.");
    }
}