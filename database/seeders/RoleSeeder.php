<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
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
        User::create([
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

        // Partner (Peternak)
        User::create([
            'name' => 'Pak Tani Peternak',
            'email' => 'partner@replate.com',
            'password' => Hash::make('password'),
            'role' => 'partner',
            'desa' => 'Sumbermulyo',
            'kecamatan' => 'Bambanglipuro',
            'whatsapp_number' => '628111222333',
        ]);
    }
}