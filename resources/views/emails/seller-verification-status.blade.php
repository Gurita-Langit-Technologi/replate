@extends('emails.layout')

@section('content')
<h2 style="font-size: 18px; font-weight: 800; color: #111827; margin-top: 0; margin-bottom: 8px;">
    Halo, {{ $applicant->name }}!
</h2>

@if($isApproved)
<div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 16px 0; text-align: center;">
    <div style="font-size: 32px; margin-bottom: 8px;">🎉</div>
    <h3 style="font-size: 16px; font-weight: 800; color: #065f46; margin: 0 0 6px 0;">
        Selamat! Akun Anda Telah Terverifikasi sebagai Penjual Olahan Resmi
    </h3>
    <p style="font-size: 13px; color: #047857; margin: 0; line-height: 1.5;">
        Pengajuan verifikasi olahan pangan Anda telah ditinjau dan disetujui oleh Koordinator BUMDes.
    </p>
</div>

<p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
    Anda sekarang memiliki hak istimewa untuk:
</p>
<ul style="font-size: 13px; color: #374151; line-height: 1.8; padding-left: 20px;">
    <li>Mengunggah produk dalam kategori <strong>Pangan Olahan</strong> dan <strong>Siap Santap</strong>.</li>
    <li>Mendapatkan lencana <strong>Verified Seller</strong> terpercaya di profil Anda.</li>
    <li>Menjangkau lebih banyak warga dengan standar kebersihan dan higienitas desa.</li>
</ul>

<div style="text-align: center; margin: 28px 0 10px 0;">
    <a href="{{ url('/products/create') }}" class="btn">
        Mulai Unggah Produk Olahan →
    </a>
</div>
@else
<div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 16px 0; text-align: center;">
    <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
    <h3 style="font-size: 16px; font-weight: 800; color: #991b1b; margin: 0 0 6px 0;">
        Pengajuan Verifikasi Belum Dapat Disetujui
    </h3>
    <p style="font-size: 13px; color: #b91c1c; margin: 0; line-height: 1.5;">
        Setelah peninjauan dokumen dan standar oleh BUMDes, pengajuan Anda saat ini belum memenuhi kriteria.
    </p>
</div>

@if($notes)
<div class="card-box" style="border-left: 4px solid #ef4444;">
    <p style="font-size: 12px; font-weight: 700; color: #991b1b; margin: 0 0 4px 0;">Catatan dari Admin BUMDes:</p>
    <p style="font-size: 13px; color: #4b5563; margin: 0; font-style: italic;">"{{ $notes }}"</p>
</div>
@endif

<p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
    Anda dapat melengkapi persyaratan dan mengajukan verifikasi kembali melalui menu profil di Replate.
</p>

<div style="text-align: center; margin: 28px 0 10px 0;">
    <a href="{{ url('/seller/apply') }}" class="btn" style="background-color: #4b5563;">
        Tinjau & Ajukan Ulang →
    </a>
</div>
@endif
@endsection
