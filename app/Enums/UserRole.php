<?php

namespace App\Enums;

enum UserRole: string
{
    case USER = 'user';
    case VERIFIED_SELLER = 'verified_seller';
    case PARTNER = 'partner';
    case ADMIN = 'admin';
}