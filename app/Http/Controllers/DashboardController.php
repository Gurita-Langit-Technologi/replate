<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $myProducts = Product::where('user_id', $user->id)
            ->where('status', 'active')
            ->count();

        $totalTransactions = Transaction::where('buyer_id', $user->id)
            ->orWhere('seller_id', $user->id)
            ->count();

        $totalWeightSaved = Transaction::where('transactions.status', 'completed')
            ->where(function ($query) use ($user) {
                $query->where('buyer_id', $user->id)
                    ->orWhere('seller_id', $user->id);
            })
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        $incomingBarterCount = \App\Models\BarterOffer::whereHas('product', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->where('status', 'pending')->count();

        // Recent products
        $recentProducts = Product::where('user_id', $user->id)
            ->whereIn('status', ['active', 'timeout_stage_1', 'sold', 'bartered', 'donated'])
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
        $incomingBarters = \App\Models\BarterOffer::with(['product', 'offerer'])
            ->whereHas('product', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'myProducts' => $myProducts,
                'totalTransactions' => $totalTransactions,
                'totalWeightSaved' => $totalWeightSaved,
                'incomingBarterCount' => $incomingBarterCount,
            ],
            'recentProducts' => $recentProducts,
            'recentTransactions' => $recentTransactions,
            'incomingBarters' => $incomingBarters,
        ]);
    }

    public function admin()
    {
        $stats = [
            'totalProducts' => Product::count(),
            'activeProducts' => Product::where('status', 'active')->count(),
            'totalTransactions' => Transaction::count(),
            'totalUsers' => \App\Models\User::where('role', '!=', 'admin')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    public function partner(Request $request)
    {
        $transferred = Product::where('status', 'transferred')->get();

        return Inertia::render('Partner/Dashboard', [
            'transferredProducts' => $transferred,
        ]);
    }
}