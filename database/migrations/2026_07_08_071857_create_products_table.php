<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Info produk
            $table->string('title');
            $table->text('description');
            $table->string('photo'); // path foto produk (wajib)

            // Klasifikasi
            $table->enum('category', ['mentah', 'olahan', 'hasil_bumi']);
            $table->enum('condition', ['layak_konsumsi', 'layak_olah', 'layak_pakan_kompos']);

            // Berat (dalam gram, minimal 500)
            $table->integer('weight_grams');

            // Mode transaksi
            $table->enum('transaction_mode', ['sell', 'barter', 'sell_and_barter', 'donate']);

            // Harga (nullable karena barter/donasi tidak perlu)
            $table->integer('price')->nullable(); // dalam Rupiah
            $table->integer('discounted_price')->nullable(); // harga setelah timeout tahap 1

            // Barter
            $table->text('barter_description')->nullable(); // "Menerima barter dalam bentuk..."

            // Lokasi (otomatis dari profil user, bisa override)
            $table->string('desa');
            $table->string('kecamatan');

            // Timeout system
            $table->timestamp('timeout_at'); // dihitung otomatis dari condition
            $table->timestamp('timeout_stage1_at')->nullable(); // 75% dari durasi
            $table->enum('status', [
                'active',              // sedang tayang
                'timeout_stage_1',     // harga turun, badge "segera habis"
                'timeout_stage_2',     // masuk jalur donasi
                'timeout_stage_3',     // dialihkan ke partner
                'sold',                // terjual
                'bartered',            // terbarter
                'donated',             // terdonasi
                'transferred',         // dialihkan ke partner (selesai)
            ])->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};