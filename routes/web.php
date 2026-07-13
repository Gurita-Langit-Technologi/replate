<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BarterOfferController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ============ LANDING PAGE (PUBLIC) ============
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// ============ DASHBOARD (SEMUA USER LOGIN) ============
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

// ============ SEMUA USER LOGIN ============
Route::middleware('auth')->group(function () {

    // Profile (bawaan Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Marketplace
    Route::get('/marketplace', [ProductController::class, 'index'])->name('marketplace');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

    // Produk Saya
    Route::get('/my-products', [ProductController::class, 'myProducts'])->name('products.mine');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Transaksi
    Route::post('/products/{product}/buy', [TransactionController::class, 'buy'])->name('transactions.buy');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::patch('/transactions/{transaction}/confirm', [TransactionController::class, 'confirm'])->name('transactions.confirm');
    Route::patch('/transactions/{transaction}/complete', [TransactionController::class, 'complete'])->name('transactions.complete');
    Route::patch('/transactions/{transaction}/cancel', [TransactionController::class, 'cancel'])->name('transactions.cancel');

    // Barter
    Route::get('/barter', [BarterOfferController::class, 'index'])->name('barter.index');
    Route::get('/products/{product}/barter', [BarterOfferController::class, 'create'])->name('barter.create');
    Route::post('/products/{product}/barter', [BarterOfferController::class, 'store'])->name('barter.store');
    Route::patch('/barter/{offer}/accept', [BarterOfferController::class, 'accept'])->name('barter.accept');
    Route::patch('/barter/{offer}/reject', [BarterOfferController::class, 'reject'])->name('barter.reject');
});

// ============ ADMIN ONLY ============
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'admin'])->name('dashboard');
});

// ============ PARTNER ONLY ============
Route::middleware(['auth', 'role:partner'])->prefix('partner')->name('partner.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'partner'])->name('dashboard');
});

require __DIR__.'/auth.php';