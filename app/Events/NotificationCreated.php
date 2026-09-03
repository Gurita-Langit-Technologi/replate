<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Notification $notification)
    {
        //
    }

    /**
     * Broadcast ke private channel milik penerima notifikasi.
     * Format: notifications.{userId}
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('notifications.' . $this->notification->user_id),
        ];
    }

    /**
     * Nama event yang didengarkan frontend
     */
    public function broadcastAs(): string
    {
        return 'NotificationCreated';
    }

    /**
     * Data yang dikirim ke frontend
     */
    public function broadcastWith(): array
    {
        return [
            'id'           => $this->notification->id,
            'title'        => $this->notification->title,
            'message'      => $this->notification->message,
            'type'         => $this->notification->type instanceof \BackedEnum
                                ? $this->notification->type->value
                                : $this->notification->type,
            'related_id'   => $this->notification->related_id,
            'related_type' => $this->notification->related_type,
            'is_read'      => false,
            'created_at'   => $this->notification->created_at->toISOString(),
        ];
    }
}
