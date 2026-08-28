<?php

namespace App\Enums;

enum ReportReason: string
{
    case TIDAK_SESUAI_FOTO = 'tidak_sesuai_foto';
    case KONDISI_BURUK = 'kondisi_buruk';
    case PRODUK_TIDAK_LAYAK = 'produk_tidak_layak';
    case PENIPUAN = 'penipuan';
    case DISPUTE_SPOILED = 'dispute_spoiled';
}