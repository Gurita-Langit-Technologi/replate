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
}
