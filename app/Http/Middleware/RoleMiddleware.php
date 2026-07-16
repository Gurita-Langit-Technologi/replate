<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Cek blacklist
        if ($request->user()->is_blacklisted) {
            auth()->logout();
            $request->session()->invalidate();
            return redirect()->route('login')->with('error', 'Akun Anda ditangguhkan. Hubungi admin untuk banding.');
        }

        if (!in_array($request->user()->role, $roles)) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}