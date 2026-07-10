<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Konten notifikasi
            $table->string('title');
            $table->text('message');

            // Jenis notifikasi
            $table->enum('type', [
                'transaction',     // ada pembelian/barter masuk
                'timeout',         // produk mendekati/melewati timeout
                'barter_offer',    // ada tawaran barter
                'report',          // produk dilaporkan
                'verification',    // status verifikasi berubah
                'partner_transfer', // produk dialihkan ke partner
            ]);

            $table->boolean('is_read')->default(false);

            // Polymorphic relation (bisa link ke product, transaction, dll)
            $table->nullableMorphs('related');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};