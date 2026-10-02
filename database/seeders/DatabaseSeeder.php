<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\BarterOffer;
use App\Models\PartnerProfile;
use App\Models\Notification;
use App\Models\Review;
use App\Models\PointHistory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================
        // USERS
        // ============================================

        $admin = User::create([
            'name' => 'Admin BUMDes',
            'email' => 'admin@replate.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'address' => 'Kantor BUMDes Sumbermulyo, Jl. Desa No. 1',
        ]);

        $verifiedSeller = User::create([
            'name' => 'UMKM Berkah Kompos',
            'email' => 'seller@replate.com',
            'password' => Hash::make('password'),
            'role' => 'verified_seller',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'whatsapp_number' => '628987654321',
            'address' => 'Jl. Kebun Kompos RT 05/RW 02, belakang balai desa',
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
            'address' => 'Dusun Krajan RT 01/RW 03, kandang sapi pojok timur',
        ]);
        PartnerProfile::create([
            'user_id' => $partner1->id,
            'partner_type' => 'peternak',
            'capacity_description' => 'Ternak sapi 15 ekor, bisa terima max 50kg/minggu',
            'daily_capacity_kg' => 50,
            'today_received_kg' => 0,
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
            'address' => 'Jl. Kompos Desa, samping sawah barat',
        ]);
        PartnerProfile::create([
            'user_id' => $partner2->id,
            'partner_type' => 'kompos',
            'capacity_description' => 'Pengelola kompos skala desa, kapasitas 100kg/minggu',
            'daily_capacity_kg' => 100,
            'today_received_kg' => 0,
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
            'address' => 'Dusun Ngemplak RT 02/RW 01, rumah pagar hijau',
        ]);
        PartnerProfile::create([
            'user_id' => $partner3->id,
            'partner_type' => 'maggot',
            'capacity_description' => 'Budidaya maggot BSF, butuh bahan organik 30kg/minggu',
            'daily_capacity_kg' => 30,
            'today_received_kg' => 0,
            'is_active' => true,
        ]);

        // Regular users
        $users = [];
        $userData = [
            ['name' => 'Warga Budiman', 'email' => 'user@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro', 'address' => 'Dusun Krajan RT 03/RW 01, rumah cat biru'],
            ['name' => 'Ibu Sari', 'email' => 'sari@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro', 'address' => 'Gang Mangga No. 12, depan toko kelontong'],
            ['name' => 'Pak Joko', 'email' => 'joko@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro', 'address' => 'Dusun Karanglo RT 04/RW 02, rumah pojok pertigaan'],
            ['name' => 'Mbak Dewi', 'email' => 'dewi@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro', 'address' => 'Jl. Mawar No. 7, sebelah pos ronda'],
            ['name' => 'Warung Barokah', 'email' => 'barokah@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro', 'address' => 'Jl. Raya Mulyodadi No. 12, depan lapangan'],
            ['name' => 'Katering Bu Ning', 'email' => 'ning@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro', 'address' => 'Dusun Krajan RT 02/RW 01, rumah pagar putih'],
            ['name' => 'Toko Roti Makmur', 'email' => 'roti@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro', 'address' => 'Jl. Raya Mulyodadi No. 5, depan pasar desa'],
            ['name' => 'Pak Hadi', 'email' => 'hadi@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro', 'address' => 'Dusun Ngemplak RT 01/RW 02, belakang mushola'],
            ['name' => 'Ibu Ratna', 'email' => 'ratna@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro', 'address' => 'Gang Kenanga No. 3, samping TK'],
            ['name' => 'Minimarket Sejahtera', 'email' => 'sejahtera@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro', 'address' => 'Jl. Desa Sumbermulyo No. 8, depan balai desa'],
            ['name' => 'Pak Agus Tani', 'email' => 'agus@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro', 'address' => 'Dusun Karanglo RT 03/RW 01, rumah dekat sawah'],
            ['name' => 'Bu Endang', 'email' => 'endang@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro', 'address' => 'Gang Melati No. 9, samping warung Bu Tin'],
            ['name' => 'Restoran Padang Bundo', 'email' => 'bundo@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro', 'address' => 'Jl. Desa Sumbermulyo No. 15, depan kantor pos'],
            ['name' => 'Mas Rendi', 'email' => 'rendi@replate.com', 'desa' => 'Mulyodadi', 'kecamatan' => 'Bambanglipuro', 'address' => 'Dusun Karanglo RT 02/RW 03, rumah cat kuning'],
            ['name' => 'Ibu Wati', 'email' => 'wati@replate.com', 'desa' => 'Sumbermulyo', 'kecamatan' => 'Bambanglipuro', 'address' => 'Dusun Krajan RT 04/RW 02, rumah dekat jembatan'],
        ];

        foreach ($userData as $u) {
            $users[] = User::create([
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make('password'),
                'role' => 'user',
                'desa' => $u['desa'],
                'kecamatan' => $u['kecamatan'],
                'address' => $u['address'],
                'whatsapp_number' => '6281' . rand(10000000, 99999999),
            ]);
        }

        // ============================================
        // PRODUK AKTIF
        // ============================================

        $activeProducts = [
            [
                'user' => $users[0], 'title' => 'Nasi Kotak Ayam Bakar',
                'description' => 'Sisa katering pernikahan kemarin, bersih dan layak konsumsi. Dikemas dalam kotak styrofoam higienis. Nasi masih pulen, ayam bakar utuh.',
                'category' => 'mentah', 'condition' => 'layak_konsumsi',
                'weight_grams' => 7500, 'quantity' => 25, 'unit' => 'kotak',
                'mode' => 'sell_and_barter', 'price' => 8000, 'barter' => 'Beras, telur, atau hasil kebun',
                'pickup_type' => 'rumah', 'pickup_address' => 'Rumah Pak Budiman, Dusun Krajan RT 03/RW 01, rumah cat biru',
                'pickup_notes' => 'Ambil sebelum jam 5 sore, ketuk pintu atau WA dulu',
                'hours' => 36,
            ],
            [
                'user' => $users[1], 'title' => 'Sayuran Layu Campur (wortel, bayam, kangkung)',
                'description' => 'Sayuran dari pasar tadi pagi, agak layu tapi masih bisa ditumis atau dijadikan jus. Tidak ada yang busuk.',
                'category' => 'mentah', 'condition' => 'layak_olah',
                'weight_grams' => 3000, 'quantity' => 3, 'unit' => 'kg',
                'mode' => 'sell', 'price' => 3000, 'barter' => null,
                'pickup_type' => 'drop_point', 'pickup_address' => 'Pos BUMDes Sumbermulyo, Jl. Desa No. 1',
                'pickup_notes' => 'Sudah dititipkan di pos sejak jam 10 pagi',
                'hours' => 96,
            ],
            [
                'user' => $users[4], 'title' => 'Nasi Putih Sisa Warung',
                'description' => 'Nasi putih sisa jualan hari ini, belum basi, masih hangat. Cocok untuk pakan ternak atau diolah ulang.',
                'category' => 'mentah', 'condition' => 'layak_pakan_kompos',
                'weight_grams' => 5000, 'quantity' => 5, 'unit' => 'kg',
                'mode' => 'donate', 'price' => null, 'barter' => null,
                'pickup_type' => 'rumah', 'pickup_address' => 'Warung Barokah, Jl. Raya Mulyodadi No. 12',
                'pickup_notes' => 'Langsung ambil di warung, buka sampai jam 8 malam',
                'hours' => 120,
            ],
            [
                'user' => $users[5], 'title' => 'Lauk Pauk Sisa Katering (rendang, sambal goreng)',
                'description' => 'Sisa katering aqiqah, porsi berlebih. Lauk masih segar, baru dimasak 4 jam lalu. Rendang 2kg, sambal goreng 1kg.',
                'category' => 'mentah', 'condition' => 'layak_konsumsi',
                'weight_grams' => 4000, 'quantity' => 15, 'unit' => 'porsi',
                'mode' => 'sell_and_barter', 'price' => 6000, 'barter' => 'Beras 1kg atau telur per porsi',
                'pickup_type' => 'rumah', 'pickup_address' => 'Rumah Bu Ning, Dusun Krajan RT 02/RW 01, pagar putih',
                'pickup_notes' => 'WA dulu sebelum datang, bisa antar kalau dekat',
                'hours' => 24,
            ],
            [
                'user' => $users[6], 'title' => 'Roti Tawar & Roti Manis (hampir expired)',
                'description' => 'Expired besok, masih aman dikonsumsi hari ini. Roti tawar 5 bungkus dan roti manis 10 biji. Kondisi baik, kemasan utuh.',
                'category' => 'mentah', 'condition' => 'layak_konsumsi',
                'weight_grams' => 2500, 'quantity' => 15, 'unit' => 'bungkus',
                'mode' => 'sell', 'price' => 3000, 'barter' => null,
                'pickup_type' => 'rumah', 'pickup_address' => 'Toko Roti Makmur, Jl. Raya Mulyodadi No. 5',
                'pickup_notes' => 'Buka jam 7 pagi - 9 malam',
                'hours' => 18,
            ],
            [
                'user' => $users[2], 'title' => 'Singkong Berlebih (panen kemarin)',
                'description' => 'Hasil panen singkong berlebih, tidak sempat dijual ke pasar. Masih segar, baru dicabut kemarin sore.',
                'category' => 'hasil_bumi', 'condition' => 'layak_konsumsi',
                'weight_grams' => 10000, 'quantity' => 10, 'unit' => 'kg',
                'mode' => 'barter', 'price' => null, 'barter' => 'Beras, gula, minyak goreng, atau telur',
                'pickup_type' => 'drop_point', 'pickup_address' => 'Pos BUMDes Sumbermulyo, Jl. Desa No. 1',
                'pickup_notes' => 'Sudah dititipkan pagi ini',
                'hours' => 72,
            ],
            [
                'user' => $users[7], 'title' => 'Kulit Buah & Ampas Tahu',
                'description' => 'Kulit jeruk, kulit pisang, kulit mangga, dan ampas tahu dari warung. Cocok untuk kompos atau pakan maggot BSF.',
                'category' => 'mentah', 'condition' => 'layak_pakan_kompos',
                'weight_grams' => 6000, 'quantity' => 2, 'unit' => 'kg',
                'mode' => 'donate', 'price' => null, 'barter' => null,
                'pickup_type' => 'rumah', 'pickup_address' => 'Rumah Pak Hadi, Dusun Ngemplak RT 01/RW 02',
                'pickup_notes' => 'Ditaruh di depan pagar dalam plastik hitam',
                'hours' => 144,
            ],
            [
                'user' => $users[10], 'title' => 'Jagung Manis (panen berlebih)',
                'description' => 'Jagung manis panen melimpah dari ladang. Masih segar manis, baru dipetik tadi pagi.',
                'category' => 'hasil_bumi', 'condition' => 'layak_konsumsi',
                'weight_grams' => 15000, 'quantity' => 15, 'unit' => 'kg',
                'mode' => 'sell_and_barter', 'price' => 5000, 'barter' => 'Beras, minyak goreng, gula, atau tepung',
                'pickup_type' => 'drop_point', 'pickup_address' => 'Pos BUMDes Sumbermulyo, Jl. Desa No. 1',
                'pickup_notes' => 'Dititipkan jam 8 pagi, ambil sebelum sore',
                'hours' => 60,
            ],
            [
                'user' => $users[9], 'title' => 'Buah-buahan Overripe (pisang, pepaya)',
                'description' => 'Pisang sudah sangat matang dan pepaya terlalu lunak. Masih sangat bagus untuk selai, smoothie, atau es buah.',
                'category' => 'mentah', 'condition' => 'layak_olah',
                'weight_grams' => 4000, 'quantity' => 13, 'unit' => 'pcs',
                'mode' => 'sell', 'price' => 1500, 'barter' => null,
                'pickup_type' => 'rumah', 'pickup_address' => 'Minimarket Sejahtera, Jl. Desa Sumbermulyo No. 8',
                'pickup_notes' => 'Ambil di belakang toko, bilang ke kasir',
                'hours' => 48,
            ],
            [
                'user' => $users[12], 'title' => 'Sisa Masakan Padang (gulai, ayam pop)',
                'description' => 'Sisa jualan restoran hari ini. Gulai nangka dan ayam pop bersih higienis. Masih layak makan, baru dimasak tadi pagi.',
                'category' => 'mentah', 'condition' => 'layak_konsumsi',
                'weight_grams' => 3000, 'quantity' => 10, 'unit' => 'porsi',
                'mode' => 'sell_and_barter', 'price' => 7000, 'barter' => 'Beras atau sayuran segar',
                'pickup_type' => 'rumah', 'pickup_address' => 'RM Padang Bundo, Jl. Desa Sumbermulyo No. 15',
                'pickup_notes' => 'Ambil sebelum jam 9 malam, restoran tutup jam 10',
                'hours' => 12,
            ],
            [
                'user' => $users[3], 'title' => 'Tempe & Tahu Sisa (agak asam)',
                'description' => 'Tempe dan tahu dari pabrik langganan, sudah agak asam tapi masih bagus jika digoreng garing atau dibacem hari ini.',
                'category' => 'mentah', 'condition' => 'layak_olah',
                'weight_grams' => 3000, 'quantity' => 3, 'unit' => 'kg',
                'mode' => 'sell', 'price' => 4000, 'barter' => null,
                'pickup_type' => 'rumah', 'pickup_address' => 'Rumah Mbak Dewi, Jl. Mawar No. 7',
                'pickup_notes' => 'WA dulu ya, kadang tidak di rumah',
                'hours' => 20,
            ],
            [
                'user' => $users[11], 'title' => 'Daun Pisang Segar (berlebih)',
                'description' => 'Daun pisang dari kebun belakang, terlalu banyak. Bisa untuk membungkus makanan, alas tumpeng, atau kompos.',
                'category' => 'hasil_bumi', 'condition' => 'layak_konsumsi',
                'weight_grams' => 2000, 'quantity' => 50, 'unit' => 'pcs',
                'mode' => 'barter', 'price' => null, 'barter' => 'Apa saja hasil kebun',
                'pickup_type' => 'rumah', 'pickup_address' => 'Rumah Bu Endang, Gang Melati No. 9',
                'pickup_notes' => 'Langsung ambil di kebun belakang, bilang ke Bu Endang',
                'hours' => 96,
            ],
        ];

        // Produk olahan
        $olahanProducts = [
            [
                'user' => $verifiedSeller, 'title' => 'Kompos Organik Premium',
                'description' => 'Kompos dari sisa sayuran dan buah-buahan. Sudah difermentasi 3 minggu. Siap pakai untuk kebun dan tanaman.',
                'category' => 'olahan', 'condition' => 'layak_pakan_kompos',
                'weight_grams' => 10000, 'quantity' => 10, 'unit' => 'kg',
                'mode' => 'sell_and_barter', 'price' => 2500, 'barter' => 'Sisa sayuran/buah untuk bahan kompos berikutnya',
                'pickup_type' => 'rumah', 'pickup_address' => 'UMKM Berkah Kompos, Jl. Kebun Kompos RT 05/RW 02',
                'pickup_notes' => 'Buka setiap hari jam 8-5, bisa antar kalau beli banyak',
                'hours' => 720,
            ],
            [
                'user' => $verifiedSeller, 'title' => 'Pupuk Cair Organik',
                'description' => 'Pupuk cair dari fermentasi sisa buah dan sayuran. Bagus untuk tanaman hortikultura. Sudah diuji di kebun sendiri.',
                'category' => 'olahan', 'condition' => 'layak_pakan_kompos',
                'weight_grams' => 5000, 'quantity' => 5, 'unit' => 'liter',
                'mode' => 'sell', 'price' => 6000, 'barter' => null,
                'pickup_type' => 'drop_point', 'pickup_address' => 'Pos BUMDes Sumbermulyo, Jl. Desa No. 1',
                'pickup_notes' => 'Sudah dititipkan, bilang nama ke petugas pos',
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
                'quantity' => $p['quantity'],
                'unit' => $p['unit'],
                'transaction_mode' => $p['mode'],
                'price' => $p['price'],
                'barter_description' => $p['barter'],
                'desa' => $p['user']->desa,
                'kecamatan' => $p['user']->kecamatan,
                'pickup_type' => $p['pickup_type'],
                'pickup_address' => $p['pickup_address'],
                'pickup_notes' => $p['pickup_notes'],
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
                'quantity' => $p['quantity'],
                'unit' => $p['unit'],
                'transaction_mode' => $p['mode'],
                'price' => $p['price'],
                'barter_description' => $p['barter'],
                'desa' => $p['user']->desa,
                'kecamatan' => $p['user']->kecamatan,
                'pickup_type' => $p['pickup_type'],
                'pickup_address' => $p['pickup_address'],
                'pickup_notes' => $p['pickup_notes'],
                'timeout_at' => now()->addHours($p['hours']),
                'timeout_stage1_at' => now()->addHours((int)($p['hours'] * 0.75)),
                'status' => 'active',
            ]);
        }

        // ============================================
        // TRANSAKSI SELESAI — riwayat historis & ulasan
        // ============================================

        $completedData = [
            // UMKM Berkah Kompos (Verified Seller - seller@replate.com)
            ['buyer' => $users[2], 'seller' => $verifiedSeller, 'type' => 'sale', 'title' => 'Kompos Organik Super', 'weight' => 5000, 'qty' => 5, 'unit' => 'kg', 'price' => 3000, 'days_ago' => 20, 'rating' => 5, 'comment' => 'Kompos kualitas premium! Tanaman cabai di pekarangan rumah saya jadi subur dan berbuah lebat.'],
            ['buyer' => $users[0], 'seller' => $verifiedSeller, 'type' => 'sale', 'title' => 'Pupuk Kascing Organik', 'weight' => 3000, 'qty' => 3, 'unit' => 'kg', 'price' => 4000, 'days_ago' => 15, 'rating' => 5, 'comment' => 'Sangat recommended, tanah jadi gembur dan tidak bau. Penjual sangat ramah dan edukatif.'],
            ['buyer' => $users[3], 'seller' => $verifiedSeller, 'type' => 'sale', 'title' => 'Media Tanam Siap Pakai (10kg)', 'weight' => 10000, 'qty' => 1, 'unit' => 'karung', 'price' => 25000, 'days_ago' => 10, 'rating' => 4, 'comment' => 'Media tanam bagus dan subur. Karung sedikit kotor kena debu saat ambil tapi isinya top markotop.'],
            ['buyer' => $users[7], 'seller' => $verifiedSeller, 'type' => 'sale', 'title' => 'POC Urin Kelinci Fermentasi (1L)', 'weight' => 1000, 'qty' => 2, 'unit' => 'botol', 'price' => 10000, 'days_ago' => 6, 'rating' => 5, 'comment' => 'Pupuk cairnya ampuh sekali, daun tanaman jadi hijau royo-royo. Pasti repeat order!'],
            ['buyer' => $users[8], 'seller' => $verifiedSeller, 'type' => 'sale', 'title' => 'Bibit Cabai Rawit & Polybag Kompos', 'weight' => 2000, 'qty' => 5, 'unit' => 'polybag', 'price' => 3000, 'days_ago' => 2, 'rating' => 5, 'comment' => 'Bibit segar dan sehat, packing aman pakai kardus. Terima kasih banyak Berkah Kompos!'],

            // Warga Budiman (user@replate.com)
            ['buyer' => $users[1], 'seller' => $users[0], 'type' => 'sale', 'title' => 'Nasi Gudeg Sisa Hajatan', 'weight' => 3000, 'qty' => 12, 'unit' => 'porsi', 'price' => 5000, 'days_ago' => 30, 'rating' => 5, 'comment' => 'Gudegnya masih lezat dan ayamnya empuk. Porsi berlimpah, keluarga di rumah senang sekali.'],
            ['buyer' => $users[10], 'seller' => $users[0], 'type' => 'barter', 'title' => 'Buah Mangga Manalagi Kebun', 'weight' => 4000, 'qty' => 4, 'unit' => 'kg', 'price' => null, 'days_ago' => 14, 'rating' => 5, 'comment' => 'Mangganya manis legit, segar baru dipetik dari pohon. Barter yang sangat menyenangkan!'],
            ['buyer' => $users[4], 'seller' => $users[0], 'type' => 'sale', 'title' => 'Pisang Raja Matang Pohon', 'weight' => 3500, 'qty' => 2, 'unit' => 'sisir', 'price' => 9000, 'days_ago' => 4, 'rating' => 4, 'comment' => 'Pisang manis dan mulus, pas untuk pisang goreng sore hari. Komunikasi lewat WA sangat lancar.'],

            // Katering Bu Ning (ning@replate.com)
            ['buyer' => $users[3], 'seller' => $users[5], 'type' => 'sale', 'title' => 'Sayur Lodeh Sisa Katering', 'weight' => 2000, 'qty' => 8, 'unit' => 'porsi', 'price' => 3000, 'days_ago' => 28, 'rating' => 5, 'comment' => 'Sayur lodeh gurih sedap, masih hangat waktu dijemput. Bu Ning ramah sekali.'],
            ['buyer' => $users[14], 'seller' => $users[5], 'type' => 'sale', 'title' => 'Opor Ayam Sisa Lebaran', 'weight' => 2000, 'qty' => 8, 'unit' => 'porsi', 'price' => 4000, 'days_ago' => 18, 'rating' => 4, 'comment' => 'Ayamnya empuk dan bumbu meresap. Berkah sekali ada platform Replate ini.'],
            ['buyer' => $users[1], 'seller' => $users[5], 'type' => 'sale', 'title' => 'Nasi Tumpeng Mini Sisa Syukuran', 'weight' => 3500, 'qty' => 7, 'unit' => 'porsi', 'price' => 6000, 'days_ago' => 7, 'rating' => 5, 'comment' => 'Lauk pauk lengkap, higienis dan porsi melimpah. Katering Bu Ning selalu memuaskan!'],

            // Warung Barokah (barokah@replate.com)
            ['buyer' => $users[2], 'seller' => $users[4], 'type' => 'barter', 'title' => 'Nasi Kuning Sisa Warung', 'weight' => 2500, 'qty' => 10, 'unit' => 'porsi', 'price' => null, 'days_ago' => 22, 'rating' => 4, 'comment' => 'Nasi kuning wangi dan lauk sambal goreng tempenya mantap.'],
            ['buyer' => $users[11], 'seller' => $users[4], 'type' => 'sale', 'title' => 'Sayur Asem & Tempe Goreng Lengkap', 'weight' => 2000, 'qty' => 5, 'unit' => 'porsi', 'price' => 2500, 'days_ago' => 11, 'rating' => 5, 'comment' => 'Segar banget sayur asemnya, cocok buat makan siang bersama tetangga.'],
            ['buyer' => $users[9], 'seller' => $users[4], 'type' => 'sale', 'title' => 'Soto Ayam Kuah Bening Sisa Siang', 'weight' => 2500, 'qty' => 6, 'unit' => 'porsi', 'price' => 3000, 'days_ago' => 3, 'rating' => 3, 'comment' => 'Rasa enak dan gurih, tapi pas dijemput bungkus kuahnya agak bocor sedikit. Tapi tetap oke.'],

            // Toko Roti Makmur (roti@replate.com)
            ['buyer' => $users[7], 'seller' => $users[6], 'type' => 'sale', 'title' => 'Roti Tawar Mendekati Expired', 'weight' => 1500, 'qty' => 5, 'unit' => 'bungkus', 'price' => 2000, 'days_ago' => 25, 'rating' => 5, 'comment' => 'Roti masih sangat lembut, langsung dibikin roti bakar keju sama anak-anak.'],
            ['buyer' => $users[13], 'seller' => $users[6], 'type' => 'donation', 'title' => 'Kue Kering Sisa Display Toko', 'weight' => 1000, 'qty' => 10, 'unit' => 'bungkus', 'price' => null, 'days_ago' => 12, 'rating' => 5, 'comment' => 'Terima kasih banyak atas donasinya, kuenya enak dan masih renyah.'],
            ['buyer' => $users[0], 'seller' => $users[6], 'type' => 'sale', 'title' => 'Roti Manis Aneka Rasa (Cokelat & Keju)', 'weight' => 1200, 'qty' => 8, 'unit' => 'pcs', 'price' => 2000, 'days_ago' => 5, 'rating' => 4, 'comment' => 'Kualitas roti Makmur memang tidak diragukan, harga sangat bersahabat.'],

            // Restoran Padang Bundo (bundo@replate.com)
            ['buyer' => $users[8], 'seller' => $users[12], 'type' => 'sale', 'title' => 'Dendeng & Rendang Sisa', 'weight' => 1500, 'qty' => 6, 'unit' => 'porsi', 'price' => 6000, 'days_ago' => 19, 'rating' => 5, 'comment' => 'Rendangnya mantap luar biasa, rempah Minang asli terasa banget.'],
            ['buyer' => $users[3], 'seller' => $users[12], 'type' => 'sale', 'title' => 'Gulai Cincang & Sambal Ijo', 'weight' => 1800, 'qty' => 5, 'unit' => 'porsi', 'price' => 5000, 'days_ago' => 8, 'rating' => 5, 'comment' => 'Porsi banyak, sambal ijonya juara. Sangat bermanfaat daripada terbuang percuma.'],

            // Pengguna Komunitas Lainnya
            ['buyer' => $users[10], 'seller' => $users[1], 'type' => 'barter', 'title' => 'Sayuran Layu (kangkung, bayam)', 'weight' => 2000, 'qty' => 2, 'unit' => 'kg', 'price' => null, 'days_ago' => 20, 'rating' => 4, 'comment' => 'Sayuran masih bisa dipilah dan dimasak tumis enak. Hemat belanja dapur.'],
            ['buyer' => $users[11], 'seller' => $users[9], 'type' => 'donation', 'title' => 'Buah Pisang Overripe', 'weight' => 3000, 'qty' => 5, 'unit' => 'kg', 'price' => null, 'days_ago' => 16, 'rating' => 5, 'comment' => 'Dibuat bolu pisang kukus hasilnya lembut dan manis alami. Terima kasih!'],
            ['buyer' => $users[3], 'seller' => $users[7], 'type' => 'sale', 'title' => 'Ampas Kelapa & Tahu', 'weight' => 4000, 'qty' => 4, 'unit' => 'kg', 'price' => 1500, 'days_ago' => 13, 'rating' => 4, 'comment' => 'Bagus sekali untuk tambahan pakan ayam kampung saya.'],
            ['buyer' => $users[0], 'seller' => $users[10], 'type' => 'barter', 'title' => 'Jagung Rebus Berlebih', 'weight' => 5000, 'qty' => 20, 'unit' => 'pcs', 'price' => null, 'days_ago' => 9, 'rating' => 5, 'comment' => 'Jagungnya manis dan pulen. Barter dengan beras ketan berjalan lancar.'],

            // Penyaluran ke Mitra (tanpa ulasan karena mitra ternak/kompos/maggot)
            ['buyer' => $partner1, 'seller' => $users[4], 'type' => 'partner_transfer', 'title' => 'Sisa Nasi Warung (basi ringan)', 'weight' => 8000, 'qty' => 8, 'unit' => 'kg', 'price' => null, 'days_ago' => 17],
            ['buyer' => $partner2, 'seller' => $users[0], 'type' => 'partner_transfer', 'title' => 'Kulit Buah Campur', 'weight' => 5000, 'qty' => 5, 'unit' => 'kg', 'price' => null, 'days_ago' => 15],
            ['buyer' => $partner3, 'seller' => $users[8], 'type' => 'partner_transfer', 'title' => 'Sisa Sayuran Busuk Ringan', 'weight' => 6000, 'qty' => 6, 'unit' => 'kg', 'price' => null, 'days_ago' => 6],
        ];

        foreach ($completedData as $t) {
            $createdAt = now()->subDays($t['days_ago']);
            $unitPrice = $t['price'];
            $totalPrice = $unitPrice ? ($unitPrice * $t['qty']) : null;

            $product = Product::create([
                'user_id' => $t['seller']->id,
                'title' => $t['title'],
                'description' => 'Produk ini telah berhasil tersalurkan melalui platform Replate.',
                'photo' => 'dummy/placeholder.jpg',
                'category' => 'mentah',
                'condition' => $t['type'] === 'partner_transfer' ? 'layak_pakan_kompos' : 'layak_konsumsi',
                'weight_grams' => $t['weight'],
                'quantity' => $t['qty'],
                'unit' => $t['unit'],
                'transaction_mode' => $t['type'] === 'sale' ? 'sell' : ($t['type'] === 'barter' ? 'barter' : 'donate'),
                'price' => $unitPrice,
                'desa' => $t['seller']->desa,
                'kecamatan' => $t['seller']->kecamatan,
                'pickup_type' => 'rumah',
                'pickup_address' => $t['seller']->address,
                'timeout_at' => $createdAt->copy()->addHours(48),
                'timeout_stage1_at' => $createdAt->copy()->addHours(36),
                'status' => $t['type'] === 'partner_transfer' ? 'transferred' : ($t['type'] === 'donation' ? 'donated' : ($t['type'] === 'barter' ? 'bartered' : 'sold')),
                'created_at' => $createdAt,
                'updated_at' => $createdAt->copy()->addHours(rand(1, 24)),
            ]);

            $tx = Transaction::create([
                'product_id' => $product->id,
                'buyer_id' => $t['buyer']->id,
                'seller_id' => $t['seller']->id,
                'type' => $t['type'],
                'status' => 'completed',
                'price' => $totalPrice,
                'quantity' => $t['qty'],
                'barter_notes' => $t['type'] === 'barter' ? 'Deal tukar dengan hasil kebun' : null,
                'partner_id' => $t['type'] === 'partner_transfer' ? $t['buyer']->id : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt->copy()->addHours(rand(1, 24)),
            ]);

            // Review for completed sale/barter/donation
            if (in_array($t['type'], ['sale', 'barter', 'donation'])) {
                $rating = $t['rating'] ?? rand(4, 5);
                $comment = $t['comment'] ?? 'Pelayanan cepat, kondisi produk baik dan sangat membantu mengurangi food waste.';

                Review::create([
                    'transaction_id' => $tx->id,
                    'reviewer_id' => $t['buyer']->id,
                    'reviewee_id' => $t['seller']->id,
                    'rating' => $rating,
                    'comment' => $comment,
                    'created_at' => $createdAt->copy()->addHours(rand(2, 24)),
                ]);
            }

            // Award Points
            $points = PointHistory::calculatePoints($product);
            PointHistory::awardPoints(
                $t['seller'],
                $points,
                "Produk \"{$product->title}\" tersalurkan",
                $t['type'] === 'partner_transfer' ? 'earned_partner' : ($t['type'] === 'donation' ? 'earned_donate' : 'earned_sell'),
                $tx
            );
        }

        // ============================================
        // TUGAS MITRA AKTIF (PENDING PICKUP)
        // ============================================

        $partnerProduct1 = Product::create([
            'user_id' => $users[0]->id,
            'title' => 'Sisa Olahan Dapur & Nasi Pagi (15kg)',
            'description' => 'Sisa produksi dapur pagi hari, bersih dalam ember tertutup. Cocok untuk pakan ternak / maggot.',
            'photo' => 'dummy/placeholder.jpg',
            'category' => 'mentah',
            'condition' => 'layak_pakan_kompos',
            'weight_grams' => 15000,
            'quantity' => 15,
            'unit' => 'kg',
            'transaction_mode' => 'donate',
            'desa' => $users[0]->desa,
            'kecamatan' => $users[0]->kecamatan,
            'pickup_type' => 'rumah',
            'pickup_address' => $users[0]->address,
            'pickup_notes' => 'Ember ditaruh di samping garasi, tolong embernya dikembalikan ya pak.',
            'status' => 'dialihkan_ke_mitra',
            'timeout_at' => now()->subHours(2),
        ]);

        Transaction::create([
            'product_id' => $partnerProduct1->id,
            'buyer_id' => $partner1->id,
            'seller_id' => $users[0]->id,
            'partner_id' => $partner1->id,
            'type' => 'partner_transfer',
            'status' => 'pending',
            'notes' => 'Alih fungsi otomatis ke Peternak (15kg)',
            'created_at' => now()->subHours(2),
        ]);

        $partnerProduct2 = Product::create([
            'user_id' => $users[5]->id,
            'title' => 'Sisa Sayur & Kulit Buah Katering (20kg)',
            'description' => 'Sisa sayuran dan kulit buah kupasan katering. Cocok untuk bahan kompos.',
            'photo' => 'dummy/placeholder.jpg',
            'category' => 'mentah',
            'condition' => 'layak_pakan_kompos',
            'weight_grams' => 20000,
            'quantity' => 20,
            'unit' => 'kg',
            'transaction_mode' => 'donate',
            'desa' => $users[5]->desa,
            'kecamatan' => $users[5]->kecamatan,
            'pickup_type' => 'rumah',
            'pickup_address' => $users[5]->address,
            'pickup_notes' => 'Di dalam karung goni di teras samping.',
            'status' => 'dialihkan_ke_mitra',
            'timeout_at' => now()->subHours(1),
        ]);

        Transaction::create([
            'product_id' => $partnerProduct2->id,
            'buyer_id' => $partner2->id,
            'seller_id' => $users[5]->id,
            'partner_id' => $partner2->id,
            'type' => 'partner_transfer',
            'status' => 'pending',
            'notes' => 'Alih fungsi otomatis ke Pengelola Kompos (20kg)',
            'created_at' => now()->subHours(1),
        ]);

        // ============================================
        // VERIFIKASI PENJUAL (ADMIN VERIFICATIONS)
        // ============================================

        \App\Models\SellerVerification::create([
            'user_id' => $users[4]->id, // Warung Barokah
            'document_type' => \App\Enums\DocumentType::NIB,
            'document_photo' => 'dummy/nib_sample.jpg',
            'production_photo' => 'dummy/dapur_sample.jpg',
            'status' => \App\Enums\VerificationStatus::PENDING,
            'admin_notes' => 'Pengajuan verifikasi dapur UMKM Warung Barokah.',
        ]);

        \App\Models\SellerVerification::create([
            'user_id' => $verifiedSeller->id,
            'document_type' => \App\Enums\DocumentType::PIRT,
            'document_photo' => 'dummy/pirt_sample.jpg',
            'production_photo' => 'dummy/dapur_sample.jpg',
            'status' => \App\Enums\VerificationStatus::APPROVED,
            'admin_notes' => 'Disetujui. Dokumen dan dapur higienis.',
        ]);

        // ============================================
        // LAPORAN / DISPUTE (ADMIN REPORTS)
        // ============================================

        \App\Models\Report::create([
            'reporter_id' => $users[1]->id,
            'product_id' => $activeProductList[0]->id ?? $product->id,
            'reason' => \App\Enums\ReportReason::TIDAK_SESUAI_FOTO,
            'description' => 'Keterangan porsi dan foto di deskripsi agak berbeda dengan aslinya.',
            'status' => \App\Enums\ReportStatus::PENDING,
        ]);

        // ============================================
        // BARTER OFFERS
        // ============================================

        $barterProducts = Product::where('status', 'active')
            ->whereIn('transaction_mode', ['barter', 'sell_and_barter'])
            ->get();

        if ($barterProducts->count() >= 2) {
            BarterOffer::create([
                'product_id' => $barterProducts[0]->id,
                'offerer_id' => $users[3]->id,
                'offer_description' => 'Saya punya telur ayam kampung 2 kg, mau tukar dengan nasi kotak ini. Telur baru dari kandang tadi pagi.',
                'status' => 'pending',
            ]);

            BarterOffer::create([
                'product_id' => $barterProducts[0]->id,
                'offerer_id' => $users[8]->id,
                'offer_description' => 'Bisa tukar dengan beras 3 kg? Beras IR64 baru giling minggu lalu.',
                'status' => 'pending',
            ]);

            BarterOffer::create([
                'product_id' => $barterProducts[1]->id,
                'offerer_id' => $users[13]->id,
                'offer_description' => 'Mau tukar dengan singkong 5 kg dari kebun saya. Singkong segar, baru dicabut.',
                'status' => 'pending',
            ]);
        }

        // ============================================
        // TRANSAKSI PENDING & TRANSAKSI SIAP DIULAS
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
                'quantity' => 1,
            ]);
        }

        // Transaksi Selesai yang Belum Diulas (untuk testing flow 'Beri Ulasan' oleh user@replate.com)
        $unreviewedProduct = Product::create([
            'user_id' => $verifiedSeller->id,
            'title' => 'Pupuk Kascing Organik Granul (2kg)',
            'description' => 'Produk tersalurkan ke Warga Budiman dan menunggu ulasan dari pembeli.',
            'photo' => 'dummy/placeholder.jpg',
            'category' => 'olahan',
            'condition' => 'layak_konsumsi',
            'weight_grams' => 2000,
            'quantity' => 1,
            'unit' => 'karung',
            'transaction_mode' => 'sell',
            'price' => 10000,
            'desa' => $verifiedSeller->desa,
            'kecamatan' => $verifiedSeller->kecamatan,
            'pickup_type' => 'rumah',
            'pickup_address' => $verifiedSeller->address,
            'timeout_at' => now()->addHours(48),
            'timeout_stage1_at' => now()->addHours(36),
            'status' => 'sold',
            'created_at' => now()->subDays(1),
        ]);

        Transaction::create([
            'product_id' => $unreviewedProduct->id,
            'buyer_id' => $users[0]->id, // Warga Budiman (user@replate.com)
            'seller_id' => $verifiedSeller->id,
            'type' => 'sale',
            'status' => 'completed',
            'price' => 10000,
            'quantity' => 1,
            'created_at' => now()->subDays(1),
            'updated_at' => now()->subHours(2),
        ]);

        // ============================================
        // NOTIFIKASI
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
            'title' => 'Tugas Penjemputan Baru',
            'message' => 'Ada penugasan baru: "Sisa Olahan Dapur & Nasi Pagi" (15kg) di Dusun Krajan.',
            'type' => 'partner_transfer',
            'is_read' => false,
        ]);

        $this->command->info('Seeder selesai!');
        $this->command->info('20 users, 16 produk, 17 transaksi, 3 barter offers, reviews & poin lengkap');
        $this->command->info('Login: admin@replate.com / user@replate.com / partner@replate.com / seller@replate.com');
        $this->command->info('Password semua: password');
    }
}