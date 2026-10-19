<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Vehicle;
use App\Models\CashAccount;
use App\Models\ExpenseCategory;
use App\Models\Expense;
use App\Models\DemandLead;
use App\Models\ShowroomSetting;
use App\Models\CashLedger;

class ShowroomSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions
        $adminRole = Role::create([
            'name' => 'Admin',
            'slug' => 'admin',
            'description' => 'Owner & Full Showroom Administrator with unrestricted financial & system access',
            'permissions' => ['*'],
        ]);

        $managerRole = Role::create([
            'name' => 'Manager',
            'slug' => 'manager',
            'description' => 'Showroom Operations & Deal Closer Manager',
            'permissions' => [
                'pos:access', 'pos:sell', 'inventory:view', 'inventory:add', 'inventory:edit',
                'inventory:view_cost', 'purchases:view', 'purchases:create', 'demands:manage',
                'finance:view_summary', 'reports:view', 'commissions:view', 'commissions:pay'
            ],
        ]);

        $salesRole = Role::create([
            'name' => 'Sales Staff',
            'slug' => 'sales-staff',
            'description' => 'Floor Sales Representative & Booking Agent',
            'permissions' => [
                'pos:access', 'pos:sell', 'inventory:view', 'demands:manage',
                'customers:view', 'customers:create'
            ],
        ]);

        $accountantRole = Role::create([
            'name' => 'Accountant',
            'slug' => 'accountant',
            'description' => 'Financial Auditor & Cash Ledger Controller',
            'permissions' => [
                'finance:manage', 'ledger:view', 'ledger:entry', 'expenses:manage',
                'reports:view', 'reports:export', 'inventory:view', 'inventory:view_cost',
                'purchases:view', 'sales:view', 'commissions:manage'
            ],
        ]);

        // 2. Users
        User::create([
            'name' => 'Muhammad Ahsan (Owner)',
            'email' => 'admin@ahsanautos.pk',
            'username' => 'admin',
            'phone' => '+92 300 1234567',
            'password' => Hash::make('admin123'),
            'role_id' => $adminRole->id,
            'role_name' => 'Admin',
            'status' => 'Active',
            'avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
        ]);

        User::create([
            'name' => 'Kashif Mehmood',
            'email' => 'manager@ahsanautos.pk',
            'username' => 'manager',
            'phone' => '+92 321 9876543',
            'password' => Hash::make('manager123'),
            'role_id' => $managerRole->id,
            'role_name' => 'Manager',
            'status' => 'Active',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        ]);

        User::create([
            'name' => 'Hamza Ali Khan',
            'email' => 'sales@ahsanautos.pk',
            'username' => 'sales',
            'phone' => '+92 333 4567890',
            'password' => Hash::make('sales123'),
            'role_id' => $salesRole->id,
            'role_name' => 'Sales Staff',
            'status' => 'Active',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        ]);

        User::create([
            'name' => 'Abdul Rehman CA',
            'email' => 'accountant@ahsanautos.pk',
            'username' => 'accountant',
            'phone' => '+92 345 6789012',
            'password' => Hash::make('accountant123'),
            'role_id' => $accountantRole->id,
            'role_name' => 'Accountant',
            'status' => 'Active',
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        ]);

        // 3. Cash Accounts
        $safe = CashAccount::create([
            'name' => 'Main Cash Safe (Counter)',
            'type' => 'CASH_SAFE',
            'opening_balance' => 2500000.00,
            'current_balance' => 2500000.00,
            'is_active' => true,
        ]);

        CashAccount::create([
            'name' => 'Meezan Bank (PK76MEZN00012345678901)',
            'type' => 'BANK_ACCOUNT',
            'bank_name' => 'Meezan Bank Ltd',
            'account_number' => '010203040506',
            'opening_balance' => 8500000.00,
            'current_balance' => 8500000.00,
            'is_active' => true,
        ]);

        CashAccount::create([
            'name' => 'Habib Bank HBL (PK12HABB009988776655)',
            'type' => 'BANK_ACCOUNT',
            'bank_name' => 'Habib Bank Limited',
            'account_number' => '998877665544',
            'opening_balance' => 4200000.00,
            'current_balance' => 4200000.00,
            'is_active' => true,
        ]);

        // 4. Initial Cash Ledger Entry
        CashLedger::create([
            'voucher_no' => 'LED-2026-001',
            'cash_account_id' => $safe->id,
            'account_name' => $safe->name,
            'date' => '2026-10-01',
            'type' => 'DEBIT',
            'category' => 'CAPITAL_INJECTION',
            'amount' => 2500000.00,
            'running_balance' => 2500000.00,
            'recorded_by' => 'Muhammad Ahsan (Owner)',
            'narration' => 'Fiscal Year 2026-27 Showroom Cash Safe Opening Liquidity Float',
        ]);

        // 5. Expense Categories
        $categories = [
            ['name' => 'Vehicle Repair & Mechanical', 'description' => 'Engine tuning, suspension overhaul, brakes, fluids', 'is_vehicle_direct' => true],
            ['name' => 'Body & Paint (Denting/Painting)', 'description' => 'Bumper repaint, touchups, dry denting', 'is_vehicle_direct' => true],
            ['name' => 'Car Detailing & Ceramic Coating', 'description' => 'Interior dry cleaning, compounding, ceramic polish', 'is_vehicle_direct' => true],
            ['name' => 'Showroom Rent & Property Tax', 'description' => 'Monthly facility lease and municipal property charges', 'is_vehicle_direct' => false],
            ['name' => 'Electricity & Utilities (WAPDA / SNGPL)', 'description' => 'Commercial power supply, generator fuel & backup', 'is_vehicle_direct' => false],
            ['name' => 'Staff Salaries & Welfare', 'description' => 'Guards, cleaners, tea-boy and showroom staff payroll', 'is_vehicle_direct' => false],
            ['name' => 'Tea, Refreshments & Customer Entertainment', 'description' => 'Daily bakery, tea, coffee and mineral water for showroom visitors', 'is_vehicle_direct' => false],
            ['name' => 'Marketing, PakWheels Ads & Photography', 'description' => 'Social media ads, PakWheels featured listings, drone shoot', 'is_vehicle_direct' => false],
        ];

        foreach ($categories as $cat) {
            ExpenseCategory::create($cat);
        }

        // 6. Vehicles Fleet
        $vehicles = [
            [
                'stock_code' => 'STK-2026-001',
                'registration_no' => 'ICT-23-9001',
                'chassis_no' => 'GUN156-9028341',
                'engine_no' => '1GD-FTV-89412',
                'make' => 'Toyota',
                'model' => 'Fortuner',
                'variant' => 'Sigma 4 (2.8 Diesel 4x4)',
                'model_year' => 2023,
                'color' => 'Attitude Black',
                'fuel_type' => 'Diesel',
                'transmission' => 'Automatic',
                'engine_capacity_cc' => 2755,
                'mileage_km' => 24000,
                'registration_city' => 'Islamabad',
                'assembly' => 'Local',
                'ownership_type' => 'Showroom',
                'cost_price' => 17200000.00,
                'demand_price' => 18600000.00,
                'minimum_price' => 18100000.00,
                'total_expenses' => 180000.00,
                'status' => 'Available',
                'condition_notes' => 'Bumper to bumper 100% original. First owner driven in Islamabad diplomat enclave. Ceramic coated.',
                'primary_image' => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
                'purchase_date' => '2026-09-15',
            ],
            [
                'stock_code' => 'STK-2026-002',
                'registration_no' => 'LEA-22-3412',
                'chassis_no' => 'FE1-801294',
                'engine_no' => 'L15B7-561298',
                'make' => 'Honda',
                'model' => 'Civic',
                'variant' => 'RS Turbo 1.5 VTEC',
                'model_year' => 2022,
                'color' => 'Meteoroid Grey Metallic',
                'fuel_type' => 'Petrol',
                'transmission' => 'Automatic',
                'engine_capacity_cc' => 1498,
                'mileage_km' => 31000,
                'registration_city' => 'Lahore',
                'assembly' => 'Local',
                'ownership_type' => 'Client',
                'owner_name' => 'Chaudhry Nadeem Akhtar',
                'owner_phone' => '+92 300 8472910',
                'owner_cnic' => '35201-1294819-3',
                'owner_payable' => 8100000.00,
                'cost_price' => 8100000.00,
                'demand_price' => 8600000.00,
                'minimum_price' => 8350000.00,
                'total_expenses' => 45000.00,
                'status' => 'Available',
                'condition_notes' => 'Sunroof, red-stitched leather interior, brand new Michelin Primacy tyres. Left rear fender minor spray.',
                'primary_image' => 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop&q=80',
                'purchase_date' => '2026-09-22',
            ],
            [
                'stock_code' => 'STK-2026-003',
                'registration_no' => 'ISB-24-7788',
                'chassis_no' => 'NZE161-401928',
                'engine_no' => '1NZ-FE-772190',
                'make' => 'Toyota',
                'model' => 'Corolla',
                'variant' => 'Altis Grande 1.8 CVT-i',
                'model_year' => 2024,
                'color' => 'Super White',
                'fuel_type' => 'Petrol',
                'transmission' => 'Automatic',
                'engine_capacity_cc' => 1798,
                'mileage_km' => 8500,
                'registration_city' => 'Islamabad',
                'assembly' => 'Local',
                'ownership_type' => 'Showroom',
                'cost_price' => 7450000.00,
                'demand_price' => 7850000.00,
                'minimum_price' => 7650000.00,
                'total_expenses' => 25000.00,
                'status' => 'Available',
                'condition_notes' => 'Like zero meter, invoice on delivery, smart card verified, paddle shifters, sunroof, genuine fragrance.',
                'primary_image' => 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80',
                'purchase_date' => '2026-10-01',
            ],
            [
                'stock_code' => 'STK-2026-004',
                'registration_no' => 'RWP-21-5544',
                'chassis_no' => 'NQ-30918274',
                'engine_no' => 'G4KD-662910',
                'make' => 'KIA',
                'model' => 'Sportage',
                'variant' => 'AWD 2.0 Alpha-Tech',
                'model_year' => 2021,
                'color' => 'Panthera Metal',
                'fuel_type' => 'Petrol',
                'transmission' => 'Automatic',
                'engine_capacity_cc' => 1999,
                'mileage_km' => 48000,
                'registration_city' => 'Rawalpindi',
                'assembly' => 'Local',
                'ownership_type' => 'Investor',
                'owner_name' => 'Syed Faisal Bukhari (Dubai Investor Syndicate)',
                'owner_phone' => '+92 334 5192837',
                'investor_profit_share_pct' => 60.00,
                'cost_price' => 6200000.00,
                'demand_price' => 6700000.00,
                'minimum_price' => 6450000.00,
                'total_expenses' => 75000.00,
                'status' => 'Available',
                'condition_notes' => 'Panoramic sunroof, electronic handbrake, power tailgate. Complete service history from KIA Motors I-9 Islamabad.',
                'primary_image' => 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
                'purchase_date' => '2026-09-10',
            ],
            [
                'stock_code' => 'STK-2026-005',
                'registration_no' => 'KHI-23-1122',
                'chassis_no' => 'K10B-902184',
                'engine_no' => 'K10B-1129384',
                'make' => 'Suzuki',
                'model' => 'Cultus',
                'variant' => 'VXL (Auto Gear Shift)',
                'model_year' => 2023,
                'color' => 'Silky Silver',
                'fuel_type' => 'Petrol',
                'transmission' => 'Automatic',
                'engine_capacity_cc' => 998,
                'mileage_km' => 19000,
                'registration_city' => 'Karachi',
                'assembly' => 'Local',
                'ownership_type' => 'Showroom',
                'cost_price' => 3550000.00,
                'demand_price' => 3850000.00,
                'minimum_price' => 3700000.00,
                'total_expenses' => 35000.00,
                'status' => 'Sold',
                'sale_price' => 3800000.00,
                'condition_notes' => 'First owner, fuel average 19 km/L in city, ABS brakes, alloy wheels. Sold on 2026-10-04.',
                'primary_image' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
                'purchase_date' => '2026-09-01',
                'sale_date' => '2026-10-04',
            ],
        ];

        foreach ($vehicles as $v) {
            Vehicle::create($v);
        }

        // 7. Demands
        DemandLead::create([
            'demand_no' => 'DMD-2026-001',
            'customer' => 'Haji Bilal Aslam',
            'phone' => '+92 300 1122334',
            'city' => 'Islamabad',
            'make' => 'Toyota',
            'model' => 'Fortuner',
            'variant' => 'Sigma 4 (2.8 Diesel)',
            'min_year' => 2022,
            'max_year' => 2024,
            'budget' => 18500000.00,
            'color' => 'Attitude Black',
            'transmission' => 'Automatic',
            'fuel_type' => 'Diesel',
            'max_mileage_km' => 35000,
            'notes' => 'Looking for total genuine bumper to bumper car with smart card on hand. Urgent buyer.',
            'status' => 'Matched',
            'matched_vehicle_id' => 1,
            'matched_vehicle_summary' => 'Toyota Fortuner Sigma 4 (2023) • ICT-23-9001',
            'date' => '2026-10-06',
        ]);

        // 8. Settings
        $settings = [
            'showroomName' => 'Ahsan Autos',
            'tagline' => 'Specialized Used Car Showroom & POS Management',
            'phone' => '+92 300 1234567',
            'whatsapp' => '+92 313 2066883',
            'email' => 'contact@ahsanautos.pk',
            'ntn' => 'NTN-7861122-9',
            'strn' => 'STRN-09-12-3456-789',
            'address' => 'Main IJP Road, Near Faizabad Interchange, Islamabad / Rawalpindi, Pakistan',
            'currency' => 'PKR',
            'currencySymbol' => '₨',
            'taxRatePct' => '0',
            'defaultTransferFee' => '25000',
            'defaultBrokerFeePct' => '1.0',
            'defaultAgentCommission' => '15000',
            'receiptFooter' => "Powered By Rojrztech\n03132066883 / 03151210736\nwebsite: Rojrztech.com",
            'enableWhatsAppSharing' => 'true',
            'enableAutoMatcher' => 'true',
        ];

        foreach ($settings as $k => $val) {
            ShowroomSetting::create(['key' => $k, 'value' => $val, 'type' => 'string']);
        }
    }
}
