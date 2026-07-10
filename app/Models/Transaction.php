<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'buyer_id',
        'seller_id',
        'type',
        'status',
        'price',
        'barter_notes',
        'partner_id',
    ];

    protected $casts = [
        'price' => 'integer',
    ];

    // ==================== RELASI ====================

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function partner()
    {
        return $this->belongsTo(User::class, 'partner_id');
    }
}