<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->text('appeal_notes')->nullable()->after('admin_notes');
            $table->string('appeal_photo')->nullable()->after('appeal_notes');
            $table->string('appeal_status')->nullable()->after('appeal_photo'); // null, 'pending', 'approved', 'rejected'
            $table->text('appeal_admin_notes')->nullable()->after('appeal_status');
            $table->timestamp('appealed_at')->nullable()->after('appeal_admin_notes');
            $table->timestamp('appeal_reviewed_at')->nullable()->after('appealed_at');
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn([
                'appeal_notes',
                'appeal_photo',
                'appeal_status',
                'appeal_admin_notes',
                'appealed_at',
                'appeal_reviewed_at',
            ]);
        });
    }
};
