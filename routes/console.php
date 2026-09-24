<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::command('products:process-timeout')->hourlyAt(0)->withoutOverlapping()->runInBackground();
Schedule::command('partners:reset-quota')->dailyAt('00:00')->withoutOverlapping();
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
