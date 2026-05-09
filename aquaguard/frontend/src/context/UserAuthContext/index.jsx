import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserAuthContext = createContext({ isUserAuthenticated: false });
const STORAGE_KEY_USERS = 'aquaguard-auth-users';
const STORAGE_KEY_CURRENT_USER = 'aquaguard-auth-current-user';

function normalizeEmail(email) {
  return email?.trim().toLowerCase() || '';
}

function createDisplayName(email) {
  const localPart = normalizeEmail(email).split('@')[0] || 'Aqua User';
  const formatted = localPart.replace(/[^a-z0-9]+/gi, ' ').trim();
  return formatted ? formatted.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Aqua User';
}

function computeInitialPoints(email) {
  const normalized = normalizeEmail(email);
  const base = Math.min(1500, Math.max(650, normalized.length * 38 + normalized.charCodeAt(0)));
  return base;
}

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    try {
      const storedUsers = window.localStorage.getItem(STORAGE_KEY_USERS);
      const storedCurrent = window.localStorage.getItem(STORAGE_KEY_CURRENT_USER);

      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
      if (storedCurrent) {
        setUser(JSON.parse(storedCurrent));
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to persist users:', error);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch (error) {
      console.error('Failed to persist current user:', error);
    }
  }, [user]);

  function signIn({ email, password }) {
    const normalized = normalizeEmail(email);
    if (!normalized || !password?.trim()) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const existing = users[normalized];
    if (!existing) {
      return { success: false, message: 'No account found. Please sign up first.' };
    }

    if (existing.password !== password.trim()) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    setUser({
      email: existing.email,
      displayName: existing.displayName,
      points: existing.points,
      createdAt: existing.createdAt,
      reports: existing.reports || []
    });

    return { success: true };
  }

  function signUp({ displayName, email, password }) {
    const normalized = normalizeEmail(email);
    if (!normalized || !password?.trim()) {
      return { success: false, message: 'Please enter your email and password.' };
    }

    if (password.trim().length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    if (users[normalized]) {
      return { success: false, message: 'An account already exists with that email. Please log in.' };
    }

    const profile = {
      email: normalized,
      password: password.trim(),
      displayName: displayName?.trim() || createDisplayName(normalized),
      points: computeInitialPoints(normalized),
      createdAt: new Date().toISOString(),
      reports: []
    };

    setUsers((current) => ({
      ...current,
      [normalized]: profile
    }));

    setUser({
      email: profile.email,
      displayName: profile.displayName,
      points: profile.points,
      createdAt: profile.createdAt,
      reports: []
    });

    return { success: true };
  }

  function addReport(report) {
    if (!user?.email) {
      return { success: false, message: 'Must be signed in to save this report.' };
    }

    const normalized = normalizeEmail(user.email);
    const submittedReport = {
      id: Date.now(),
      ...report,
      submittedBy: user.displayName,
      submittedAt: report.submittedAt || new Date().toISOString()
    };

    setUsers((current) => {
      const existing = current[normalized] || {
        email: normalized,
        displayName: user.displayName,
        points: user.points,
        createdAt: user.createdAt,
        password: '',
        reports: []
      };
      const updated = {
        ...existing,
        reports: [submittedReport, ...(existing.reports || [])],
        points: existing.points + 50
      };
      return { ...current, [normalized]: updated };
    });

    setUser((current) => ({
      ...current,
      points: (current?.points || 0) + 50,
      reports: [submittedReport, ...(current?.reports || [])]
    }));

    return { success: true, report: submittedReport };
  }

  function signOut() {
    setUser(null);
  }

  const value = useMemo(
    () => ({ isUserAuthenticated: Boolean(user), user, signIn, signUp, signOut, addReport }),
    [user]
  );

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
