<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\PartnerProfile;
use App\Models\SellerVerification;
use App\Models\Report;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Dashboard admin dengan statistik
     */
    public function dashboard()
    {
        $stats = [
            'totalUsers' => User::where('role', '!=', 'admin')->count(),
            'totalProducts' => Product::count(),
            'activeProducts' => Product::where('status', 'active')->count(),
            'totalTransactions' => Transaction::count(),
            'completedTransactions' => Transaction::where('status', 'completed')->count(),
            'totalWeightSaved' => Transaction::where('transactions.status', 'completed')
                ->join('products', 'transactions.product_id', '=', 'products.id')
                ->sum('products.weight_grams'),
            'pendingVerifications' => SellerVerification::where('status', 'pending')->count(),
            'pendingReports' => Report::where('status', 'pending')->count(),
        ];

        // Data untuk chart: transaksi per jenis
        $transactionsByType = [
            ['name' => 'Jual', 'value' => Transaction::where('type', 'sale')->count()],
            ['name' => 'Barter', 'value' => Transaction::where('type', 'barter')->count()],
            ['name' => 'Donasi', 'value' => Transaction::where('type', 'donation')->count()],
            ['name' => 'Partner', 'value' => Transaction::where('type', 'partner_transfer')->count()],
        ];

        // Data untuk chart: produk per status
        $productsByStatus = [
            ['name' => 'Aktif', 'value' => Product::where('status', 'active')->count()],
            ['name' => 'Diskon', 'value' => Product::where('status', 'timeout_stage_1')->count()],
            ['name' => 'Donasi', 'value' => Product::where('status', 'timeout_stage_2')->count()],
            ['name' => 'Terjual', 'value' => Product::where('status', 'sold')->count()],
            ['name' => 'Terbarter', 'value' => Product::where('status', 'bartered')->count()],
            ['name' => 'Terdonasi', 'value' => Product::where('status', 'donated')->count()],
            ['name' => 'Dialihkan', 'value' => Product::whereIn('status', ['timeout_stage_3', 'transferred'])->count()],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'transactionsByType' => $transactionsByType,
            'productsByStatus' => $productsByStatus,
        ]);
    }

    /**
     * Daftar pengajuan verifikasi penjual olahan
     */
    public function verifications()
    {
        $verifications = SellerVerification::with('user')
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Verifications', [
            'verifications' => $verifications,
        ]);
    }

    /**
     * Approve verifikasi
     */
    public function approveVerification(SellerVerification $verification)
    {
        $verification->update(['status' => 'approved']);
        $verification->user->update(['role' => 'verified_seller']);

        Notification::create([
            'user_id' => $verification->user_id,
            'title' => 'Verifikasi disetujui!',
            'message' => 'Pengajuan penjual olahan Anda telah disetujui. Anda sekarang bisa menjual produk olahan.',
            'type' => 'verification',
            'related_id' => $verification->id,
            'related_type' => SellerVerification::class,
        ]);

        return back()->with('success', 'Verifikasi disetujui.');
    }

    /**
     * Reject verifikasi
     */
    public function rejectVerification(Request $request, SellerVerification $verification)
    {
        $validated = $request->validate([
            'admin_notes' => 'required|string',
        ]);

        $verification->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
        ]);

        Notification::create([
            'user_id' => $verification->user_id,
            'title' => 'Verifikasi ditolak',
            'message' => "Pengajuan ditolak: {$validated['admin_notes']}",
            'type' => 'verification',
            'related_id' => $verification->id,
            'related_type' => SellerVerification::class,
        ]);

        return back()->with('success', 'Verifikasi ditolak.');
    }

    /**
     * Daftar laporan produk
     */
    public function reports()
    {
        $reports = Report::with(['product', 'reporter'])
            ->orderByRaw("FIELD(status, 'pending', 'reviewed', 'dismissed')")
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
        ]);
    }

    /**
     * Review laporan — hapus produk + warning ke penjual
     */
    public function reviewReport(Report $report)
    {
        $report->update(['status' => 'reviewed']);
        $product = $report->product;
        $owner = User::find($product->user_id);

        // Tambah report count
        $owner->increment('report_count');

        // Blacklist kalau sudah 3x
        if ($owner->report_count >= 3) {
            $owner->update(['is_blacklisted' => true]);
            Notification::create([
                'user_id' => $owner->id,
                'title' => 'Akun ditangguhkan',
                'message' => 'Akun Anda ditangguhkan karena 3x laporan dikonfirmasi. Hubungi admin untuk banding.',
                'type' => 'report',
                'related_id' => $report->id,
                'related_type' => Report::class,
            ]);
        }

        // Hapus produk
        $product->update(['status' => 'sold']); // soft remove dari marketplace

        Notification::create([
            'user_id' => $owner->id,
            'title' => 'Produk dihapus oleh admin',
            'message' => "Produk \"{$product->title}\" dihapus karena laporan dari pengguna lain.",
            'type' => 'report',
            'related_id' => $report->id,
            'related_type' => Report::class,
        ]);

        return back()->with('success', 'Laporan diproses, produk dihapus.');
    }

    /**
     * Dismiss laporan
     */
    public function dismissReport(Report $report)
    {
        $report->update(['status' => 'dismissed']);
        return back()->with('success', 'Laporan diabaikan.');
    }

    /**
     * Manajemen partner
     */
    public function partners()
    {
        $partners = User::where('role', 'partner')
            ->with('partnerProfile')
            ->get();

        return Inertia::render('Admin/Partners', [
            'partners' => $partners,
        ]);
    }

    /**
     * Tambah partner baru
     */
    public function storePartner(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'whatsapp_number' => 'nullable|string',
            'desa' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'partner_type' => 'required|in:peternak,kompos,maggot,umkm',
            'capacity_description' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'partner',
            'whatsapp_number' => $validated['whatsapp_number'] ?? null,
            'desa' => $validated['desa'] ?? null,
            'kecamatan' => $validated['kecamatan'] ?? null,
        ]);

        PartnerProfile::create([
            'user_id' => $user->id,
            'partner_type' => $validated['partner_type'],
            'capacity_description' => $validated['capacity_description'] ?? null,
            'is_active' => true,
        ]);

        return back()->with('success', 'Partner berhasil ditambahkan.');
    }

    /**
     * Toggle aktif/nonaktif partner
     */
    public function togglePartner(PartnerProfile $profile)
    {
        $profile->update(['is_active' => !$profile->is_active]);
        return back()->with('success', 'Status partner diperbarui.');
    }

    /**
     * Manajemen pengguna
     */
    public function users()
    {
        $users = User::where('role', '!=', 'admin')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Toggle blacklist user
     */
    public function toggleBlacklist(User $user)
    {
        $user->update(['is_blacklisted' => !$user->is_blacklisted]);

        $status = $user->is_blacklisted ? 'ditangguhkan' : 'diaktifkan kembali';
        return back()->with('success', "Akun {$user->name} {$status}.");
    }
}