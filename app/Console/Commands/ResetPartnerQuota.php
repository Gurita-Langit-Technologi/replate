<?php

namespace App\Console\Commands;

use App\Models\PartnerProfile;
use Illuminate\Console\Command;

class ResetPartnerQuota extends Command
{
    protected $signature = 'partners:reset-quota';
    protected $description = 'Reset kuota harian partner ke 0';

    public function handle()
    {
        PartnerProfile::query()->update(['today_received_kg' => 0]);
        $this->info('Kuota harian partner di-reset.');
    }
}