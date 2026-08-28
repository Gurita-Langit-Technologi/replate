<?php

namespace Tests\Feature;

use App\Enums\BarterOfferStatus;
use App\Enums\PartnerType;
use App\Enums\ProductStatus;
use App\Enums\TransactionStatus;
use App\Enums\UserRole;
use App\Models\BarterOffer;
use App\Models\PartnerProfile;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProcessTimeoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_stage_1_discounts_product_price_by_25_percent(): void
    {
        $product = Product::factory()->create([
            'price' => 10000,
            'discounted_price' => null,
            'status' => ProductStatus::ACTIVE,
            'timer_paused' => false,
            'timeout_stage1_at' => now()->subMinute(),
            'timeout_at' => now()->addHours(12),
        ]);

        $this->artisan('products:process-timeout')->assertSuccessful();

        $product->refresh();
        $this->assertEquals(ProductStatus::TIMEOUT_STAGE_1, $product->status);
        $this->assertEquals(7500, $product->discounted_price);
    }

    public function test_stage_2_moves_expired_product_to_donation_path(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => ProductStatus::TIMEOUT_STAGE_1,
            'timer_paused' => false,
            'timeout_at' => now()->subMinute(),
        ]);

        $offer = BarterOffer::create([
            'product_id' => $product->id,
            'offerer_id' => $buyer->id,
            'offer_description' => 'Tukar dengan buah',
            'status' => BarterOfferStatus::PENDING,
        ]);

        $this->artisan('products:process-timeout')->assertSuccessful();

        $product->refresh();
        $offer->refresh();

        $this->assertEquals(ProductStatus::TIMEOUT_STAGE_2, $product->status);
        $this->assertEquals(BarterOfferStatus::REJECTED, $offer->status);
    }

    public function test_stage_3_transfers_unclaimed_donation_to_partner(): void
    {
        $seller = User::factory()->create();
        $partnerUser = User::factory()->create(['role' => UserRole::PARTNER]);

        PartnerProfile::create([
            'user_id' => $partnerUser->id,
            'partner_type' => PartnerType::UMKM->value,
            'daily_capacity_kg' => 100,
            'today_received_kg' => 0,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'condition' => 'layak_konsumsi',
            'weight_grams' => 2000,
            'status' => ProductStatus::TIMEOUT_STAGE_2,
            'timer_paused' => false,
            'timeout_at' => now()->subHours(25),
        ]);

        $this->artisan('products:process-timeout')->assertSuccessful();

        $product->refresh();
        $this->assertEquals(ProductStatus::TIMEOUT_STAGE_3, $product->status);

        $this->assertDatabaseHas('transactions', [
            'product_id' => $product->id,
            'seller_id' => $seller->id,
            'buyer_id' => $partnerUser->id,
            'partner_id' => $partnerUser->id,
            'status' => TransactionStatus::PENDING->value,
        ]);
    }

    public function test_expired_paused_timer_is_unpaused_and_pending_offers_rejected(): void
    {
        $seller = User::factory()->create();
        $offerer = User::factory()->create();

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'timer_paused' => true,
            'timer_paused_at' => now()->subHours(13),
        ]);

        $offer = BarterOffer::create([
            'product_id' => $product->id,
            'offerer_id' => $offerer->id,
            'offer_description' => 'Barter sayur',
            'status' => BarterOfferStatus::PENDING,
        ]);

        $this->artisan('products:process-timeout')->assertSuccessful();

        $product->refresh();
        $offer->refresh();

        $this->assertFalse($product->timer_paused);
        $this->assertNull($product->timer_paused_at);
        $this->assertEquals(BarterOfferStatus::REJECTED, $offer->status);
    }
}
