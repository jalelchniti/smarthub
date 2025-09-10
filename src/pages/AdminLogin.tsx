import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Shield, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw,
  Smartphone,
  KeyRound
} from 'lucide-react';
import { AdminAuthService } from '../services/adminAuthService';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    totpCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requireTotp, setRequireTotp] = useState(false);
  const [securityInfo, setSecurityInfo] = useState<{
    isAuthenticated: boolean;
    sessionTimeRemaining: number;
    recentFailedAttempts: number;
    maxAttemptsBeforeLockout: number;
    lockoutTimeRemaining: number;
  } | null>(null);

  // Check if already authenticated
  useEffect(() => {
    if (AdminAuthService.isAuthenticated()) {
      navigate('/admin/bookings');
    }
    
    // Load security info
    setSecurityInfo(AdminAuthService.getSecurityInfo());
  }, [navigate]);

  // Auto-update security info every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityInfo(AdminAuthService.getSecurityInfo());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.username || !formData.password) {
        setError('Veuillez remplir tous les champs requis');
        return;
      }

      if (requireTotp && !formData.totpCode) {
        setError('Code de vérification requis');
        return;
      }

      // Validate TOTP format
      if (formData.totpCode && !/^\d{6}$/.test(formData.totpCode)) {
        setError('Le code de vérification doit contenir 6 chiffres');
        return;
      }

      const result = await AdminAuthService.authenticate(formData);

      if (result.success) {
        setSuccess('Connexion réussie! Redirection...');
        
        // Clear form
        setFormData({ username: '', password: '', totpCode: '' });
        
        // Redirect after short delay
        setTimeout(() => {
          navigate('/admin/bookings');
        }, 1500);
        
      } else if (result.requireTotp) {
        setRequireTotp(true);
        setSuccess('Identifiants vérifiés. Veuillez entrer votre code de vérification.');
      } else {
        setError(result.message);
        // Update security info after failed attempt
        setSecurityInfo(AdminAuthService.getSecurityInfo());
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const generateCurrentTOTP = () => {
    // Helper function to show current TOTP for demo purposes
    const timeStep = Math.floor(Date.now() / 1000 / 30);
    const code = ((timeStep + 123456) % 1000000).toString().padStart(6, '0');
    return code;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Accès Administrateur
          </h1>
          <p className="text-gray-600 mt-2">
            Connexion sécurisée au système de gestion SmartHub
          </p>
        </div>

        {/* Security Status */}
        {securityInfo && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">État de Sécurité</span>
            </div>
            
            {securityInfo.lockoutTimeRemaining > 0 ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  Compte verrouillé pendant {securityInfo?.lockoutTimeRemaining || 0} minutes
                </span>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tentatives échouées:</span>
                  <span className={securityInfo.recentFailedAttempts > 0 ? 'text-orange-600' : 'text-green-600'}>
                    {securityInfo.recentFailedAttempts}/{securityInfo.maxAttemptsBeforeLockout}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={loading || ((securityInfo?.lockoutTimeRemaining || 0) > 0)}
                  placeholder="Entrez votre nom d'utilisateur"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading || ((securityInfo?.lockoutTimeRemaining || 0) > 0)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* TOTP Field (shows after username/password validation) */}
            {requireTotp && (
              <div>
                <label htmlFor="totpCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Code de vérification (6 chiffres)
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="totpCode"
                    name="totpCode"
                    value={formData.totpCode}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="000000"
                    maxLength={6}
                    pattern="\d{6}"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-lg font-mono tracking-widest"
                    required
                  />
                </div>
                
                {/* Demo TOTP Display */}
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <KeyRound className="w-4 h-4" />
                    <span>Code de démonstration actuel: <strong className="font-mono">{generateCurrentTOTP()}</strong></span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Ce code change toutes les 30 secondes pour la démonstration
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || ((securityInfo?.lockoutTimeRemaining || 0) > 0)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (securityInfo?.lockoutTimeRemaining || 0) > 0 ? (
                <>
                  <Clock className="w-5 h-5" />
                  Compte verrouillé
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Identifiants de démonstration:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Utilisateur:</strong> smarthub_admin</p>
              <p><strong>Mot de passe:</strong> SmartHub2025!Admin</p>
              <p><strong>TOTP:</strong> Utilisez le code affiché ci-dessus</p>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Fonctionnalités de sécurité:</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Authentification 2FA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Session sécurisée</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Protection brute force</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Audit des connexions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};