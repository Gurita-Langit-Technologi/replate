<?php

namespace App\Http\Controllers;

use App\Enums\NotificationType;
use App\Enums\PartnerType;
use App\Enums\ProductStatus;
use App\Enums\ReportStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Enums\UserRole;
use App\Enums\VerificationStatus;
use App\Models\Notification;
use App\Models\PartnerProfile;
use App\Models\PointHistory;
use App\Models\Product;
use App\Models\Report;
use App\Models\SellerVerification;
use App\Models\Transaction;
use App\Models\User;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct(
        protected EmailNotificationService $emailService
    ) {}

    /**
     * Dashboard admin dengan statistik
     */
    public function dashboard()
    {
        $directSavedGrams = Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->whereIn('type', [TransactionType::SALE, TransactionType::BARTER, TransactionType::DONATION])
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        $partnerSavedGrams = Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->where('type', TransactionType::PARTNER_TRANSFER)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        $directSavedKg = round($directSavedGrams / 1000, 1);
        $partnerSavedKg = round($partnerSavedGrams / 1000, 1);
        $totalVillageImpactKg = round(($directSavedGrams + $partnerSavedGrams) / 1000, 1);

        $totalImpactGrams = $directSavedGrams + $partnerSavedGrams;
        $directRatio = $totalImpactGrams > 0 ? round(($directSavedGrams / $totalImpactGrams) * 100, 1) : 0;
        $partnerRatio = $totalImpactGrams > 0 ? round(($partnerSavedGrams / $totalImpactGrams) * 100, 1) : 0;

        $villageImpactMetrics = [
            'totalVillageImpactKg' => $totalVillageImpactKg,
            'directSavedKg' => $directSavedKg,
            'partnerSavedKg' => $partnerSavedKg,
            'directRatio' => $directRatio,
            'partnerRatio' => $partnerRatio,
            'chartData' => [
                ['name' => 'Penyelamatan Langsung', 'weightKg' => $directSavedKg, 'percentage' => $directRatio],
                ['name' => 'Alih Fungsi Mitra', 'weightKg' => $partnerSavedKg, 'percentage' => $partnerRatio],
            ],
        ];

        $stats = [
            'totalUsers' => User::where('role', '!=', UserRole::ADMIN)->count(),
            'totalProducts' => Product::count(),
            'activeProducts' => Product::where('status', ProductStatus::ACTIVE)->count(),
            'totalTransactions' => Transaction::count(),
            'completedTransactions' => Transaction::where('status', TransactionStatus::COMPLETED)->count(),
            'totalWeightSaved' => Transaction::where('transactions.status', TransactionStatus::COMPLETED)
                ->join('products', 'transactions.product_id', '=', 'products.id')
                ->sum('products.weight_grams'),
            'pendingVerifications' => SellerVerification::where('status', VerificationStatus::PENDING)->count(),
            'pendingReports' => Report::where('status', ReportStatus::PENDING)->count(),
        ];

        // Data untuk chart: transaksi per jenis
        $transactionsByType = [
            ['name' => 'Jual', 'value' => Transaction::where('type', TransactionType::SALE)->count()],
            ['name' => 'Barter', 'value' => Transaction::where('type', TransactionType::BARTER)->count()],
            ['name' => 'Donasi', 'value' => Transaction::where('type', TransactionType::DONATION)->count()],
            ['name' => 'Partner', 'value' => Transaction::where('type', TransactionType::PARTNER_TRANSFER)->count()],
        ];

        // Data untuk chart: produk per status
        $productsByStatus = [
            ['name' => 'Aktif', 'value' => Product::where('status', ProductStatus::ACTIVE)->count()],
            ['name' => 'Diskon', 'value' => Product::where('status', ProductStatus::TIMEOUT_STAGE_1)->count()],
            ['name' => 'Donasi', 'value' => Product::where('status', ProductStatus::TIMEOUT_STAGE_2)->count()],
            ['name' => 'Terjual', 'value' => Product::where('status', ProductStatus::SOLD)->count()],
            ['name' => 'Terbarter', 'value' => Product::where('status', ProductStatus::BARTERED)->count()],
            ['name' => 'Terdonasi', 'value' => Product::where('status', ProductStatus::DONATED)->count()],
            ['name' => 'Dialihkan', 'value' => Product::whereIn('status', [ProductStatus::TIMEOUT_STAGE_3, ProductStatus::TRANSFERRED, ProductStatus::DIALIHKAN_KE_MITRA])->count()],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'villageImpactMetrics' => $villageImpactMetrics,
            'transactionsByType' => $transactionsByType,
            'productsByStatus' => $productsByStatus,
        ]);
    }

    /**
     * Daftar pengajuan verifikasi penjual olahan
     */
    public function verifications(Request $request)
    {
        $statusFilter = $request->input('status', 'pending');
        $allowedStatuses = ['pending', 'approved', 'rejected', 'all'];
        if (!in_array($statusFilter, $allowedStatuses)) {
            $statusFilter = 'pending';
        }

        $query = SellerVerification::with('user')
            ->orderByRaw("CASE status WHEN ? THEN 1 WHEN ? THEN 2 WHEN ? THEN 3 ELSE 4 END", [
                VerificationStatus::PENDING->value,
                VerificationStatus::APPROVED->value,
                VerificationStatus::REJECTED->value,
            ])
            ->orderBy('created_at', 'desc');

        if ($statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        $verifications = $query->get();

        $statusCounts = [
            'all'      => SellerVerification::count(),
            'pending'  => SellerVerification::where('status', VerificationStatus::PENDING)->count(),
            'approved' => SellerVerification::where('status', VerificationStatus::APPROVED)->count(),
            'rejected' => SellerVerification::where('status', VerificationStatus::REJECTED)->count(),
        ];

        return Inertia::render('Admin/Verifications', [
            'verifications' => $verifications,
            'statusCounts'  => $statusCounts,
            'filters'       => ['status' => $statusFilter],
        ]);
    }

    /**
     * Approve verifikasi
     */
    public function approveVerification(SellerVerification $verification)
    {
        $verification->update(['status' => VerificationStatus::APPROVED]);
        $verification->user->update(['role' => UserRole::VERIFIED_SELLER]);

        Notification::create([
            'user_id' => $verification->user_id,
            'title' => 'Verifikasi disetujui!',
            'message' => 'Pengajuan penjual olahan Anda telah disetujui. Anda sekarang bisa menjual produk olahan.',
            'type' => NotificationType::VERIFICATION,
            'related_id' => $verification->id,
            'related_type' => SellerVerification::class,
        ]);

        $this->emailService->sendSellerVerificationResult($verification, true);

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
            'status' => VerificationStatus::REJECTED,
            'admin_notes' => $validated['admin_notes'],
        ]);

        Notification::create([
            'user_id' => $verification->user_id,
            'title' => 'Verifikasi ditolak',
            'message' => "Pengajuan ditolak: {$validated['admin_notes']}",
            'type' => NotificationType::VERIFICATION,
            'related_id' => $verification->id,
            'related_type' => SellerVerification::class,
        ]);

        $this->emailService->sendSellerVerificationResult($verification, false, $validated['admin_notes']);

        return back()->with('success', 'Verifikasi ditolak.');
    }

    /**
     * Daftar laporan produk dan akun pengguna
     */
    public function reports()
    {
        $reports = Report::with(['product.user', 'reporter', 'reportedUser'])
            ->orderByRaw("CASE WHEN appeal_status = 'pending' THEN 0 WHEN status = ? THEN 1 WHEN status = ? THEN 2 WHEN status = ? THEN 3 ELSE 4 END", [
                ReportStatus::PENDING->value,
                ReportStatus::REVIEWED->value,
                ReportStatus::DISMISSED->value,
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
        ]);
    }

    /**
     * Review laporan — beri sanksi warning / hapus produk
     */
    public function reviewReport(Request $request, Report $report)
    {
        $adminNotes = $request->input('admin_notes', 'Tindakan moderasi telah diterapkan oleh Admin BUMDes.');

        $report->update([
            'status' => ReportStatus::REVIEWED,
            'admin_notes' => $adminNotes,
        ]);

        $targetUser = $report->reportedUser ?? ($report->product ? $report->product->user : null);

        if ($targetUser) {
            $targetUser->increment('report_count');

            if ($targetUser->report_count >= 3 && !$targetUser->is_blacklisted) {
                $targetUser->update(['is_blacklisted' => true]);
                Notification::create([
                    'user_id' => $targetUser->id,
                    'title' => 'Akun Dinonaktifkan (Blacklist)',
                    'message' => 'Akun Anda telah dinonaktifkan otomatis karena akumulasi 3 pelanggaran terkonfirmasi.',
                    'type' => NotificationType::REPORT,
                    'related_id' => $report->id,
                    'related_type' => Report::class,
                ]);
            } else {
                Notification::create([
                    'user_id' => $targetUser->id,
                    'title' => 'Peringatan Pelanggaran Akun',
                    'message' => "Anda menerima surat peringatan ({$targetUser->report_count}/3) atas pelanggaran: {$report->reason->label()}. Catatan: {$adminNotes}",
                    'type' => NotificationType::REPORT,
                    'related_id' => $report->id,
                    'related_type' => Report::class,
                ]);
            }
        }

        // Jika laporan terkait produk, hapus produk dari marketplace
        if ($report->product) {
            $report->product->update(['status' => ProductStatus::SOLD]);
            Notification::create([
                'user_id' => $report->product->user_id,
                'title' => 'Produk Dinonaktifkan Admin',
                'message' => "Produk \"{$report->product->title}\" dihapus dari marketplace karena melanggar ketentuan.",
                'type' => NotificationType::REPORT,
                'related_id' => $report->id,
                'related_type' => Report::class,
            ]);
        }

        // Beri tahu pelapor bahwa laporannya sudah ditindaklanjuti
        Notification::create([
            'user_id' => $report->reporter_id,
            'title' => 'Laporan Anda Telah Ditindaklanjuti',
            'message' => 'Terima kasih telah menjaga keamanan komunitas Replate. Laporan Anda telah diperiksa dan ditindaklanjuti.',
            'type' => NotificationType::REPORT,
            'related_id' => $report->id,
            'related_type' => Report::class,
        ]);

        return back()->with('success', 'Laporan berhasil ditindaklanjuti dan sanksi telah diberikan.');
    }

    /**
     * Langsung blacklist pengguna dari laporan
     */
    public function blacklistReportUser(Request $request, Report $report)
    {
        $adminNotes = $request->input('admin_notes', 'Akun diblokir langsung oleh Admin BUMDes karena pelanggaran berat.');

        $report->update([
            'status' => ReportStatus::REVIEWED,
            'admin_notes' => $adminNotes,
        ]);

        $targetUser = $report->reportedUser ?? ($report->product ? $report->product->user : null);

        if ($targetUser) {
            $targetUser->update([
                'is_blacklisted' => true,
                'report_count' => max(3, $targetUser->report_count + 1),
            ]);

            Notification::create([
                'user_id' => $targetUser->id,
                'title' => 'Akun Diblokir Permanen',
                'message' => "Akun Anda telah dinonaktifkan oleh Admin BUMDes karena pelanggaran berat. Catatan: {$adminNotes}",
                'type' => NotificationType::REPORT,
                'related_id' => $report->id,
                'related_type' => Report::class,
            ]);
        }

        if ($report->product) {
            $report->product->update(['status' => ProductStatus::SOLD]);
        }

        Notification::create([
            'user_id' => $report->reporter_id,
            'title' => 'Laporan Selesai: Akun Telah Dinonaktifkan',
            'message' => 'Laporan Anda telah diverifikasi dan tindakan tegas pemblokiran akun telah dilakukan.',
            'type' => NotificationType::REPORT,
            'related_id' => $report->id,
            'related_type' => Report::class,
        ]);

        return back()->with('success', 'Pengguna berhasil diblokir / di-blacklist.');
    }

    /**
     * Dismiss / Abaikan laporan
     */
    public function dismissReport(Request $request, Report $report)
    {
        $adminNotes = $request->input('admin_notes', 'Laporan diabaikan setelah ditinjau: bukti tidak cukup atau tidak ditemukan pelanggaran.');

        $report->update([
            'status' => ReportStatus::DISMISSED,
            'admin_notes' => $adminNotes,
        ]);

        Notification::create([
            'user_id' => $report->reporter_id,
            'title' => 'Pembaruan Laporan',
            'message' => "Laporan Anda telah ditinjau dan ditutup oleh Admin. Catatan: {$adminNotes}",
            'type' => NotificationType::REPORT,
            'related_id' => $report->id,
            'related_type' => Report::class,
        ]);

        return back()->with('success', 'Laporan telah diabaikan/ditutup.');
    }

    /**
     * Terima Banding Penjual — pulihkan produk dan kurangi poin pelanggaran
     */
    public function approveAppeal(Request $request, Report $report)
    {
        $adminNotes = $request->input('admin_notes', 'Banding disetujui setelah ditinjau ulang oleh Admin BUMDes. Sanksi telah dicabut.');

        $report->update([
            'appeal_status' => 'approved',
            'appeal_admin_notes' => $adminNotes,
            'appeal_reviewed_at' => now(),
            'status' => ReportStatus::DISMISSED,
        ]);

        $targetUser = $report->reportedUser ?? ($report->product ? $report->product->user : null);

        if ($targetUser) {
            $newReportCount = max(0, $targetUser->report_count - 1);
            $targetUser->update([
                'report_count' => $newReportCount,
                'is_blacklisted' => $newReportCount >= 3 ? $targetUser->is_blacklisted : false,
            ]);

            Notification::create([
                'user_id' => $targetUser->id,
                'title' => 'Banding Laporan Disetujui',
                'message' => "Pengajuan banding Anda untuk laporan #{$report->id} telah disetujui oleh Admin BUMDes. Catatan: {$adminNotes}",
                'type' => NotificationType::REPORT,
                'related_id' => $report->id,
                'related_type' => Report::class,
            ]);
        }

        // Jika ada produk terkait yang sempat dinonaktifkan, kembalikan statusnya ke active
        if ($report->product && $report->product->status === ProductStatus::SOLD) {
            $report->product->update(['status' => ProductStatus::ACTIVE]);
        }

        return back()->with('success', 'Banding berhasil disetujui. Produk dan reputasi akun telah dipulihkan.');
    }

    /**
     * Tolak Banding Penjual — pertahankan sanksi
     */
    public function rejectAppeal(Request $request, Report $report)
    {
        $adminNotes = $request->input('admin_notes', 'Banding ditolak setelah peninjauan ulang: bukti sanggahan tidak mencukupi.');

        $report->update([
            'appeal_status' => 'rejected',
            'appeal_admin_notes' => $adminNotes,
            'appeal_reviewed_at' => now(),
        ]);

        $targetUser = $report->reportedUser ?? ($report->product ? $report->product->user : null);

        if ($targetUser) {
            Notification::create([
                'user_id' => $targetUser->id,
                'title' => 'Banding Laporan Ditolak',
                'message' => "Pengajuan banding Anda untuk laporan #{$report->id} ditolak. Keputusan moderasi tetap berlaku. Catatan: {$adminNotes}",
                'type' => NotificationType::REPORT,
                'related_id' => $report->id,
                'related_type' => Report::class,
            ]);
        }

        return back()->with('success', 'Banding telah ditolak dan keputusan moderasi dipertahankan.');
    }

    /**
     * Manajemen partner
     */
    public function partners()
    {
        $partners = User::where('role', UserRole::PARTNER)
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
            'partner_type' => ['required', Rule::enum(PartnerType::class)],
            'capacity_description' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => UserRole::PARTNER,
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
    public function users(Request $request)
    {
        $role      = $request->input('role');
        $status    = $request->input('status');
        $sort      = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $search    = $request->input('search');

        // Whitelist sortable columns
        $allowedSorts = ['name', 'created_at', 'report_count', 'points'];
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'created_at';
        }

        $query = User::where('role', '!=', UserRole::ADMIN);

        if ($role && in_array($role, ['user', 'verified_seller', 'partner'])) {
            $query->where('role', $role);
        }

        if ($status === 'active') {
            $query->where('is_blacklisted', false);
        } elseif ($status === 'suspended') {
            $query->where('is_blacklisted', true);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sort, $direction === 'asc' ? 'asc' : 'desc');

        $users = $query->get();

        // Role counts for tabs
        $roleCounts = [
            'all'             => User::where('role', '!=', UserRole::ADMIN)->count(),
            'user'            => User::where('role', 'user')->count(),
            'verified_seller' => User::where('role', 'verified_seller')->count(),
            'partner'         => User::where('role', 'partner')->count(),
        ];

        return Inertia::render('Admin/Users', [
            'users'      => $users,
            'filters'    => $request->only(['role', 'status', 'sort', 'direction', 'search']),
            'roleCounts' => $roleCounts,
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

    /**
     * Monitoring seluruh transaksi desa
     */
    public function transactions(Request $request)
    {
        $period = $request->input('period', 'all');
        if (!in_array($period, ['all', 'week', 'month', 'year'])) {
            $period = 'all';
        }

        $query = Transaction::with(['product', 'buyer', 'seller', 'partner'])
            ->orderBy('created_at', 'desc');

        // Filter periode
        if ($period === 'week') {
            $query->whereBetween('transactions.created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($period === 'month') {
            $query->whereBetween('transactions.created_at', [now()->startOfMonth(), now()->endOfMonth()]);
        } elseif ($period === 'year') {
            $query->whereBetween('transactions.created_at', [now()->startOfYear(), now()->endOfYear()]);
        }

        // Filter status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('transactions.status', $request->status);
        }

        // Filter jenis
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('transactions.type', $request->type);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('transactions.id', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($pq) use ($search) {
                        $pq->where('title', 'like', "%{$search}%");
                    })
                    ->orWhereHas('buyer', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('seller', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $transactions = $query->get();

        // Metrik ringkasan untuk header dashboard transaksi (sesuai periode)
        $metricBase = Transaction::query();
        if ($period === 'week') {
            $metricBase->whereBetween('transactions.created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($period === 'month') {
            $metricBase->whereBetween('transactions.created_at', [now()->startOfMonth(), now()->endOfMonth()]);
        } elseif ($period === 'year') {
            $metricBase->whereBetween('transactions.created_at', [now()->startOfYear(), now()->endOfYear()]);
        }

        $totalTransactions = (clone $metricBase)->count();
        $activeTransactions = (clone $metricBase)->whereIn('transactions.status', [TransactionStatus::PENDING, TransactionStatus::CONFIRMED])->count();
        $completedTransactions = (clone $metricBase)->where('transactions.status', TransactionStatus::COMPLETED)->count();
        $disputeTransactions = (clone $metricBase)->where('transactions.status', TransactionStatus::DISPUTE_SPOILED)->count();
        $cancelledTransactions = (clone $metricBase)->where('transactions.status', TransactionStatus::CANCELLED)->count();

        $totalRevenueRp = (clone $metricBase)->where('transactions.status', TransactionStatus::COMPLETED)
            ->where('transactions.type', TransactionType::SALE)
            ->sum('transactions.price');

        $totalWeightSavedKg = round((clone $metricBase)->where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams') / 1000, 1);

        // Period counts untuk tab navigasi rentang waktu
        $periodCounts = [
            'all' => Transaction::count(),
            'week' => Transaction::whereBetween('transactions.created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'month' => Transaction::whereBetween('transactions.created_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
            'year' => Transaction::whereBetween('transactions.created_at', [now()->startOfYear(), now()->endOfYear()])->count(),
        ];

        return Inertia::render('Admin/Transactions', [
            'transactions' => $transactions,
            'filters' => [
                'period' => $period,
                'status' => $request->status ?? 'all',
                'type' => $request->type ?? 'all',
                'search' => $request->search ?? '',
            ],
            'periodCounts' => $periodCounts,
            'metrics' => [
                'total' => $totalTransactions,
                'active' => $activeTransactions,
                'completed' => $completedTransactions,
                'dispute' => $disputeTransactions,
                'cancelled' => $cancelledTransactions,
                'revenueRp' => $totalRevenueRp,
                'weightSavedKg' => $totalWeightSavedKg,
            ],
        ]);
    }

    /**
     * Format data profil user lengkap untuk admin redeem
     */
    private function formatUserData(User $user): array
    {
        $completedTxCount = Transaction::where(function ($q) use ($user) {
                $q->where('seller_id', $user->id)
                  ->orWhere('buyer_id', $user->id);
            })
            ->where('status', TransactionStatus::COMPLETED)
            ->count();

        $savedWeightGrams = Transaction::where('seller_id', $user->id)
            ->where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'whatsapp_number' => $user->whatsapp_number,
            'role' => $user->role instanceof \BackedEnum ? $user->role->value : $user->role,
            'desa' => $user->desa,
            'kecamatan' => $user->kecamatan,
            'address' => $user->address,
            'points' => (int) $user->points,
            'redeem_code' => $user->redeem_code,
            'report_count' => (int) $user->report_count,
            'is_blacklisted' => (bool) $user->is_blacklisted,
            'joined_at' => $user->created_at ? $user->created_at->translatedFormat('d F Y') : '-',
            'completed_tx_count' => $completedTxCount,
            'saved_weight_kg' => round($savedWeightGrams / 1000, 1),
        ];
    }

    /**
     * Halaman tukar poin
     */
    public function redeemPage(Request $request)
    {
        $allUsers = User::orderBy('points', 'desc')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'email', 'role', 'whatsapp_number', 'desa', 'kecamatan', 'address', 'points', 'redeem_code']);

        $recentRedemptions = PointHistory::where('type', 'redeemed')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(30)
            ->get();

        $foundUser = null;
        $userRedemptions = [];
        $searchedCode = $request->query('code');

        if ($searchedCode) {
            $query = trim($searchedCode);
            $user = User::where('redeem_code', strtoupper($query))
                ->orWhere('email', $query)
                ->orWhere('whatsapp_number', $query)
                ->orWhere('name', 'like', "%{$query}%")
                ->first();

            if ($user) {
                $foundUser = $this->formatUserData($user);
                $userRedemptions = PointHistory::where('user_id', $user->id)
                    ->where('type', 'redeemed')
                    ->orderBy('created_at', 'desc')
                    ->get();
            }
        }

        return Inertia::render('Admin/Redeem', [
            'foundUser' => $foundUser,
            'userRedemptions' => $userRedemptions,
            'searchedCode' => $searchedCode,
            'allUsers' => $allUsers,
            'recentRedemptions' => $recentRedemptions,
            'predefinedRewards' => PointController::getRewardsCatalog(),
        ]);
    }

    /**
     * Cari user berdasarkan kode, nama, email, atau no WhatsApp
     */
    public function redeemSearch(Request $request)
    {
        $code = $request->input('code') ?? $request->query('code');

        if (!$code || trim($code) === '') {
            return redirect()->route('admin.redeem');
        }

        $query = trim($code);

        $user = User::where('redeem_code', strtoupper($query))
            ->orWhere('email', $query)
            ->orWhere('whatsapp_number', $query)
            ->orWhere('name', 'like', "%{$query}%")
            ->first();

        if (!$user) {
            return redirect()->route('admin.redeem')->with('error', "Warga dengan kode/identitas '{$query}' tidak ditemukan.");
        }

        $allUsers = User::orderBy('points', 'desc')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'email', 'role', 'whatsapp_number', 'desa', 'kecamatan', 'address', 'points', 'redeem_code']);

        $recentRedemptions = PointHistory::where('type', 'redeemed')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(30)
            ->get();

        $userRedemptions = PointHistory::where('user_id', $user->id)
            ->where('type', 'redeemed')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Redeem', [
            'foundUser' => $this->formatUserData($user),
            'userRedemptions' => $userRedemptions,
            'searchedCode' => $code,
            'allUsers' => $allUsers,
            'recentRedemptions' => $recentRedemptions,
            'predefinedRewards' => PointController::getRewardsCatalog(),
        ]);
    }

    /**
     * Proses penukaran poin
     */
    public function redeemProcess(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|integer|min:1',
            'description' => 'required|string|max:255',
        ]);

        $user = User::find($validated['user_id']);

        if ($user->points < $validated['amount']) {
            return back()->with('error', "Saldo poin tidak cukup. Saldo: {$user->points} poin.");
        }

        $result = PointHistory::redeemPoints(
            $user,
            $validated['amount'],
            $validated['description']
        );

        if (!$result) {
            return back()->with('error', 'Gagal menukar poin. Saldo tidak cukup.');
        }

        Notification::create([
            'user_id' => $user->id,
            'title' => "RePoin ditukar: -{$validated['amount']} poin",
            'message' => "Penukaran: {$validated['description']}. Sisa saldo: {$user->fresh()->points} poin.",
            'type' => NotificationType::TRANSACTION,
        ]);

        return redirect()->route('admin.redeem')->with('success', "Berhasil menukar {$validated['amount']} poin milik {$user->name}.");
    }
}