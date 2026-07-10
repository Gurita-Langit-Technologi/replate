<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\PartnerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============ USERS ============

        // Admin
        User::create([
            'name' => 'Admin BUMDes',
            'email' => 'admin@replate.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
        ]);

        // User biasa
        $user = User::create([
            'name' => 'Warga Budiman',
            'email' => 'user@replate.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'whatsapp_number' => '628123456789',
        ]);

        // Verified Seller
        User::create([
            'name' => 'UMKM Jaya Kompos',
            'email' => 'seller@replate.com',
            'password' => Hash::make('password'),
            'role' => 'verified_seller',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'whatsapp_number' => '628987654321',
        ]);

        // Partner
        $partner = User::create([
            'name' => 'Pak Tani Peternak',
            'email' => 'partner@replate.com',
            'password' => Hash::make('password'),
            'role' => 'partner',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'whatsapp_number' => '628111222333',
        ]);

        // Partner profile
        PartnerProfile::create([
            'user_id' => $partner->id,
            'partner_type' => 'peternak',
            'capacity_description' => 'Bisa terima max 50kg/minggu',
            'is_active' => true,
        ]);

        // ============ PRODUK DUMMY ============

        Product::create([
            'user_id' => $user->id,
            'title' => 'Nasi Kotak Ayam Bakar',
            'description' => 'Sisa katering pernikahan, bersih, layak konsumsi.',
            'photo' => 'dummy/nasi-kotak.jpg',
            'category' => 'mentah',
            'condition' => 'layak_konsumsi',
            'weight_grams' => 5000,
            'transaction_mode' => 'sell_and_barter',
            'price' => 50000,
            'barter_description' => 'Mau ditukar dengan telur atau beras',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'timeout_at' => now()->addHours(48),
            'timeout_stage1_at' => now()->addHours(36),
            'status' => 'active',
        ]);

        Product::create([
            'user_id' => $user->id,
            'title' => 'Sayuran Layu Campur',
            'description' => 'Wortel, kangkung, bayam. Masih layak untuk tumis atau jus.',
            'photo' => 'dummy/sayur-layu.jpg',
            'category' => 'mentah',
            'condition' => 'layak_olah',
            'weight_grams' => 3000,
            'transaction_mode' => 'sell',
            'price' => 10000,
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'timeout_at' => now()->addDays(5),
            'timeout_stage1_at' => now()->addDays(3)->addHours(18),
            'status' => 'active',
        ]);

        Product::create([
            'user_id' => $user->id,
            'title' => 'Kulit Buah & Ampas',
            'description' => 'Kulit jeruk, kulit pisang, ampas tahu. Cocok untuk kompos.',
            'photo' => 'dummy/kulit-buah.jpg',
            'category' => 'mentah',
            'condition' => 'layak_pakan_kompos',
            'weight_grams' => 8000,
            'transaction_mode' => 'donate',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'timeout_at' => now()->addDays(7),
            'timeout_stage1_at' => now()->addDays(5)->addHours(6),
            'status' => 'active',
        ]);
    }
}