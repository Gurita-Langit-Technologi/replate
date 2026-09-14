<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->foreignId('product_id')->nullable()->change();
            $table->foreignId('reported_user_id')->nullable()->after('reporter_id')->constrained('users')->onDelete('cascade');
            $table->string('evidence_photo')->nullable()->after('description');
            $table->text('admin_notes')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropForeign(['reported_user_id']);
            $table->dropColumn(['reported_user_id', 'evidence_photo', 'admin_notes']);
            $table->foreignId('product_id')->nullable(false)->change();
        });
    }
};
