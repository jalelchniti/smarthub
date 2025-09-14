import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  
  Shield, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Mail,
  Settings,
  Info,
  Server
} from 'lucide-react';
import { FirebaseAuthService, type AuthState } from '../services/firebaseAuthService';

export const FirebaseAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, user: null, loading: true });
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);

  // Initialize Firebase Auth and check authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔐 Starting Firebase Auth initialization...');
        setLoading(true);
        setError('');

        const initialized = await FirebaseAuthService.initialize();

        if (!initialized) {
          setError('Erreur: Firebase initialization failed. Veuillez vérifier la configuration et rafraîchir la page.');
          setLoading(false);
          return;
        }

        // Check if demo setup is needed (removed automatic popup - user can manually access setup instructions)
        await FirebaseAuthService.checkDemoSetup();
        console.log('✅ Firebase Auth initialization completed');

      } catch (error) {
        console.error('❌ Firebase Auth initialization error:', error);
        setError('Erreur d\'initialisation. Veuillez rafraîchir la page.');
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const unsubscribe = FirebaseAuthService.onAuthStateChanged((state) => {
      setAuthState(state);

      // Redirect if already authenticated
      if (state.isAuthenticated && !state.loading) {
        navigate('/admin/firebase-bookings');
      }

      // Update loading state
      if (!state.loading) {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [navigate]);

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
      if (!formData.email || !formData.password) {
        setError('Veuillez remplir tous les champs requis');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Format d\'email invalide');
        return;
      }

      const result = await FirebaseAuthService.signIn(formData.email, formData.password);

      if (result.success) {
        setSuccess('Connexion réussie! Redirection...');
        
        // Clear form
        setFormData({ email: '', password: '' });
        
        // Navigation will be handled by auth state change
        
      } else if (result.requireSetup) {
        // Don't auto-show popup, just show error message
        setError(result.message);
      } else {
        setError(result.message);
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Removed unused function

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError('Veuillez entrer votre email pour la réinitialisation');
      return;
    }

    try {
      const result = await FirebaseAuthService.resetPassword(formData.email);
      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Initialisation de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Firebase Admin Access
          </h1>
          <p className="text-gray-600 mt-2">
            Connexion sécurisée avec Firebase Authentication
          </p>
        </div>

        {/* Setup Instructions Modal */}
        {showSetupInstructions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Configuration Firebase Required</h3>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Étapes de configuration:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-blue-700">
                    <li>Allez sur <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                    <li>Sélectionnez votre projet SmartHub</li>
                    <li>Activez Authentication → Sign-in method → Email/Password</li>
                    <li>Ajoutez un utilisateur admin:</li>
                  </ol>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Compte Admin autorisé:</h4>
                  <div className="space-y-1 font-mono text-sm">
                    <p><strong>Email:</strong> jalel.chniti@smarthub.com.tn</p>
                    <p><strong>Password:</strong> [Votre mot de passe]</p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Emails administrateurs autorisés:</h4>
                  <div className="space-y-1 text-sm text-yellow-700">
                    <p>• jalel.chniti@smarthub.com.tn</p>
                    <p>• jalel.chniti@gmail.com</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Avantages Firebase Auth:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li>Sécurité enterprise-grade</li>
                    <li>Gestion centralisée des utilisateurs</li>
                    <li>Authentification multi-facteurs disponible</li>
                    <li>Audit et logs automatiques</li>
                    <li>Réinitialisation de mot de passe intégrée</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowSetupInstructions(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ouvrir Firebase Console
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email administrateur
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="admin@smarthub.com"
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
                  disabled={loading}
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
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Se connecter avec Firebase
                </>
              )}
            </button>

            {/* Additional Actions */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={loading || !formData.email}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
              >
                Mot de passe oublié ?
              </button>
              
              <button
                type="button"
                onClick={() => setShowSetupInstructions(true)}
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Info className="w-4 h-4" />
                Instructions de configuration
              </button>
            </div>
          </form>

          {/* Demo Setup Helper */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Configuration de démonstration:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Utilisez votre compte admin créé dans Firebase Console:</p>
              <div className="bg-white p-2 rounded border text-xs font-mono">
                <p>Email: jalel.chniti@smarthub.com.tn</p>
                <p>Password: [Votre mot de passe]</p>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Fonctionnalités Firebase Auth:</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Chiffrement enterprise</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Audit automatique</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Sessions sécurisées</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Réinitialisation email</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-3 h-3 text-blue-500" />
                <span>Infrastructure Google</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-purple-500" />
                <span>Protection DDOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};