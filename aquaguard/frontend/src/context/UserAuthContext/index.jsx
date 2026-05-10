import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
  return 0;
}

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    try {
      const storedUsers = window.localStorage.getItem(STORAGE_KEY_USERS);
      const storedCurrent = window.localStorage.getItem(STORAGE_KEY_CURRENT_USER);

      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed)) {
          setUsers(parsed);
        }
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

    const existing = users.find(u => normalizeEmail(u.email) === normalized);
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

    if (users.some(u => normalizeEmail(u.email) === normalized)) {
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

    setUsers((current) => [...current, profile]);

    setUser({
      email: profile.email,
      displayName: profile.displayName,
      points: profile.points,
      createdAt: profile.createdAt,
      reports: []
    });

    return { success: true };
  }

  const addReport = useCallback(function addReport(report) {
    if (!user?.email) {
      return { success: false, message: 'Must be signed in to save this report.' };
    }

    const normalized = normalizeEmail(user.email);
    const award = Number(report?.pointsAwarded ?? report?.points ?? 50);
    const pointsDelta = Number.isFinite(award) && award > 0 ? award : 50;

    const submittedReport = {
      ...report,
      id: report.id != null ? report.id : Date.now(),
      submittedBy: user.displayName,
      submittedAt: report.submittedAt || new Date().toISOString(),
      points: pointsDelta,
    };

    setUsers((current) => current.map(u => {
      if (normalizeEmail(u.email) === normalized) {
        return {
          ...u,
          reports: [submittedReport, ...(u.reports || [])],
          points: u.points + pointsDelta
        };
      }
      return u;
    }));

    setUser((current) => ({
      ...current,
      points: (current?.points || 0) + pointsDelta,
      reports: [submittedReport, ...(current?.reports || [])]
    }));

    return { success: true, report: submittedReport };
  }, [user]);

  function signOut() {
    setUser(null);
  }

  const value = useMemo(
    () => ({ isUserAuthenticated: Boolean(user), user, signIn, signUp, signOut, addReport }),
    [user, addReport]
  );

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
