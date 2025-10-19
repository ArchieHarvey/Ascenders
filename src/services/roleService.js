import UserRole from '../models/userRole.js';

const parseIdList = (value) =>
  value
    ?.split(',')
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];

const envSuperusers = new Set(parseIdList(process.env.SUPERUSER_IDS));
const envAdmins = new Set(parseIdList(process.env.ADMIN_IDS));

const roleCache = new Map();

const loadRoleRecord = async (userId) => {
  if (roleCache.has(userId)) {
    return roleCache.get(userId);
  }

  const roles = await UserRole.find({ userId }).lean().exec();
  roleCache.set(userId, roles);
  return roles;
};

export const clearRoleCache = (userId) => {
  if (userId) {
    roleCache.delete(userId);
    return;
  }
  roleCache.clear();
};

const hasRole = async (userId, role) => {
  if (!userId) {
    return false;
  }

  if (role === 'superuser' && envSuperusers.has(userId)) {
    return true;
  }

  if (role === 'admin' && (envAdmins.has(userId) || envSuperusers.has(userId))) {
    return true;
  }

  const roles = await loadRoleRecord(userId);
  return roles.some((entry) => {
    if (entry.role === 'superuser') {
      return true;
    }
    return entry.role === role;
  });
};

export const isSuperuser = async (userId) => hasRole(userId, 'superuser');

export const isAdmin = async (userId) =>
  (await hasRole(userId, 'superuser')) || (await hasRole(userId, 'admin'));
