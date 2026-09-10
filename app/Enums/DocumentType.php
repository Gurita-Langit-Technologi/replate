<?php

namespace App\Enums;

enum DocumentType: string
{
    case PIRT = 'pirt';
    case BPOM = 'bpom';
    case HALAL = 'halal';
    case NIB = 'nib';
    case LAINNYA = 'lainnya';
}
