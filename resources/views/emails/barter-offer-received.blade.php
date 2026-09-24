@extends('emails.layout')

@section('content')
<h2 style="font-size: 18px; font-weight: 800; color: #111827; margin-top: 0; margin-bottom: 8px;">
    Halo, {{ $owner->name }}! 🤝
</h2>
<p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 0;">
    Ada warga yang mengajukan <strong>Tawaran Barter Pangan</strong> untuk produk Anda di Replate:
</p>

<div class="card-box">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 12px; font-weight: 700; color: #7c3aed;">
            ID Penawaran: #{{ $barterOffer->id }}
        </span>
        <span class="badge badge-info">
            Tawaran Baru
        </span>
    </div>

    <table class="detail-table">
        <tr>
            <td class="label">Produk Anda yang Diminati</td>
            <td class="val" style="color: #059669;">{{ $barterOffer->product->title }}</td>
        </tr>
        <tr>
            <td class="label">Nama Penawar</td>
            <td class="val">{{ $barterOffer->offerer->name }}</td>
        </tr>
        <tr>
            <td class="label">Pangan yang Ditawarkan</td>
            <td class="val" style="color: #7c3aed; font-weight: 700;">{{ $barterOffer->offer_description }}</td>
        </tr>
        <tr>
            <td class="label">Jumlah yang Ingin Ditukar</td>
            <td class="val">{{ $barterOffer->quantity }} {{ $barterOffer->product->unit ?? 'satuan' }}</td>
        </tr>
        @if($barterOffer->offerer->whatsapp_number)
        <tr>
            <td class="label">Kontak WhatsApp Penawar</td>
            <td class="val">{{ $barterOffer->offerer->whatsapp_number }}</td>
        </tr>
        @endif
    </table>
</div>

<p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
    💡 Anda dapat menerima atau menolak tawaran ini melalui menu Barter di aplikasi Replate.
</p>

<div style="text-align: center; margin: 28px 0 10px 0;">
    <a href="{{ url('/barter') }}" class="btn" style="background-color: #7c3aed;">
        Tinjau & Tanggapi Tawaran Barter →
    </a>
</div>
@endsection
