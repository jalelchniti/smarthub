import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X, User, Mail, Phone, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react';

interface TeacherTCAFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeacherTCAForm: React.FC<TeacherTCAFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    sms: '',
    email: ''
  });
  const [countryCode, setCountryCode] = useState('+216');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'SMS__COUNTRY_CODE') {
      setCountryCode(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name.toLowerCase()]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('NOM', formData.nom);
      formDataToSend.append('PRENOM', formData.prenom);
      formDataToSend.append('SMS', formData.sms);
      formDataToSend.append('SMS__COUNTRY_CODE', countryCode);
      formDataToSend.append('EMAIL', formData.email);
      formDataToSend.append('locale', 'fr');

      const response = await fetch('https://e631d0f7.sibforms.com/serve/MUIFAB9eTKN19ZZHzLB3pDy9iApj7i7hfmfRJ5Et7AdQTncSEzLJg8sta7_1VK90zoVLBw-KysxwK2AABJbQ5wa6Ej_dsh5MeGMMg1l3COydke0Eis5wM6601UBH-HUb4TXc1W1WF7iOCbI4z2Zsz2-yyBb6s40JMppq_NCsoAgyDm6Wy7lHBXZsdoSB3b6sLw-3iRkfK2v9PXdI', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ nom: '', prenom: '', sms: '', email: '' });
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 text-center">Rejoignez notre Équipe</h3>
            <p className="text-gray-600 text-center mt-1">Candidature pour devenir enseignant chez SmartHub</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-center w-10 h-10 rounded-full p-0 border-gray-300 hover:border-red-400 hover:text-red-600"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Votre candidature est confirmée.</p>
                <p className="text-green-600 text-sm">Nous examinerons votre profil et vous contacterons bientôt.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {showError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Nous n'avons pas pu enregistrer votre candidature.</p>
                <p className="text-red-600 text-sm">Veuillez réessayer ou nous contacter directement.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label htmlFor="nom" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Nom *</span>
              </label>
              <input
                type="text"
                id="nom"
                name="NOM"
                required
                maxLength={200}
                value={formData.nom}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Entrez votre nom"
              />
            </div>

            {/* Prénom */}
            <div>
              <label htmlFor="prenom" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Prénom *</span>
              </label>
              <input
                type="text"
                id="prenom"
                name="PRENOM"
                required
                maxLength={200}
                value={formData.prenom}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Entrez votre prénom"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="sms" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                <span>Numéro de téléphone *</span>
              </label>
              <div className="flex space-x-2">
                <select
                  name="SMS__COUNTRY_CODE"
                  value={countryCode}
                  onChange={handleInputChange}
                  className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                  required
                >
                  <option value="+216">+216 TN</option>
                  <option value="+33">+33 FR</option>
                  <option value="+1">+1 US</option>
                  <option value="+44">+44 GB</option>
                  <option value="+49">+49 DE</option>
                  <option value="+39">+39 IT</option>
                  <option value="+34">+34 ES</option>
                </select>
                <input
                  type="tel"
                  id="sms"
                  name="SMS"
                  required
                  value={formData.sms}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Numéro de téléphone"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Le champ doit contenir entre 6 et 19 chiffres (ex: 99730144 pour la Tunisie)
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                <span>Adresse email *</span>
              </label>
              <input
                type="email"
                id="email"
                name="EMAIL"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="votre.email@exemple.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Votre adresse email professionnelle pour la communication
              </p>
            </div>

            {/* Information Notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 text-sm text-center">
                <strong>Devenez enseignant chez SmartHub!</strong><br/>
                Rejoignez notre équipe d'enseignants compétents et contribuez à l'excellence éducative. 
                Nous vous contacterons pour discuter de votre profil et des opportunités disponibles.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-5 h-5" />
                    <span>Postuler Maintenant</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherTCAForm;