<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'partner_type',
        'capacity_description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ==================== RELASI ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}