<?php

namespace App\Http\Controllers;

use App\Services\ImpactAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ImpactController extends Controller
{
    public function __construct(
        protected ImpactAnalyticsService $impactService
    ) {}

    /**
     * Halaman Publik Portal Dampak Desa & Transparansi Lingkungan
     */
    public function index(): Response
    {
        $impactData = $this->impactService->getGlobalImpact();
        $topContributors = $this->impactService->getLeaderboard(5);

        return Inertia::render('Impact/Index', [
            'impact' => $impactData,
            'topContributors' => $topContributors,
        ]);
    }

    /**
     * Halaman Publik Papan Peringkat (Leaderboard) Warga Penyelamat Pangan
     */
    public function leaderboard(Request $request): Response
    {
        $leaderboard = $this->impactService->getLeaderboard(20);
        $impactData = $this->impactService->getGlobalImpact();

        $currentUserRank = null;
        if ($request->user()) {
            $userBadgesData = $this->impactService->getUserBadges($request->user());
            $allRanked = $this->impactService->getLeaderboard(100);
            $foundRank = collect($allRanked)->firstWhere('id', $request->user()->id);
            $currentUserRank = [
                'rank' => $foundRank['rank'] ?? '-',
                'stats' => $userBadgesData['user_stats'],
                'total_badges' => $userBadgesData['total_unlocked'],
            ];
        }

        return Inertia::render('Leaderboard/Index', [
            'leaderboard' => $leaderboard,
            'impactSummary' => [
                'total_kg' => $impactData['total_weight_kg'],
                'total_co2' => $impactData['total_co2_kg'],
                'total_meals' => $impactData['total_meals_saved'],
                'total_users' => $impactData['total_users'],
            ],
            'currentUserRank' => $currentUserRank,
        ]);
    }

    /**
     * Halaman Laporan ESG (Environmental, Social, Governance) & CSR Resmi
     */
    public function report(Request $request): Response
    {
        $period = $request->get('period', 'all');
        $esgData = $this->impactService->getEsgReport($period);
        $globalImpact = $this->impactService->getGlobalImpact();

        return Inertia::render('Impact/Report', [
            'esg' => $esgData,
            'globalImpact' => $globalImpact,
            'currentPeriod' => $period,
        ]);
    }
}
