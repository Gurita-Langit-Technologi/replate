<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\BarterOffer;
use App\Models\PartnerProfile;
use App\Models\Notification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================
        // USERS — 15 user + 1 admin + 3 partner + 1 verified seller
        // ============================================

        $admin = User::create([
            'name' => 'Admin BUMDes',
            'email' => 'admin@replate.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
        ]);

        $verifiedSeller = User::create([
            'name' => 'UMKM Berkah Kompos',
            'email' => 'seller@replate.com',
            'password' => Hash::make('password'),
            'role' => 'verified_seller',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'whatsapp_number' => '628987654321',
        ]);

        // Partners
        $partner1 = User::create([
            'name' => 'Pak Slamet (Peternak)',
            'email' => 'partner@replate.com',
            'password' => Hash::make('password'),
            'role' => 'partner',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'whatsapp_number' => '628111222333',
        ]);
        PartnerProfile::create([
            'user_id' => $partner1->id,
            'partner_type' => 'peternak',
            'capacity_description' => 'Ternak sapi 15 ekor, bisa terima max 50kg/minggu',
            'is_active' => true,
        ]);

        $partner2 = User::create([
            'name' => 'Bu Rina (Kompos)',
            'email' => 'kompos@replate.com',
            'password' => Hash::make('password'),
            'role' => 'partner',
            'desa' => 'Mulyodadi',
            'kecamatan' => 'Bambanglipuro',
            'whatsapp_number' => '628222333444',
        ]);
        PartnerProfile::create([
            'user_id' => $partner2->id,
            'partner_type' => 'kompos',
            'capacity_description' => 'Pengelola kompos skala desa, kapasitas 100kg/minggu',
            'is_active' => true,
        ]);

        $partner3 = User::create([
            'name' => 'Mas Doni (Maggot BSF)',
            'email' => 'maggot@replate.com',
            'password' => Hash::make('password'),
            'role' => 'partner',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'whatsapp_number' => '628333444555',
        ]);
        PartnerProfile::create([
            'user_id' => $partner3->id,
            'partner_type' => 'maggot',
            'capacity_description' => 'Budidaya maggot BSF, butuh bahan organik 30kg/minggu',
            'is_active' => true,
        ]);

        // Regular users
        $users = [];

        $userData = [
            ['name' => 'Warga Budiman', 'email' => 'user@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Ibu Sari', 'email' => 'sari@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Pak Joko', 'email' => 'joko@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Mbak Dewi', 'email' => 'dewi@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Warung Barokah', 'email' => 'barokah@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Katering Bu Ning', 'email' => 'ning@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Toko Roti Makmur', 'email' => 'roti@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Pak Hadi', 'email' => 'hadi@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Ibu Ratna', 'email' => 'ratna@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Minimarket Sejahtera', 'email' => 'sejahtera@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Pak Agus Tani', 'email' => 'agus@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Bu Endang', 'email' => 'endang@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Restoran Padang Bundo', 'email' => 'bundo@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Mas Rendi', 'email' => 'rendi@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro'],
            ['name' => 'Ibu Wati', 'email' => 'wati@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro'],
        ];

        foreach ($userData as $u) {
            $users[] = User::create([
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make('password'),
                'role' => 'user',
                'desa' => $u['desa'],
                'kecamatan' => $u['kecamatan'],
                'whatsapp_number' => '6281' . rand(10000000, 99999999),
            ]);
        }

        // ============================================
        // PRODUK AKTIF — yang sedang tayang
        // ============================================

        $activeProducts = [
            [
                'user' => $users[0], 'title' => 'Nasi Kotak Ayam Bakar (25 kotak)',
                'description' => 'Sisa katering pernikahan kemarin, bersih dan layak konsumsi. Dikemas dalam kotak styrofoam.',
                'category' => 'mentah', 'condition' => 'layak_konsumsi', 'weight_grams' => 7500,
                'mode' => 'sell_and_barter', 'price' => 75000, 'barter' => 'Beras, telur, atau hasil kebun',
                'hours' => 36,
            ],
            [
                'user' => $users[1], 'title' => 'Sayuran Layu Campur (wortel, bayam, kangkung)',
                'description' => 'Sayuran dari pasar tadi pagi, agak layu tapi masih bisa ditumis atau dijadikan jus.',
                'category' => 'mentah', 'condition' => 'layak_olah', 'weight_grams' => 3000,
                'mode' => 'sell', 'price' => 8000, 'barter' => null,
                'hours' => 96,
            ],
            [
                'user' => $users[4], 'title' => 'Nasi Putih Sisa Warung (5 kg)',
                'description' => 'Nasi putih sisa jualan hari ini, belum basi, masih hangat. Cocok untuk pakan ternak.',
                'category' => 'mentah', 'condition' => 'layak_pakan_kompos', 'weight_grams' => 5000,
                'mode' => 'donate', 'price' => null, 'barter' => null,
                'hours' => 120,
            ],
            [
                'user' => $users[5], 'title' => 'Lauk Pauk Sisa Katering (rendang, sambal goreng)',
                'description' => 'Sisa katering aqiqah, porsi berlebih. Lauk masih segar, baru dimasak 4 jam lalu.',
                'category' => 'mentah', 'condition' => 'layak_konsumsi', 'weight_grams' => 4000,
                'mode' => 'sell_and_barter', 'price' => 50000, 'barter' => 'Beras 3kg atau telur 1 tray',
                'hours' => 24,
            ],
            [
                'user' => $users[6], 'title' => 'Roti Tawar & Roti Manis (hampir expired)',
                'description' => 'Expired besok, masih aman dikonsumsi hari ini. Ada roti tawar 5 bungkus dan roti manis 10 biji.',
                'category' => 'mentah', 'condition' => 'layak_konsumsi', 'weight_grams' => 2500,
                'mode' => 'sell', 'price' => 15000, 'barter' => null,
                'hours' => 18,
            ],
            [
                'user' => $users[2], 'title' => 'Singkong Berlebih (panen kemarin)',
                'description' => 'Hasil panen singkong berlebih, tidak sempat dijual ke pasar. Masih segar.',
                'category' => 'hasil_bumi', 'condition' => 'layak_konsumsi', 'weight_grams' => 10000,
                'mode' => 'barter', 'price' => null, 'barter' => 'Beras, gula, minyak goreng, atau telur',
                'hours' => 72,
            ],
            [
                'user' => $users[7], 'title' => 'Kulit Buah & Ampas Tahu',
                'description' => 'Kulit jeruk, kulit pisang, kulit mangga, dan ampas tahu. Cocok untuk kompos atau maggot.',
                'category' => 'mentah', 'condition' => 'layak_pakan_kompos', 'weight_grams' => 6000,
                'mode' => 'donate', 'price' => null, 'barter' => null,
                'hours' => 144,
            ],
            [
                'user' => $users[10], 'title' => 'Jagung Manis (panen berlebih)',
                'description' => '3 karung jagung manis, panen terlalu banyak. Mau ditukar dengan kebutuhan dapur.',
                'category' => 'hasil_bumi', 'condition' => 'layak_konsumsi', 'weight_grams' => 15000,
                'mode' => 'sell_and_barter', 'price' => 45000, 'barter' => 'Beras, minyak goreng, gula, atau tepung',
                'hours' => 60,
            ],
            [
                'user' => $users[9], 'title' => 'Buah-buahan Overripe (pisang, pepaya)',
                'description' => 'Pisang sudah sangat matang dan pepaya terlalu lunak. Masih bisa untuk selai atau smoothie.',
                'category' => 'mentah', 'condition' => 'layak_olah', 'weight_grams' => 4000,
                'mode' => 'sell', 'price' => 10000, 'barter' => null,
                'hours' => 48,
            ],
            [
                'user' => $users[12], 'title' => 'Sisa Masakan Padang (gulai, ayam pop)',
                'description' => 'Sisa jualan restoran hari ini. Gulai 2kg, ayam pop 1kg. Masih layak makan.',
                'category' => 'mentah', 'condition' => 'layak_konsumsi', 'weight_grams' => 3000,
                'mode' => 'sell_and_barter', 'price' => 35000, 'barter' => 'Beras atau sayuran segar',
                'hours' => 12,
            ],
            [
                'user' => $users[3], 'title' => 'Tempe & Tahu Sisa (agak asam)',
                'description' => 'Tempe 2kg dan tahu 1kg, sudah agak asam tapi masih bisa digoreng hari ini.',
                'category' => 'mentah', 'condition' => 'layak_olah', 'weight_grams' => 3000,
                'mode' => 'sell', 'price' => 12000, 'barter' => null,
                'hours' => 20,
            ],
            [
                'user' => $users[11], 'title' => 'Daun Pisang Segar (berlebih)',
                'description' => 'Daun pisang dari kebun belakang, terlalu banyak. Bisa untuk membungkus atau kompos.',
                'category' => 'hasil_bumi', 'condition' => 'layak_konsumsi', 'weight_grams' => 2000,
                'mode' => 'barter', 'price' => null, 'barter' => 'Apa saja hasil kebun',
                'hours' => 96,
            ],
        ];

        // Produk olahan (dari verified seller)
        $olahanProducts = [
            [
                'user' => $verifiedSeller, 'title' => 'Kompos Organik Premium (10 kg)',
                'description' => 'Kompos dari sisa sayuran dan buah-buahan. Sudah difermentasi 3 minggu. Siap pakai.',
                'category' => 'olahan', 'condition' => 'layak_konsumsi', 'weight_grams' => 10000,
                'mode' => 'sell_and_barter', 'price' => 25000, 'barter' => 'Sisa sayuran/buah untuk bahan kompos berikutnya',
                'hours' => 720,
            ],
            [
                'user' => $verifiedSeller, 'title' => 'Pupuk Cair Organik (5 liter)',
                'description' => 'Pupuk cair dari fermentasi sisa buah dan sayuran. Bagus untuk tanaman hortikultura.',
                'category' => 'olahan', 'condition' => 'layak_konsumsi', 'weight_grams' => 5000,
                'mode' => 'sell', 'price' => 30000, 'barter' => null,
                'hours' => 720,
            ],
        ];

        foreach ($activeProducts as $p) {
            $timeoutAt = now()->addHours($p['hours']);
            $stage1At = now()->addHours((int)($p['hours'] * 0.75));

            Product::create([
                'user_id' => $p['user']->id,
                'title' => $p['title'],
                'description' => $p['description'],
                'photo' => 'dummy/placeholder.jpg',
                'category' => $p['category'],
                'condition' => $p['condition'],
                'weight_grams' => $p['weight_grams'],
                'transaction_mode' => $p['mode'],
                'price' => $p['price'],
                'barter_description' => $p['barter'],
                'desa' => $p['user']->desa,
                'kecamatan' => $p['user']->kecamatan,
                'timeout_at' => $timeoutAt,
                'timeout_stage1_at' => $stage1At,
                'status' => 'active',
            ]);
        }

        foreach ($olahanProducts as $p) {
            Product::create([
                'user_id' => $p['user']->id,
                'title' => $p['title'],
                'description' => $p['description'],
                'photo' => 'dummy/placeholder.jpg',
                'category' => $p['category'],
                'condition' => $p['condition'],
                'weight_grams' => $p['weight_grams'],
                'transaction_mode' => $p['mode'],
                'price' => $p['price'],
                'barter_description' => $p['barter'],
                'desa' => $p['user']->desa,
                'kecamatan' => $p['user']->kecamatan,
                'timeout_at' => now()->addHours($p['hours']),
                'timeout_stage1_at' => now()->addHours((int)($p['hours'] * 0.75)),
                'status' => 'active',
            ]);
        }

        // ============================================
        // TRANSAKSI SELESAI — riwayat historis
        // ============================================

        $completedData = [
            ['buyer' => $users[1], 'seller' => $users[0], 'type' => 'sale', 'title' => 'Nasi Gudeg Sisa Hajatan', 'weight' => 3000, 'price' => 25000, 'days_ago' => 30],
            ['buyer' => $users[3], 'seller' => $users[5], 'type' => 'sale', 'title' => 'Sayur Lodeh Sisa Katering', 'weight' => 2000, 'price' => 15000, 'days_ago' => 28],
            ['buyer' => $users[7], 'seller' => $users[6], 'type' => 'sale', 'title' => 'Roti Tawar Mendekati Expired', 'weight' => 1500, 'price' => 8000, 'days_ago' => 25],
            ['buyer' => $users[2], 'seller' => $users[4], 'type' => 'barter', 'title' => 'Nasi Kuning Sisa Warung', 'weight' => 2500, 'price' => null, 'days_ago' => 22],
            ['buyer' => $users[10], 'seller' => $users[1], 'type' => 'barter', 'title' => 'Sayuran Layu (kangkung, bayam)', 'weight' => 2000, 'price' => null, 'days_ago' => 20],
            ['buyer' => $users[8], 'seller' => $users[12], 'type' => 'sale', 'title' => 'Dendeng & Rendang Sisa', 'weight' => 1500, 'price' => 30000, 'days_ago' => 18],
            ['buyer' => $users[11], 'seller' => $users[9], 'type' => 'donation', 'title' => 'Buah Pisang Overripe', 'weight' => 3000, 'price' => null, 'days_ago' => 15],
            ['buyer' => $users[3], 'seller' => $users[7], 'type' => 'sale', 'title' => 'Ampas Kelapa & Tahu', 'weight' => 4000, 'price' => 5000, 'days_ago' => 12],
            ['buyer' => $partner1, 'seller' => $users[4], 'type' => 'partner_transfer', 'title' => 'Sisa Nasi Warung (basi ringan)', 'weight' => 8000, 'price' => null, 'days_ago' => 10],
            ['buyer' => $partner2, 'seller' => $users[0], 'type' => 'partner_transfer', 'title' => 'Kulit Buah Campur', 'weight' => 5000, 'price' => null, 'days_ago' => 8],
            ['buyer' => $users[14], 'seller' => $users[5], 'type' => 'sale', 'title' => 'Opor Ayam Sisa Lebaran', 'weight' => 2000, 'price' => 20000, 'days_ago' => 7],
            ['buyer' => $users[0], 'seller' => $users[10], 'type' => 'barter', 'title' => 'Jagung Rebus Berlebih', 'weight' => 5000, 'price' => null, 'days_ago' => 5],
            ['buyer' => $partner3, 'seller' => $users[8], 'type' => 'partner_transfer', 'title' => 'Sisa Sayuran Busuk Ringan', 'weight' => 6000, 'price' => null, 'days_ago' => 3],
            ['buyer' => $users[13], 'seller' => $users[6], 'type' => 'donation', 'title' => 'Kue Kering Sisa (masih ok)', 'weight' => 1000, 'price' => null, 'days_ago' => 2],
            ['buyer' => $users[2], 'seller' => $verifiedSeller, 'type' => 'sale', 'title' => 'Kompos Organik 5kg', 'weight' => 5000, 'price' => 15000, 'days_ago' => 1],
        ];

        foreach ($completedData as $t) {
            $createdAt = now()->subDays($t['days_ago']);

            $product = Product::create([
                'user_id' => $t['seller']->id,
                'title' => $t['title'],
                'description' => 'Produk ini telah berhasil tersalurkan melalui platform Replate.',
                'photo' => 'dummy/placeholder.jpg',
                'category' => 'mentah',
                'condition' => $t['type'] === 'partner_transfer' ? 'layak_pakan_kompos' : 'layak_konsumsi',
                'weight_grams' => $t['weight'],
                'transaction_mode' => $t['type'] === 'sale' ? 'sell' : ($t['type'] === 'barter' ? 'barter' : 'donate'),
                'price' => $t['price'],
                'desa' => $t['seller']->desa,
                'kecamatan' => $t['seller']->kecamatan,
                'timeout_at' => $createdAt->copy()->addHours(48),
                'timeout_stage1_at' => $createdAt->copy()->addHours(36),
                'status' => $t['type'] === 'partner_transfer' ? 'transferred' : ($t['type'] === 'donation' ? 'donated' : ($t['type'] === 'barter' ? 'bartered' : 'sold')),
                'created_at' => $createdAt,
                'updated_at' => $createdAt->copy()->addHours(rand(1, 24)),
            ]);

            Transaction::create([
                'product_id' => $product->id,
                'buyer_id' => $t['buyer']->id,
                'seller_id' => $t['seller']->id,
                'type' => $t['type'],
                'status' => 'completed',
                'price' => $t['price'],
                'barter_notes' => $t['type'] === 'barter' ? 'Deal tukar dengan hasil kebun' : null,
                'partner_id' => $t['type'] === 'partner_transfer' ? $t['buyer']->id : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt->copy()->addHours(rand(1, 24)),
            ]);
        }

        // ============================================
        // BARTER OFFERS — beberapa pending
        // ============================================

        // Ambil produk aktif yang menerima barter
        $barterProducts = Product::where('status', 'active')
            ->whereIn('transaction_mode', ['barter', 'sell_and_barter'])
            ->get();

        if ($barterProducts->count() >= 2) {
            BarterOffer::create([
                'product_id' => $barterProducts[0]->id,
                'offerer_id' => $users[3]->id,
                'offer_description' => 'Saya punya telur ayam kampung 2 kg, mau tukar dengan nasi kotak ini.',
                'status' => 'pending',
            ]);

            BarterOffer::create([
                'product_id' => $barterProducts[0]->id,
                'offerer_id' => $users[8]->id,
                'offer_description' => 'Bisa tukar dengan beras 3 kg? Beras IR64 baru giling.',
                'status' => 'pending',
            ]);

            BarterOffer::create([
                'product_id' => $barterProducts[1]->id,
                'offerer_id' => $users[13]->id,
                'offer_description' => 'Mau tukar dengan singkong 5 kg dari kebun saya.',
                'status' => 'pending',
            ]);
        }

        // ============================================
        // TRANSAKSI PENDING — yang sedang berjalan
        // ============================================

        $activeProductList = Product::where('status', 'active')->get();
        if ($activeProductList->count() >= 2) {
            Transaction::create([
                'product_id' => $activeProductList[1]->id,
                'buyer_id' => $users[7]->id,
                'seller_id' => $activeProductList[1]->user_id,
                'type' => 'sale',
                'status' => 'pending',
                'price' => $activeProductList[1]->price,
            ]);
        }

        // ============================================
        // NOTIFIKASI — beberapa sample
        // ============================================

        Notification::create([
            'user_id' => $users[0]->id,
            'title' => 'Tawaran barter masuk!',
            'message' => 'Mbak Dewi menawarkan 2kg telur untuk Nasi Kotak Anda.',
            'type' => 'barter_offer',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $users[0]->id,
            'title' => 'Produk mendekati batas waktu',
            'message' => 'Produk "Nasi Kotak Ayam Bakar" mendekati batas waktu tayang.',
            'type' => 'timeout',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $users[5]->id,
            'title' => 'Transaksi selesai!',
            'message' => 'Pembeli telah menerima "Opor Ayam Sisa Lebaran".',
            'type' => 'transaction',
            'is_read' => true,
        ]);

        Notification::create([
            'user_id' => $partner1->id,
            'title' => 'Produk dialihkan kepada Anda',
            'message' => 'Produk "Sisa Nasi Warung" (8kg) telah dialihkan untuk diambil.',
            'type' => 'partner_transfer',
            'is_read' => true,
        ]);

        $this->command->info('Seeder selesai!');
        $this->command->info('20 users, 14 produk aktif, 15 transaksi selesai, 3 barter offers, 4 notifikasi');
        $this->command->info('Login: admin@replate.com / user@replate.com / partner@replate.com / seller@replate.com (password: password)');
    }
}