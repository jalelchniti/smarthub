import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, Clock, CheckCircle } from 'lucide-react';

export const PaymentOnlineComingSoon: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Paiement en Ligne - SmartHub';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Main card */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl text-center">
            {/* Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={40} className="text-white" />
              </div>
              <div className="flex items-center justify-center space-x-2 text-orange-600">
                <Clock size={20} />
                <span className="font-medium">Bientôt Disponible</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Paiement en Ligne
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Notre système de paiement en ligne sécurisé sera bientôt disponible. 
              En attendant, vous pouvez régler votre réservation directement au bureau SmartHub.
            </p>

            {/* Features coming soon */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center justify-center space-x-2">
                <CheckCircle size={20} className="text-green-600" />
                <span>Fonctionnalités à venir</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Paiement sécurisé par carte bancaire</li>
                <li>• Confirmation instantanée par email</li>
                <li>• Suivi de vos paiements en ligne</li>
                <li>• Support de plusieurs devises</li>
              </ul>
            </div>

            {/* Contact info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Pour le moment, payez sur place au:</strong>
              </p>
              <p className="text-sm text-gray-800 font-medium">
                13, Rue de Belgique, Immeuble MAE<br />
                1er étage, Bureau 1.1, 1000 Tunis
              </p>
              <p className="text-sm text-blue-600 font-medium mt-2">
                Tél: +216 99 456 059
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-medium"
              >
                Retour à l'accueil
              </button>
              
              <button
                onClick={() => navigate('/booking')}
                className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 py-2 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Nouvelle réservation</span>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Nous travaillons dur pour vous offrir la meilleure expérience possible
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};