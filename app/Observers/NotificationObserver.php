<?php

namespace App\Observers;

use App\Events\NotificationCreated;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class NotificationObserver
{
    /**
     * Setiap kali Notification::create() dipanggil di mana saja,
     * broadcast event ini secara otomatis ke channel private user penerima.
     *
     * Menggunakan event(...) dalam try-catch agar jika Reverb offline / unreachable,
     * request HTTP tetap berjalan normal tanpa 500 error.
     */
    public function created(Notification $notification): void
    {
        try {
            event(new NotificationCreated($notification));
        } catch (\Throwable $e) {
            Log::warning('Broadcast notifikasi gagal (Reverb offline): ' . $e->getMessage());
        }
    }
}
