<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckBlacklist
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (Auth::check() && $request->user()->isBlacklisted()) {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'email' => 'Akun Anda telah di-blacklist karena melanggar ketentuan. Hubungi admin untuk banding.',
            ]);
        }

        return $next($request);
    }
}
