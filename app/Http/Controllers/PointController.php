<?php

namespace App\Http\Controllers;

use App\Models\PointHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PointController extends Controller
{
    /**
     * Halaman riwayat dan saldo RePoin pengguna
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $history = PointHistory::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Points/Index', [
            'points' => $user->points,
            'history' => $history,
            'redeemCode' => $user->redeem_code,
        ]);
    }
}