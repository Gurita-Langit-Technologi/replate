<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message)
    {
        //
    }

    /**
     * Broadcast ke private channel milik penerima pesan.
     * Format: chat.{receiverId}
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->message->receiver_id),
        ];
    }

    /**
     * Nama event yang diterima frontend (window.Echo.private(...).listen('MessageSent', ...))
     */
    public function broadcastAs(): string
    {
        return 'MessageSent';
    }

    /**
     * Data yang dikirim ke frontend
     */
    public function broadcastWith(): array
    {
        return [
            'id'         => $this->message->id,
            'body'       => $this->message->body,
            'sender_id'  => $this->message->sender_id,
            'receiver_id'=> $this->message->receiver_id,
            'product_id' => $this->message->product_id,
            'is_read'    => $this->message->is_read,
            'created_at' => $this->message->created_at->toISOString(),
            'sender'     => [
                'id'   => $this->message->sender->id,
                'name' => $this->message->sender->name,
            ],
        ];
    }
}
