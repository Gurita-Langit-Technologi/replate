<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'photo',
        'category', 'condition',
        'weight_grams', 'quantity', 'unit',
        'transaction_mode',
        'price', 'discounted_price', 'barter_description',
        'desa', 'kecamatan',
        'pickup_address', 'pickup_notes', 'pickup_type',
        'timeout_at', 'timeout_stage1_at', 'status',
        'timer_paused', 'timer_paused_at',
    ];

    protected $casts = [
        'timeout_at' => 'datetime',
        'timeout_stage1_at' => 'datetime',
        'timer_paused_at' => 'datetime',
        'timer_paused' => 'boolean',
        'price' => 'integer',
        'discounted_price' => 'integer',
        'weight_grams' => 'integer',
        'quantity' => 'integer',
    ];

    // ==================== RELASI ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function barterOffers()
    {
        return $this->hasMany(BarterOffer::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    // ==================== HELPER ====================

    /**
     * Hitung timeout_at berdasarkan kondisi produk
     */
    public static function calculateTimeout(string $condition): Carbon
    {
        return match ($condition) {
            'layak_konsumsi' => now()->addHours(48),
            'layak_olah' => now()->addDays(5),
            'layak_pakan_kompos' => now()->addDays(7),
            default => now()->addDays(30), // produk olahan
        };
    }

    /**
     * Hitung timeout stage 1 (75% dari durasi)
     */
    public static function calculateTimeoutStage1(string $condition): Carbon
    {
        return match ($condition) {
            'layak_konsumsi' => now()->addHours(36),    // 75% dari 48 jam
            'layak_olah' => now()->addDays(3)->addHours(18), // 75% dari 5 hari
            'layak_pakan_kompos' => now()->addDays(5)->addHours(6), // 75% dari 7 hari
            default => now()->addDays(22)->addHours(12), // 75% dari 30 hari
        };
    }
}