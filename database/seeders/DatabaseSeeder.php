<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Admin Utama
        // Nilai default bisa di-override via file .env (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME)
        $adminEmail = env('ADMIN_EMAIL', 'admin@replate.com');
        $adminPassword = env('ADMIN_PASSWORD', 'password');
        $adminName = env('ADMIN_NAME', 'Admin BUMDes');

        User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => $adminName,
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'desa' => 'Sumbermulyo',
                'kecamatan' => 'Bambanglipuro',
                'address' => 'Kantor BUMDes Sumbermulyo, Jl. Desa No. 1',
                'email_verified_at' => now(),
            ]
        );

        $this->command?->info("Akun Admin siap: {$adminEmail}");

        // 2. Data Demo / Dummy (Hanya dijalankan di environment lokal / testing)
        if (app()->environment('local')) {
            $this->command?->info('Environment lokal terdeteksi: Menjalankan DemoDataSeeder...');
            $this->call(DemoDataSeeder::class);
        } else {
            $this->command?->info('Environment production: Data dummy dilewati untuk menjaga database tetap bersih.');
        }
    }
}