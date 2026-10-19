<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'system' => 'Ahsan Autos POS & Car Showroom Management System',
        'backend' => 'Laravel 11 Engine',
        'database' => 'MySQL',
        'api_docs' => '/api/v1/health',
    ]);
});
