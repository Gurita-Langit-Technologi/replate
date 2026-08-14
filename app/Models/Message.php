<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'product_id',
        'body',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    // ==================== HELPER METHODS ====================

    /**
     * Tandai pesan sebagai sudah dibaca
     */
    public function markAsRead(): bool
    {
        if (! $this->is_read) {
            return $this->update(['is_read' => true]);
        }

        return false;
    }

    // ==================== SCOPES ====================

    /**
     * Filter percakapan antara dua pengguna
     */
    public function scopeBetweenUsers(Builder $query, int $userOneId, int $userTwoId): Builder
    {
        return $query->where(function ($q) use ($userOneId, $userTwoId) {
            $q->where('sender_id', $userOneId)->where('receiver_id', $userTwoId);
        })->orWhere(function ($q) use ($userOneId, $userTwoId) {
            $q->where('sender_id', $userTwoId)->where('receiver_id', $userOneId);
        });
    }

    /**
     * Filter pesan yang belum dibaca
     */
    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('is_read', false);
    }

    // ==================== RELASI ====================

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}