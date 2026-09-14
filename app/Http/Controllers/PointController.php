<?php

namespace App\Http\Controllers;

use App\Enums\NotificationType;
use App\Models\Notification;
use App\Models\PointHistory;
use App\Models\User;
use App\Services\ImpactAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PointController extends Controller
{
    public function __construct(
        protected ImpactAnalyticsService $impactService
    ) {}

    /**
     * Daftar katalog hadiah penukaran RePoin resmi desa & mitra
     */
    public static function getRewardsCatalog(): array
    {
        return [
            [
                'id' => 'rice_25kg',
                'title' => 'Beras Organik Desa 2.5 kg',
                'points' => 50,
                'category' => 'Sembako',
                'icon' => 'wheat',
                'stock' => 15,
                'description' => 'Beras pulen hasil panen petani lokal mitra BUMDes.',
            ],
            [
                'id' => 'cooking_oil_1l',
                'title' => 'Minyak Goreng Sawit 1 Liter',
                'points' => 35,
                'category' => 'Sembako',
                'icon' => 'cooking_pot',
                'stock' => 20,
                'description' => 'Minyak goreng kemasan higienis untuk kebutuhan dapur.',
            ],
            [
                'id' => 'organic_fertilizer_5kg',
                'title' => 'Pupuk Kompos Organik 5 kg',
                'points' => 20,
                'category' => 'Pertanian',
                'icon' => 'sprout',
                'stock' => 50,
                'description' => 'Pupuk kompos siap pakai dari hasil olahan food waste desa.',
            ],
            [
                'id' => 'chili_seeds_pack',
                'title' => 'Bibit Cabai Rawit & Sayuran (3 Pack)',
                'points' => 15,
                'category' => 'Bibit Tanaman',
                'icon' => 'flower',
                'stock' => 40,
                'description' => 'Bibit tanaman pangan lokal siap semai untuk kebun pekarangan.',
            ],
            [
                'id' => 'egg_pack_10',
                'title' => 'Telur Ayam Kampung (10 Butir)',
                'points' => 30,
                'category' => 'Sembako',
                'icon' => 'egg',
                'stock' => 25,
                'description' => 'Telur segar dari peternak lokal penerima pakan sirkular Replate.',
            ],
            [
                'id' => 'umkm_voucher_20k',
                'title' => 'Kupon Belanja UMKM Desa Rp 20.000',
                'points' => 25,
                'category' => 'Voucher Belanja',
                'icon' => 'ticket',
                'stock' => 30,
                'description' => 'Potongan belanja langsung pada UMKM olahan terverifikasi.',
            ],
        ];
    }

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

        $allUsers = $user->isAdmin()
            ? User::orderBy('points', 'desc')
                ->orderBy('name', 'asc')
                ->get(['id', 'name', 'email', 'role', 'points', 'redeem_code', 'desa', 'kecamatan', 'whatsapp_number'])
            : [];

        return Inertia::render('Points/Index', [
            'points' => $user->points ?? 0,
            'history' => $history,
            'redeemCode' => $user->redeem_code,
            'badges' => $badgesData['badges'],
            'totalUnlocked' => $badgesData['total_unlocked'],
            'totalBadges' => $badgesData['total_badges'],
            'userStats' => $badgesData['user_stats'],
            'userRank' => $userRank,
            'rewards' => self::getRewardsCatalog(),
            'allUsers' => $allUsers,
        ]);
    }

    /**
     * Penukaran RePoin Mandiri oleh User
     */
    public function redeem(Request $request)
    {
        $request->validate([
            'reward_id' => 'required|string',
        ]);

        $user = $request->user();
        $rewards = self::getRewardsCatalog();
        $reward = collect($rewards)->firstWhere('id', $request->reward_id);

        if (!$reward) {
            return back()->with('error', 'Pilihan hadiah tidak valid.');
        }

        if (($user->points ?? 0) < $reward['points']) {
            return back()->with('error', "Saldo RePoin Anda ({$user->points} poin) tidak mencukupi untuk menukar {$reward['title']} ({$reward['points']} poin).");
        }

        $claimTicketCode = 'RPL-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
        $description = "Klaim {$reward['title']} (Kode Tiket: {$claimTicketCode})";

        $history = PointHistory::redeemPoints(
            $user,
            $reward['points'],
            $description
        );

        if (!$history) {
            return back()->with('error', 'Gagal memproses penukaran poin. Silakan coba lagi.');
        }

        Notification::create([
            'user_id' => $user->id,
            'title' => "Berhasil Klaim {$reward['title']}!",
            'message' => "Tiket: {$claimTicketCode}. Tunjukkan kode ini atau kode QR akun Anda di posko admin/mitra desa untuk serah terima barang.",
            'type' => NotificationType::TRANSACTION,
        ]);

        return back()->with('success', "Selamat! Anda berhasil menukar {$reward['points']} RePoin untuk {$reward['title']}. Kode Tiket: {$claimTicketCode}.");
    }
}