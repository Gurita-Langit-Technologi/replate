<?php

namespace App\Enums;

enum NotificationType: string
{
    case TRANSACTION = 'transaction';
    case TIMEOUT = 'timeout';
    case BARTER_OFFER = 'barter_offer';
    case REPORT = 'report';
    case VERIFICATION = 'verification';
    case PARTNER_TRANSFER = 'partner_transfer';
    case CHAT = 'chat';
}