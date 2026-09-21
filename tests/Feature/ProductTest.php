<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use App\Enums\ProductCategory;
use App\Enums\ProductCondition;
use App\Enums\TransactionMode;
use App\Enums\PickupType;
use App\Enums\ProductStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_without_location_is_redirected_to_profile_on_product_upload(): void
    {
        $user = User::factory()->create([
            'desa' => null,
            'kecamatan' => null,
        ]);

        $response = $this->actingAs($user)->post('/products', [
            'title' => 'Makanan Sisa Pesta',
        ]);

        $response->assertRedirect(route('profile.edit'));
        $response->assertSessionHas('error', 'Lengkapi lokasi (desa & kecamatan) di profil Anda sebelum upload produk.');
    }

    public function test_user_with_location_can_upload_product(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'desa' => 'Coblong',
            'kecamatan' => 'Dago',
        ]);

        // Cek category enum
        $category = ProductCategory::cases()[0]->value; // Get any valid enum value
        $condition = ProductCondition::cases()[0]->value;
        $mode = TransactionMode::cases()[0]->value;
        $pickupType = PickupType::cases()[0]->value;

        $response = $this->actingAs($user)->post('/products', [
            'title' => 'Nasi Goreng Spesial',
            'description' => 'Masih bagus, sisa katering tadi siang.',
            'photo' => UploadedFile::fake()->image('nasigoreng.jpg'),
            'category' => $category,
            'condition' => $condition,
            'weight_grams' => 1000,
            'quantity' => 2,
            'unit' => 'pcs',
            'transaction_mode' => $mode,
            'price' => 15000,
            'pickup_address' => 'Jl. Dago No. 10',
            'pickup_type' => $pickupType,
        ]);

        $response->assertRedirect(route('marketplace'));
        $response->assertSessionHas('success', 'Produk berhasil diunggah!');

        $this->assertDatabaseHas('products', [
            'title' => 'Nasi Goreng Spesial',
            'user_id' => $user->id,
            'desa' => 'Coblong',
            'kecamatan' => 'Dago',
        ]);
    }

    public function test_user_can_update_product_without_changing_photo(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'desa' => 'Coblong',
            'kecamatan' => 'Dago',
        ]);

        $product = Product::factory()->create([
            'user_id' => $user->id,
            'title' => 'Sayuran Segar',
            'photo' => 'products/sample.jpg',
            'price' => 5000,
            'quantity' => 2,
            'unit' => 'kg',
            'condition' => ProductCondition::LAYAK_KONSUMSI,
            'category' => ProductCategory::MENTAH,
            'transaction_mode' => TransactionMode::SELL,
        ]);

        $response = $this->actingAs($user)->put("/products/{$product->id}", [
            'title' => 'Sayuran Segar Diupdate',
            'description' => 'Deskripsi baru',
            'category' => ProductCategory::MENTAH->value,
            'condition' => ProductCondition::LAYAK_KONSUMSI->value,
            'weight_grams' => 2000,
            'quantity' => 3,
            'unit' => 'kg',
            'transaction_mode' => TransactionMode::SELL->value,
            'price' => 7000,
            'pickup_type' => PickupType::RUMAH->value,
        ]);

        $response->assertRedirect(route('products.mine'));
        $response->assertSessionHas('success', 'Produk berhasil diperbarui!');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'title' => 'Sayuran Segar Diupdate',
            'photo' => 'products/sample.jpg', // Photo remains intact
            'price' => 7000,
            'quantity' => 3,
        ]);
    }
}
