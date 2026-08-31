<?php

namespace App\Http\Controllers;

use App\Enums\BarterOfferStatus;
use App\Enums\ProductStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Enums\UserRole;
use App\Models\BarterOffer;
use App\Models\PointHistory;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Redirect admin ke admin dashboard
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // Redirect partner ke partner dashboard
        if ($user->isPartner()) {
            return redirect()->route('partner.dashboard');
        }

        $myProducts = Product::where('user_id', $user->id)
            ->where('status', ProductStatus::ACTIVE)
            ->count();

        $totalTransactions = Transaction::where('buyer_id', $user->id)
            ->orWhere('seller_id', $user->id)
            ->count();

        $totalWeightSaved = Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->where(function ($query) use ($user) {
                $query->where('transactions.buyer_id', $user->id)
                    ->orWhere('transactions.seller_id', $user->id);
            })
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        $incomingBarterCount = BarterOffer::whereHas('product', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->where('status', BarterOfferStatus::PENDING)->count();

        // Recent products
        $recentProducts = Product::where('user_id', $user->id)
            ->whereIn('status', [
                ProductStatus::ACTIVE,
                ProductStatus::TIMEOUT_STAGE_1,
                ProductStatus::SOLD,
                ProductStatus::BARTERED,
                ProductStatus::DONATED,
            ])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Recent transactions
        $recentTransactions = Transaction::with('product')
            ->where(function ($q) use ($user) {
                $q->where('buyer_id', $user->id)
                    ->orWhere('seller_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Incoming barter offers
        $incomingBarters = BarterOffer::with(['product', 'offerer'])
            ->whereHas('product', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('status', BarterOfferStatus::PENDING)
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get();

        $pointHistory = PointHistory::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'myProducts' => $myProducts,
                'totalTransactions' => $totalTransactions,
                'totalWeightSaved' => $totalWeightSaved,
                'incomingBarterCount' => $incomingBarterCount,
                'userPoints' => $user->points,
            ],
            'recentProducts' => $recentProducts,
            'recentTransactions' => $recentTransactions,
            'incomingBarters' => $incomingBarters,
            'pointHistory' => $pointHistory,
        ]);
    }

    public function admin()
    {
        $stats = [
            'totalProducts' => Product::count(),
            'activeProducts' => Product::where('status', ProductStatus::ACTIVE)->count(),
            'totalTransactions' => Transaction::count(),
            'totalUsers' => User::where('role', '!=', UserRole::ADMIN)->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    public function partner(Request $request)
    {
        $user = $request->user();

        $pending = Transaction::with(['product.user'])
            ->where('type', TransactionType::PARTNER_TRANSFER)
            ->where('partner_id', $user->id)
            ->where('status', TransactionStatus::PENDING)
            ->get();

        $completed = Transaction::with(['product.user'])
            ->where('type', TransactionType::PARTNER_TRANSFER)
            ->where('partner_id', $user->id)
            ->where('status', TransactionStatus::COMPLETED)
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        $totalWeight = Transaction::where('transactions.type', TransactionType::PARTNER_TRANSFER)
            ->where('transactions.partner_id', $user->id)
            ->where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        $pointHistory = PointHistory::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Partner/Dashboard', [
            'pending' => $pending,
            'completed' => $completed,
            'totalWeight' => $totalWeight,
            'pointHistory' => $pointHistory,
        ]);
    }

    public function partnerHistory(Request $request)
    {
        $user = $request->user();

        $history = Transaction::with(['product.user'])
            ->where('type', TransactionType::PARTNER_TRANSFER)
            ->where('partner_id', $user->id)
            ->where('status', TransactionStatus::COMPLETED)
            ->orderBy('updated_at', 'desc')
            ->get();

        $totalWeight = Transaction::where('transactions.type', TransactionType::PARTNER_TRANSFER)
            ->where('transactions.partner_id', $user->id)
            ->where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        return Inertia::render('Partner/History', [
            'history' => $history,
            'totalWeight' => $totalWeight,
        ]);
    }
}