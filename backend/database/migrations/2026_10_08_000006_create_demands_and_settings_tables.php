<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demand_leads', function (Blueprint $table) {
            $table->id();
            $table->string('demand_no')->unique(); // DMD-2026-001
            $table->string('customer');
            $table->string('phone');
            $table->string('city')->default('Islamabad');
            $table->string('make');
            $table->string('model');
            $table->string('variant')->nullable();
            $table->integer('min_year')->default(2020);
            $table->integer('max_year')->default(2026);
            $table->decimal('budget', 15, 2)->default(0.00);
            $table->string('color')->default('Any');
            $table->string('transmission')->default('Automatic');
            $table->string('fuel_type')->default('Petrol');
            $table->integer('max_mileage_km')->default(60000);
            $table->text('notes')->nullable();
            $table->enum('status', ['Active', 'Matched', 'Purchased', 'Closed'])->default('Active');
            $table->foreignId('matched_vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->string('matched_vehicle_summary')->nullable();
            $table->date('date');
            $table->timestamps();
        });

        Schema::create('showroom_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, json, boolean, integer
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('showroom_settings');
        Schema::dropIfExists('demand_leads');
    }
};
