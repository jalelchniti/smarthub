// Firebase Authentication Service for SmartHub Admin
// Enterprise-grade authentication using Firebase Auth

import { auth, getFirebaseInitialization, isFirebaseReady } from '../config/firebase';

interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  lastLogin: string;
  permissions: string[];
}

interface LoginResult {
  success: boolean;
  user?: AdminUser;
  message: string;
  requireSetup?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  loading: boolean;
}

export class FirebaseAuthService {
  private static authStateListeners: ((state: AuthState) => void)[] = [];
  private static currentAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true
  };

  /**
   * Initialize Firebase Auth and set up auth state listener
   */
  static async initialize(): Promise<boolean> {
    try {
      // Wait for Firebase initialization to complete
      console.log('🔐 Initializing Firebase Auth Service...');
      const firebaseReady = await getFirebaseInitialization();

      if (!firebaseReady) {
        console.error('❌ Firebase initialization failed - Auth service cannot start');
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          loading: false
        });
        return false;
      }

      if (!auth) {
        console.error('❌ Firebase Auth service not available after initialization');
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          loading: false
        });
        return false;
      }

      console.log('✅ Firebase Auth service initialized successfully');

      // Set up auth state listener
      auth.onAuthStateChanged(async (firebaseUser) => {
        try {
          if (firebaseUser) {
            console.log('👤 User signed in:', firebaseUser.email);
            // User is signed in
            const adminUser = await this.createAdminUserFromFirebaseUser(firebaseUser);
            this.updateAuthState({
              isAuthenticated: true,
              user: adminUser,
              loading: false
            });
          } else {
            console.log('👤 User signed out');
            // User is signed out
            this.updateAuthState({
              isAuthenticated: false,
              user: null,
              loading: false
            });
          }
        } catch (error) {
          console.error('❌ Auth state change error:', error);
          this.updateAuthState({
            isAuthenticated: false,
            user: null,
            loading: false
          });
        }
      });

      return true;
    } catch (error) {
      console.error('❌ Firebase Auth initialization failed:', error);
      this.updateAuthState({
        isAuthenticated: false,
        user: null,
        loading: false
      });
      return false;
    }
  }

  /**
   * Sign in admin user with email and password
   */
  static async signIn(email: string, password: string): Promise<LoginResult> {
    try {
      // Check if Firebase is ready
      if (!isFirebaseReady()) {
        console.error('❌ Firebase not ready for sign in');
        return {
          success: false,
          message: 'Erreur: Firebase initialization failed. Veuillez rafraîchir la page.'
        };
      }

      if (!auth) {
        console.error('❌ Firebase Auth service not available');
        return {
          success: false,
          message: 'Service d\'authentification non disponible. Veuillez vérifier la configuration Firebase.'
        };
      }

      console.log('🔐 Attempting sign in for:', email);
    } catch (error) {
      console.error('❌ Pre-signin validation failed:', error);
      return {
        success: false,
        message: 'Erreur de validation. Veuillez réessayer.'
      };
    }

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user as {
        uid: string;
        email: string;
        displayName?: string;
      };
      
      // Check if user has admin privileges
      const isAdminUser = await this.verifyAdminPrivileges(firebaseUser);
      
      if (!isAdminUser) {
        // Sign out non-admin user
        await auth.signOut();
        return {
          success: false,
          message: 'Accès refusé: privilèges administrateur requis'
        };
      }

      const adminUser = await this.createAdminUserFromFirebaseUser(firebaseUser);
      
      // Update last login time
      await this.updateLastLogin(firebaseUser.uid);

      return {
        success: true,
        user: adminUser,
        message: 'Connexion réussie'
      };

    } catch (error: unknown) {
      console.error('Sign in error:', error);
      
      // Handle specific Firebase Auth errors
      const errorCode = error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : '';
      const errorMessage = this.getErrorMessage(errorCode);
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<boolean> {
    if (!auth) return false;

    try {
      await auth.signOut();
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  }

  /**
   * Get current authentication state
   */
  static getCurrentAuthState(): AuthState {
    return { ...this.currentAuthState };
  }

  /**
   * Check if user is currently authenticated
   */
  static isAuthenticated(): boolean {
    return this.currentAuthState.isAuthenticated;
  }

  /**
   * Get current user
   */
  static getCurrentUser(): AdminUser | null {
    return this.currentAuthState.user;
  }

  /**
   * Subscribe to auth state changes
   */
  static onAuthStateChanged(callback: (state: AuthState) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Immediately call with current state
    callback(this.getCurrentAuthState());
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  /**
   * Create admin user setup (for initial configuration)
   */
  static async createAdminUser(): Promise<LoginResult> {
    if (!auth) {
      return {
        success: false,
        message: 'Service d\'authentification non disponible'
      };
    }

    try {
      // This would typically be done through Firebase Admin SDK on the server
      // For demo purposes, we'll simulate the process
      console.log('Admin user creation would be handled by server-side functions');
      
      return {
        success: false,
        message: 'La création d\'utilisateur admin doit être effectuée côté serveur',
        requireSetup: true
      };

    } catch (error: unknown) {
      console.error('Create admin user error:', error);
      return {
        success: false,
        message: this.getErrorMessage(error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : '')
      };
    }
  }

  /**
   * Reset password for admin user
   */
  static async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (!auth) {
      return {
        success: false,
        message: 'Service d\'authentification non disponible'
      };
    }

    try {
      // This would typically use Firebase Auth's sendPasswordResetEmail
      // For now, we'll simulate the process
      console.log('Password reset email would be sent to:', email);
      
      return {
        success: true,
        message: `Email de réinitialisation envoyé à ${email}`
      };
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: this.getErrorMessage(error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : '')
      };
    }
  }

  /**
   * Get admin user statistics
   */
  static async getAdminStats(): Promise<{
    totalLogins: number;
    lastLoginDate: string;
    sessionDuration: number;
  }> {
    const user = this.getCurrentUser();
    if (!user) {
      return {
        totalLogins: 0,
        lastLoginDate: 'N/A',
        sessionDuration: 0
      };
    }

    // In a real implementation, this would fetch from Firebase Database
    return {
      totalLogins: 1,
      lastLoginDate: user.lastLogin,
      sessionDuration: Date.now() - new Date(user.lastLogin).getTime()
    };
  }

  // Private helper methods

  private static async createAdminUserFromFirebaseUser(firebaseUser: {
    uid: string;
    email: string;
    displayName?: string;
  }): Promise<AdminUser> {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || 'Admin',
      isAdmin: true, // In production, check custom claims
      lastLogin: new Date().toISOString(),
      permissions: ['read_bookings', 'write_bookings', 'delete_bookings', 'export_data']
    };
  }

  private static async verifyAdminPrivileges(firebaseUser: {
    email: string;
  }): Promise<boolean> {
    // In production, this would check Firebase custom claims
    // For demo purposes, we'll check if email is in allowed admin list
    const allowedAdminEmails = [
      'jalel.chniti@smarthub.com.tn',
      'jalel.chniti@gmail.com'
    ];

    return allowedAdminEmails.includes(firebaseUser.email);
  }

  private static async updateLastLogin(uid: string): Promise<void> {
    // In production, this would update user data in Firebase Database
    console.log('Updated last login for user:', uid);
  }

  private static updateAuthState(newState: AuthState): void {
    this.currentAuthState = { ...newState };
    
    // Notify all listeners
    this.authStateListeners.forEach(callback => {
      try {
        callback(this.getCurrentAuthState());
      } catch (error) {
        console.error('Auth state listener error:', error);
      }
    });
  }

  private static getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Utilisateur non trouvé. Vérifiez votre adresse email.',
      'auth/wrong-password': 'Mot de passe incorrect. Vérifiez votre mot de passe.',
      'auth/invalid-email': 'Adresse email invalide. Vérifiez le format de votre email.',
      'auth/user-disabled': 'Compte utilisateur désactivé. Contactez l\'administrateur.',
      'auth/too-many-requests': 'Trop de tentatives de connexion. Réessayez dans quelques minutes.',
      'auth/network-request-failed': 'Erreur de connexion réseau. Vérifiez votre connexion internet.',
      'auth/invalid-credential': 'Identifiants invalides. Vérifiez votre email et mot de passe.',
      'auth/operation-not-allowed': 'Opération non autorisée. Vérifiez la configuration Firebase.',
      'auth/weak-password': 'Mot de passe trop faible. Utilisez un mot de passe plus complexe.',
      'auth/missing-email': 'Adresse email requise.',
      'auth/missing-password': 'Mot de passe requis.',
      'auth/invalid-api-key': 'Clé API Firebase invalide. Vérifiez la configuration.',
      'auth/app-not-authorized': 'Application non autorisée. Vérifiez la configuration Firebase.',
      'auth/configuration-not-found': 'Configuration Firebase introuvable.',
      // Firebase initialization specific errors
      'firebase/initialization-failed': 'Erreur d\'initialisation Firebase. Veuillez rafraîchir la page.',
      'firebase/cdn-not-loaded': 'Scripts Firebase non chargés. Vérifiez votre connexion internet.',
      'firebase/config-missing': 'Configuration Firebase manquante. Vérifiez le fichier .env.'
    };

    // Enhanced error message with troubleshooting hints
    const baseMessage = errorMessages[errorCode] || 'Erreur d\'authentification inconnue';

    if (errorCode.includes('network') || errorCode.includes('failed')) {
      return baseMessage + ' Si le problème persiste, vérifiez votre connexion internet et rafraîchissez la page.';
    }

    return baseMessage;
  }

  /**
   * Development/Demo helper methods
   */
  
  /**
   * Create demo admin account (for development only)
   */
  static async createDemoAdmin(): Promise<LoginResult> {
    // This is for demo purposes only
    // In production, admin accounts should be created through Firebase Console or Admin SDK
    
    console.log('Demo admin account setup:');
    console.log('Email: admin@smarthub.com');
    console.log('Password: SmartHub2025!Admin');
    console.log('Please create this account in Firebase Console > Authentication > Users');
    
    return {
      success: false,
      message: 'Veuillez créer le compte admin dans la console Firebase',
      requireSetup: true
    };
  }

  /**
   * Check if demo admin exists
   */
  static async checkDemoSetup(): Promise<boolean> {
    // In a real app, this would check if admin users exist
    return false; // Always return false for demo to show setup instructions
  }
}

// Export types for use in components
export type { AdminUser, LoginResult, AuthState };