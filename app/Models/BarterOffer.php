<?php

namespace App\Models;

use App\Enums\BarterOfferStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class BarterOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'offerer_id',
        'quantity',
        'offer_description',
        'offer_photo',
        'status',
    ];

    protected $appends = [
        'offer_photo_url',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'status' => BarterOfferStatus::class,
        ];
    }

    // ==================== HELPER METHODS ====================

    public function isPending(): bool
    {
        return $this->status === BarterOfferStatus::PENDING;
    }

    public function isAccepted(): bool
    {
        return $this->status === BarterOfferStatus::ACCEPTED;
    }

    public function isRejected(): bool
    {
        return $this->status === BarterOfferStatus::REJECTED;
    }

    // Accessor untuk URL foto penawaran
    public function getOfferPhotoUrlAttribute(): ?string
    {
        return $this->offer_photo ? Storage::url($this->offer_photo) : null;
    }

    // ==================== RELASI ====================

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function offerer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'offerer_id');
    }

    public function transaction(): HasOne
    {
        return $this->hasOne(Transaction::class, 'barter_offer_id');
    }
}