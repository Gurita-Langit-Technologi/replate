<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;

class ReportController extends Controller
{
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
            'reason' => 'required|in:tidak_sesuai_foto,kondisi_buruk,produk_tidak_layak,penipuan',
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
            'type' => 'report',
            'related_id' => $product->id,
            'related_type' => Product::class,
        ]);

        return back()->with('success', 'Laporan terkirim. Admin akan meninjau.');
    }
}