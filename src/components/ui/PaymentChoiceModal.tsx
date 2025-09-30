import React from 'react';
import { CreditCard, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  bookingCount: number;
}

export const PaymentChoiceModal: React.FC<PaymentChoiceModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  bookingCount
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOfflinePayment = () => {
    onClose();
    navigate('/booking/thank-you');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Mode de Paiement
          </h2>
          <p className="text-gray-600">
            {bookingCount > 1 
              ? `${Math.ceil(bookingCount / 3)} créneau${Math.ceil(bookingCount / 3) > 1 ? 'x' : ''} réservé${Math.ceil(bookingCount / 3) > 1 ? 's' : ''} avec succès`
              : 'Créneau réservé avec succès'
            }
          </p>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <p className="text-lg font-semibold text-gray-800">
              Total à payer: <span className="text-blue-600">{totalAmount.toFixed(2)} TND</span>
            </p>
          </div>
        </div>

        {/* Payment options */}
        <div className="space-y-4">
          {/* Offline payment option */}
          <button
            onClick={handleOfflinePayment}
            className="w-full p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-3">
              <MapPin size={24} />
              <div className="text-center">
                <div className="font-semibold text-lg">Payer sur place</div>
                <div className="text-sm opacity-90">Dans les 24 heures au bureau SmartHub</div>
              </div>
            </div>
          </button>
        </div>

        {/* Payment methods info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-gray-800 mb-2 text-center">Modes de paiement acceptés</h3>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <CreditCard size={16} className="text-blue-600" />
              <span>Espèces</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center space-x-1">
              <CreditCard size={16} className="text-blue-600" />
              <span>Carte bancaire (TPE)</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Le paiement doit être effectué dans les 24 heures suivant la réservation
          </p>
        </div>
      </div>
    </div>
  );
};