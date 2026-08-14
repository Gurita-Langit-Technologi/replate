<?php

namespace App\Http\Controllers;

use App\Enums\NotificationType;
use App\Enums\ReportReason;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    /**
     * Laporkan produk yang melanggar ketentuan
     */
    public function store(Request $request, Product $product)
    {
        $user = $request->user();

        if ($product->user_id === $user->id) {
            return back()->with('error', 'Tidak bisa melaporkan produk sendiri.');
        }

        $existing = Report::where('product_id', $product->id)
            ->where('reporter_id', $user->id)
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah melaporkan produk ini.');
        }

        $validated = $request->validate([
            'reason' => ['required', Rule::enum(ReportReason::class)],
            'description' => 'nullable|string|max:500',
        ]);

        Report::create([
            'product_id' => $product->id,
            'reporter_id' => $user->id,
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? null,
        ]);

        Notification::create([
            'user_id' => $product->user_id,
            'title' => 'Produk Anda dilaporkan',
            'message' => "Produk \"{$product->title}\" dilaporkan oleh pengguna lain.",
            'type' => NotificationType::REPORT,
            'related_id' => $product->id,
            'related_type' => Product::class,
        ]);

        return back()->with('success', 'Laporan terkirim. Admin akan meninjau.');
    }
}