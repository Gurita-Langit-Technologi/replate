<?php

namespace App\Mail;

use App\Models\SellerVerification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SellerVerificationStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public SellerVerification $verification,
        public User $applicant,
        public bool $isApproved,
        public ?string $notes = null
    ) {}

    public function envelope(): Envelope
    {
        $statusText = $this->isApproved ? 'Disetujui' : 'Belum Dapat Disetujui';
        return new Envelope(
            subject: "Status Pengajuan Penjual Olahan BUMDes: {$statusText}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.seller-verification-status',
        );
    }
}
