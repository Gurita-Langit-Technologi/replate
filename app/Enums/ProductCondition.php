<?php

namespace App\Enums;

enum ProductCondition: string
{
    case LAYAK_KONSUMSI = 'layak_konsumsi';
    case LAYAK_OLAH = 'layak_olah';
    case LAYAK_PAKAN_KOMPOS = 'layak_pakan_kompos';
}
