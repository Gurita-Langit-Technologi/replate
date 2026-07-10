<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerVerification extends Model
{
    protected $fillable = [
        'user_id',
        'document_type',
        'document_photo',
        'production_photo',
        'status',
        'admin_notes',
    ];

    // ==================== RELASI ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}