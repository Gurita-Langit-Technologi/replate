<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Bikin User Akun Dummy Pemilik Makanan
        $user = User::create([
            'name' => 'Warga Budiman',
            'email' => 'warga@replate.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'whatsapp_number' => '628123456789',
            'wilayah_dusun' => 'Dusun Krajan',
        ]);

        // 2. Bikin Produk Dummy Pertama di Marketplace
        // 1. Produk Dummy Pertama (Satuan Kotak)
        DB::table('products')->insert([
            'user_id' => $user->id,
            'title' => 'Nasi Kotak Ayam Bakar',
            'description' => 'Sisa katering pernikahan, bersih, layak konsumsi.',
            'quantity' => 25,
            'unit' => 'kotak', // <--- Satuan Kotak
            'expiry_time' => now()->addHours(5),
            'status' => 'AVAILABLE',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Produk Dummy Kedua (Satuan Kg untuk Makanan Curah/Bahan Mentah)
        DB::table('products')->insert([
            'user_id' => $user->id,
            'title' => 'Kentang dan Sayuran Sup (Belum Dimasak)',
            'description' => 'Kelebihan stok dari dapur restoran, kondisi segar dalam kulkas.',
            'quantity' => 10,
            'unit' => 'Kg', // <--- Satuan Kg tinggal ditulis di sini!
            'expiry_time' => now()->addDays(2),
            'status' => 'AVAILABLE',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}