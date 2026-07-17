<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Marketplace — tampilkan semua produk aktif
     */
    public function index(Request $request)
    {
        $query = Product::with('user')
            ->whereIn('status', ['active', 'timeout_stage_1', 'timeout_stage_2']);

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

        return Inertia::render('Marketplace/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Form upload produk
     */
    public function create()
    {
        return Inertia::render('Marketplace/Create');
    }

    /**
     * Simpan produk baru
     */
    public function store(Request $request)
    {   
        $user = $request->user();

        // Cek lokasi
        if (empty($user->desa) || empty($user->kecamatan)) {
            return redirect()->route('profile.edit')->with('error', 'Lengkapi lokasi (desa & kecamatan) di profil Anda sebelum upload produk.');
        }

        // Cek olahan hanya untuk verified seller
        if ($request->category === 'olahan' && $user->role !== 'verified_seller') {
            return back()->withErrors(['category' => 'Hanya penjual olahan terverifikasi yang bisa upload produk olahan.']);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'photo' => 'required|image|max:2048',
            'category' => 'required|in:mentah,olahan,hasil_bumi',
            'condition' => 'required|in:layak_konsumsi,layak_olah,layak_pakan_kompos',
            'weight_grams' => 'required|integer|min:500',
            'transaction_mode' => 'required|in:sell,barter,sell_and_barter,donate',
            'price' => 'nullable|integer|min:0',
            'barter_description' => 'nullable|string',
        ]);

        // Validasi tambahan: jual harus ada harga
        if (in_array($validated['transaction_mode'], ['sell', 'sell_and_barter']) && empty($validated['price'])) {
            return back()->withErrors(['price' => 'Harga wajib diisi untuk mode jual.']);
        }

        // Validasi tambahan: barter harus ada deskripsi
        if (in_array($validated['transaction_mode'], ['barter', 'sell_and_barter']) && empty($validated['barter_description'])) {
            return back()->withErrors(['barter_description' => 'Deskripsi barter wajib diisi.']);
        }

        // Upload foto
        $photoPath = $request->file('photo')->store('products', 'public');

        // Hitung timeout berdasarkan kondisi
        $timeoutAt = Product::calculateTimeout($validated['condition']);
        $timeoutStage1At = Product::calculateTimeoutStage1($validated['condition']);

        // Simpan produk
        $product = Product::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'photo' => $photoPath,
            'category' => $validated['category'],
            'condition' => $validated['condition'],
            'weight_grams' => $validated['weight_grams'],
            'transaction_mode' => $validated['transaction_mode'],
            'price' => $validated['price'] ?? null,
            'barter_description' => $validated['barter_description'] ?? null,
            'desa' => $request->user()->desa ?? '',
            'kecamatan' => $request->user()->kecamatan ?? '',
            'timeout_at' => $timeoutAt,
            'timeout_stage1_at' => $timeoutStage1At,
            'status' => 'active',
        ]);

        return redirect()->route('marketplace')->with('success', 'Produk berhasil diunggah!');
    }

    /**
     * Produk saya
     */
    public function myProducts(Request $request)
    {
        $products = Product::where('user_id', $request->user()->id)
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

        if ($request->category === 'olahan' && $request->user()->role !== 'verified_seller') {
            return back()->withErrors(['category' => 'Hanya penjual olahan terverifikasi yang bisa upload produk olahan.']);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'photo' => 'nullable|image|max:2048',
            'category' => 'required|in:mentah,olahan,hasil_bumi',
            'condition' => 'required|in:layak_konsumsi,layak_olah,layak_pakan_kompos',
            'weight_grams' => 'required|integer|min:500',
            'transaction_mode' => 'required|in:sell,barter,sell_and_barter,donate',
            'price' => 'nullable|integer|min:0',
            'barter_description' => 'nullable|string',
        ]);

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
}