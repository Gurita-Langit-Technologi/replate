<?php

namespace App\Services;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Enums\UserRole;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ImpactAnalyticsService
{
    /**
     * Hitung ringkasan metrik dampak lingkungan & ekonomi komprehensif
     */
    public function getGlobalImpact(): array
    {
        // Total berat sampah makanan terselamatkan dari transaksi selesai
        $totalWeightGrams = Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        $totalKg = round($totalWeightGrams / 1000, 1);

        // Formula ilmiah estimasi lingkungan (FAO & UNEP):
        // 1 kg food waste yang dicegah membusuk di TPA mengurangi ~2.5 kg emisi CO2 ekuivalen
        $co2ReductionKg = round($totalKg * 2.5, 1);

        // 1 porsi makan standar rata-rata ~350 gram
        $mealsEquivalent = $totalWeightGrams > 0 ? (int) floor($totalWeightGrams / 350) : 0;

        // Total perputaran ekonomi / nilai manfaat transaksi yang selesai
        $totalEconomicValue = Transaction::where('status', TransactionStatus::COMPLETED)
            ->sum('price');

        // Total transaksi selesai
        $totalCompletedTransactions = Transaction::where('status', TransactionStatus::COMPLETED)->count();

        // Jumlah anggota komunitas desa & mitra
        $totalUsers = User::whereIn('role', [UserRole::USER, UserRole::VERIFIED_SELLER])->count();
        $totalPartners = User::where('role', UserRole::PARTNER)->count();
        $totalProducts = Product::count();

        // Distribusi per Kategori Pangan (Kg & Persentase)
        $categoryStats = Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->select('products.category', DB::raw('SUM(products.weight_grams) as total_weight'), DB::raw('COUNT(transactions.id) as total_tx'))
            ->groupBy('products.category')
            ->get()
            ->mapWithKeys(function ($item) use ($totalWeightGrams) {
                $weightKg = round($item->total_weight / 1000, 1);
                $pct = $totalWeightGrams > 0 ? round(($item->total_weight / $totalWeightGrams) * 100, 1) : 0;
                return [$item->category => [
                    'weight_kg' => $weightKg,
                    'percentage' => $pct,
                    'transactions' => $item->total_tx,
                ]];
            })->toArray();

        // Distribusi per Mode Transaksi (Jual, Barter, Donasi, Alih Fungsi)
        $modeStats = Transaction::where('status', TransactionStatus::COMPLETED)
            ->select('type', DB::raw('COUNT(*) as count'), DB::raw('SUM(price) as total_amount'))
            ->groupBy('type')
            ->get()
            ->mapWithKeys(function ($item) {
                $typeKey = $item->type instanceof \BackedEnum ? $item->type->value : $item->type;
                return [$typeKey => [
                    'count' => $item->count,
                    'total_amount' => $item->total_amount ?? 0,
                ]];
            })->toArray();

        // Distribusi Sebaran Per Desa
        $villageStats = Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->whereNotNull('products.desa')
            ->where('products.desa', '!=', '')
            ->select('products.desa', DB::raw('SUM(products.weight_grams) as total_weight'), DB::raw('COUNT(transactions.id) as count'))
            ->groupBy('products.desa')
            ->orderByDesc('total_weight')
            ->limit(6)
            ->get()
            ->map(function ($item) {
                return [
                    'desa' => $item->desa,
                    'weight_kg' => round($item->total_weight / 1000, 1),
                    'count' => $item->count,
                ];
            })->toArray();

        return [
            'total_weight_kg' => $totalKg,
            'total_co2_kg' => $co2ReductionKg,
            'total_meals_saved' => $mealsEquivalent,
            'total_economic_value' => (int) $totalEconomicValue,
            'total_completed_tx' => $totalCompletedTransactions,
            'total_users' => $totalUsers,
            'total_partners' => $totalPartners,
            'total_products' => $totalProducts,
            'categories' => $categoryStats,
            'modes' => $modeStats,
            'villages' => $villageStats,
        ];
    }

    /**
     * Ambil Leaderboard Warga Penyelamat Pangan Teraktif
     */
    public function getLeaderboard(int $limit = 10): array
    {
        // Ambil ranking user berdasarkan total berat sampah makanan yang diselamatkan (sebagai penjual/pemberi atau pembeli)
        $users = User::whereIn('role', [UserRole::USER, UserRole::VERIFIED_SELLER])
            ->where('is_blacklisted', false)
            ->get()
            ->map(function (User $user) {
                $weightSavedGrams = Transaction::where('transactions.status', TransactionStatus::COMPLETED)
                    ->where(function ($q) use ($user) {
                        $q->where('transactions.buyer_id', $user->id)
                          ->orWhere('transactions.seller_id', $user->id);
                    })
                    ->join('products', 'transactions.product_id', '=', 'products.id')
                    ->sum('products.weight_grams');

                $completedTxCount = Transaction::where('status', TransactionStatus::COMPLETED)
                    ->where(function ($q) use ($user) {
                        $q->where('buyer_id', $user->id)
                          ->orWhere('seller_id', $user->id);
                    })
                    ->count();

                $weightKg = round($weightSavedGrams / 1000, 1);
                $co2Kg = round($weightKg * 2.5, 1);

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'desa' => $user->desa ?? 'Desa Replate',
                    'kecamatan' => $user->kecamatan ?? '-',
                    'role' => $user->role instanceof \BackedEnum ? $user->role->value : $user->role,
                    'points' => (int) ($user->points ?? 0),
                    'weight_saved_kg' => $weightKg,
                    'co2_saved_kg' => $co2Kg,
                    'completed_tx' => $completedTxCount,
                    'level_title' => $this->getUserLevelTitle($weightKg),
                ];
            })
            // Urutkan berdasarkan berat terselamatkan, lalu poin
            ->sortByDesc(fn ($u) => ($u['weight_saved_kg'] * 100) + $u['points'])
            ->values();

        // Tambahkan nomor ranking
        $rankedUsers = $users->take($limit)->map(function ($item, $index) {
            $item['rank'] = $index + 1;
            return $item;
        })->toArray();

        return $rankedUsers;
    }

    /**
     * Daftar Badge Pencapaian Komunitas untuk User Tertentu
     */
    public function getUserBadges(User $user): array
    {
        $weightSavedGrams = Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->where(function ($q) use ($user) {
                $q->where('transactions.buyer_id', $user->id)
                  ->orWhere('transactions.seller_id', $user->id);
            })
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->sum('products.weight_grams');

        $weightKg = round($weightSavedGrams / 1000, 1);

        $barterCount = Transaction::where('status', TransactionStatus::COMPLETED)
            ->where('type', TransactionType::BARTER)
            ->where(function ($q) use ($user) {
                $q->where('buyer_id', $user->id)->orWhere('seller_id', $user->id);
            })->count();

        $donationCount = Transaction::where('status', TransactionStatus::COMPLETED)
            ->where('type', TransactionType::DONATION)
            ->where(function ($q) use ($user) {
                $q->where('buyer_id', $user->id)->orWhere('seller_id', $user->id);
            })->count();

        $productCount = Product::where('user_id', $user->id)->count();

        $badges = [
            [
                'id' => 'pioneer',
                'title' => 'Pionir Komunitas',
                'description' => 'Mendaftar dan bergabung dalam gerakan circular economy desa.',
                'icon' => '🌱',
                'category' => 'Warga',
                'unlocked' => true,
                'progress' => '1/1',
                'unlocked_at' => $user->created_at->format('d M Y'),
            ],
            [
                'id' => 'first_rescue',
                'title' => 'Penyelamat Pemula',
                'description' => 'Menyelamatkan minimal 1 kg makanan dari potensi terbuang.',
                'icon' => '🥉',
                'category' => 'Penyelamatan',
                'unlocked' => $weightKg >= 1.0,
                'progress' => min($weightKg, 1.0) . ' / 1.0 kg',
                'unlocked_at' => $weightKg >= 1.0 ? 'Tercapai' : null,
            ],
            [
                'id' => 'food_hero',
                'title' => 'Pahlawan Pangan',
                'description' => 'Menyelamatkan akumulasi minimal 10 kg makanan berkelanjutan.',
                'icon' => '🥈',
                'category' => 'Penyelamatan',
                'unlocked' => $weightKg >= 10.0,
                'progress' => min($weightKg, 10.0) . ' / 10.0 kg',
                'unlocked_at' => $weightKg >= 10.0 ? 'Tercapai' : null,
            ],
            [
                'id' => 'circular_knight',
                'title' => 'Ksatria Sirkular',
                'description' => 'Pencapaian luar biasa: menyelamatkan lebih dari 50 kg food waste.',
                'icon' => '🥇',
                'category' => 'Penyelamatan',
                'unlocked' => $weightKg >= 50.0,
                'progress' => min($weightKg, 50.0) . ' / 50.0 kg',
                'unlocked_at' => $weightKg >= 50.0 ? 'Tercapai' : null,
            ],
            [
                'id' => 'barter_master',
                'title' => 'Sahabat Barter',
                'description' => 'Menyelesaikan minimal 3 transaksi barter produk pangan desa.',
                'icon' => '🔄',
                'category' => 'Gotong Royong',
                'unlocked' => $barterCount >= 3,
                'progress' => min($barterCount, 3) . ' / 3 transaksi',
                'unlocked_at' => $barterCount >= 3 ? 'Tercapai' : null,
            ],
            [
                'id' => 'generous_donor',
                'title' => 'Donatur Berhati Emas',
                'description' => 'Menyalurkan minimal 1 donasi makanan untuk warga yang membutuhkan.',
                'icon' => '💖',
                'category' => 'Kemanusiaan',
                'unlocked' => $donationCount >= 1,
                'progress' => min($donationCount, 1) . ' / 1 donasi',
                'unlocked_at' => $donationCount >= 1 ? 'Tercapai' : null,
            ],
            [
                'id' => 'active_seller',
                'title' => 'Pedagang Berdaya',
                'description' => 'Mengunggah minimal 5 produk pangan berlebih di marketplace.',
                'icon' => '🧺',
                'category' => 'Pemberdayaan',
                'unlocked' => $productCount >= 5,
                'progress' => min($productCount, 5) . ' / 5 produk',
                'unlocked_at' => $productCount >= 5 ? 'Tercapai' : null,
            ],
        ];

        return [
            'badges' => $badges,
            'total_unlocked' => count(array_filter($badges, fn ($b) => $b['unlocked'])),
            'total_badges' => count($badges),
            'user_stats' => [
                'weight_saved_kg' => $weightKg,
                'co2_saved_kg' => round($weightKg * 2.5, 1),
                'barter_count' => $barterCount,
                'donation_count' => $donationCount,
                'level_title' => $this->getUserLevelTitle($weightKg),
            ],
        ];
    }

    /**
     * Laporan Komprehensif ESG (Environmental, Social, Governance) & CSR
     * Berdasarkan standar estimasi UNEP Food Waste Index & FAO Food Loss Protocol
     */
    public function getEsgReport(string $period = 'all'): array
    {
        $query = Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id');

        if ($period === 'month') {
            $query->where('transactions.updated_at', '>=', now()->startOfMonth());
        } elseif ($period === 'year') {
            $query->where('transactions.updated_at', '>=', now()->startOfYear());
        }

        $totalWeightGrams = (float) $query->sum('products.weight_grams');
        $totalKg = round($totalWeightGrams / 1000, 2);
        $totalTons = round($totalKg / 1000, 3);

        // Standar UNEP / IPCC:
        // 1 kg food waste di TPA menghasilkan ~2.5 kg CO2e dan ~0.105 kg gas Metana (CH4)
        $co2AvoidedKg = round($totalKg * 2.5, 1);
        $co2AvoidedTons = round($co2AvoidedKg / 1000, 2);
        $methaneAvoidedKg = round($totalKg * 0.105, 2);

        // Water footprint avoided: rata-rata 1 kg makanan mewakili ~250 liter air jejak virtual (water footprint)
        $waterSavedLiters = round($totalKg * 250);

        // Rasio Penyelamatan & Sirkularitas
        $consumptionKg = round((float) Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->whereIn('products.condition', ['layak_konsumsi', 'layak_olah'])
            ->sum('products.weight_grams') / 1000, 1);

        $compostPakanKg = round((float) Transaction::where('transactions.status', TransactionStatus::COMPLETED)
            ->join('products', 'transactions.product_id', '=', 'products.id')
            ->where('products.condition', 'layak_pakan_kompos')
            ->sum('products.weight_grams') / 1000, 1);

        $totalEconomicVal = (int) Transaction::where('status', TransactionStatus::COMPLETED)->sum('price');
        $mealsSaved = (int) floor($totalWeightGrams / 350);

        return [
            'period' => $period,
            'generated_at' => now()->translatedFormat('d F Y, H:i:s T'),
            'metrics' => [
                'total_food_rescued_kg' => $totalKg,
                'total_food_rescued_tons' => $totalTons,
                'co2_avoided_kg' => $co2AvoidedKg,
                'co2_avoided_tons' => $co2AvoidedTons,
                'methane_avoided_kg' => $methaneAvoidedKg,
                'water_footprint_saved_liters' => $waterSavedLiters,
                'meals_distributed' => $mealsSaved,
                'economic_circular_value' => $totalEconomicVal,
                'human_consumption_kg' => $consumptionKg,
                'compost_feed_kg' => $compostPakanKg,
            ],
            'standards' => [
                'framework' => 'UNEP Food Waste Index & FAO SDG 12.3 Protocol',
                'emission_factor' => '2.50 kg CO2e / kg food waste prevented from landfill',
                'methane_factor' => '0.105 kg CH4 / kg organic waste avoided',
                'water_factor' => '250 L virtual water / kg food waste',
            ],
        ];
    }

    private function getUserLevelTitle(float $weightKg): string
    {
        if ($weightKg >= 50) return 'Ksatria Sirkular ⭐⭐⭐';
        if ($weightKg >= 25) return 'Pejuang Nol Sampah ⭐⭐';
        if ($weightKg >= 10) return 'Pahlawan Pangan ⭐';
        if ($weightKg >= 1) return 'Penyelamat Aktif';
        return 'Warga Peduli Pangan';
    }
}
