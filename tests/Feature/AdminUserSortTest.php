<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminUserSortTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_sort_users_by_name_ascending(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);

        User::factory()->create(['name' => 'Zulfa', 'role' => UserRole::USER]);
        User::factory()->create(['name' => 'Budi', 'role' => UserRole::USER]);
        User::factory()->create(['name' => 'Andi', 'role' => UserRole::USER]);

        $response = $this->actingAs($admin)->get('/admin/users?sort=name&direction=asc');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Users')
            ->has('users', 3)
            ->where('users.0.name', 'Andi')
            ->where('users.1.name', 'Budi')
            ->where('users.2.name', 'Zulfa')
        );
    }

    public function test_admin_can_sort_users_by_name_descending(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);

        User::factory()->create(['name' => 'Zulfa', 'role' => UserRole::USER]);
        User::factory()->create(['name' => 'Budi', 'role' => UserRole::USER]);
        User::factory()->create(['name' => 'Andi', 'role' => UserRole::USER]);

        $response = $this->actingAs($admin)->get('/admin/users?sort=name&direction=desc');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Users')
            ->has('users', 3)
            ->where('users.0.name', 'Zulfa')
            ->where('users.1.name', 'Budi')
            ->where('users.2.name', 'Andi')
        );
    }

    public function test_sort_by_name_defaults_to_ascending(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);

        User::factory()->create(['name' => 'Citra', 'role' => UserRole::USER]);
        User::factory()->create(['name' => 'Agus', 'role' => UserRole::USER]);

        $response = $this->actingAs($admin)->get('/admin/users?sort=name');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Users')
            ->where('users.0.name', 'Agus')
            ->where('users.1.name', 'Citra')
        );
    }
}
