<?php

namespace Tests\Feature;

use App\Enums\ProductCategory;
use App\Enums\ProductCondition;
use App\Enums\ProductStatus;
use App\Enums\TransactionMode;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Enums\UserRole;
use App\Models\PointHistory;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use App\Services\ImageService;
use App\Services\ImpactAnalyticsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NewEnhancementsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Laporan ESG & CSR dapat diakses secara publik dan menghasilkan metrik yang valid
     */
    public function test_esg_report_page_can_be_rendered(): void
    {
        $response = $this->get(route('impact.report'));
        $response->assertStatus(200);

        $impactService = app(ImpactAnalyticsService::class);
        $esgData = $impactService->getEsgReport('all');

        $this->assertArrayHasKey('metrics', $esgData);
        $this->assertArrayHasKey('standards', $esgData);
        $this->assertArrayHasKey('co2_avoided_kg', $esgData['metrics']);
        $this->assertArrayHasKey('methane_avoided_kg', $esgData['metrics']);
    }

    /**
     * Test User dapat menukar RePoin mandiri jika saldo mencukupi
     */
    public function test_user_can_redeem_points_with_sufficient_balance(): void
    {
        $user = User::factory()->create([
            'role' => UserRole::USER,
            'points' => 100,
        ]);

        $response = $this->actingAs($user)->post(route('points.redeem'), [
            'reward_id' => 'rice_25kg', // 50 poin
        ]);

        $response->assertSessionHas('success');
        $this->assertEquals(50, $user->fresh()->points);

        $this->assertDatabaseHas('point_histories', [
            'user_id' => $user->id,
            'amount' => -50,
            'balance_after' => 50,
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test User ditolak menukar RePoin jika saldo tidak cukup
     */
    public function test_user_cannot_redeem_points_with_insufficient_balance(): void
    {
        $user = User::factory()->create([
            'role' => UserRole::USER,
            'points' => 10,
        ]);

        $response = $this->actingAs($user)->post(route('points.redeem'), [
            'reward_id' => 'rice_25kg', // 50 poin
        ]);

        $response->assertSessionHas('error');
        $this->assertEquals(10, $user->fresh()->points);
    }

    /**
     * Test ImageService menyimpan dan mengoptimasi file gambar
     */
    public function test_image_service_stores_file_successfully(): void
    {
        Storage::fake('public');
        $imageService = new ImageService();

        $file = UploadedFile::fake()->image('test_product.jpg', 600, 600);
        $path = $imageService->storeOptimized($file, 'products');

        $this->assertNotNull($path);
        Storage::disk('public')->assertExists($path);
    }

    /**
     * Test Transaksi Beli dengan atomic lock dan kalkulasi total
     */
    public function test_buy_product_creates_transaction_atomically(): void
    {
        $seller = User::factory()->create(['role' => UserRole::USER, 'desa' => 'Maju Jaya', 'kecamatan' => 'Sukamaju']);
        $buyer = User::factory()->create(['role' => UserRole::USER, 'desa' => 'Maju Jaya', 'kecamatan' => 'Sukamaju']);

        $product = Product::create([
            'user_id' => $seller->id,
            'title' => 'Sayur Kangkung Segar',
            'description' => 'Sisa panen kebun',
            'photo' => 'products/kangkung.jpg',
            'category' => ProductCategory::MENTAH,
            'condition' => ProductCondition::LAYAK_KONSUMSI,
            'quantity' => 5,
            'unit' => 'ikat',
            'weight_grams' => 1500,
            'transaction_mode' => TransactionMode::SELL,
            'price' => 5000,
            'desa' => 'Maju Jaya',
            'kecamatan' => 'Sukamaju',
            'pickup_type' => \App\Enums\PickupType::RUMAH,
            'status' => ProductStatus::ACTIVE,
            'timeout_at' => now()->addDays(2),
        ]);

        $response = $this->actingAs($buyer)->post(route('transactions.buy', $product), [
            'quantity' => 2,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('transactions', [
            'product_id' => $product->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'price' => 10000,
            'quantity' => 2,
            'status' => TransactionStatus::PENDING,
        ]);
    }
}
