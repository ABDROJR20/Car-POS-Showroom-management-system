import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { rbacService, ROLES, DEMO_USERS } from '../services/rbacService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Check saved session on mount
    const savedToken = localStorage.getItem('ahsan_auth_token');
    const savedUser = localStorage.getItem('ahsan_auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        setUser(null);
        setToken(null);
      }
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Attempt real Laravel API login
      const response = await api.post('/auth/login', { email, password });
      const authToken = response.data?.token || response.token;
      const authUser = response.data?.user || response.user;

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('ahsan_auth_token', authToken);
      localStorage.setItem('ahsan_auth_user', JSON.stringify(authUser));

      showToast('success', `Welcome back, ${authUser.name}!`, 'Signed In');
      return { success: true };
    } catch (error) {
      // Fallback matching Demo Users (when backend is offline / standalone demo mode)
      const cleanEmail = (email || '').trim().toLowerCase();
      const allUsers = rbacService.getAllUsers();
      const matched = allUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanEmail ||
          (u.username && u.username.toLowerCase() === cleanEmail) ||
          (cleanEmail.includes('sales') && u.role === ROLES.SALES_STAFF) ||
          (cleanEmail.includes('admin') && u.role === ROLES.ADMIN) ||
          (cleanEmail.includes('manager') && u.role === ROLES.MANAGER) ||
          (cleanEmail.includes('account') && u.role === ROLES.ACCOUNTANT)
      );

      const validPasswords = [
        'sales123',
        'admin123',
        'manager123',
        'accountant123',
        'password',
        '123456',
        '12345678',
      ];

      if (matched && (validPasswords.includes(password) || password.length >= 4)) {
        const mockToken = `mock_sanctum_token_${matched.role.toLowerCase()}`;
        setToken(mockToken);
        setUser(matched);
        localStorage.setItem('ahsan_auth_token', mockToken);
        localStorage.setItem('ahsan_auth_user', JSON.stringify(matched));

        showToast('success', `Logged in as ${matched.name} (${matched.role})`, 'Authentication Success');
        return { success: true };
      }

      const msg = error.message || 'Invalid email or password';
      showToast('error', msg, 'Authentication Failed');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fast Role / User Switcher for RBAC Permission Testing
   */
  const switchUser = (userId) => {
    const allUsers = rbacService.getAllUsers();
    const target = allUsers.find((u) => u.id === Number(userId));
    if (target) {
      setUser(target);
      localStorage.setItem('ahsan_auth_user', JSON.stringify(target));
      showToast('info', `Switched active role to: ${target.name} (${target.role})`, 'Role Switched');
    }
  };

  const logout = async () => {
    try {
      if (token && !token.startsWith('mock_')) {
        await api.post('/auth/logout');
      }
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('ahsan_auth_token');
      localStorage.removeItem('ahsan_auth_user');
      showToast('info', 'You have been signed out.', 'Logged Out');
    }
  };

  const hasRole = (roleName) => {
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true;
    return user.role === roleName;
  };

  const hasPermission = (permissionName) => {
    if (!user) return false;
    return rbacService.checkPermission(user.role, permissionName);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        switchUser,
        hasRole,
        hasPermission,
        can: hasPermission,
        is: hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
