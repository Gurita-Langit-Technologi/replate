<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        // Cek apakah user sudah login
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Cek apakah role user termasuk dalam daftar role yang diizinkan
        if (!in_array($request->user()->role, $roles)) {
            // Kalau tidak, redirect ke dashboard sesuai role-nya
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}