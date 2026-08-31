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
        Schema::table('barter_offers', function (Blueprint $table) {
            if (!Schema::hasColumn('barter_offers', 'quantity')) {
                $table->unsignedInteger('quantity')->default(1)->after('offerer_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barter_offers', function (Blueprint $table) {
            if (Schema::hasColumn('barter_offers', 'quantity')) {
                $table->dropColumn('quantity');
            }
        });
    }
};
