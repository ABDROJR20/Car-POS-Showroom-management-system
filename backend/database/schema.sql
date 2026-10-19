-- =============================================================================
-- AHSAN AUTOS POS & CAR SHOWROOM MANAGEMENT SYSTEM
-- MySQL Database Schema & Initial Production Seed Data
-- Database Name: `ahsan_autos_pos`
-- Charset: utf8mb4_unicode_ci
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `ahsan_autos_pos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ahsan_autos_pos`;

-- -----------------------------------------------------------------------------
-- Table structure for `roles`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `permissions` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`),
  UNIQUE KEY `roles_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `users`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint unsigned DEFAULT NULL,
  `role_name` varchar(255) NOT NULL DEFAULT 'Sales Staff',
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `vehicles`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE `vehicles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stock_code` varchar(255) DEFAULT NULL,
  `registration_no` varchar(255) NOT NULL,
  `chassis_no` varchar(255) NOT NULL,
  `engine_no` varchar(255) NOT NULL,
  `make` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `model_year` int NOT NULL,
  `color` varchar(255) NOT NULL,
  `fuel_type` varchar(255) NOT NULL DEFAULT 'Petrol',
  `transmission` varchar(255) NOT NULL DEFAULT 'Automatic',
  `engine_capacity_cc` int DEFAULT NULL,
  `mileage_km` int NOT NULL DEFAULT '0',
  `registration_city` varchar(255) NOT NULL DEFAULT 'Islamabad',
  `assembly` varchar(255) NOT NULL DEFAULT 'Local',
  `ownership_type` enum('Showroom','Client','Investor') NOT NULL DEFAULT 'Showroom',
  `owner_name` varchar(255) DEFAULT NULL,
  `owner_phone` varchar(255) DEFAULT NULL,
  `owner_cnic` varchar(255) DEFAULT NULL,
  `owner_payable` decimal(15,2) NOT NULL DEFAULT '0.00',
  `investor_profit_share_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `cost_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `demand_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `minimum_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `sale_price` decimal(15,2) DEFAULT NULL,
  `total_expenses` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` enum('Available','Reserved','Sold','In Refurbishment') NOT NULL DEFAULT 'Available',
  `condition_notes` text,
  `primary_image` varchar(500) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `sale_date` date DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicles_registration_no_unique` (`registration_no`),
  UNIQUE KEY `vehicles_chassis_no_unique` (`chassis_no`),
  UNIQUE KEY `vehicles_engine_no_unique` (`engine_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `cash_accounts`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `cash_accounts`;
CREATE TABLE `cash_accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `opening_balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `current_balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cash_accounts_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `cash_ledgers`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `cash_ledgers`;
CREATE TABLE `cash_ledgers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `voucher_no` varchar(255) NOT NULL,
  `cash_account_id` bigint unsigned DEFAULT NULL,
  `account_name` varchar(255) NOT NULL DEFAULT 'Main Cash Safe (Counter)',
  `date` date NOT NULL,
  `type` enum('DEBIT','CREDIT') NOT NULL,
  `category` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `running_balance` decimal(15,2) NOT NULL,
  `reference_type` varchar(255) DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `recorded_by` varchar(255) DEFAULT NULL,
  `narration` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cash_ledgers_voucher_no_unique` (`voucher_no`),
  KEY `cash_ledgers_cash_account_id_foreign` (`cash_account_id`),
  CONSTRAINT `cash_ledgers_cash_account_id_foreign` FOREIGN KEY (`cash_account_id`) REFERENCES `cash_accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `expense_categories`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `expense_categories`;
CREATE TABLE `expense_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `is_vehicle_direct` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `expense_categories_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `expenses`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `voucher_no` varchar(255) NOT NULL,
  `expense_category_id` bigint unsigned DEFAULT NULL,
  `category_name` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `paid_to` varchar(255) NOT NULL,
  `account_name` varchar(255) NOT NULL DEFAULT 'Main Cash Safe (Counter)',
  `date` date NOT NULL,
  `is_vehicle_linked` tinyint(1) NOT NULL DEFAULT '0',
  `vehicle_id` bigint unsigned DEFAULT NULL,
  `vehicle_summary` varchar(255) DEFAULT NULL,
  `recorded_by` varchar(255) DEFAULT NULL,
  `narration` text,
  `receipt_attachment` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `expenses_voucher_no_unique` (`voucher_no`),
  KEY `expenses_vehicle_id_foreign` (`vehicle_id`),
  CONSTRAINT `expenses_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `purchases`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `purchases`;
CREATE TABLE `purchases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchase_no` varchar(255) NOT NULL,
  `vehicle_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `seller_name` varchar(255) NOT NULL,
  `seller_phone` varchar(255) NOT NULL,
  `seller_cnic` varchar(255) DEFAULT NULL,
  `seller_city` varchar(255) DEFAULT NULL,
  `seller_address` text,
  `ownership_type` enum('Showroom','Client','Investor') NOT NULL DEFAULT 'Showroom',
  `agreed_purchase_price` decimal(15,2) NOT NULL,
  `token_advance_paid` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_amount_paid` decimal(15,2) NOT NULL DEFAULT '0.00',
  `remaining_payable` decimal(15,2) NOT NULL DEFAULT '0.00',
  `payment_status` enum('TOKEN_ADVANCE','PARTIAL_PAID','PAID_IN_FULL','UNPAID') NOT NULL DEFAULT 'TOKEN_ADVANCE',
  `payment_method` varchar(255) NOT NULL DEFAULT 'Cash',
  `purchase_date` date NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchases_purchase_no_unique` (`purchase_no`),
  KEY `purchases_vehicle_id_foreign` (`vehicle_id`),
  CONSTRAINT `purchases_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `purchase_payments`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `purchase_payments`;
CREATE TABLE `purchase_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `voucher_no` varchar(255) NOT NULL,
  `purchase_id` bigint unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` varchar(255) NOT NULL DEFAULT 'Cash',
  `account_name` varchar(255) NOT NULL DEFAULT 'Main Cash Safe (Counter)',
  `bank_reference` varchar(255) DEFAULT NULL,
  `payment_date` date NOT NULL,
  `recorded_by` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchase_payments_voucher_no_unique` (`voucher_no`),
  KEY `purchase_payments_purchase_id_foreign` (`purchase_id`),
  CONSTRAINT `purchase_payments_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `sales`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_no` varchar(255) NOT NULL,
  `vehicle_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `buyer_name` varchar(255) NOT NULL,
  `buyer_phone` varchar(255) NOT NULL,
  `buyer_cnic` varchar(255) DEFAULT NULL,
  `buyer_city` varchar(255) DEFAULT NULL,
  `buyer_address` text,
  `ownership_type` enum('Showroom','Client','Investor') NOT NULL DEFAULT 'Showroom',
  `cost_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `vehicle_expenses` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_vehicle_cost` decimal(15,2) NOT NULL DEFAULT '0.00',
  `negotiated_price` decimal(15,2) NOT NULL,
  `transfer_fee` decimal(15,2) NOT NULL DEFAULT '0.00',
  `extra_charges` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `net_sale_price` decimal(15,2) NOT NULL,
  `amount_received` decimal(15,2) NOT NULL DEFAULT '0.00',
  `remaining_balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `payment_status` enum('TOKEN_ADVANCE','PARTIAL_PAID','PAID_IN_FULL','UNPAID') NOT NULL DEFAULT 'TOKEN_ADVANCE',
  `payment_method` varchar(255) NOT NULL DEFAULT 'Cash',
  `showroom_commission` decimal(15,2) NOT NULL DEFAULT '0.00',
  `broker_commission` decimal(15,2) NOT NULL DEFAULT '0.00',
  `broker_name` varchar(255) DEFAULT NULL,
  `broker_phone` varchar(255) DEFAULT NULL,
  `agent_commission` decimal(15,2) NOT NULL DEFAULT '0.00',
  `agent_name` varchar(255) DEFAULT NULL,
  `gross_profit` decimal(15,2) NOT NULL DEFAULT '0.00',
  `owner_payable` decimal(15,2) NOT NULL DEFAULT '0.00',
  `showroom_net_earnings` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` enum('COMPLETED','VOIDED','REFUNDED') NOT NULL DEFAULT 'COMPLETED',
  `sale_date` date NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `terms_and_conditions` text,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_invoice_no_unique` (`invoice_no`),
  KEY `sales_vehicle_id_foreign` (`vehicle_id`),
  CONSTRAINT `sales_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `sale_payments`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `sale_payments`;
CREATE TABLE `sale_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `receipt_no` varchar(255) NOT NULL,
  `sale_id` bigint unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` varchar(255) NOT NULL DEFAULT 'Cash',
  `account_name` varchar(255) NOT NULL DEFAULT 'Main Cash Safe (Counter)',
  `bank_reference` varchar(255) DEFAULT NULL,
  `payment_date` date NOT NULL,
  `received_by` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sale_payments_receipt_no_unique` (`receipt_no`),
  KEY `sale_payments_sale_id_foreign` (`sale_id`),
  CONSTRAINT `sale_payments_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `commissions`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `commissions`;
CREATE TABLE `commissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `voucher_no` varchar(255) NOT NULL,
  `sale_id` bigint unsigned NOT NULL,
  `vehicle_id` bigint unsigned DEFAULT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `party_type` enum('SHOWROOM','BROKER','SALES_AGENT') NOT NULL DEFAULT 'BROKER',
  `amount` decimal(15,2) NOT NULL,
  `status` enum('PENDING','PAID') NOT NULL DEFAULT 'PENDING',
  `date` date NOT NULL,
  `paid_date` date DEFAULT NULL,
  `payment_account` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commissions_voucher_no_unique` (`voucher_no`),
  KEY `commissions_sale_id_foreign` (`sale_id`),
  CONSTRAINT `commissions_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `demand_leads`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `demand_leads`;
CREATE TABLE `demand_leads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `demand_no` varchar(255) NOT NULL,
  `customer` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL DEFAULT 'Islamabad',
  `make` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `min_year` int NOT NULL DEFAULT '2020',
  `max_year` int NOT NULL DEFAULT '2026',
  `budget` decimal(15,2) NOT NULL DEFAULT '0.00',
  `color` varchar(255) NOT NULL DEFAULT 'Any',
  `transmission` varchar(255) NOT NULL DEFAULT 'Automatic',
  `fuel_type` varchar(255) NOT NULL DEFAULT 'Petrol',
  `max_mileage_km` int NOT NULL DEFAULT '60000',
  `notes` text,
  `status` enum('Active','Matched','Purchased','Closed') NOT NULL DEFAULT 'Active',
  `matched_vehicle_id` bigint unsigned DEFAULT NULL,
  `matched_vehicle_summary` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `demand_leads_demand_no_unique` (`demand_no`),
  KEY `demand_leads_matched_vehicle_id_foreign` (`matched_vehicle_id`),
  CONSTRAINT `demand_leads_matched_vehicle_id_foreign` FOREIGN KEY (`matched_vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table structure for `showroom_settings`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `showroom_settings`;
CREATE TABLE `showroom_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text,
  `type` varchar(255) NOT NULL DEFAULT 'string',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `showroom_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- SEED DATA INSERTION
-- -----------------------------------------------------------------------------

INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `permissions`) VALUES
(1, 'Admin', 'admin', 'Owner & Full Showroom Administrator', '[\"*\"]'),
(2, 'Manager', 'manager', 'Showroom Operations & Deal Closer Manager', '[\"pos:access\", \"pos:sell\", \"inventory:view\", \"inventory:add\", \"inventory:edit\", \"inventory:view_cost\", \"purchases:view\", \"purchases:create\", \"demands:manage\", \"finance:view_summary\", \"reports:view\", \"commissions:view\", \"commissions:pay\"]'),
(3, 'Sales Staff', 'sales-staff', 'Floor Sales Representative & Booking Agent', '[\"pos:access\", \"pos:sell\", \"inventory:view\", \"demands:manage\", \"customers:view\", \"customers:create\"]'),
(4, 'Accountant', 'accountant', 'Financial Auditor & Cash Ledger Controller', '[\"finance:manage\", \"ledger:view\", \"ledger:entry\", \"expenses:manage\", \"reports:view\", \"reports:export\", \"inventory:view\", \"inventory:view_cost\", \"purchases:view\", \"sales:view\", \"commissions:manage\"]');

-- Password for all seed users is 'admin123' / 'manager123' / 'sales123' / 'accountant123' (bcrypt hashed)
INSERT INTO `users` (`id`, `name`, `email`, `username`, `phone`, `password`, `role_id`, `role_name`, `status`, `avatar`) VALUES
(1, 'Muhammad Ahsan (Owner)', 'admin@ahsanautos.pk', 'admin', '+92 300 1234567', '$2y$12$R.79u54k243WkGz815vjSuw8Q9H1m8/j6a5wK62Wz9XbL.6yN4aTe', 1, 'Admin', 'Active', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80'),
(2, 'Kashif Mehmood', 'manager@ahsanautos.pk', 'manager', '+92 321 9876543', '$2y$12$R.79u54k243WkGz815vjSuw8Q9H1m8/j6a5wK62Wz9XbL.6yN4aTe', 2, 'Manager', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'),
(3, 'Hamza Ali Khan', 'sales@ahsanautos.pk', 'sales', '+92 333 4567890', '$2y$12$R.79u54k243WkGz815vjSuw8Q9H1m8/j6a5wK62Wz9XbL.6yN4aTe', 3, 'Sales Staff', 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'),
(4, 'Abdul Rehman CA', 'accountant@ahsanautos.pk', 'accountant', '+92 345 6789012', '$2y$12$R.79u54k243WkGz815vjSuw8Q9H1m8/j6a5wK62Wz9XbL.6yN4aTe', 4, 'Accountant', 'Active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80');

INSERT INTO `cash_accounts` (`id`, `name`, `type`, `bank_name`, `account_number`, `opening_balance`, `current_balance`, `is_active`) VALUES
(1, 'Main Cash Safe (Counter)', 'CASH_SAFE', NULL, NULL, 2500000.00, 2500000.00, 1),
(2, 'Meezan Bank (PK76MEZN00012345678901)', 'BANK_ACCOUNT', 'Meezan Bank Ltd', '010203040506', 8500000.00, 8500000.00, 1),
(3, 'Habib Bank HBL (PK12HABB009988776655)', 'BANK_ACCOUNT', 'Habib Bank Limited', '998877665544', 4200000.00, 4200000.00, 1);

INSERT INTO `cash_ledgers` (`id`, `voucher_no`, `cash_account_id`, `account_name`, `date`, `type`, `category`, `amount`, `running_balance`, `recorded_by`, `narration`) VALUES
(1, 'LED-2026-001', 1, 'Main Cash Safe (Counter)', '2026-10-01', 'DEBIT', 'CAPITAL_INJECTION', 2500000.00, 2500000.00, 'Muhammad Ahsan (Owner)', 'Fiscal Year 2026-27 Showroom Cash Safe Opening Liquidity Float');

INSERT INTO `vehicles` (`id`, `stock_code`, `registration_no`, `chassis_no`, `engine_no`, `make`, `model`, `variant`, `model_year`, `color`, `fuel_type`, `transmission`, `engine_capacity_cc`, `mileage_km`, `registration_city`, `assembly`, `ownership_type`, `owner_name`, `owner_phone`, `owner_cnic`, `owner_payable`, `investor_profit_share_pct`, `cost_price`, `demand_price`, `minimum_price`, `sale_price`, `total_expenses`, `status`, `condition_notes`, `primary_image`, `purchase_date`, `sale_date`) VALUES
(1, 'STK-2026-001', 'ICT-23-9001', 'GUN156-9028341', '1GD-FTV-89412', 'Toyota', 'Fortuner', 'Sigma 4 (2.8 Diesel 4x4)', 2023, 'Attitude Black', 'Diesel', 'Automatic', 2755, 24000, 'Islamabad', 'Local', 'Showroom', NULL, NULL, NULL, 0.00, 0.00, 17200000.00, 18600000.00, 18100000.00, NULL, 180000.00, 'Available', 'Bumper to bumper 100% original. First owner driven in Islamabad diplomat enclave. Ceramic coated.', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80', '2026-09-15', NULL),
(2, 'STK-2026-002', 'LEA-22-3412', 'FE1-801294', 'L15B7-561298', 'Honda', 'Civic', 'RS Turbo 1.5 VTEC', 2022, 'Meteoroid Grey Metallic', 'Petrol', 'Automatic', 1498, 31000, 'Lahore', 'Local', 'Client', 'Chaudhry Nadeem Akhtar', '+92 300 8472910', '35201-1294819-3', 8100000.00, 0.00, 8100000.00, 8600000.00, 8350000.00, NULL, 45000.00, 'Available', 'Sunroof, red-stitched leather interior, brand new Michelin Primacy tyres. Left rear fender minor spray.', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop&q=80', '2026-09-22', NULL),
(3, 'STK-2026-003', 'ISB-24-7788', 'NZE161-401928', '1NZ-FE-772190', 'Toyota', 'Corolla', 'Altis Grande 1.8 CVT-i', 2024, 'Super White', 'Petrol', 'Automatic', 1798, 8500, 'Islamabad', 'Local', 'Showroom', NULL, NULL, NULL, 0.00, 0.00, 7450000.00, 7850000.00, 7650000.00, NULL, 25000.00, 'Available', 'Like zero meter, invoice on delivery, smart card verified, paddle shifters, sunroof, genuine fragrance.', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80', '2026-10-01', NULL),
(4, 'STK-2026-004', 'RWP-21-5544', 'NQ-30918274', 'G4KD-662910', 'KIA', 'Sportage', 'AWD 2.0 Alpha-Tech', 2021, 'Panthera Metal', 'Petrol', 'Automatic', 1999, 48000, 'Rawalpindi', 'Local', 'Investor', 'Syed Faisal Bukhari (Dubai Investor Syndicate)', '+92 334 5192837', NULL, 0.00, 60.00, 6200000.00, 6700000.00, 6450000.00, NULL, 75000.00, 'Available', 'Panoramic sunroof, electronic handbrake, power tailgate. Complete service history from KIA Motors I-9 Islamabad.', 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80', '2026-09-10', NULL),
(5, 'STK-2026-005', 'KHI-23-1122', 'K10B-902184', 'K10B-1129384', 'Suzuki', 'Cultus', 'VXL (Auto Gear Shift)', 2023, 'Silky Silver', 'Petrol', 'Automatic', 998, 19000, 'Karachi', 'Local', 'Showroom', NULL, NULL, NULL, 0.00, 0.00, 3550000.00, 3850000.00, 3700000.00, 3800000.00, 35000.00, 'Sold', 'First owner, fuel average 19 km/L in city, ABS brakes, alloy wheels. Sold on 2026-10-04.', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80', '2026-09-01', '2026-10-04');

INSERT INTO `demand_leads` (`id`, `demand_no`, `customer`, `phone`, `city`, `make`, `model`, `variant`, `min_year`, `max_year`, `budget`, `color`, `transmission`, `fuel_type`, `max_mileage_km`, `notes`, `status`, `matched_vehicle_id`, `matched_vehicle_summary`, `date`) VALUES
(1, 'DMD-2026-001', 'Haji Bilal Aslam', '+92 300 1122334', 'Islamabad', 'Toyota', 'Fortuner', 'Sigma 4 (2.8 Diesel)', 2022, 2024, 18500000.00, 'Attitude Black', 'Automatic', 'Diesel', 35000, 'Looking for total genuine bumper to bumper car with smart card on hand. Urgent buyer.', 'Matched', 1, 'Toyota Fortuner Sigma 4 (2023) • ICT-23-9001', '2026-10-06');

INSERT INTO `showroom_settings` (`key`, `value`, `type`) VALUES
('showroomName', 'Ahsan Autos', 'string'),
('tagline', 'Specialized Used Car Showroom & POS Management', 'string'),
('phone', '+92 300 1234567', 'string'),
('whatsapp', '+92 313 2066883', 'string'),
('email', 'contact@ahsanautos.pk', 'string'),
('ntn', 'NTN-7861122-9', 'string'),
('strn', 'STRN-09-12-3456-789', 'string'),
('address', 'Main IJP Road, Near Faizabad Interchange, Islamabad / Rawalpindi, Pakistan', 'string'),
('currency', 'PKR', 'string'),
('currencySymbol', '₨', 'string'),
('taxRatePct', '0', 'string'),
('defaultTransferFee', '25000', 'string'),
('defaultBrokerFeePct', '1.0', 'string'),
('defaultAgentCommission', '15000', 'string'),
('receiptFooter', 'Powered By Rojrztech\n03132066883 / 03151210736\nwebsite: Rojrztech.com', 'string'),
('enableWhatsAppSharing', 'true', 'string'),
('enableAutoMatcher', 'true', 'string');
