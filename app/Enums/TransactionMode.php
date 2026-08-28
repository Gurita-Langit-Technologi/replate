<?php

namespace App\Enums;

enum TransactionMode: string
{
    case SELL = 'sell';
    case BARTER = 'barter';
    case SELL_AND_BARTER = 'sell_and_barter';
    case DONATE = 'donate';
}
