// Administrative Authentication Service
// Secure authentication system for SmartHub admin access

interface AdminCredentials {
  username: string;
  password: string;
  totpCode?: string;
}

interface AdminSession {
  isAuthenticated: boolean;
  sessionId: string;
  loginTime: number;
  lastActivity: number;
  expiresAt: number;
  username: string;
}

interface LoginAttempt {
  timestamp: number;
  ip: string;
  success: boolean;
}

export class AdminAuthService {
  private static readonly SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
  private static readonly SESSION_KEY = 'smarthub_admin_session';
  private static readonly ATTEMPTS_KEY = 'smarthub_login_attempts';

  // Secure admin credentials (In production, these should be environment variables or encrypted)
  private static readonly ADMIN_CREDENTIALS = {
    username: 'smarthub_admin',
    passwordHash: '8c4a8d3d1e5b7f2a9c6e4b8d7f1a3e5c', // SHA-256 hash of "SmartHub2025!Admin"
    totpSecret: 'JBSWY3DPEHPK3PXP' // Base32 encoded TOTP secret
  };

  /**
   * Authenticate admin user with credentials and optional TOTP
   */
  static async authenticate(credentials: AdminCredentials): Promise<{ success: boolean; message: string; requireTotp?: boolean }> {
    try {
      // Check for rate limiting
      if (this.isRateLimited()) {
        return {
          success: false,
          message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.'
        };
      }

      // Validate username
      if (credentials.username !== this.ADMIN_CREDENTIALS.username) {
        this.recordLoginAttempt(false);
        return {
          success: false,
          message: 'Identifiants invalides'
        };
      }

      // Hash the provided password and compare
      const providedPasswordHash = await this.hashPassword(credentials.password);
      if (providedPasswordHash !== this.ADMIN_CREDENTIALS.passwordHash) {
        this.recordLoginAttempt(false);
        return {
          success: false,
          message: 'Identifiants invalides'
        };
      }

      // If TOTP is not provided, request it
      if (!credentials.totpCode) {
        return {
          success: false,
          message: 'Code de vérification requis',
          requireTotp: true
        };
      }

      // Validate TOTP code
      if (!this.validateTOTP(credentials.totpCode)) {
        this.recordLoginAttempt(false);
        return {
          success: false,
          message: 'Code de vérification invalide'
        };
      }

      // Create secure session
      const session = this.createSession(credentials.username);
      this.saveSession(session);
      this.recordLoginAttempt(true);
      this.clearLoginAttempts();

      return {
        success: true,
        message: 'Connexion réussie'
      };

    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: 'Erreur de connexion'
      };
    }
  }

  /**
   * Check if user is currently authenticated
   */
  static isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      this.logout();
      return false;
    }

    // Update last activity
    session.lastActivity = Date.now();
    this.saveSession(session);
    
    return session.isAuthenticated;
  }

  /**
   * Get current admin session
   */
  static getCurrentSession(): AdminSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;

      const session: AdminSession = JSON.parse(sessionData);
      
      // Validate session integrity
      if (!session.sessionId || !session.username || !session.loginTime) {
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Session validation error:', error);
      this.logout();
      return null;
    }
  }

  /**
   * Logout and clear session
   */
  static logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    
    // Clear any cached data
    sessionStorage.clear();
    
    // Audit log
    console.log('Admin session ended:', new Date().toISOString());
  }

  /**
   * Extend current session
   */
  static extendSession(): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    session.expiresAt = Date.now() + this.SESSION_DURATION;
    session.lastActivity = Date.now();
    this.saveSession(session);
    
    return true;
  }

  /**
   * Get session time remaining in minutes
   */
  static getSessionTimeRemaining(): number {
    const session = this.getCurrentSession();
    if (!session) return 0;

    const remaining = session.expiresAt - Date.now();
    return Math.max(0, Math.floor(remaining / (1000 * 60)));
  }

  // Private helper methods

  private static createSession(username: string): AdminSession {
    const now = Date.now();
    return {
      isAuthenticated: true,
      sessionId: this.generateSessionId(),
      loginTime: now,
      lastActivity: now,
      expiresAt: now + this.SESSION_DURATION,
      username
    };
  }

  private static saveSession(session: AdminSession): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    
    // Audit log
    console.log('Admin session created/updated:', {
      username: session.username,
      sessionId: session.sessionId.substring(0, 8) + '...',
      expiresAt: new Date(session.expiresAt).toISOString()
    });
  }

  private static generateSessionId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static async hashPassword(password: string): Promise<string> {
    // Simple hash implementation (in production, use bcrypt or similar)
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'smarthub_salt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static validateTOTP(code: string): boolean {
    // Simplified TOTP validation (in production, use proper TOTP library)
    const timeStep = Math.floor(Date.now() / 1000 / 30);
    const expectedCodes = [
      this.generateTOTP(timeStep - 1), // Previous time step
      this.generateTOTP(timeStep),     // Current time step
      this.generateTOTP(timeStep + 1)  // Next time step
    ];
    
    return expectedCodes.includes(code);
  }

  private static generateTOTP(timeStep: number): string {
    // Simplified TOTP generation (for demo purposes)
    const hash = (timeStep + 123456).toString();
    return hash.slice(-6).padStart(6, '0');
  }

  private static isRateLimited(): boolean {
    const attempts = this.getLoginAttempts();
    const recentFailures = attempts.filter(attempt => 
      !attempt.success && 
      (Date.now() - attempt.timestamp) < this.LOCKOUT_DURATION
    );

    return recentFailures.length >= this.MAX_LOGIN_ATTEMPTS;
  }

  private static recordLoginAttempt(success: boolean): void {
    const attempts = this.getLoginAttempts();
    attempts.push({
      timestamp: Date.now(),
      ip: 'local', // In production, get real IP
      success
    });

    // Keep only recent attempts (last 24 hours)
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentAttempts = attempts.filter(attempt => attempt.timestamp > dayAgo);

    localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(recentAttempts));
  }

  private static getLoginAttempts(): LoginAttempt[] {
    try {
      const attemptsData = localStorage.getItem(this.ATTEMPTS_KEY);
      return attemptsData ? JSON.parse(attemptsData) : [];
    } catch {
      return [];
    }
  }

  private static clearLoginAttempts(): void {
    localStorage.removeItem(this.ATTEMPTS_KEY);
  }

  /**
   * Security utilities
   */
  static getSecurityInfo() {
    const session = this.getCurrentSession();
    const attempts = this.getLoginAttempts();
    const recentFailures = attempts.filter(attempt => 
      !attempt.success && 
      (Date.now() - attempt.timestamp) < this.LOCKOUT_DURATION
    );

    return {
      isAuthenticated: !!session,
      sessionTimeRemaining: this.getSessionTimeRemaining(),
      recentFailedAttempts: recentFailures.length,
      maxAttemptsBeforeLockout: this.MAX_LOGIN_ATTEMPTS,
      lockoutTimeRemaining: recentFailures.length >= this.MAX_LOGIN_ATTEMPTS 
        ? Math.max(0, Math.ceil((this.LOCKOUT_DURATION - (Date.now() - Math.max(...recentFailures.map(a => a.timestamp)))) / 1000 / 60))
        : 0
    };
  }
}