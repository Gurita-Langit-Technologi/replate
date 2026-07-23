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

            // Redirect admin ke admin dashboard
            if ($user->isAdmin()) {
                return redirect()->route('admin.dashboard');
            }

            // Redirect partner ke partner dashboard
            if ($user->isPartner()) {
                return redirect()->route('partner.dashboard');
            }

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

        $pointHistory = \App\Models\PointHistory::where('user_id', $user->id)
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
        $user = $request->user();

        $pending = Transaction::with('product')
            ->where('type', 'partner_transfer')
            ->where('partner_id', $user->id)
            ->where('status', 'pending')
            ->get();

        $completed = Transaction::with('product')
            ->where('type', 'partner_transfer')
            ->where('partner_id', $user->id)
            ->where('status', 'completed')
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        $totalWeight = Transaction::where('type', 'partner_transfer')
            ->where('partner_id', $user->id)
            ->where('status', 'completed')
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        return Inertia::render('Partner/Dashboard', [
            'pending' => $pending,
            'completed' => $completed,
            'totalWeight' => $totalWeight,
            'pointHistory' => $pointHistory,
        ]);
    }
}