<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
    'whatsapp_number',
    'profile_photo',
    'desa',
    'kecamatan',
    'report_count',
    'is_blacklisted',
    'address',
    'points',
    'reedem_code',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

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
            'is_blacklisted' => 'boolean',
            'report_count' => 'integer',
        ];
    }

    // ==================== RELASI ====================

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'buyer_id');
    }

    public function sales()
    {
        return $this->hasMany(Transaction::class, 'seller_id');
    }

    public function barterOffers()
    {
        return $this->hasMany(BarterOffer::class, 'offerer_id');
    }

    public function partnerProfile()
    {
        return $this->hasOne(PartnerProfile::class);
    }

    public function sellerVerification()
    {
        return $this->hasOne(SellerVerification::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    public function notifications()
    {
        return $this->hasMany(\App\Models\Notification::class);
    }

    // ==================== HELPER ====================

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPartner(): bool
    {
        return $this->role === 'partner';
    }

    public function isVerifiedSeller(): bool
    {
        return $this->role === 'verified_seller';
    }

    public function isBlacklisted(): bool
    {
        return $this->is_blacklisted;
    }

    public function pointHistories()
    {
        return $this->hasMany(PointHistory::class);
    }

    protected static function booted()
    {
        static::creating(function ($user) {
            $user->redeem_code = 'RPT-' . strtoupper(Str::random(5));
        });
    }
}