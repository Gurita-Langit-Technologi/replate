<?php

namespace App\Services;

use App\Mail\BarterOfferReceivedMail;
use App\Mail\SellerVerificationStatusMail;
use App\Mail\TransactionCreatedMail;
use App\Mail\TransactionStatusUpdatedMail;
use App\Models\BarterOffer;
use App\Models\SellerVerification;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailNotificationService
{
    /**
     * Kirim email ke penjual saat ada transaksi atau klaim donasi baru masuk
     */
    public function sendTransactionCreated(Transaction $transaction): void
    {
        try {
            $transaction->loadMissing(['seller', 'buyer', 'product']);
            if (!$transaction->seller?->email) {
                return;
            }

            Mail::to($transaction->seller->email)
                ->send(new TransactionCreatedMail($transaction, $transaction->seller));
        } catch (\Throwable $e) {
            Log::warning("Gagal mengirim email transaksi baru #{$transaction->id}: " . $e->getMessage());
        }
    }

    /**
     * Kirim email ke pembeli saat pesanan dikonfirmasi / disetujui penjual
     */
    public function sendTransactionConfirmed(Transaction $transaction): void
    {
        try {
            $transaction->loadMissing(['seller', 'buyer', 'product']);
            if (!$transaction->buyer?->email) {
                return;
            }

            $pickupLoc = $transaction->product->pickup_address ?? ($transaction->seller->address ?? 'Sesuai kesepakatan');

            Mail::to($transaction->buyer->email)
                ->send(new TransactionStatusUpdatedMail(
                    transaction: $transaction,
                    recipient: $transaction->buyer,
                    statusMessage: 'Kabar baik! Pesanan pangan Anda telah dikonfirmasi oleh penjual dan siap untuk diambil.',
                    statusLabel: 'Dikonfirmasi',
                    statusBadgeClass: 'badge-success',
                    pickupLocation: $pickupLoc,
                    isCompleted: false
                ));
        } catch (\Throwable $e) {
            Log::warning("Gagal mengirim email konfirmasi transaksi #{$transaction->id}: " . $e->getMessage());
        }
    }

    /**
     * Kirim email saat transaksi selesai (ke pembeli & penjual)
     */
    public function sendTransactionCompleted(Transaction $transaction): void
    {
        try {
            $transaction->loadMissing(['seller', 'buyer', 'product']);

            // Email ke pembeli
            if ($transaction->buyer?->email) {
                Mail::to($transaction->buyer->email)
                    ->send(new TransactionStatusUpdatedMail(
                        transaction: $transaction,
                        recipient: $transaction->buyer,
                        statusMessage: 'Transaksi pengambilan pangan telah berhasil diselesaikan. Terima kasih telah berpartisipasi menjaga bumi!',
                        statusLabel: 'Selesai',
                        statusBadgeClass: 'badge-success',
                        isCompleted: true
                    ));
            }

            // Email ke penjual
            if ($transaction->seller?->email) {
                Mail::to($transaction->seller->email)
                    ->send(new TransactionStatusUpdatedMail(
                        transaction: $transaction,
                        recipient: $transaction->seller,
                        statusMessage: 'Pangan berlebih Anda telah sukses diselamatkan oleh warga. Dampak dan poin telah ditambahkan ke profil Anda!',
                        statusLabel: 'Selesai',
                        statusBadgeClass: 'badge-success',
                        isCompleted: true
                    ));
            }
        } catch (\Throwable $e) {
            Log::warning("Gagal mengirim email transaksi selesai #{$transaction->id}: " . $e->getMessage());
        }
    }

    /**
     * Kirim email saat transaksi dibatalkan atau ditolak
     */
    public function sendTransactionCancelled(Transaction $transaction, ?string $reason = null): void
    {
        try {
            $transaction->loadMissing(['seller', 'buyer', 'product']);

            // Kirim notifikasi email ke pihak pembeli
            if ($transaction->buyer?->email) {
                Mail::to($transaction->buyer->email)
                    ->send(new TransactionStatusUpdatedMail(
                        transaction: $transaction,
                        recipient: $transaction->buyer,
                        statusMessage: 'Pesanan untuk produk ini telah dibatalkan atau ditolak.',
                        statusLabel: 'Dibatalkan',
                        statusBadgeClass: 'badge-danger',
                        cancelReason: $reason,
                        isCompleted: false
                    ));
            }
        } catch (\Throwable $e) {
            Log::warning("Gagal mengirim email pembatalan transaksi #{$transaction->id}: " . $e->getMessage());
        }
    }

    /**
     * Kirim email ke pemilik produk saat ada tawaran barter masuk
     */
    public function sendBarterOfferReceived(BarterOffer $barterOffer): void
    {
        try {
            $barterOffer->loadMissing(['product.user', 'offerer']);
            $owner = $barterOffer->product?->user;

            if (!$owner?->email) {
                return;
            }

            Mail::to($owner->email)
                ->send(new BarterOfferReceivedMail($barterOffer, $owner));
        } catch (\Throwable $e) {
            Log::warning("Gagal mengirim email tawaran barter #{$barterOffer->id}: " . $e->getMessage());
        }
    }

    /**
     * Kirim email ke pemohon saat verifikasi penjual olahan diproses admin
     */
    public function sendSellerVerificationResult(SellerVerification $verification, bool $isApproved, ?string $notes = null): void
    {
        try {
            $verification->loadMissing('user');
            $applicant = $verification->user;

            if (!$applicant?->email) {
                return;
            }

            Mail::to($applicant->email)
                ->send(new SellerVerificationStatusMail($verification, $applicant, $isApproved, $notes));
        } catch (\Throwable $e) {
            Log::warning("Gagal mengirim email verifikasi penjual #{$verification->id}: " . $e->getMessage());
        }
    }
}
