<?php

namespace Database\Factories;

use App\Enums\PickupType;
use App\Enums\ProductCategory;
use App\Enums\ProductCondition;
use App\Enums\ProductStatus;
use App\Enums\TransactionMode;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'photo' => 'products/sample.jpg',
            'category' => ProductCategory::MENTAH->value,
            'condition' => ProductCondition::LAYAK_KONSUMSI->value,
            'weight_grams' => 1000,
            'quantity' => 1,
            'unit' => 'kg',
            'transaction_mode' => TransactionMode::SELL->value,
            'price' => 20000,
            'discounted_price' => null,
            'barter_description' => null,
            'desa' => 'Coblong',
            'kecamatan' => 'Dago',
            'pickup_address' => 'Jl. Dago No. 10',
            'pickup_notes' => null,
            'pickup_type' => PickupType::RUMAH->value,
            'timeout_at' => now()->addHours(48),
            'timeout_stage1_at' => now()->addHours(36),
            'status' => ProductStatus::ACTIVE->value,
            'timer_paused' => false,
            'timer_paused_at' => null,
        ];
    }
}
