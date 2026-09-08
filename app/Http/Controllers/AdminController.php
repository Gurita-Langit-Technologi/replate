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
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminController extends Controller
{
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
    public function verifications()
    {
        $verifications = SellerVerification::with('user')
            ->orderByRaw("FIELD(status, ?, ?, ?)", [
                VerificationStatus::PENDING->value,
                VerificationStatus::APPROVED->value,
                VerificationStatus::REJECTED->value,
            ])
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

        return back()->with('success', 'Verifikasi ditolak.');
    }

    /**
     * Daftar laporan produk
     */
    public function reports()
    {
        $reports = Report::with(['product', 'reporter'])
            ->orderByRaw("FIELD(status, ?, ?, ?)", [
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
     * Review laporan — hapus produk + warning ke penjual
     */
    public function reviewReport(Report $report)
    {
        $report->update(['status' => ReportStatus::REVIEWED]);
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
                'type' => NotificationType::REPORT,
                'related_id' => $report->id,
                'related_type' => Report::class,
            ]);
        }

        // Hapus produk
        $product->update(['status' => ProductStatus::SOLD]); // soft remove dari marketplace

        Notification::create([
            'user_id' => $owner->id,
            'title' => 'Produk dihapus oleh admin',
            'message' => "Produk \"{$product->title}\" dihapus karena laporan dari pengguna lain.",
            'type' => NotificationType::REPORT,
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
        $report->update(['status' => ReportStatus::DISMISSED]);
        return back()->with('success', 'Laporan diabaikan.');
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
    public function users()
    {
        $users = User::where('role', '!=', UserRole::ADMIN)
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

    /**
     * Monitoring seluruh transaksi desa
     */
    public function transactions(Request $request)
    {
        $query = Transaction::with(['product', 'buyer', 'seller', 'partner'])
            ->orderBy('created_at', 'desc');

        // Filter status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter jenis
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
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

        // Metrik ringkasan untuk header dashboard transaksi
        $totalTransactions = Transaction::count();
        $activeTransactions = Transaction::whereIn('status', [TransactionStatus::PENDING, TransactionStatus::CONFIRMED])->count();
        $completedTransactions = Transaction::where('status', TransactionStatus::COMPLETED)->count();
        $disputeTransactions = Transaction::where('status', TransactionStatus::DISPUTE_SPOILED)->count();
        $cancelledTransactions = Transaction::where('status', TransactionStatus::CANCELLED)->count();

        $totalRevenueRp = Transaction::where('status', TransactionStatus::COMPLETED)
            ->where('type', TransactionType::SALE)
            ->sum('price');

        $totalWeightSavedKg = round(Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams') / 1000, 1);

        return Inertia::render('Admin/Transactions', [
            'transactions' => $transactions,
            'filters' => [
                'status' => $request->status ?? 'all',
                'type' => $request->type ?? 'all',
                'search' => $request->search ?? '',
            ],
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
     * Halaman tukar poin
     */
    public function redeemPage()
    {
        $recentRedemptions = PointHistory::where('type', 'redeemed')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        return Inertia::render('Admin/Redeem', [
            'recentRedemptions' => $recentRedemptions,
        ]);
    }

    /**
     * Cari user berdasarkan kode
     */
    public function redeemSearch(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $user = User::where('redeem_code', strtoupper($request->code))->first();

        if (!$user) {
            return back()->with('error', 'Kode tidak ditemukan.');
        }

        $recentRedemptions = PointHistory::where('type', 'redeemed')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        return Inertia::render('Admin/Redeem', [
            'foundUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'desa' => $user->desa,
                'points' => $user->points,
                'redeem_code' => $user->redeem_code,
            ],
            'searchedCode' => $request->code,
            'recentRedemptions' => $recentRedemptions,
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