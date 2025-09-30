import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar, MapPin } from 'lucide-react';

export const BookingThankYou: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    document.title = 'Réservation Confirmée - SmartHub';
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHomeNow = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Main card */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl text-center">
            {/* Success icon with animation */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CheckCircle size={40} className="text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Réservation Confirmée!
            </h1>

            {/* Success message */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Merci pour votre réservation. Votre créneau a été confirmé. Veuillez effectuer le paiement dans les 24 heures au bureau SmartHub.
            </p>

            {/* Payment info */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center space-x-2">
                <MapPin size={18} className="text-blue-600" />
                <span>Informations de Paiement</span>
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Délai:</strong> Paiement dans les 24 heures</p>
                <p><strong>Mode:</strong> Espèces ou Carte bancaire (TPE)</p>
                <p><strong>Lieu:</strong> Bureau SmartHub</p>
                <p><strong>Adresse:</strong> 13, Rue de Belgique, Immeuble MAE</p>
                <p><strong>Téléphone:</strong> +216 99 456 059</p>
              </div>
            </div>

            {/* Next steps */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Prochaines étapes:</h4>
              <ul className="text-sm text-gray-600 text-left space-y-1">
                <li>• Effectuez le paiement dans les 24 heures</li>
                <li>• Modes acceptés: Espèces ou Carte bancaire (TPE)</li>
                <li>• Présentez-vous au bureau à l'heure prévue</li>
                <li>• Apportez une pièce d'identité</li>
                <li>• N'hésitez pas à nous contacter si besoin</li>
              </ul>
            </div>

            {/* Countdown and actions */}
            <div className="space-y-4">
              {/* Countdown */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Redirection automatique dans
                </p>
                <div className="text-2xl font-bold text-blue-600 mb-4">
                  {countdown}s
                </div>
              </div>

              {/* Manual navigation */}
              <div className="space-y-3">
                <button
                  onClick={handleGoHomeNow}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-medium flex items-center justify-center space-x-2"
                >
                  <Home size={18} />
                  <span>Retour à l'accueil maintenant</span>
                </button>
                
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 py-2 transition-colors"
                >
                  <Calendar size={16} />
                  <span>Nouvelle réservation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Un email de confirmation sera bientôt envoyé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};