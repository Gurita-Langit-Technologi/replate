<?php

namespace App\Models;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'reporter_id',
        'reported_user_id',
        'reason',
        'description',
        'evidence_photo',
        'status',
        'admin_notes',
        'appeal_notes',
        'appeal_photo',
        'appeal_status',
        'appeal_admin_notes',
        'appealed_at',
        'appeal_reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'reason' => ReportReason::class,
            'status' => ReportStatus::class,
            'appealed_at' => 'datetime',
            'appeal_reviewed_at' => 'datetime',
        ];
    }

    protected $appends = [
        'evidence_media_list',
        'appeal_media_list',
    ];

    public function getEvidenceMediaListAttribute(): array
    {
        if (!$this->evidence_photo) {
            return [];
        }
        $decoded = json_decode($this->evidence_photo, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        return [$this->evidence_photo];
    }

    public function getAppealMediaListAttribute(): array
    {
        if (!$this->appeal_photo) {
            return [];
        }
        $decoded = json_decode($this->appeal_photo, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        return [$this->appeal_photo];
    }

    // ==================== RELASI ====================

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function reportedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }
}