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
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
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

        $products = $query->paginate(12);

        return Inertia::render('Marketplace/Index', [
            'products' => $products,
            'filters' => $request->only(['category', 'condition', 'mode', 'kecamatan', 'search', 'sort']),
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

        // Upload foto
        $photoPath = $request->file('photo')->store('products', 'public');

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
            $validated['photo'] = $request->file('photo')->store('products', 'public');
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
     * Profil penjual — lihat semua produk aktif miliknya
     */
    public function sellerProfile(User $user)
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

        return Inertia::render('Seller/Profile', [
            'seller' => $user,
            'products' => $products,
            'stats' => [
                'totalProducts' => $products->count(),
                'totalSold' => $totalSold,
                'totalWeight' => $totalWeight,
            ],
        ]);
    }
}