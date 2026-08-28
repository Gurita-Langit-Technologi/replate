<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\Notification;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_chat_routes(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this->get('/chat')->assertRedirect('/login');
        $this->get("/chat/{$user->id}")->assertRedirect('/login');
        $this->post("/chat/{$user->id}", ['body' => 'Halo'])->assertRedirect('/login');
        $this->get("/products/{$product->id}/chat")->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_chat_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/chat');

        $response->assertOk();
    }

    public function test_authenticated_user_can_send_message_and_trigger_notification(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();

        $response = $this->actingAs($sender)->post("/chat/{$receiver->id}", [
            'body' => 'Halo, apakah barang ini masih ada?',
        ]);

        $response->assertRedirect("/chat/{$receiver->id}");

        $this->assertDatabaseHas('messages', [
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'body' => 'Halo, apakah barang ini masih ada?',
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $receiver->id,
            'title' => 'Pesan baru',
        ]);
    }

    public function test_user_cannot_start_chat_with_self_from_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get("/products/{$product->id}/chat");

        $response->assertSessionHas('error', 'Tidak bisa chat dengan diri sendiri.');
    }
}
