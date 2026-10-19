import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * PermissionGuard conditionally renders children if the authenticated user
 * has the required permission or role. Otherwise renders fallback or null.
 */
export const PermissionGuard = ({
  permission,
  role,
  fallback = null,
  children,
}) => {
  const { can, is, user } = useAuth();

  if (!user) return fallback;

  if (role && !is(role)) {
    return fallback;
  }

  if (permission && !can(permission)) {
    return fallback;
  }

  return <>{children}</>;
};
