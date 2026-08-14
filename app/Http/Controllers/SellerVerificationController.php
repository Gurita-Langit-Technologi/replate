<?php

namespace App\Http\Controllers;

use App\Enums\NotificationType;
use App\Enums\SellerVerificationDocumentType;
use App\Enums\UserRole;
use App\Enums\VerificationStatus;
use App\Models\Notification;
use App\Models\SellerVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SellerVerificationController extends Controller
{
    /**
     * Halaman pengajuan verifikasi penjual olahan
     */
    public function create(Request $request)
    {
        $existing = SellerVerification::where('user_id', $request->user()->id)
            ->latest()
            ->first();

        return Inertia::render('Seller/Apply', [
            'existing' => $existing,
        ]);
    }

    /**
     * Kirim formulir pengajuan verifikasi penjual
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role === UserRole::VERIFIED_SELLER->value) {
            return back()->with('error', 'Anda sudah menjadi penjual olahan terverifikasi.');
        }

        $pending = SellerVerification::where('user_id', $user->id)
            ->where('status', VerificationStatus::PENDING)
            ->first();

        if ($pending) {
            return back()->with('error', 'Anda sudah memiliki pengajuan yang sedang ditinjau.');
        }

        $validated = $request->validate([
            'document_type' => ['required', Rule::enum(SellerVerificationDocumentType::class)],
            'document_photo' => 'required|image|max:2048',
            'production_photo' => 'required|image|max:2048',
        ]);

        $docPath = $request->file('document_photo')->store('verifications', 'public');
        $prodPath = $request->file('production_photo')->store('verifications', 'public');

        SellerVerification::create([
            'user_id' => $user->id,
            'document_type' => $validated['document_type'],
            'document_photo' => $docPath,
            'production_photo' => $prodPath,
        ]);

        // Notifikasi ke admin
        $admins = User::where('role', UserRole::ADMIN)->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Pengajuan penjual olahan baru',
                'message' => "{$user->name} mengajukan verifikasi penjual olahan.",
                'type' => NotificationType::VERIFICATION,
            ]);
        }

        return redirect()->route('seller.apply')->with('success', 'Pengajuan terkirim! Admin akan meninjau.');
    }
}
