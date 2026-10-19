<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('stock_code')->unique()->nullable();
            $table->string('registration_no')->unique();
            $table->string('chassis_no')->unique();
            $table->string('engine_no')->unique();
            $table->string('make'); // Toyota, Honda, Suzuki, KIA, Hyundai, etc.
            $table->string('model'); // Fortuner, Civic, Cultus, Sportage, etc.
            $table->string('variant')->nullable(); // Sigma 4, RS Turbo, VXL, etc.
            $table->integer('model_year');
            $table->string('color');
            $table->string('fuel_type')->default('Petrol'); // Petrol, Diesel, Hybrid, EV
            $table->string('transmission')->default('Automatic'); // Automatic, Manual
            $table->integer('engine_capacity_cc')->nullable();
            $table->integer('mileage_km')->default(0);
            $table->string('registration_city')->default('Islamabad');
            $table->string('assembly')->default('Local'); // Local, Imported
            
            // Ownership Segregation
            $table->enum('ownership_type', ['Showroom', 'Client', 'Investor'])->default('Showroom');
            $table->string('owner_name')->nullable();
            $table->string('owner_phone')->nullable();
            $table->string('owner_cnic')->nullable();
            $table->decimal('owner_payable', 15, 2)->default(0.00);
            $table->decimal('investor_profit_share_pct', 5, 2)->default(0.00);

            // Financial Pricing & Valuation
            $table->decimal('cost_price', 15, 2)->default(0.00);
            $table->decimal('demand_price', 15, 2)->default(0.00);
            $table->decimal('minimum_price', 15, 2)->default(0.00);
            $table->decimal('sale_price', 15, 2)->nullable();
            $table->decimal('total_expenses', 15, 2)->default(0.00); // Capitalized repair/detailing

            // Floor Status
            $table->enum('status', ['Available', 'Reserved', 'Sold', 'In Refurbishment'])->default('Available');
            $table->text('condition_notes')->nullable();
            $table->string('primary_image')->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('sale_date')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('vehicle_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->string('image_path');
            $table->string('caption')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        Schema::create('vehicle_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->string('document_type'); // Registration Book, Smart Card, Original File, NOC, Biometric, Excise Return
            $table->string('file_path');
            $table->string('document_no')->nullable();
            $table->string('status')->default('Verified'); // Verified, Pending, Missing
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_documents');
        Schema::dropIfExists('vehicle_images');
        Schema::dropIfExists('vehicles');
    }
};
