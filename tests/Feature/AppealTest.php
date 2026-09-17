<?php

namespace Tests\Feature;

use App\Enums\ProductStatus;
use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Models\Product;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AppealTest extends TestCase
{
    use RefreshDatabase;

    public function test_reported_seller_can_view_report_detail_and_appeal_page(): void
    {
        $seller = User::factory()->create(['role' => UserRole::USER]);
        $reporter = User::factory()->create(['role' => UserRole::USER]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => ProductStatus::ACTIVE,
        ]);

        $report = Report::create([
            'product_id' => $product->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $seller->id,
            'reason' => ReportReason::TIDAK_SESUAI_FOTO,
            'description' => 'Foto berbeda dengan fisik.',
            'status' => ReportStatus::PENDING,
        ]);

        $response = $this->actingAs($seller)->get(route('reports.show', $report));
        $response->assertOk();
    }

    public function test_unauthorized_user_cannot_view_report(): void
    {
        $seller = User::factory()->create(['role' => UserRole::USER]);
        $reporter = User::factory()->create(['role' => UserRole::USER]);
        $stranger = User::factory()->create(['role' => UserRole::USER]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
        ]);

        $report = Report::create([
            'product_id' => $product->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $seller->id,
            'reason' => ReportReason::TIDAK_SESUAI_FOTO,
            'status' => ReportStatus::PENDING,
        ]);

        $response = $this->actingAs($stranger)->get(route('reports.show', $report));
        $response->assertForbidden();
    }

    public function test_seller_can_submit_appeal(): void
    {
        Storage::fake('public');

        $seller = User::factory()->create(['role' => UserRole::USER]);
        $reporter = User::factory()->create(['role' => UserRole::USER]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
        ]);

        $report = Report::create([
            'product_id' => $product->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $seller->id,
            'reason' => ReportReason::TIDAK_SESUAI_FOTO,
            'status' => ReportStatus::REVIEWED,
            'admin_notes' => 'Produk dinonaktifkan.',
        ]);

        $response = $this->actingAs($seller)->post(route('reports.appeal', $report), [
            'appeal_notes' => 'Ini produk asli dan saya lampirkan foto fisik terkini yang masih utuh.',
            'appeal_photo' => UploadedFile::fake()->image('bukti.jpg'),
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'appeal_status' => 'pending',
            'appeal_notes' => 'Ini produk asli dan saya lampirkan foto fisik terkini yang masih utuh.',
        ]);
    }

    public function test_admin_can_approve_appeal_and_restore_product(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $seller = User::factory()->create([
            'role' => UserRole::USER,
            'report_count' => 1,
        ]);
        $reporter = User::factory()->create(['role' => UserRole::USER]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => ProductStatus::SOLD,
        ]);

        $report = Report::create([
            'product_id' => $product->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $seller->id,
            'reason' => ReportReason::TIDAK_SESUAI_FOTO,
            'status' => ReportStatus::REVIEWED,
            'admin_notes' => 'Produk dinonaktifkan.',
            'appeal_notes' => 'Barang sebenarnya masih baru dan sesuai.',
            'appeal_status' => 'pending',
            'appealed_at' => now(),
        ]);

        $response = $this->actingAs($admin)->patch(route('admin.reports.appeal.approve', $report), [
            'admin_notes' => 'Sanggahan diterima, foto bukti valid.',
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'appeal_status' => 'approved',
            'appeal_admin_notes' => 'Sanggahan diterima, foto bukti valid.',
        ]);

        // Product restored to active
        $this->assertEquals(ProductStatus::ACTIVE, $product->fresh()->status);

        // Seller warning reduced
        $this->assertEquals(0, $seller->fresh()->report_count);
    }

    public function test_admin_can_reject_appeal(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $seller = User::factory()->create([
            'role' => UserRole::USER,
            'report_count' => 1,
        ]);
        $reporter = User::factory()->create(['role' => UserRole::USER]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
            'status' => ProductStatus::SOLD,
        ]);

        $report = Report::create([
            'product_id' => $product->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $seller->id,
            'reason' => ReportReason::TIDAK_SESUAI_FOTO,
            'status' => ReportStatus::REVIEWED,
            'admin_notes' => 'Produk dinonaktifkan.',
            'appeal_notes' => 'Mohon aktifkan kembali.',
            'appeal_status' => 'pending',
            'appealed_at' => now(),
        ]);

        $response = $this->actingAs($admin)->patch(route('admin.reports.appeal.reject', $report), [
            'admin_notes' => 'Bukti tidak cukup kuat.',
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'appeal_status' => 'rejected',
            'appeal_admin_notes' => 'Bukti tidak cukup kuat.',
        ]);

        // Product remains sold / disabled
        $this->assertEquals(ProductStatus::SOLD, $product->fresh()->status);
        $this->assertEquals(1, $seller->fresh()->report_count);
    }

    public function test_seller_can_submit_appeal_with_video(): void
    {
        Storage::fake('public');

        $seller = User::factory()->create(['role' => UserRole::USER]);
        $reporter = User::factory()->create(['role' => UserRole::USER]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
        ]);

        $report = Report::create([
            'product_id' => $product->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $seller->id,
            'reason' => ReportReason::TIDAK_SESUAI_FOTO,
            'status' => ReportStatus::REVIEWED,
            'admin_notes' => 'Produk dinonaktifkan.',
        ]);

        $fakeVideo = UploadedFile::fake()->create('bukti_video.mp4', 5000, 'video/mp4');

        $response = $this->actingAs($seller)->post(route('reports.appeal', $report), [
            'appeal_notes' => 'Berikut rekaman video fisik kondisi makanan terkini yang masih hangat.',
            'appeal_photo' => $fakeVideo,
        ]);

        $response->assertSessionHas('success');
        $updatedReport = $report->fresh();
        $this->assertEquals('pending', $updatedReport->appeal_status);
        $this->assertStringEndsWith('.mp4', $updatedReport->appeal_photo);
        Storage::disk('public')->assertExists($updatedReport->appeal_photo);
    }

    public function test_seller_can_submit_appeal_with_multiple_media_files(): void
    {
        Storage::fake('public');

        $seller = User::factory()->create(['role' => UserRole::USER]);
        $reporter = User::factory()->create(['role' => UserRole::USER]);

        $product = Product::factory()->create([
            'user_id' => $seller->id,
        ]);

        $report = Report::create([
            'product_id' => $product->id,
            'reporter_id' => $reporter->id,
            'reported_user_id' => $seller->id,
            'reason' => ReportReason::TIDAK_SESUAI_FOTO,
            'status' => ReportStatus::REVIEWED,
            'admin_notes' => 'Produk dinonaktifkan.',
        ]);

        $files = [
            UploadedFile::fake()->image('bukti1.jpg'),
            UploadedFile::fake()->image('bukti2.jpg'),
            UploadedFile::fake()->create('video_fisik.mp4', 3000, 'video/mp4'),
        ];

        $response = $this->actingAs($seller)->post(route('reports.appeal', $report), [
            'appeal_notes' => 'Melampirkan 2 foto dan 1 video kondisi barang.',
            'appeal_photos' => $files,
        ]);

        $response->assertSessionHas('success');
        $updatedReport = $report->fresh();
        $this->assertEquals('pending', $updatedReport->appeal_status);

        $mediaList = $updatedReport->appeal_media_list;
        $this->assertCount(3, $mediaList);
        foreach ($mediaList as $path) {
            Storage::disk('public')->assertExists($path);
        }
    }
}

