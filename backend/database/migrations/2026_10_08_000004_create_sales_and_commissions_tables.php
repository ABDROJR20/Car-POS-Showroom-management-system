<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique(); // SAL-2026-001
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            // Buyer Profile
            $table->string('buyer_name');
            $table->string('buyer_phone');
            $table->string('buyer_cnic')->nullable();
            $table->string('buyer_city')->nullable();
            $table->text('buyer_address')->nullable();

            $table->enum('ownership_type', ['Showroom', 'Client', 'Investor'])->default('Showroom');

            // Sales Financial Breakdown
            $table->decimal('cost_price', 15, 2)->default(0.00);
            $table->decimal('vehicle_expenses', 15, 2)->default(0.00);
            $table->decimal('total_vehicle_cost', 15, 2)->default(0.00);
            $table->decimal('negotiated_price', 15, 2);
            $table->decimal('transfer_fee', 15, 2)->default(0.00);
            $table->decimal('extra_charges', 15, 2)->default(0.00);
            $table->decimal('discount', 15, 2)->default(0.00);
            $table->decimal('net_sale_price', 15, 2);

            // Payment Split & Balances
            $table->decimal('amount_received', 15, 2)->default(0.00);
            $table->decimal('remaining_balance', 15, 2)->default(0.00);
            $table->enum('payment_status', ['TOKEN_ADVANCE', 'PARTIAL_PAID', 'PAID_IN_FULL', 'UNPAID'])->default('TOKEN_ADVANCE');
            $table->string('payment_method')->default('Cash');

            // Commission Allocations
            $table->decimal('showroom_commission', 15, 2)->default(0.00);
            $table->decimal('broker_commission', 15, 2)->default(0.00);
            $table->string('broker_name')->nullable();
            $table->string('broker_phone')->nullable();
            $table->decimal('agent_commission', 15, 2)->default(0.00);
            $table->string('agent_name')->nullable();

            // Calculated Showroom Gross & Net Profit
            $table->decimal('gross_profit', 15, 2)->default(0.00);
            $table->decimal('owner_payable', 15, 2)->default(0.00);
            $table->decimal('showroom_net_earnings', 15, 2)->default(0.00);

            $table->enum('status', ['COMPLETED', 'VOIDED', 'REFUNDED'])->default('COMPLETED');
            $table->date('sale_date');
            $table->date('delivery_date')->nullable();
            $table->text('terms_and_conditions')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });

        Schema::create('sale_payments', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_no')->unique(); // REC-2026-001
            $table->foreignId('sale_id')->constrained('sales')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('payment_method')->default('Cash');
            $table->string('account_name')->default('Main Cash Safe (Counter)');
            $table->string('bank_reference')->nullable();
            $table->date('payment_date');
            $table->string('received_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_no')->unique(); // COM-2026-001
            $table->foreignId('sale_id')->constrained('sales')->cascadeOnDelete();
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->string('recipient_name');
            $table->enum('party_type', ['SHOWROOM', 'BROKER', 'SALES_AGENT'])->default('BROKER');
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['PENDING', 'PAID'])->default('PENDING');
            $table->date('date');
            $table->date('paid_date')->nullable();
            $table->string('payment_account')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commissions');
        Schema::dropIfExists('sale_payments');
        Schema::dropIfExists('sales');
    }
};
