<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'partner_type',
        'capacity_description',
        'daily_capacity_kg',
        'today_received_kg',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'daily_capacity_kg' => 'integer',
        'today_received_kg' => 'integer',
    ];

    // ==================== RELASI ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}