<?php

namespace App\Http\Controllers;

use App\Enums\NotificationType;
use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Report;
use App\Models\User;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    public function __construct(
        protected ImageService $imageService
    ) {}

    /**
     * Laporkan produk yang melanggar ketentuan
     */
    public function store(Request $request, Product $product)
    {
        $user = $request->user();

        if ($product->user_id === $user->id) {
            return back()->with('error', 'Tidak bisa melaporkan produk sendiri.');
        }

        $existing = Report::where('product_id', $product->id)
            ->where('reporter_id', $user->id)
            ->where('status', ReportStatus::PENDING)
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah memiliki laporan aktif untuk produk ini.');
        }

        $validated = $request->validate([
            'reason' => ['required', Rule::enum(ReportReason::class)],
            'description' => 'nullable|string|max:1000',
            'evidence_photo' => 'nullable|image|max:3072',
        ]);

        $photoPath = null;
        if ($request->hasFile('evidence_photo')) {
            $photoPath = $this->imageService->storeOptimized($request->file('evidence_photo'), 'reports');
        }

        $report = Report::create([
            'product_id' => $product->id,
            'reporter_id' => $user->id,
            'reported_user_id' => $product->user_id,
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? null,
            'evidence_photo' => $photoPath,
            'status' => ReportStatus::PENDING,
        ]);

        // Notifikasi ke pemilik produk
        Notification::create([
            'user_id' => $product->user_id,
            'title' => 'Produk Anda Dilaporkan',
            'message' => "Produk \"{$product->title}\" dilaporkan dengan alasan: {$report->reason->label()}.",
            'type' => NotificationType::REPORT,
            'related_id' => $product->id,
            'related_type' => Product::class,
        ]);

        // Notifikasi ke seluruh Admin
        $admins = User::where('role', UserRole::ADMIN)->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Laporan Produk Baru',
                'message' => "{$user->name} melaporkan produk \"{$product->title}\".",
                'type' => NotificationType::REPORT,
                'related_id' => $report->id,
                'related_type' => Report::class,
            ]);
        }

        return back()->with('success', 'Laporan produk berhasil dikirim. Admin BUMDes akan segera meninjau.');
    }

    /**
     * Laporkan akun pengguna yang melanggar ketentuan
     */
    public function storeUserReport(Request $request, User $user)
    {
        $currentUser = $request->user();

        if ($user->id === $currentUser->id) {
            return back()->with('error', 'Tidak bisa melaporkan akun sendiri.');
        }

        if ($user->isAdmin()) {
            return back()->with('error', 'Tidak bisa melaporkan akun administrator.');
        }

        $existing = Report::whereNull('product_id')
            ->where('reported_user_id', $user->id)
            ->where('reporter_id', $currentUser->id)
            ->where('status', ReportStatus::PENDING)
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah memiliki laporan aktif yang sedang ditinjau untuk pengguna ini.');
        }

        $validated = $request->validate([
            'reason' => ['required', Rule::enum(ReportReason::class)],
            'description' => 'required|string|max:1000',
            'evidence_photo' => 'nullable|image|max:3072',
        ]);

        $photoPath = null;
        if ($request->hasFile('evidence_photo')) {
            $photoPath = $this->imageService->storeOptimized($request->file('evidence_photo'), 'reports');
        }

        $report = Report::create([
            'product_id' => null,
            'reporter_id' => $currentUser->id,
            'reported_user_id' => $user->id,
            'reason' => $validated['reason'],
            'description' => $validated['description'],
            'evidence_photo' => $photoPath,
            'status' => ReportStatus::PENDING,
        ]);

        // Notifikasi ke Admin
        $admins = User::where('role', UserRole::ADMIN)->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Laporan Akun Pengguna Baru',
                'message' => "{$currentUser->name} melaporkan akun {$user->name} dengan alasan: {$report->reason->label()}.",
                'type' => NotificationType::REPORT,
                'related_id' => $report->id,
                'related_type' => Report::class,
            ]);
        }

        return back()->with('success', 'Laporan akun pengguna berhasil dikirim. Tim pengawas BUMDes akan memeriksa.');
    }
}