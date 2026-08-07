<?php

namespace App\Enums;

enum PointType: string
{
    case EARNED_UPLOAD = 'earned_upload';
    case EARNED_SELL = 'earned_sell';
    case EARNED_BARTER = 'earned_barter';
    case EARNED_DONATE = 'earned_donate';
    case EARNED_PARTNER = 'earned_partner';
    case REDEEMED = 'redeemed';
}