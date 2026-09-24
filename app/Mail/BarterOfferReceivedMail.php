<?php

namespace App\Mail;

use App\Models\BarterOffer;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BarterOfferReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public BarterOffer $barterOffer,
        public User $owner
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Tawaran Barter Baru Masuk untuk \"{$this->barterOffer->product->title}\"",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.barter-offer-received',
        );
    }
}
