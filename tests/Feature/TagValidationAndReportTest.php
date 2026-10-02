<?php

namespace Tests\Feature;

use App\Enums\ProductCategory;
use App\Enums\ProductCondition;
use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Enums\TransactionMode;
use App\Enums\UserRole;
use App\Models\Product;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TagValidationAndReportTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test tidak boleh upload pupuk/kompos dengan tag layak_konsumsi
     */
    public function test_cannot_create_compost_or_fertilizer_as_layak_konsumsi(): void
    {
        Storage::fake('public');
        $user = User::factory()->create([
            'role' => UserRole::VERIFIED_SELLER,
            'desa' => 'Maju Jaya',
            'kecamatan' => 'Sukamaju',
        ]);

        $response = $this->actingAs($user)->post(route('products.store'), [
            'title' => 'Pupuk Kompos Organik Desa',
            'description' => 'Pupuk siap pakai untuk menyuburkan tanaman pekarangan.',
            'category' => ProductCategory::OLAHAN->value,
            'condition' => ProductCondition::LAYAK_KONSUMSI->value, // Tidak sesuai!
            'quantity' => 10,
            'unit' => 'kg',
            'transaction_mode' => TransactionMode::SELL->value,
            'price' => 5000,
            'pickup_type' => 'rumah',
            'photo' => UploadedFile::fake()->image('pupuk.jpg'),
        ]);

        $response->assertSessionHasErrors('condition');
        $this->assertDatabaseMissing('products', [
            'title' => 'Pupuk Kompos Organik Desa',
        ]);
    }

    /**
     * Test boleh upload pupuk/kompos dengan tag layak_pakan_kompos
     */
    public function test_can_create_compost_with_layak_pakan_kompos_tag(): void
    {
        Storage::fake('public');
        $user = User::factory()->create([
            'role' => UserRole::VERIFIED_SELLER,
            'desa' => 'Maju Jaya',
            'kecamatan' => 'Sukamaju',
        ]);

        $response = $this->actingAs($user)->post(route('products.store'), [
            'title' => 'Pupuk Kompos Organik Desa',
            'description' => 'Pupuk siap pakai untuk menyuburkan tanaman pekarangan.',
            'category' => ProductCategory::OLAHAN->value,
            'condition' => ProductCondition::LAYAK_PAKAN_KOMPOS->value, // Sesuai!
            'quantity' => 10,
            'unit' => 'kg',
            'transaction_mode' => TransactionMode::SELL->value,
            'price' => 5000,
            'pickup_type' => 'rumah',
            'photo' => UploadedFile::fake()->image('pupuk.jpg'),
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('products', [
            'title' => 'Pupuk Kompos Organik Desa',
            'condition' => 'layak_pakan_kompos',
        ]);
    }

    /**
     * Test user dapat melaporkan produk dengan alasan salah_tag_kategori
     */
    public function test_user_can_report_product_with_salah_tag_kategori(): void
    {
        Storage::fake('public');
        $seller = User::factory()->create(['role' => UserRole::USER]);
        $reporter = User::factory()->create(['role' => UserRole::USER]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'title' => 'Sayuran Agak Busuk',
            'condition' => ProductCondition::LAYAK_KONSUMSI,
        ]);

        $response = $this->actingAs($reporter)->post("/products/{$product->id}/report", [
            'reason' => ReportReason::SALAH_TAG_KATEGORI->value,
            'description' => 'Produk ini pupuk/kompos tapi dimasukkan ke siap konsumsi, berbahaya.',
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('reports', [
            'product_id' => $product->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $seller->id,
            'reason' => 'salah_tag_kategori',
            'status' => ReportStatus::PENDING->value,
        ]);
    }
}
