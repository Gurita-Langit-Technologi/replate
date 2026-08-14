<?php

namespace App\Models;

use App\Enums\PartnerType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartnerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'partner_type',
        'capacity_description',
        'daily_capacity_kg',
        'today_received_kg',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'partner_type' => PartnerType::class,
            'is_active' => 'boolean',
            'daily_capacity_kg' => 'integer',
            'today_received_kg' => 'integer',
        ];
    }

    // ==================== RELASI ====================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}