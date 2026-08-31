<?php

namespace Tests\Feature;

use App\Enums\PartnerType;
use App\Enums\ProductStatus;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Enums\UserRole;
use App\Models\PartnerProfile;
use App\Models\Product;
use App\Models\Review;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GapAnalysisFixesTest extends TestCase
{
    use RefreshDatabase;

    public function test_dispute_reroutes_product_to_partner_transfer(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();
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
            'weight_grams' => 3000,
            'status' => ProductStatus::ACTIVE,
        ]);

        $transaction = Transaction::create([
            'product_id' => $product->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'type' => TransactionType::SALE,
            'status' => TransactionStatus::CONFIRMED,
            'price' => 15000,
        ]);

        $response = $this->actingAs($buyer)
            ->patch("/transactions/{$transaction->id}/dispute");

        $response->assertRedirect();

        $transaction->refresh();
        $product->refresh();

        $this->assertEquals(TransactionStatus::DISPUTE_SPOILED, $transaction->status);
        $this->assertEquals(ProductStatus::DIALIHKAN_KE_MITRA, $product->status);

        $this->assertDatabaseHas('transactions', [
            'product_id' => $product->id,
            'seller_id' => $seller->id,
            'buyer_id' => $partnerUser->id,
            'partner_id' => $partnerUser->id,
            'type' => TransactionType::PARTNER_TRANSFER->value,
            'status' => TransactionStatus::PENDING->value,
        ]);
    }

    public function test_donor_can_accept_donation_claim(): void
    {
        $donor = User::factory()->create();
        $recipient = User::factory()->create();

        $product = Product::factory()->create([
            'user_id' => $donor->id,
            'status' => ProductStatus::ACTIVE,
        ]);

        $transaction = Transaction::create([
            'product_id' => $product->id,
            'buyer_id' => $recipient->id,
            'seller_id' => $donor->id,
            'type' => TransactionType::DONATION,
            'status' => TransactionStatus::PENDING,
        ]);

        $response = $this->actingAs($donor)
            ->patch("/transactions/{$transaction->id}/accept-donation");

        $response->assertRedirect();

        $transaction->refresh();
        $this->assertEquals(TransactionStatus::CONFIRMED, $transaction->status);
    }

    public function test_donor_can_reject_donation_claim_and_restores_product(): void
    {
        $donor = User::factory()->create();
        $recipient = User::factory()->create();

        $product = Product::factory()->create([
            'user_id' => $donor->id,
            'status' => ProductStatus::ACTIVE,
        ]);

        $transaction = Transaction::create([
            'product_id' => $product->id,
            'buyer_id' => $recipient->id,
            'seller_id' => $donor->id,
            'type' => TransactionType::DONATION,
            'status' => TransactionStatus::PENDING,
        ]);

        $response = $this->actingAs($donor)
            ->patch("/transactions/{$transaction->id}/reject-donation");

        $response->assertRedirect();

        $transaction->refresh();
        $product->refresh();

        $this->assertEquals(TransactionStatus::CANCELLED, $transaction->status);
        $this->assertEquals(ProductStatus::ACTIVE, $product->status);
    }

    public function test_completing_donation_transaction_sets_product_status_to_donated(): void
    {
        $donor = User::factory()->create();
        $recipient = User::factory()->create();

        $product = Product::factory()->create([
            'user_id' => $donor->id,
            'status' => ProductStatus::ACTIVE,
        ]);

        $transaction = Transaction::create([
            'product_id' => $product->id,
            'buyer_id' => $recipient->id,
            'seller_id' => $donor->id,
            'type' => TransactionType::DONATION,
            'status' => TransactionStatus::CONFIRMED,
        ]);

        $response = $this->actingAs($recipient)
            ->patch("/transactions/{$transaction->id}/complete");

        $response->assertRedirect();

        $transaction->refresh();
        $product->refresh();

        $this->assertEquals(TransactionStatus::COMPLETED, $transaction->status);
        $this->assertEquals(ProductStatus::DONATED, $product->status);
    }

    public function test_submitting_review_for_completed_transaction(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => ProductStatus::SOLD,
        ]);

        $transaction = Transaction::create([
            'product_id' => $product->id,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'type' => TransactionType::SALE,
            'status' => TransactionStatus::COMPLETED,
            'price' => 20000,
        ]);

        $response = $this->actingAs($buyer)
            ->post("/transactions/{$transaction->id}/review", [
                'rating' => 5,
                'comment' => 'Makanan masih sangat segar dan pengiriman cepat!',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('reviews', [
            'transaction_id' => $transaction->id,
            'reviewer_id' => $buyer->id,
            'reviewee_id' => $seller->id,
            'rating' => 5,
            'comment' => 'Makanan masih sangat segar dan pengiriman cepat!',
        ]);

        $this->assertEquals(5.0, $seller->averageRating());
    }

    public function test_partner_dashboard_loads_and_calculates_weight_correctly(): void
    {
        $partnerUser = User::factory()->create(['role' => UserRole::PARTNER]);
        $seller = User::factory()->create();

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => ProductStatus::TRANSFERRED,
            'weight_grams' => 2500,
        ]);

        Transaction::create([
            'product_id' => $product->id,
            'seller_id' => $seller->id,
            'partner_id' => $partnerUser->id,
            'type' => TransactionType::PARTNER_TRANSFER,
            'status' => TransactionStatus::COMPLETED,
        ]);

        $response = $this->actingAs($partnerUser)
            ->get('/partner/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Partner/Dashboard')
            ->where('totalWeight', 2500)
        );
    }

    public function test_admin_cannot_access_product_upload_or_buy(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $seller = User::factory()->create();

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => ProductStatus::ACTIVE,
            'transaction_mode' => 'sell',
            'price' => 10000,
        ]);

        // Admin create product
        $response = $this->actingAs($admin)->get('/products/create');
        $response->assertRedirect('/admin/dashboard');

        // Admin buy product
        $buyResponse = $this->actingAs($admin)->post("/products/{$product->id}/buy");
        $buyResponse->assertSessionHas('error');
    }

    public function test_seller_profile_loads_and_calculates_weight_correctly(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => ProductStatus::SOLD,
            'weight_grams' => 1500,
        ]);

        Transaction::create([
            'product_id' => $product->id,
            'seller_id' => $seller->id,
            'buyer_id' => $buyer->id,
            'type' => TransactionType::SALE,
            'status' => TransactionStatus::COMPLETED,
            'price' => 10000,
        ]);

        $response = $this->actingAs($buyer)
            ->get("/seller/{$seller->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Seller/Profile')
            ->where('stats.totalWeight', 1500)
        );
    }
}
