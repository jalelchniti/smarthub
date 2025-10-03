// Authentication Context for Admin System
// Simple localStorage-based authentication (demo - NOT production-grade)

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AdminDataStorage } from '../utils/adminDataStorage';
import type { AdminUser, UserRole } from '../types/admin.types';

interface AuthContextType {
  user: AdminUser | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_SESSION_KEY = 'smarthub_admin_session';

/**
 * Simple password hashing (DEMO ONLY - use bcrypt in production)
 */
function simpleHash(password: string): string {
  // This is NOT secure - replace with proper hashing in production
  return btoa(password + '_smarthub_salt_2025');
}

/**
 * Authentication Provider Component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionData = localStorage.getItem(AUTH_SESSION_KEY);

        if (sessionData) {
          const session = JSON.parse(sessionData);
          const adminData = AdminDataStorage.load();

          // Verify user still exists and is active
          const foundUser = adminData.users.find(u => u.id === session.userId);

          if (foundUser && foundUser.status === 'active') {
            setUser(foundUser);
          } else {
            // Session invalid - clear it
            localStorage.removeItem(AUTH_SESSION_KEY);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem(AUTH_SESSION_KEY);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  /**
   * Login function
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const adminData = AdminDataStorage.load();
      const passwordHash = simpleHash(password);

      // Find user by email
      const foundUser = adminData.users.find(
        u => u.email === email && u.status === 'active'
      );

      if (!foundUser) {
        return false; // User not found or inactive
      }

      // Verify password (in production, use proper password verification)
      if (foundUser.password_hash !== passwordHash) {
        return false; // Wrong password
      }

      // Update last login time
      const updatedUsers = adminData.users.map(u =>
        u.id === foundUser.id
          ? { ...u, last_login: new Date().toISOString() }
          : u
      );

      AdminDataStorage.save({
        ...adminData,
        users: updatedUsers
      });

      // Create session
      const session = {
        userId: foundUser.id,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));

      // Update state
      setUser({ ...foundUser, last_login: session.loginTime });

      return true;

    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Utility: Create new admin user (for initial setup)
 * WARNING: Only use this during development/setup
 */
export function createAdminUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'manager'
): boolean {
  try {
    const adminData = AdminDataStorage.load();

    // Check if user already exists
    if (adminData.users.some(u => u.email === email)) {
      console.error('User with this email already exists');
      return false;
    }

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      password_hash: simpleHash(password),
      status: 'active',
      created_at: new Date().toISOString()
    };

    adminData.users.push(newUser);
    AdminDataStorage.save(adminData);

    console.log('Admin user created successfully');
    return true;

  } catch (error) {
    console.error('Failed to create admin user:', error);
    return false;
  }
}
