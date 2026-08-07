<?php

namespace App\Enums;

enum TransactionStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case DISPUTE_SPOILED = 'dispute_spoiled';
}