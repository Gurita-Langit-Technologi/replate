<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barter_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('offerer_id')->constrained('users')->onDelete('cascade');

            // Apa yang ditawarkan
            $table->text('offer_description'); // "Saya tawarkan 2kg singkong"
            $table->string('offer_photo')->nullable(); // foto barang yang ditawarkan

            // Status
            $table->enum('status', [
                'pending',   // menunggu response penjual
                'accepted',  // penjual setuju
                'rejected',  // penjual tolak
                'cancelled', // pembeli batalkan
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barter_offers');
    }
};