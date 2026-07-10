<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');

            // Jenis transaksi
            $table->enum('type', ['sale', 'barter', 'donation', 'partner_transfer']);

            // Status flow
            $table->enum('status', [
                'pending',      // menunggu konfirmasi penjual
                'confirmed',    // penjual sudah konfirmasi
                'completed',    // pembeli konfirmasi terima
                'cancelled',    // dibatalkan
            ])->default('pending');

            // Detail pembayaran (nullable untuk barter/donasi)
            $table->integer('price')->nullable();

            // Catatan barter (apa yang ditukar)
            $table->text('barter_notes')->nullable();

            // Untuk partner transfer
            $table->foreignId('partner_id')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};