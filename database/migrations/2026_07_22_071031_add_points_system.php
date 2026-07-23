<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tambah kolom poin di users
        Schema::table('users', function (Blueprint $table) {
            $table->integer('points')->default(0)->after('is_blacklisted');
        });

        // Tabel riwayat poin
        Schema::create('point_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('amount'); // positif = dapat, negatif = pakai
            $table->integer('balance_after'); // saldo setelah transaksi
            $table->string('description');
            $table->enum('type', [
                'earned_upload',      // dapat dari upload produk yang tersalurkan
                'earned_sell',        // dapat dari jual
                'earned_barter',     // dapat dari barter
                'earned_donate',     // dapat dari donasi
                'earned_partner',    // dapat dari alih ke partner
                'redeemed',          // tukar poin
            ]);
            $table->nullableMorphs('related'); // link ke transaction/product
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('points');
        });
        Schema::dropIfExists('point_histories');
    }
};
