# 🏎️ Ahsan Autos POS & Car Showroom Management System — Frontend

> **Enterprise-grade Point of Sale (POS), Inventory Floor, and Dealership Management SPA**  
> Tailored specifically for Pakistani used-car showrooms and automotive dealerships.

[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Lucide React](https://img.shields.io/badge/Icons-Lucide%20React-orange?style=for-the-badge)](https://lucide.dev)

Designed with high aesthetics, real-time double-entry financial controls, status-driven vehicle fleet isolation, and full mobile/tablet responsiveness.

- 📖 **Main Project Documentation**: [Root README.md](../README.md)
- ⚙️ **Backend API Engine**: [Backend README.md](../backend/README.md)


---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) + Custom Glassmorphism Design System
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) with Bearer Auth & Global Error Interceptors
- **Printing**: Native CSS `@media print` with 80mm Thermal & A4 Stamp Paper layout engine

---

## 🌟 Core Modules & Business Features

### 1. ⚡ POS Sales Terminal (`/pos-terminal`)
- Rapid checkout with dual-mode support for vehicle sales and auto spare parts/accessories.
- Brand filter pills (Toyota, Honda, Suzuki, KIA, Hyundai, Changan, MG).
- Barcode scanning & quick SKU search.
- Payment modes: Cash, Bank Transfer (Meezan/HBL), Credit/Token Advance.
- Instant 80mm Thermal Receipt generation and WhatsApp click-to-chat invoice dispatch.

### 2. 🚗 Vehicle Fleet & Inventory (`/vehicles`)
- Status-driven inventory management: `Available`, `Reserved`, `Sold`, `In Refurbishment`.
- Strict double-sale prevention (Sold vehicles vanish from active sale floor).
- Multi-tier ownership segregation:
  - **Showroom Owned** (100% capitalized asset)
  - **Client Consignment** (Owner base price protected, showroom earns commission)
  - **Investor Funded** (Profit split syndicate)
- 360° Dossier: Specs, 6-Seals Condition Score, Image Gallery, Document Vault (Registration Book, Smart Card, NOC, Biometric).

### 3. 📋 Car Demand Sheet & AI Matchmaker (`/car-demand`)
- Capture walk-in and phone customer vehicle requirements (Make, Model, Budget, Transmission, Year Range).
- Automated Inventory Matchmaker scoring (0% – 100% match confidence) against showroom stock.

### 4. 📝 Inward Vehicle Purchases (`/purchases`)
- Seller acquisition deeds with CNIC, biometric records, and contact verification.
- Flexible payment milestones: Token advance, partial installments, balance due.
- Direct synchronization with the Cash Safe ledger.

### 5. 🛒 Sales Orders & Deal Closing (`/sales`)
- Atomic deal closures with real-time gross profit calculation:
  $$\text{Gross Profit} = \text{Net Sale} - (\text{Purchase Cost} + \text{Capitalized Expenses}) - \text{Brokerage} - \text{Agent Commission}$$
- Client consignment profit isolation (Never books complete car sale price as showroom profit).
- Atomic Void / Cancellation with full vehicle stock and ledger reversal.

### 6. 💼 Financial Treasury & Cash Safe (`/cash-finance`, `/expenses`)
- Real-time **Cash in Hand** drawer formula:
  $$\text{Cash in Hand} = \text{Opening Float} + \text{Inflows (Debits)} - \text{Outflows (Credits)}$$
- 12-category expense management with automatic vehicle refurbishment cost capitalization (`totalExpenses`).
- Multi-account support: Main Cash Safe (Counter), Meezan Bank, Habib Bank (HBL).
- Daily cash closing reconciliations and internal safe-to-bank transfers.

### 7. 🤝 Multi-Tier Commission Register (`/commission`)
- Granular tracking for Showroom commission, external car brokers, and internal sales staff rewards.
- Payout vouchers and settlement receipts.

### 8. 📊 20 Specialized BI Reports (`/reports`)
- **Sales & Velocity**: Daily Sales, Monthly Sales, Vehicle Sales Register, Sales by Date.
- **Inventory Assets**: Acquisitions, Stock Valuation, Sold Archive, Unsold Aging, Ownership Breakdowns.
- **P&L & Treasury**: Profit & Loss (EBITDA), Vehicle Profitability, Cash Flow, Cash in Hand.
- **Payables & Receivables**: Outstanding Buyer Balances, Seller Liabilities, Broker Commissions.
- Instant CSV / Excel export and formatted print previews.

### 9. 🖨️ Automotive Print & Document Center (`/print-center`)
- 8 Legal Document Templates:
  1. 80mm Thermal POS Sales Slip
  2. Legal Stamp Paper Vehicle Sale Deed (Ikranama / Bayana)
  3. Vehicle Purchase Agreement
  4. Commission Payment Voucher
  5. Vehicle Gate Pass & Delivery Order
  6. Comprehensive 360° Vehicle Dossier
  7. Cash Payment Receipt Voucher
  8. Daily Cash Drawer Closing Certificate
- Built-in WhatsApp invoice sharing with Pakistani phone number formatting.

### 10. 🔒 Role-Based Access Control (RBAC) & Settings (`/settings`)
- 4 Preset Pakistani Showroom Roles:
  - **Admin (Owner)**: Unrestricted wildcard access (`*`).
  - **Manager**: Deals closer, stock editor, commission disbursements.
  - **Sales Staff**: POS terminal, customer leads, floor catalog (Cost prices hidden).
  - **Accountant**: Cash ledger, expense vouchers, financial reports (Stock deletion blocked).
- Customizable showroom identity, NTN/STRN, tax rates, and Rojrztech branded footer:
  ```text
  Powered By Rojrztech
  03132066883 / 03151210736
  website: Rojrztech.com
  ```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm` or `yarn` or `pnpm`

### 2. Installation
```bash
# Navigate to frontend directory
cd frontend

# Install project dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `frontend` root (optional for local defaults):
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 4. Development Server
```bash
npm run dev
```
Open your browser at **`http://localhost:5173`**.

### 5. Production Build
```bash
npm run build
```
Generates optimized production bundle in `frontend/dist/`.

---

## 🔑 Default Login Credentials

| Role | Username | Password | Default Landing Page |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Executive Dashboard |
| **Manager** | `manager` | `manager123` | POS / Stock Floor |
| **Sales Staff** | `sales` | `sales123` | POS Terminal |
| **Accountant** | `accountant` | `accountant123` | Cash Ledger & Treasury |

---

## 📱 Responsive Design Matrix

- **Mobile Phones (`≤ 768px`)**: Single-column vertical stacking, responsive slide-in sidebar drawer, compact POS cart view, and horizontal scrolling data tables.
- **Tablets (`768px - 1024px`)**: Adaptive 2-column POS, touch-friendly modal sheets, and collapsible menu.
- **Desktop Screens (`> 1024px`)**: Full luxury split view, multi-column analytics grids, and persistent dark sidebar.

---

## 🏢 System Branding

**Ahsan Autos Showroom & POS Terminal**  
*Main IJP Road, Near Faizabad Interchange, Islamabad / Rawalpindi, Pakistan*  
**Engineered by Rojrztech** (`03132066883` / `03151210736` | [Rojrztech.com](https://rojrztech.com))
