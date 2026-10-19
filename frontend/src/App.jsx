import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { POSTerminalPage } from './pages/POSTerminal/POSTerminalPage';
import { VehiclesPage } from './pages/Vehicles/VehiclesPage';
import { SalesPage } from './pages/Sales/SalesPage';
import { PurchasesPage } from './pages/Purchases/PurchasesPage';
import { CustomersPage } from './pages/Customers/CustomersPage';
import { CarDemandPage } from './pages/CarDemand/CarDemandPage';
import { CommissionPage } from './pages/Commission/CommissionPage';
import { ExpensesPage } from './pages/Expenses/ExpensesPage';
import { CashFinancePage } from './pages/CashFinance/CashFinancePage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { PrintCenterPage } from './pages/PrintCenter/PrintCenterPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { NotFound } from './pages/NotFound/NotFound';

import { ScrollToTop } from './components/common/ScrollToTop';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Showroom Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pos-terminal" element={<POSTerminalPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="purchases" element={<PurchasesPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="car-demand" element={<CarDemandPage />} />
              <Route path="commission" element={<CommissionPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="cash-finance" element={<CashFinancePage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="print-center" element={<PrintCenterPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
