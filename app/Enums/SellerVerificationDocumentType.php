<?php

namespace App\Enums;

enum SellerVerificationDocumentType: string
{
    case PIRT = 'pirt';
    case BPOM = 'bpom';
    case HALAL = 'halal';
    case NIB = 'nib';
    case LAINNYA = 'lainnya';
}
