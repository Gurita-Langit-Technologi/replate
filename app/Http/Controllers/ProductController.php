<?php

namespace App\Http\Controllers;

use App\Enums\PickupType;
use App\Enums\ProductCategory;
use App\Enums\ProductCondition;
use App\Enums\ProductStatus;
use App\Enums\TransactionMode;
use App\Enums\TransactionStatus;
use App\Enums\UserRole;
use App\Models\Product;
use App\Models\Review;
use App\Models\Transaction;
use App\Models\User;
use App\Services\ImageService;
use App\Services\ImpactAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        protected ImageService $imageService
    ) {}
    /**
     * Marketplace — tampilkan semua produk aktif
     */
    public function index(Request $request)
    {
        $query = Product::with('user')
            ->whereIn('status', [
                ProductStatus::ACTIVE,
                ProductStatus::TIMEOUT_STAGE_1,
                ProductStatus::TIMEOUT_STAGE_2,
            ]);

        // Filter berdasarkan kategori
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter berdasarkan kondisi
        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }

        // Filter berdasarkan mode transaksi
        if ($request->filled('mode')) {
            $query->where('transaction_mode', $request->mode);
        }

        // Filter berdasarkan kecamatan
        if ($request->filled('kecamatan')) {
            $query->where('kecamatan', $request->kecamatan);
        }

        // Search berdasarkan judul
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sort = $request->get('sort', 'newest');
        $query = match ($sort) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'timeout' => $query->orderBy('timeout_at', 'asc'),
            default => $query->orderBy('created_at', 'desc'), // newest
        };

        $products = $query->paginate(16)->withQueryString();

        // Daftar kecamatan unik dari produk aktif (untuk filter dropdown)
        $availableKecamatan = Product::whereIn('status', [
                ProductStatus::ACTIVE,
                ProductStatus::TIMEOUT_STAGE_1,
                ProductStatus::TIMEOUT_STAGE_2,
            ])
            ->whereNotNull('kecamatan')
            ->where('kecamatan', '!=', '')
            ->distinct()
            ->orderBy('kecamatan')
            ->pluck('kecamatan');

        return Inertia::render('Marketplace/Index', [
            'products'            => $products,
            'filters'             => $request->only(['category', 'condition', 'mode', 'kecamatan', 'search', 'sort']),
            'availableKecamatan'  => $availableKecamatan,
        ]);
    }

    /**
     * Detail produk
     */
    public function show(Product $product)
    {
        $product->load('user');

        // Hitung stok yang sedang dalam proses transaksi (pending / confirmed)
        $reservedQty = (int) Transaction::where('product_id', $product->id)
            ->whereIn('status', [TransactionStatus::PENDING, TransactionStatus::CONFIRMED])
            ->sum('quantity');

        $availableQty = max(0, (int) ($product->quantity ?? 1) - $reservedQty);

        return Inertia::render('Marketplace/Show', [
            'product' => $product,
            'reservedQty' => $reservedQty,
            'availableQty' => $availableQty,
        ]);
    }

    /**
     * Form upload produk
     */
    public function create(Request $request)
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard')->with('error', 'Admin tidak memiliki akses untuk upload produk.');
        }
        if ($user->isPartner()) {
            return redirect()->route('partner.dashboard')->with('error', 'Mitra tidak memiliki akses untuk upload produk.');
        }

        return Inertia::render('Marketplace/Create');
    }

    /**
     * Simpan produk baru
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin() || $user->isPartner()) {
            return back()->with('error', 'Akun admin atau mitra tidak dapat mengunggah produk.');
        }

        // Cek lokasi
        if (empty($user->desa) || empty($user->kecamatan)) {
            return redirect()->route('profile.edit')->with('error', 'Lengkapi lokasi (desa & kecamatan) di profil Anda sebelum upload produk.');
        }

        // Cek olahan hanya untuk verified seller
        if ($request->category === ProductCategory::OLAHAN->value && $user->role !== UserRole::VERIFIED_SELLER) {
            return back()->withErrors(['category' => 'Hanya penjual olahan terverifikasi yang bisa upload produk olahan.']);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'photo' => 'required|image|max:2048',
            'category' => ['required', Rule::enum(ProductCategory::class)],
            'condition' => ['required', Rule::enum(ProductCondition::class)],
            'weight_grams' => 'nullable|integer|min:0',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|in:gram,kg,pcs,porsi,kotak,bungkus,liter,ikat,paket',
            'transaction_mode' => ['required', Rule::enum(TransactionMode::class)],
            'price' => 'nullable|integer|min:0',
            'barter_description' => 'nullable|string',
            'pickup_address' => 'nullable|string|max:500',
            'pickup_notes' => 'nullable|string|max:255',
            'pickup_type' => ['required', Rule::enum(PickupType::class)],
        ]);

        // Validasi: jual harus ada harga
        if (in_array($validated['transaction_mode'], [TransactionMode::SELL->value, TransactionMode::SELL_AND_BARTER->value]) && empty($validated['price'])) {
            return back()->withErrors(['price' => 'Harga wajib diisi untuk mode jual.']);
        }

        // Validasi: barter harus ada deskripsi
        if (in_array($validated['transaction_mode'], [TransactionMode::BARTER->value, TransactionMode::SELL_AND_BARTER->value]) && empty($validated['barter_description'])) {
            return back()->withErrors(['barter_description' => 'Deskripsi barter wajib diisi.']);
        }

        // Validasi kata larangan sesuai tag kondisi
        if ($tagError = $this->validateTagCompatibility($validated)) {
            return back()->withErrors(['condition' => $tagError])->withInput();
        }

        // Upload foto teroptimasi
        $photoPath = $this->imageService->storeOptimized($request->file('photo'), 'products');

        // Hitung timeout
        $timeoutAt = Product::calculateTimeout($validated['condition']);
        $timeoutStage1At = Product::calculateTimeoutStage1($validated['condition']);

        // Estimasi berat otomatis jika kosong/0
        $weightGrams = (int) ($validated['weight_grams'] ?? 0);
        if ($weightGrams <= 0) {
            $qty = (int) $validated['quantity'];
            $weightGrams = match ($validated['unit']) {
                'kg' => $qty * 1000,
                'gram' => $qty,
                'liter' => $qty * 1000,
                'porsi' => $qty * 350,
                'kotak', 'bungkus' => $qty * 400,
                'ikat' => $qty * 300,
                'pcs' => $qty * 150,
                default => $qty * 300,
            };
        }

        // Simpan produk
        $product = Product::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'photo' => $photoPath,
            'category' => $validated['category'],
            'condition' => $validated['condition'],
            'weight_grams' => $weightGrams,
            'quantity' => $validated['quantity'],
            'unit' => $validated['unit'],
            'transaction_mode' => $validated['transaction_mode'],
            'price' => $validated['price'] ?? null,
            'barter_description' => $validated['barter_description'] ?? null,
            'desa' => $user->desa ?? '',
            'kecamatan' => $user->kecamatan ?? '',
            'pickup_type' => $validated['pickup_type'],
            'pickup_address' => $validated['pickup_address'] ?? $user->address,
            'pickup_notes' => $validated['pickup_notes'] ?? null,
            'timeout_at' => $timeoutAt,
            'timeout_stage1_at' => $timeoutStage1At,
            'status' => ProductStatus::ACTIVE,
        ]);

        return redirect()->route('marketplace')->with('success', 'Produk berhasil diunggah!');
    }

    /**
     * Produk saya
     */
    public function myProducts(Request $request)
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        if ($user->isPartner()) {
            return redirect()->route('partner.dashboard');
        }

        $products = Product::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Marketplace/MyProducts', [
            'products' => $products,
        ]);
    }

    /**
     * Form edit produk
     */
    public function edit(Product $product, Request $request)
    {
        // Pastikan hanya pemilik yang bisa edit
        if ($product->user_id !== $request->user()->id) {
            return redirect()->route('products.mine')->with('error', 'Anda tidak memiliki akses.');
        }

        return Inertia::render('Marketplace/Edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update produk
     */
    public function update(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            return redirect()->route('products.mine')->with('error', 'Anda tidak memiliki akses.');
        }

        if ($request->category === ProductCategory::OLAHAN->value && $request->user()->role !== UserRole::VERIFIED_SELLER) {
            return back()->withErrors(['category' => 'Hanya penjual olahan terverifikasi yang bisa upload produk olahan.']);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'category' => ['required', Rule::enum(ProductCategory::class)],
            'condition' => ['required', Rule::enum(ProductCondition::class)],
            'weight_grams' => 'nullable|integer|min:0',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|in:gram,kg,pcs,porsi,kotak,bungkus,liter,ikat,paket',
            'transaction_mode' => ['required', Rule::enum(TransactionMode::class)],
            'price' => 'nullable|integer|min:0',
            'barter_description' => 'nullable|string',
            'pickup_type' => ['nullable', Rule::enum(PickupType::class)],
            'pickup_address' => 'nullable|string|max:500',
            'pickup_notes' => 'nullable|string|max:255',
        ]);

        // Validasi kata larangan sesuai tag kondisi
        if ($tagError = $this->validateTagCompatibility($validated)) {
            return back()->withErrors(['condition' => $tagError])->withInput();
        }

        // Estimasi berat otomatis jika kosong/0
        $weightGrams = (int) ($validated['weight_grams'] ?? 0);
        if ($weightGrams <= 0) {
            $qty = (int) $validated['quantity'];
            $weightGrams = match ($validated['unit']) {
                'kg' => $qty * 1000,
                'gram' => $qty,
                'liter' => $qty * 1000,
                'porsi' => $qty * 350,
                'kotak', 'bungkus' => $qty * 400,
                'ikat' => $qty * 300,
                'pcs' => $qty * 150,
                default => $qty * 300,
            };
        }
        $validated['weight_grams'] = $weightGrams;

        // Update foto jika ada yang baru
        if ($request->hasFile('photo')) {
            // Hapus foto lama
            if ($product->photo) {
                Storage::disk('public')->delete($product->photo);
            }
            $validated['photo'] = $this->imageService->storeOptimized($request->file('photo'), 'products');
        } else {
            unset($validated['photo']);
        }

        $product->update($validated);

        return redirect()->route('products.mine')->with('success', 'Produk berhasil diperbarui!');
    }

    /**
     * Hapus produk
     */
    public function destroy(Product $product, Request $request)
    {
        if ($product->user_id !== $request->user()->id) {
            return redirect()->route('products.mine')->with('error', 'Anda tidak memiliki akses.');
        }

        // Hapus foto
        if ($product->photo) {
            Storage::disk('public')->delete($product->photo);
        }

        $product->delete();

        return redirect()->route('products.mine')->with('success', 'Produk berhasil dihapus.');
    }

    /**
     * Profil publik pengguna / penjual — produk aktif, ulasan, reputasi & dampak lingkungan
     */
    public function sellerProfile(User $user, ImpactAnalyticsService $impactService)
    {
        $products = Product::where('user_id', $user->id)
            ->whereIn('status', [ProductStatus::ACTIVE, ProductStatus::TIMEOUT_STAGE_1])
            ->orderBy('created_at', 'desc')
            ->get();

        $totalSold = Transaction::where('seller_id', $user->id)
            ->where('status', TransactionStatus::COMPLETED)
            ->count();

        $totalWeight = Transaction::where('transactions.seller_id', $user->id)
            ->where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        // Ulasan yang diterima pengguna ini
        $reviews = Review::where('reviewee_id', $user->id)
            ->with([
                'reviewer:id,name,profile_photo',
                'transaction:id,product_id',
                'transaction.product:id,title',
            ])
            ->latest()
            ->get()
            ->map(function ($rev) {
                return [
                    'id' => $rev->id,
                    'rating' => $rev->rating,
                    'comment' => $rev->comment,
                    'created_at' => $rev->created_at->locale('id')->translatedFormat('d M Y'),
                    'reviewer' => [
                        'id' => $rev->reviewer?->id,
                        'name' => $rev->reviewer?->name ?? 'Pengguna Replate',
                        'profile_photo' => $rev->reviewer?->profile_photo,
                    ],
                    'product_title' => $rev->transaction?->product?->title,
                ];
            });

        $reviewCount = $reviews->count();
        $averageRating = $reviewCount > 0 ? round($reviews->avg('rating'), 1) : 0;

        $ratingDistribution = [
            5 => $reviews->where('rating', 5)->count(),
            4 => $reviews->where('rating', 4)->count(),
            3 => $reviews->where('rating', 3)->count(),
            2 => $reviews->where('rating', 2)->count(),
            1 => $reviews->where('rating', 1)->count(),
        ];

        // Ambil data lencana & statistik dampak dari ImpactAnalyticsService
        $badgeData = $impactService->getUserBadges($user);

        return Inertia::render('Seller/Profile', [
            'seller' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role instanceof \BackedEnum ? $user->role->value : $user->role,
                'profile_photo' => $user->profile_photo,
                'desa' => $user->desa,
                'kecamatan' => $user->kecamatan,
                'address' => $user->address,
                'points' => (int) ($user->points ?? 0),
                'created_at' => $user->created_at->locale('id')->translatedFormat('F Y'),
                'is_blacklisted' => (bool) $user->is_blacklisted,
            ],
            'products' => $products,
            'reviews' => $reviews,
            'ratings' => [
                'average' => $averageRating,
                'count' => $reviewCount,
                'distribution' => $ratingDistribution,
            ],
            'badges' => $badgeData['badges'],
            'totalBadgesUnlocked' => $badgeData['total_unlocked'],
            'impactStats' => $badgeData['user_stats'],
            'stats' => [
                'totalProducts' => $products->count(),
                'totalSold' => $totalSold,
                'totalWeight' => $totalWeight,
                'totalBarter' => $badgeData['user_stats']['barter_count'],
                'totalDonation' => $badgeData['user_stats']['donation_count'],
            ],
        ]);
    }

    /**
     * Validasi larangan kata produk yang tidak sesuai dengan kondisi/tag
     */
    protected function validateTagCompatibility(array $data): ?string
    {
        $title = strtolower($data['title'] ?? '');
        $desc = strtolower($data['description'] ?? '');
        $content = $title . ' ' . $desc;
        $condition = $data['condition'] instanceof ProductCondition
            ? $data['condition']->value
            : (string) ($data['condition'] ?? '');

        // Kata-kata non-pangan (khusus pupuk, kompos, maggot, kotoran, bangkai)
        // sama sekali dilarang di "layak_konsumsi" dan "layak_olah"
        $nonFoodKeywords = ['pupuk', 'kompos', 'kotoran', 'maggot', 'bangkai'];
        foreach ($nonFoodKeywords as $kw) {
            if (preg_match('/\b' . preg_quote($kw, '/') . '\b/i', $content)) {
                if (in_array($condition, [ProductCondition::LAYAK_KONSUMSI->value, ProductCondition::LAYAK_OLAH->value])) {
                    return "Produk terdeteksi mengandung '{$kw}' yang bukan makanan/konsumsi manusia. Produk pupuk/kompos/pakan wajib menggunakan tag 'Pakan / Kompos'.";
                }
            }
        }

        // Kata limbah / sampah / pakan ternak dilarang di "layak_konsumsi" (Siap Santap)
        $wasteKeywords = ['limbah', 'sampah', 'pakan ternak', 'pakan lele', 'pakan ayam'];
        foreach ($wasteKeywords as $kw) {
            if (preg_match('/\b' . preg_quote($kw, '/') . '\b/i', $content)) {
                if ($condition === ProductCondition::LAYAK_KONSUMSI->value) {
                    return "Produk dengan indikasi '{$kw}' tidak boleh menggunakan tag 'Siap Konsumsi'. Silakan gunakan tag 'Pakan / Kompos'.";
                }
            }
        }

        return null;
    }
}