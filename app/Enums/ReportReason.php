<?php

namespace App\Enums;

enum ReportReason: string
{
    // Produk
    case TIDAK_SESUAI_FOTO = 'tidak_sesuai_foto';
    case KONDISI_BURUK = 'kondisi_buruk';
    case PRODUK_TIDAK_LAYAK = 'produk_tidak_layak';
    case PENIPUAN = 'penipuan';
    case DISPUTE_SPOILED = 'dispute_spoiled';
    case PRODUK_DILARANG = 'produk_dilarang';
    case SALAH_TAG_KATEGORI = 'salah_tag_kategori';

    // Akun Pengguna
    case AKUN_PALSU = 'akun_palsu';
    case PELECEHAN_ABUSIVE = 'pelecehan_abusive';
    case PENIPUAN_TRANSAKSI = 'penipuan_transaksi';
    case GHOSTING_TIDAK_HADIR = 'ghosting_tidak_hadir';
    case SPAM_PROMOSI = 'spam_promosi';
    case LAINNYA = 'lainnya';

    public function label(): string
    {
        return match ($this) {
            self::TIDAK_SESUAI_FOTO => 'Tidak Sesuai Foto',
            self::KONDISI_BURUK => 'Kondisi Lebih Buruk / Basi',
            self::PRODUK_TIDAK_LAYAK => 'Produk Tidak Layak Konsumsi',
            self::PENIPUAN => 'Penipuan / Informasi Palsu',
            self::DISPUTE_SPOILED => 'Pangan Basi Saat Diterima (Dispute)',
            self::PRODUK_DILARANG => 'Produk Dilarang / Melanggar Aturan Desa',
            self::SALAH_TAG_KATEGORI => 'Tag / Kategori Kondisi Tidak Sesuai (Misal: Pupuk/Kompos Masuk Siap Konsumsi)',
            self::AKUN_PALSU => 'Akun Palsu / Identitas Meragukan',
            self::PELECEHAN_ABUSIVE => 'Perilaku Kasar / Pelecehan',
            self::PENIPUAN_TRANSAKSI => 'Penipuan Transaksi / Pembayaran / Barter',
            self::GHOSTING_TIDAK_HADIR => 'Tidak Hadir / Membatalkan Sepihak Berulang Kali',
            self::SPAM_PROMOSI => 'Spam / Promosi Tidak Pantas',
            self::LAINNYA => 'Pelanggaran Lainnya',
        };
    }
}