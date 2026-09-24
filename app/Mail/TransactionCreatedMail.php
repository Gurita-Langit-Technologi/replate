<?php

namespace App\Mail;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Transaction $transaction,
        public User $seller
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pesanan Baru Masuk (#{$this->transaction->id}) — {$this->transaction->product->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.transaction-created',
        );
    }
}
