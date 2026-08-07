<?php

namespace App\Enums;

enum TransactionType: string
{
    case SALE = 'sale';
    case BARTER = 'barter';
    case DONATION = 'donation';
    case PARTNER_TRANSFER = 'partner_transfer';
}