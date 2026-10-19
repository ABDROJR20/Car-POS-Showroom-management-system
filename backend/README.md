# 🏎️ Ahsan Autos POS — Laravel 11 Backend & MySQL Engine

> **Enterprise REST API Backend & High-Concurrency MySQL Database Engine**  
> Custom-built for **Ahsan Autos Used Car Showroom POS & Dealership Management System**.

[![Laravel 11](https://img.shields.io/badge/Framework-Laravel%2011-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP 8.2+](https://img.shields.io/badge/Language-PHP%208.2%2B-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![Sanctum](https://img.shields.io/badge/Auth-Laravel%20Sanctum%204-red?style=for-the-badge)](https://laravel.com/docs/11.x/sanctum)
[![MySQL 8](https://img.shields.io/badge/Database-MySQL%208-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)

---

## 📌 Engine Highlights & Architecture

The backend engine provides the financial backbone, double-entry ledger security, vehicle fleet lifecycle management, and automotive business intelligence (BI) reporting for Ahsan Autos.

Key architectural features include:
- **ACID Database Transactions (`DB::transaction`)**: Every deal closing, payment recording, and sale voiding executes atomically. If any part fails, the entire transaction rolls back cleanly.
- **Strict Vehicle Status Lifecycle Isolation**:
  - `Available` ➔ Car is active on the sales floor.
  - `Reserved` ➔ Token advance received, hidden from public checkout.
  - `Sold` ➔ Deal closed, ownership transferred, removed from active floor.
  - `In Refurbishment` ➔ In workshop (denting, paint, detailing).
- **Physical Cash Drawer Float Formula**:
  $$\text{Cash in Hand} = \text{Opening Float} + \text{Inward Debits (Sales / Tokens)} - \text{Outward Credits (Purchases / Expenses / Payouts)}$$
- **Refurbishment Expense Capitalization**: Mechanical, detailing, and touch-up expenses can be tagged directly to a vehicle's `vehicle_id`, which immediately updates the vehicle's `total_expenses` and increases `total_vehicle_cost`.
- **20 Pre-Computed Specialized Automotive BI Reports**: Real-time sales velocity, aging analysis, profit and loss, EBITDA, and broker commissions.

---

## 🏗️ Relational Database Schema (16 Relational Models)

```text
roles
 ├── users (One-to-Many)
 └── permissions (JSON field: wildcard or scoped)

vehicles
 ├── purchases (One-to-Many / Inward Acquisition)
 │    └── purchase_payments (Vouchers)
 ├── sales (One-to-Many / Deal Closures)
 │    ├── sale_payments (Receipts)
 │    └── commissions (Showroom, Broker, Sales Staff)
 ├── expenses (Vehicle Refurbishment Cost Capitalization)
 ├── vehicle_images (Gallery URLs)
 └── vehicle_documents (Digital Vault: Smart Card, NOC, Biometric)

cash_accounts (Main Cash Safe, Meezan Bank, HBL)
 └── cash_ledgers (Running Balance Journal Vouchers)

demand_leads (Customer buying leads matched with vehicles)
showroom_settings (Custom identity, tax rates, Rojrztech branding)
```

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- **PHP** `>= 8.2` (with extensions: `pdo_mysql`, `openssl`, `mbstring`, `curl`)
- **Composer** (v2.x)
- **MySQL** (v8.0+ or MariaDB 10.4+) running on port `3306`

---

### 2. Configure Environment (`.env`)
Copy the environment template and verify your database credentials:
```bash
copy .env.example .env
```
Ensure your database parameters in `.env` match your local MySQL server:
```env
APP_NAME="Ahsan Autos POS"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=Asia/Karachi
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ahsan_autos_pos
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

### 3. Database Initialization (Choose Method A or B)

#### Method A: Laravel Migrations & Showroom Seeder (Recommended)
```bash
# 1. Install Composer dependencies
composer install

# 2. Generate Application Key
php artisan key:generate

# 3. Create tables and seed Pakistani showroom records
php artisan migrate:fresh --seed
```

#### Method B: Direct MySQL SQL Import
If you prefer running pure SQL without artisan:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ahsan_autos_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p ahsan_autos_pos < database/schema.sql
```

---

### 4. Launch Backend API Server
```bash
php artisan serve --port=8000
```
- API Endpoint Base URL: **`http://localhost:8000/api/v1`**
- System Health Check: **`http://localhost:8000/api/v1/health`**

---

## 🔑 Default Seed Credentials (Pakistani Showroom Roles)

All pre-seeded test accounts use the password pattern `<role>123`:

| Role | Username | Password | Role Description & Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full unrestricted wildcard permissions (`*`), P&L, system configuration, user manager |
| **Manager** | `manager` | `manager123` | Deals closer, floor inventory manager, purchase contracts, commission disbursements |
| **Sales Staff** | `sales` | `sales123` | Floor sales terminal, bookings, customer leads catalog (Cost prices masked) |
| **Accountant** | `accountant` | `accountant123` | Cash safe ledger, expense vouchers, BI audits, payouts (Vehicle deletion blocked) |

---

## 📡 REST API Route Catalog (`/api/v1`)

### 1. Authentication & Identity
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | User login & Sanctum Bearer token generation |
| `GET` | `/auth/me` | Current authenticated user context & permissions |
| `POST` | `/auth/logout` | Revoke current user Bearer token |
| `GET` | `/users` | List showroom staff members |
| `GET` | `/roles` | List available RBAC roles |

### 2. Vehicle Fleet & Floor Inventory
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/vehicles` | Paginated fleet list (filterable by make, status, ownership) |
| `POST` | `/vehicles` | Create new vehicle record with 6-seals condition specs |
| `GET` | `/vehicles/{id}` | Complete 360° vehicle dossier with media & documents |
| `PUT` | `/vehicles/{id}` | Update vehicle specifications or price demand |
| `DELETE` | `/vehicles/{id}` | Soft delete vehicle from showroom |
| `POST` | `/vehicles/{id}/image` | Upload vehicle gallery photo |
| `POST` | `/vehicles/{id}/document` | Upload digital document (Smart Card / NOC / Biometric) |

### 3. Inward Vehicle Acquisitions (Purchases)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/purchases` | Inward vehicle acquisition deeds register |
| `POST` | `/purchases` | Create purchase contract, token advance & ledger debit |
| `GET` | `/purchases/{id}` | Purchase deed breakdown with payment schedule |
| `POST` | `/purchases/{id}/payment`| Record subsequent installment payment against purchase |

### 4. Sales Orders & Atomic Deal Closures
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/sales` | Sales orders register with customer & financial breakdown |
| `POST` | `/sales` | Atomic deal closing: generate invoice, deduct stock, credit cash |
| `GET` | `/sales/{id}` | Detailed sale order with receipts and commission schedule |
| `POST` | `/sales/{id}/payment` | Record buyer balance payment |
| `POST` | `/sales/{id}/void` | Void sale: atomically restore vehicle and reverse journal entries |

### 5. Multi-Tier Commissions & Payouts
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/commissions` | All showroom, broker, and sales agent commissions |
| `POST` | `/commissions/{id}/pay` | Settle commission voucher and credit recipient |

### 6. Treasury, Cash Safe & Expenses
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/finance/summary` | Real-time Cash Safe in hand float & bank balances |
| `GET` | `/finance/ledger` | Detailed double-entry running ledger vouchers |
| `GET` | `/finance/expenses` | Showroom operational & capitalized expenses |
| `POST` | `/finance/expenses` | Add expense voucher (optionally linked to `vehicle_id`) |
| `POST` | `/finance/transfer` | Transfer liquidity between Cash Safe and Bank accounts |

### 7. Car Demand Leads & AI Matchmaker
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/demands` | Active buyer requirement leads |
| `POST` | `/demands` | Log new walk-in / phone buyer demand lead |
| `GET` | `/demands/{id}/matches` | Algorithmic scoring of inventory against buyer criteria |

### 8. 20 Specialized Automotive BI Reports
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reports/{reportId}` | Generate report data (`DAILY_SALES`, `INVENTORY_VALUATION`, `PROFIT_LOSS`, `CASH_FLOW`, etc.) |

### 9. Showroom Settings
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/settings` | Showroom brand settings, tax rates & receipt footers |
| `POST` | `/settings` | Update showroom configuration parameters |
| `GET` | `/public-settings` | Unauthenticated public showroom settings |
| `GET` | `/health` | API status & server uptime health check |

---

## 🏢 System Branding & Credits

**Ahsan Autos Showroom & POS Terminal**  
*Main IJP Road, Near Faizabad Interchange, Islamabad / Rawalpindi, Pakistan*  

**Engineered by Rojrztech**  
- 📞 **Contact**: `03132066883` / `03151210736`  
- 🌐 **Website**: [Rojrztech.com](https://rojrztech.com)  
