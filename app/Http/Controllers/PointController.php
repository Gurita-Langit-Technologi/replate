<?php

namespace App\Http\Controllers;

use App\Models\PointHistory;
use App\Services\ImpactAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PointController extends Controller
{
    public function __construct(
        protected ImpactAnalyticsService $impactService
    ) {}

    /**
     * Halaman riwayat, saldo RePoin, dan Koleksi Badge Prestasi pengguna
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $history = PointHistory::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $badgesData = $this->impactService->getUserBadges($user);
        $leaderboard = $this->impactService->getLeaderboard(100);
        $userRank = collect($leaderboard)->firstWhere('id', $user->id)['rank'] ?? '-';

        return Inertia::render('Points/Index', [
            'points' => $user->points ?? 0,
            'history' => $history,
            'redeemCode' => $user->redeem_code,
            'badges' => $badgesData['badges'],
            'totalUnlocked' => $badgesData['total_unlocked'],
            'totalBadges' => $badgesData['total_badges'],
            'userStats' => $badgesData['user_stats'],
            'userRank' => $userRank,
        ]);
    }
}