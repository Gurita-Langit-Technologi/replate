@extends('emails.layout')

@section('content')
<h2 style="font-size: 18px; font-weight: 800; color: #111827; margin-top: 0; margin-bottom: 8px;">
    Halo, {{ $seller->name }}! 👋
</h2>
<p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 0;">
    Ada warga yang baru saja melakukan pemesanan untuk produk pangan Anda di Replate:
</p>

<div class="card-box">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 12px; font-weight: 700; color: #059669;">
            ID Transaksi: #{{ $transaction->id }}
        </span>
        <span class="badge badge-warning">
            Menunggu Konfirmasi
        </span>
    </div>

    <table class="detail-table">
        <tr>
            <td class="label">Produk</td>
            <td class="val">{{ $transaction->product->title }}</td>
        </tr>
        <tr>
            <td class="label">Pembeli / Pemohon</td>
            <td class="val">{{ $transaction->buyer->name }}</td>
        </tr>
        <tr>
            <td class="label">Jumlah</td>
            <td class="val">{{ $transaction->quantity }} {{ $transaction->product->unit ?? 'satuan' }}</td>
        </tr>
        <tr>
            <td class="label">Jenis Transaksi</td>
            <td class="val">
                @if($transaction->type->value === 'donation')
                    <span style="color: #e11d48; font-weight: 700;">Klaim Donasi Gratis</span>
                @elseif($transaction->type->value === 'barter')
                    <span style="color: #7c3aed; font-weight: 700;">Barter Pangan</span>
                @else
                    <span style="color: #059669; font-weight: 700;">Rp {{ number_format($transaction->price, 0, ',', '.') }}</span>
                @endif
            </td>
        </tr>
        @if($transaction->buyer->whatsapp_number)
        <tr>
            <td class="label">Kontak WhatsApp</td>
            <td class="val">{{ $transaction->buyer->whatsapp_number }}</td>
        </tr>
        @endif
        @if($transaction->buyer_notes)
        <tr>
            <td class="label">Catatan Pembeli</td>
            <td class="val" style="font-style: italic; color: #4b5563;">"{{ $transaction->buyer_notes }}"</td>
        </tr>
        @endif
    </table>
</div>

<p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
    💡 <strong>Perhatian:</strong> Mohon segera konfirmasi pesanan ini agar makanan dapat diselamatkan sebelum kedaluwarsa atau batas waktu habis.
</p>

<div style="text-align: center; margin: 28px 0 10px 0;">
    <a href="{{ url('/transactions/' . $transaction->id) }}" class="btn">
        Buka Detail & Konfirmasi Pesanan →
    </a>
</div>
@endsection
