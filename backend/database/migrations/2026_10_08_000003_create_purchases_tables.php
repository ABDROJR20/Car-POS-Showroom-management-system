<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('purchase_no')->unique(); // PUR-2026-001
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            
            // Seller Information
            $table->string('seller_name');
            $table->string('seller_phone');
            $table->string('seller_cnic')->nullable();
            $table->string('seller_city')->nullable();
            $table->text('seller_address')->nullable();

            $table->enum('ownership_type', ['Showroom', 'Client', 'Investor'])->default('Showroom');
            $table->decimal('agreed_purchase_price', 15, 2);
            $table->decimal('token_advance_paid', 15, 2)->default(0.00);
            $table->decimal('total_amount_paid', 15, 2)->default(0.00);
            $table->decimal('remaining_payable', 15, 2)->default(0.00);
            $table->enum('payment_status', ['TOKEN_ADVANCE', 'PARTIAL_PAID', 'PAID_IN_FULL', 'UNPAID'])->default('TOKEN_ADVANCE');
            $table->string('payment_method')->default('Cash'); // Cash, Bank Transfer, Cheque
            
            $table->date('purchase_date');
            $table->text('terms_and_conditions')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('purchase_payments', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_no')->unique();
            $table->foreignId('purchase_id')->constrained('purchases')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('payment_method')->default('Cash');
            $table->string('account_name')->default('Main Cash Safe (Counter)');
            $table->string('bank_reference')->nullable();
            $table->date('payment_date');
            $table->string('recorded_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_payments');
        Schema::dropIfExists('purchases');
    }
};
