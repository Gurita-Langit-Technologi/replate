<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarterOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'offerer_id',
        'offer_description',
        'offer_photo',
        'status',
    ];

    // ==================== RELASI ====================

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function offerer()
    {
        return $this->belongsTo(User::class, 'offerer_id');
    }
}