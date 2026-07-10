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

        return Inertia::render('Dashboard', [
            'stats' => [
                'myProducts' => $myProducts,
                'totalTransactions' => $totalTransactions,
                'totalWeightSaved' => $totalWeightSaved,
            ],
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