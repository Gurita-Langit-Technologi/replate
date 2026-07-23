<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PointHistory extends Model
{
    protected $fillable = [
        'user_id', 'amount', 'balance_after',
        'description', 'type',
        'related_id', 'related_type',
    ];

    protected $casts = [
        'amount' => 'integer',
        'balance_after' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function related()
    {
        return $this->morphTo();
    }

    /**
     * Hitung poin berdasarkan berat dan kondisi produk
     * Layak Konsumsi: 3x (3 poin/kg)
     * Layak Olah: 2x (2 poin/kg)
     * Layak Pakan/Kompos: 1x (1 poin/kg)
     */
    public static function calculatePoints(Product $product): int
    {
        $weightKg = $product->weight_grams > 0
            ? $product->weight_grams / 1000
            : $product->quantity;

        $multiplier = match ($product->condition) {
            'layak_konsumsi' => 3,
            'layak_olah' => 2,
            'layak_pakan_kompos' => 1,
            default => 1,
        };

        return (int) ceil($weightKg * $multiplier);
    }

    /**
     * Berikan poin ke user (dengan database locking)
     */
    public static function awardPoints(User $user, int $amount, string $description, string $type, $related = null): self
    {
        return DB::transaction(function () use ($user, $amount, $description, $type, $related) {
            // Lock user row untuk prevent double spending
            $user = User::lockForUpdate()->find($user->id);

            $user->increment('points', $amount);

            return self::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'balance_after' => $user->points,
                'description' => $description,
                'type' => $type,
                'related_id' => $related?->id,
                'related_type' => $related ? get_class($related) : null,
            ]);
        });
    }

    /**
     * Pakai/tukar poin (dengan locking)
     */
    public static function redeemPoints(User $user, int $amount, string $description, $related = null): self|false
    {
        return DB::transaction(function () use ($user, $amount, $description, $related) {
            $user = User::lockForUpdate()->find($user->id);

            if ($user->points < $amount) {
                return false;
            }

            $user->decrement('points', $amount);

            return self::create([
                'user_id' => $user->id,
                'amount' => -$amount,
                'balance_after' => $user->points,
                'description' => $description,
                'type' => 'redeemed',
                'related_id' => $related?->id,
                'related_type' => $related ? get_class($related) : null,
            ]);
        });
    }
}