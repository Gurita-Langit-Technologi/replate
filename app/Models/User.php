<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'whatsapp_number',
        'profile_photo',
        'desa',
        'kecamatan',
        'address',
        'report_count',
        'is_blacklisted',
        'points',
        'redeem_code',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_blacklisted' => 'boolean',
            'report_count' => 'integer',
            'points' => 'integer',
        ];
    }

    // ==================== RELASI ====================

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'buyer_id');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Transaction::class, 'seller_id');
    }

    public function barterOffers(): HasMany
    {
        return $this->hasMany(BarterOffer::class, 'user_id');
    }

    public function partnerProfile(): HasOne
    {
        return $this->hasOne(PartnerProfile::class);
    }

    public function sellerVerification(): HasOne
    {
        return $this->hasOne(SellerVerification::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function pointHistories(): HasMany
    {
        return $this->hasMany(PointHistory::class);
    }

    public function rewardClaims(): HasMany
    {
        return $this->hasMany(RewardClaim::class);
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    // ==================== HELPER ====================

    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN;
    }

    public function isPartner(): bool
    {
        return $this->role === UserRole::PARTNER;
    }

    public function isVerifiedSeller(): bool
    {
        return $this->role === UserRole::VERIFIED_SELLER;
    }

    public function isBlacklisted(): bool
    {
        return $this->is_blacklisted;
    }

    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->redeem_code)) {
                $user->redeem_code = 'RPT-' . strtoupper(Str::random(5));
            }
        });
    }
}