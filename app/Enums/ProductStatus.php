<?php

namespace App\Enums;

enum ProductStatus: string
{
    case ACTIVE = 'active';
    case TIMEOUT_STAGE_1 = 'timeout_stage_1';
    case TIMEOUT_STAGE_2 = 'timeout_stage_2';
    case TIMEOUT_STAGE_3 = 'timeout_stage_3';
    case SOLD = 'sold';
    case BARTERED = 'bartered';
    case DONATED = 'donated';
    case TRANSFERRED = 'transferred';
    case CANCELLED = 'cancelled';
}