<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambahkan kolom-kolom yang belum ada di tabel transactions:
     * - notes: catatan umum transaksi (e.g., alasan alih fungsi mitra)
     * - proof_photo: path foto bukti transaksi/COD
     * - transaction_code: kode unik transaksi
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'transaction_code')) {
                $table->string('transaction_code')->nullable()->after('id');
            }
            if (!Schema::hasColumn('transactions', 'notes')) {
                $table->text('notes')->nullable()->after('barter_notes');
            }
            if (!Schema::hasColumn('transactions', 'proof_photo')) {
                $table->string('proof_photo')->nullable()->after('notes');
            }
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumnIfExists('transaction_code');
            $table->dropColumnIfExists('notes');
            $table->dropColumnIfExists('proof_photo');
        });
    }
};
