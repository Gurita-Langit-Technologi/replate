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
        Schema::table('products', function (Blueprint $table) {
            $table->integer('quantity')->default(1)->after('weight_grams');
            $table->string('unit')->default('gram')->after('quantity');
            $table->text('pickup_address')->nullable()->after('kecamatan');
            $table->string('pickup_notes')->nullable()->after('pickup_address');
            $table->enum('pickup_type', ['rumah', 'drop_point'])->default('rumah')->after('pickup_notes');
            $table->boolean('timer_paused')->default(false)->after('status');
            $table->timestamp('timer_paused_at')->nullable()->after('timer_paused');
        });

        Schema::table('partner_profiles', function (Blueprint $table) {
            $table->integer('daily_capacity_kg')->default(50)->after('capacity_description');
            $table->integer('today_received_kg')->default(0)->after('daily_capacity_kg');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->text('address')->nullable()->after('kecamatan');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['quantity', 'unit', 'pickup_address', 'pickup_notes', 'pickup_type', 'timer_paused', 'timer_paused_at']);
        });

        Schema::table('partner_profiles', function (Blueprint $table) {
            $table->dropColumn(['daily_capacity_kg', 'today_received_kg']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('address');
        });
    }
};
