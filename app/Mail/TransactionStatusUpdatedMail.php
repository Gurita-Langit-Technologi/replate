<?php

namespace App\Mail;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionStatusUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Transaction $transaction,
        public User $recipient,
        public string $statusMessage,
        public string $statusLabel,
        public string $statusBadgeClass,
        public ?string $pickupLocation = null,
        public ?string $cancelReason = null,
        public bool $isCompleted = false
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Update Transaksi (#{$this->transaction->id}): {$this->statusLabel} — {$this->transaction->product->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.transaction-status-updated',
        );
    }
}
