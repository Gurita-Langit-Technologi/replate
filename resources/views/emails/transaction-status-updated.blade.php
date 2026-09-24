@extends('emails.layout')

@section('content')
<h2 style="font-size: 18px; font-weight: 800; color: #111827; margin-top: 0; margin-bottom: 8px;">
    Halo, {{ $recipient->name }}! 👋
</h2>
<p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 0;">
    {{ $statusMessage }}
</p>

<div class="card-box">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 12px; font-weight: 700; color: #059669;">
            ID Transaksi: #{{ $transaction->id }}
        </span>
        <span class="badge {{ $statusBadgeClass }}">
            {{ $statusLabel }}
        </span>
    </div>

    <table class="detail-table">
        <tr>
            <td class="label">Produk Pangan</td>
            <td class="val">{{ $transaction->product->title }}</td>
        </tr>
        <tr>
            <td class="label">Pemberi / Penjual</td>
            <td class="val">{{ $transaction->seller->name }}</td>
        </tr>
        <tr>
            <td class="label">Penerima / Pembeli</td>
            <td class="val">{{ $transaction->buyer->name }}</td>
        </tr>
        <tr>
            <td class="label">Jumlah & Satuan</td>
            <td class="val">{{ $transaction->quantity }} {{ $transaction->product->unit ?? 'satuan' }}</td>
        </tr>
        @if($pickupLocation)
        <tr>
            <td class="label">Lokasi Pengambilan</td>
            <td class="val" style="color: #059669;">{{ $pickupLocation }}</td>
        </tr>
        @endif
        @if($cancelReason)
        <tr>
            <td class="label">Keterangan / Alasan</td>
            <td class="val" style="color: #b91c1c; font-style: italic;">"{{ $cancelReason }}"</td>
        </tr>
        @endif
    </table>
</div>

@if($isCompleted)
<div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
    <p style="font-size: 14px; font-weight: 700; color: #065f46; margin: 0 0 6px 0;">
        🎉 Terima kasih telah menyelamatkan pangan desa!
    </p>
    <p style="font-size: 12px; color: #047857; margin: 0;">
        Transaksi ini berhasil mencegah potensi food waste dan memberikan poin kontribusi untuk profil Anda. Jangan lupa berikan ulasan!
    </p>
</div>
@endif

<div style="text-align: center; margin: 28px 0 10px 0;">
    <a href="{{ url('/transactions/' . $transaction->id) }}" class="btn">
        Buka Rincian Transaksi →
    </a>
</div>
@endsection
