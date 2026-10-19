<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\CommissionController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\DemandController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| Ahsan Autos POS REST API v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // 1. Authentication
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public / Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Users & Roles
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/roles', [UserController::class, 'getRoles']);

        // 2. Vehicles & Inventory Floor
        Route::apiResource('vehicles', VehicleController::class);
        Route::post('/vehicles/{id}/image', [VehicleController::class, 'uploadImage']);
        Route::post('/vehicles/{id}/document', [VehicleController::class, 'uploadDocument']);

        // 3. Vehicle Purchases
        Route::apiResource('purchases', PurchaseController::class);
        Route::post('/purchases/{id}/payment', [PurchaseController::class, 'recordPayment']);

        // 4. Sales Orders & Checkout
        Route::apiResource('sales', SaleController::class);
        Route::post('/sales/{id}/payment', [SaleController::class, 'recordPayment']);
        Route::post('/sales/{id}/void', [SaleController::class, 'voidSale']);

        // 5. Commissions & Payouts
        Route::get('/commissions', [CommissionController::class, 'index']);
        Route::post('/commissions/{id}/pay', [CommissionController::class, 'pay']);

        // 6. Finance, Cash Safe & Expenses
        Route::get('/finance/summary', [FinanceController::class, 'getAccountsSummary']);
        Route::get('/finance/ledger', [FinanceController::class, 'getLedger']);
        Route::get('/finance/expenses', [FinanceController::class, 'getExpenses']);
        Route::post('/finance/expenses', [FinanceController::class, 'storeExpense']);
        Route::post('/finance/transfer', [FinanceController::class, 'transferFunds']);

        // 7. Car Demand Leads & AI Matchmaker
        Route::apiResource('demands', DemandController::class);
        Route::get('/demands/{id}/matches', [DemandController::class, 'getMatches']);

        // 8. 20 Specialized Automotive Reports
        Route::get('/reports/{reportId}', [ReportController::class, 'generate']);

        // 9. Showroom Settings & Print Customization
        Route::get('/settings', [SettingsController::class, 'getSettings']);
        Route::post('/settings', [SettingsController::class, 'updateSettings']);
    });

    // Public fallback for settings & health check
    Route::get('/health', fn() => response()->json(['status' => 'healthy', 'app' => 'Ahsan Autos POS Laravel Engine', 'version' => '1.0.0']));
    Route::get('/public-settings', [SettingsController::class, 'getSettings']);
});
