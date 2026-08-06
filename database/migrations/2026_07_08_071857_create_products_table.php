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

            $table->string('title');
            $table->text('description');
            $table->string('photo');

            $table->enum('category', ['mentah', 'olahan', 'hasil_bumi']);
            $table->enum('condition', ['layak_konsumsi', 'layak_olah', 'layak_pakan_kompos']);

            $table->integer('weight_grams');

            $table->enum('transaction_mode', ['sell', 'barter', 'sell_and_barter', 'donate']);

            $table->integer('price')->nullable();
            $table->integer('discounted_price')->nullable();

            $table->text('barter_description')->nullable();

            $table->string('desa');
            $table->string('kecamatan');

            $table->timestamp('timeout_at');
            $table->timestamp('timeout_stage1_at')->nullable();

            $table->string('status')->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};