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
            'evidence_photos' => 'nullable|array|max:4',
            'evidence_photos.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,webm,mov|max:20480',
            'evidence_photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,webm,mov|max:20480',
        ]);

        $photoPaths = [];
        if ($request->hasFile('evidence_photos')) {
            foreach (array_slice($request->file('evidence_photos'), 0, 4) as $file) {
                $photoPaths[] = $this->imageService->storeMedia($file, 'reports');
            }
        } elseif ($request->hasFile('evidence_photo')) {
            $photoPaths[] = $this->imageService->storeMedia($request->file('evidence_photo'), 'reports');
        }

        $photoPayload = count($photoPaths) > 0 ? (count($photoPaths) === 1 ? $photoPaths[0] : json_encode($photoPaths)) : null;

        $report = Report::create([
            'product_id' => $product->id,
            'reporter_id' => $user->id,
            'reported_user_id' => $product->user_id,
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? null,
            'evidence_photo' => $photoPayload,
            'status' => ReportStatus::PENDING,
        ]);

        // Notifikasi ke pemilik produk
        Notification::create([
            'user_id' => $product->user_id,
            'title' => 'Produk Anda Dilaporkan',
            'message' => "Produk \"{$product->title}\" dilaporkan dengan alasan: {$report->reason->label()}.",
            'type' => NotificationType::REPORT,
            'related_id' => $report->id,
            'related_type' => Report::class,
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
     * Tampilkan detail laporan pada path khusus (/reports/{report})
     */
    public function show(Request $request, Report $report)
    {
        $user = $request->user();
        $report->load(['product.user', 'reporter', 'reportedUser']);

        $targetUser = $report->reportedUser ?? ($report->product ? $report->product->user : null);

        // Otorisasi: hanya terlapor, pelapor, atau admin yang boleh mengakses
        $isReportedUser = $targetUser && $targetUser->id === $user->id;
        $isReporter = $report->reporter_id === $user->id;
        $isAdmin = $user->isAdmin();

        if (!$isReportedUser && !$isReporter && !$isAdmin) {
            abort(403, 'Anda tidak memiliki hak akses untuk melihat laporan ini.');
        }

        return \Inertia\Inertia::render('Report/Show', [
            'report' => $report,
            'isReportedUser' => $isReportedUser,
            'isReporter' => $isReporter,
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * Pengajuan Banding dari Terlapor
     */
    public function submitAppeal(Request $request, Report $report)
    {
        $user = $request->user();
        $targetUser = $report->reportedUser ?? ($report->product ? $report->product->user : null);

        if (!$targetUser || $targetUser->id !== $user->id) {
            return back()->with('error', 'Hanya pihak terlapor yang dapat mengajukan banding.');
        }

        if ($report->appeal_status === 'pending') {
            return back()->with('error', 'Pengajuan banding Anda sedang dalam proses peninjauan oleh Admin BUMDes.');
        }

        if ($report->appeal_status === 'approved') {
            return back()->with('error', 'Banding untuk laporan ini sudah diterima sebelumnya.');
        }

        $validated = $request->validate([
            'appeal_notes' => 'required|string|max:2000',
            'appeal_photos' => 'nullable|array|max:4',
            'appeal_photos.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,webm,mov|max:20480',
            'appeal_photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,webm,mov|max:20480',
        ]);

        $photoPaths = [];
        if ($request->hasFile('appeal_photos')) {
            foreach (array_slice($request->file('appeal_photos'), 0, 4) as $file) {
                $photoPaths[] = $this->imageService->storeMedia($file, 'appeals');
            }
        } elseif ($request->hasFile('appeal_photo')) {
            $photoPaths[] = $this->imageService->storeMedia($request->file('appeal_photo'), 'appeals');
        }

        $photoPayload = count($photoPaths) > 0 ? (count($photoPaths) === 1 ? $photoPaths[0] : json_encode($photoPaths)) : $report->appeal_photo;

        $report->update([
            'appeal_notes' => $validated['appeal_notes'],
            'appeal_photo' => $photoPayload,
            'appeal_status' => 'pending',
            'appealed_at' => now(),
        ]);

        // Notifikasi ke seluruh Admin BUMDes
        $admins = User::where('role', UserRole::ADMIN)->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Pengajuan Banding Laporan',
                'message' => "{$user->name} mengajukan banding untuk laporan #{$report->id}.",
                'type' => NotificationType::REPORT,
                'related_id' => $report->id,
                'related_type' => Report::class,
            ]);
        }

        return back()->with('success', 'Pengajuan banding Anda berhasil dikirim dan akan segera ditinjau oleh Admin BUMDes.');
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
            'evidence_photos' => 'nullable|array|max:4',
            'evidence_photos.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,webm,mov|max:20480',
            'evidence_photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,webm,mov|max:20480',
        ]);

        $photoPaths = [];
        if ($request->hasFile('evidence_photos')) {
            foreach (array_slice($request->file('evidence_photos'), 0, 4) as $file) {
                $photoPaths[] = $this->imageService->storeMedia($file, 'reports');
            }
        } elseif ($request->hasFile('evidence_photo')) {
            $photoPaths[] = $this->imageService->storeMedia($request->file('evidence_photo'), 'reports');
        }

        $photoPayload = count($photoPaths) > 0 ? (count($photoPaths) === 1 ? $photoPaths[0] : json_encode($photoPaths)) : null;

        $report = Report::create([
            'product_id' => null,
            'reporter_id' => $currentUser->id,
            'reported_user_id' => $user->id,
            'reason' => $validated['reason'],
            'description' => $validated['description'],
            'evidence_photo' => $photoPayload,
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