<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('type'); // CASH_SAFE, BANK_ACCOUNT
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->decimal('opening_balance', 15, 2)->default(0.00);
            $table->decimal('current_balance', 15, 2)->default(0.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->boolean('is_vehicle_direct')->default(false);
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_no')->unique(); // EXP-2026-001
            $table->foreignId('expense_category_id')->nullable()->constrained('expense_categories')->nullOnDelete();
            $table->string('category_name');
            $table->decimal('amount', 15, 2);
            $table->string('paid_to');
            $table->string('account_name')->default('Main Cash Safe (Counter)');
            $table->date('date');
            
            // Direct Vehicle Linkage
            $table->boolean('is_vehicle_linked')->default(false);
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->string('vehicle_summary')->nullable();

            $table->string('recorded_by')->nullable();
            $table->text('narration')->nullable();
            $table->string('receipt_attachment')->nullable();
            $table->timestamps();
        });

        Schema::create('cash_ledgers', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_no')->unique(); // LED-2026-001
            $table->foreignId('cash_account_id')->nullable()->constrained('cash_accounts')->nullOnDelete();
            $table->string('account_name')->default('Main Cash Safe (Counter)');
            $table->date('date');
            $table->enum('type', ['DEBIT', 'CREDIT']); // DEBIT = Cash IN, CREDIT = Cash OUT
            $table->string('category'); // SALE_ADVANCE, SALE_FINAL, PURCHASE_OUTFLOW, VEHICLE_EXPENSE, OPERATING_OVERHEAD, COMMISSION_PAYOUT, REVERSAL
            $table->decimal('amount', 15, 2);
            $table->decimal('running_balance', 15, 2);
            $table->string('reference_type')->nullable(); // Sale, Purchase, Expense, Commission
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('recorded_by')->nullable();
            $table->text('narration');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_ledgers');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('expense_categories');
        Schema::dropIfExists('cash_accounts');
    }
};
