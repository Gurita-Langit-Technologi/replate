<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations. (Tempat membuat tabel & kolom)
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); 
            $table->foreignId('partner_id')->nullable()->constrained('users')->onDelete('set null'); 
            
            $table->string('title');
            $table->text('description');
            $table->string('photo')->nullable();
            $table->integer('quantity');
            $table->string('unit')->default('porsi');
            $table->dateTime('expiry_time'); 
            
            $table->boolean('can_barter')->default(false);
            $table->text('barter_note')->nullable(); 
            
            $table->enum('status', [
                'AVAILABLE', 'BOOKED', 'SOLD', 'DONATION_POOL', 'DONATION_SUCCESS'
            ])->default('AVAILABLE');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations. (Tempat menghancurkan tabel jika di-rollback)
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};