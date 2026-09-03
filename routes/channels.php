<?php

use Illuminate\Support\Facades\Broadcast;

// Channel default Laravel (biarkan)
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Channel private chat — hanya user yang bersangkutan bisa subscribe
// Digunakan di Chat/Show.jsx untuk real-time pesan baru
Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Channel private notifikasi — hanya user yang bersangkutan bisa subscribe
// Digunakan di AppLayout.jsx untuk badge + toast notifikasi real-time
Broadcast::channel('notifications.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
