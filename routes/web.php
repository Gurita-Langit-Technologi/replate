<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BarterOfferController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SellerVerificationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ImpactController;
use App\Services\ImpactAnalyticsService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ============ LANDING PAGE & HALAMAN PUBLIK ============
Route::get('/', function (ImpactAnalyticsService $impactService) {
    return Inertia::render('Welcome', [
        'impact' => $impactService->getGlobalImpact(),
    ]);
})->name('home');

Route::get('/impact', [ImpactController::class, 'index'])->name('impact');
Route::get('/leaderboard', [ImpactController::class, 'leaderboard'])->name('leaderboard');

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
    
    // Profil penjual
    Route::get('/seller/{user}', [ProductController::class, 'sellerProfile'])->name('seller.profile');

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
    Route::post('/products/{product}/claim-donation', [TransactionController::class, 'claimDonation'])->name('transactions.claimDonation');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::patch('/transactions/{transaction}/confirm', [TransactionController::class, 'confirm'])->name('transactions.confirm');
    Route::patch('/transactions/{transaction}/accept-donation', [TransactionController::class, 'acceptDonation'])->name('transactions.acceptDonation');
    Route::patch('/transactions/{transaction}/reject-donation', [TransactionController::class, 'rejectDonation'])->name('transactions.rejectDonation');
    Route::patch('/transactions/{transaction}/complete', [TransactionController::class, 'complete'])->name('transactions.complete');
    Route::patch('/transactions/{transaction}/cancel', [TransactionController::class, 'cancel'])->name('transactions.cancel');
    Route::patch('/transactions/{transaction}/dispute', [TransactionController::class, 'dispute'])->name('transactions.dispute');
    Route::post('/transactions/{transaction}/proof-photo', [TransactionController::class, 'uploadProofPhoto'])->name('transactions.uploadProof');
    Route::post('/transactions/{transaction}/review', [ReviewController::class, 'store'])->name('transactions.review');

    // Barter
    Route::get('/barter', [BarterOfferController::class, 'index'])->name('barter.index');
    Route::get('/products/{product}/barter', [BarterOfferController::class, 'create'])->name('barter.create');
    Route::post('/products/{product}/barter', [BarterOfferController::class, 'store'])->name('barter.store');
    Route::patch('/barter/{offer}/accept', [BarterOfferController::class, 'accept'])->name('barter.accept');
    Route::patch('/barter/{offer}/reject', [BarterOfferController::class, 'reject'])->name('barter.reject');

    // Report
    Route::post('/products/{product}/report', [ReportController::class, 'store'])->name('reports.store');

    // Pengajuan penjual olahan
    Route::get('/seller/apply', [SellerVerificationController::class, 'create'])->name('seller.apply');
    Route::post('/seller/apply', [SellerVerificationController::class, 'store'])->name('seller.store');
    
    // Notifikasi
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

    Route::get('/points', [App\Http\Controllers\PointController::class, 'index'])->name('points.index');

    // Chat
    Route::get('/chat', [MessageController::class, 'index'])->name('chat.index');
    Route::get('/chat/{partner}/{product?}', [MessageController::class, 'show'])->name('chat.show');
    Route::post('/chat/{partner}', [MessageController::class, 'store'])->name('chat.store');
    Route::get('/products/{product}/chat', [MessageController::class, 'startFromProduct'])->name('chat.start');
});

// ============ ADMIN ONLY ============
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/verifications', [AdminController::class, 'verifications'])->name('verifications');
    Route::patch('/verifications/{verification}/approve', [AdminController::class, 'approveVerification'])->name('verifications.approve');
    Route::patch('/verifications/{verification}/reject', [AdminController::class, 'rejectVerification'])->name('verifications.reject');
    Route::get('/reports', [AdminController::class, 'reports'])->name('reports');
    Route::patch('/reports/{report}/review', [AdminController::class, 'reviewReport'])->name('reports.review');
    Route::patch('/reports/{report}/dismiss', [AdminController::class, 'dismissReport'])->name('reports.dismiss');
    Route::get('/partners', [AdminController::class, 'partners'])->name('partners');
    Route::post('/partners', [AdminController::class, 'storePartner'])->name('partners.store');
    Route::patch('/partners/{profile}/toggle', [AdminController::class, 'togglePartner'])->name('partners.toggle');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::patch('/users/{user}/toggle-blacklist', [AdminController::class, 'toggleBlacklist'])->name('users.toggleBlacklist');
    Route::get('/redeem', [AdminController::class, 'redeemPage'])->name('redeem');
    Route::post('/redeem/search', [AdminController::class, 'redeemSearch'])->name('redeem.search');
    Route::post('/redeem/process', [AdminController::class, 'redeemProcess'])->name('redeem.process');
});

// ============ PARTNER ONLY ============
Route::middleware(['auth', 'role:partner'])->prefix('partner')->name('partner.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'partner'])->name('dashboard');
    Route::get('/history', [DashboardController::class, 'partnerHistory'])->name('history');
    Route::patch('/transactions/{transaction}/confirm', [TransactionController::class, 'partnerConfirm'])->name('confirm');
});


    // Halaman publik
    Route::get('/faq', function () {
        return Inertia::render('FAQ');
    })->name('faq');

    Route::get('/terms', function () {
        return Inertia::render('Terms');
    })->name('terms');

require __DIR__.'/auth.php';