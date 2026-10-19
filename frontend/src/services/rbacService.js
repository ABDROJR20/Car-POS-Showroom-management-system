// Role-Based Access Control (RBAC) & Permission Engine for Ahsan Autos Showroom

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SALES_STAFF: 'SALES_STAFF',
  ACCOUNTANT: 'ACCOUNTANT',
};

export const ROLE_DEFINITIONS = [
  {
    id: ROLES.ADMIN,
    name: 'Admin / Showroom Director',
    badgeColor: '#D97706',
    description: 'Unrestricted full system control, financial resets, user roles, system configs & master ledgers.',
    permissions: ['*'],
  },
  {
    id: ROLES.MANAGER,
    name: 'Showroom General Manager',
    badgeColor: '#2563EB',
    description: 'Inventory management, stock inward approval, sale deals execution, expense logging, and operational reports.',
    permissions: [
      'inventory.view',
      'inventory.create',
      'inventory.edit',
      'inventory.cost_price_view',
      'sales.view',
      'sales.create',
      'sales.cancel',
      'sales.margins_view',
      'purchases.view',
      'purchases.create',
      'demand.view',
      'demand.manage',
      'customers.view',
      'customers.manage',
      'expenses.view',
      'expenses.create',
      'commissions.view',
      'reports.view',
      'printing.all',
    ],
  },
  {
    id: ROLES.SALES_STAFF,
    name: 'Sales Staff / POS Cashier',
    badgeColor: '#059669',
    description: 'Quick POS sales terminal, vehicle delivery booking, customer demand leads. Restricted from dealer cost prices & net profits.',
    permissions: [
      'pos.terminal',
      'inventory.view',
      'sales.view',
      'sales.create',
      'demand.view',
      'demand.manage',
      'customers.view',
      'customers.manage',
      'printing.receipts',
    ],
  },
  {
    id: ROLES.ACCOUNTANT,
    name: 'Accountant / Treasury Officer',
    badgeColor: '#7C3AED',
    description: 'Cash in hand, cash & bank ledger, income, operating expenses, seller payables, balance collection & financial P&L.',
    permissions: [
      'finance.cash_view',
      'finance.ledger_view',
      'finance.expense_create',
      'finance.income_create',
      'finance.settlements',
      'sales.view',
      'sales.collect_balance',
      'purchases.view',
      'purchases.pay',
      'commissions.view',
      'commissions.disburse',
      'reports.view',
      'reports.profit_loss_view',
      'reports.export',
      'printing.all',
    ],
  },
];

export const DEMO_USERS = [
  {
    id: 1,
    name: 'Ahsan Khan (Director)',
    email: 'admin@ahsanautos.com',
    role: ROLES.ADMIN,
    phone: '+92 300 1234567',
    avatar: '👨‍💼',
    status: 'ACTIVE',
  },
  {
    id: 2,
    name: 'Tariq Mehmood (General Manager)',
    email: 'manager@ahsanautos.com',
    role: ROLES.MANAGER,
    phone: '+92 321 9988776',
    avatar: '👔',
    status: 'ACTIVE',
  },
  {
    id: 3,
    name: 'Bilal Ahmed (Sales Executive)',
    email: 'sales@ahsanautos.com',
    role: ROLES.SALES_STAFF,
    phone: '+92 333 4455667',
    avatar: '🧑‍💻',
    status: 'ACTIVE',
  },
  {
    id: 4,
    name: 'Zubair Farooq (Chief Accountant)',
    email: 'accounts@ahsanautos.com',
    role: ROLES.ACCOUNTANT,
    phone: '+92 301 5566778',
    avatar: '📑',
    status: 'ACTIVE',
  },
];

const USERS_STORAGE_KEY = 'ahsan_system_users_v1';

export const rbacService = {
  getAllUsers: () => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    } catch (err) {
      return DEMO_USERS;
    }
  },

  saveUsers: (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  createUser: (userData) => {
    const users = rbacService.getAllUsers();
    const newUser = {
      ...userData,
      id: Date.now(),
      status: 'ACTIVE',
    };
    const updated = [...users, newUser];
    rbacService.saveUsers(updated);
    return newUser;
  },

  updateUser: (userId, updates) => {
    const users = rbacService.getAllUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
    rbacService.saveUsers(updated);
    return updated.find((u) => u.id === userId);
  },

  deleteUser: (userId) => {
    const users = rbacService.getAllUsers();
    const updated = users.filter((u) => u.id !== userId);
    rbacService.saveUsers(updated);
    return true;
  },

  getRoleDefinition: (roleId) => {
    return ROLE_DEFINITIONS.find((r) => r.id === roleId) || ROLE_DEFINITIONS[0];
  },

  checkPermission: (userRole, requiredPermission) => {
    if (!userRole) return false;
    if (userRole === ROLES.ADMIN) return true;
    const roleDef = ROLE_DEFINITIONS.find((r) => r.id === userRole);
    if (!roleDef) return false;
    if (roleDef.permissions.includes('*')) return true;
    return roleDef.permissions.includes(requiredPermission);
  },
};
