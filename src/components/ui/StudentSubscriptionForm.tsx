import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { X, User, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';

interface StudentSubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentSubscriptionForm: React.FC<StudentSubscriptionFormProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NOM: '',
    PRENOM: '',
    SMS: '',
    EMAIL: ''
  });
  const [countryCode, setCountryCode] = useState('+216');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'SMS__COUNTRY_CODE') {
      setCountryCode(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateSMS = (sms: string): boolean => {
    // SMS must contain 6-19 digits only (no +/0 prefix)
    const smsRegex = /^[1-9]\d{5,18}$/;
    return smsRegex.test(sms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    // Validate SMS format
    if (!validateSMS(formData.SMS)) {
      setShowError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create a hidden iframe for form submission (bypasses popup security + stays on our site)
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'brevo-submit-frame';
      document.body.appendChild(iframe);

      // Create a hidden form that targets the iframe
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://e631d0f7.sibforms.com/serve/MUIFACIS_HvUBL38dN3sbehcT-uiPwKQ5Js32ozCj4_6JnlMRkBf-X9MjN62cIkuWWom-z41m6gDgRKIlxq9dHliaq6skHgdAALE4jWto2JyyjMtP9asgwdYnG-Z4oSdUSUo7T45jGoJD9fYqhijgraWcAKtoDVwUg_1HxbG8ivPIqPXcBZ5dHVrryAyzi-lD5jyxXuGTmkOuUkG';
      form.target = 'brevo-submit-frame'; // Submit to hidden iframe
      form.style.display = 'none';

      // Add all form fields
      const fields = {
        'NOM': formData.NOM,
        'PRENOM': formData.PRENOM,
        'SMS': formData.SMS,
        'SMS__COUNTRY_CODE': countryCode,
        'EMAIL': formData.EMAIL,
        'locale': 'fr',
        'email_address_check': ''
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();

      // Clean up after submission
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      }, 2000);

      // Redirect to our thank you page immediately using React Router
      navigate('/thank-you/student');
      
    } catch (error) {
      console.error('Form submission error:', error);
      setShowError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 text-center">Plus d'Information</h3>
            <p className="text-gray-600 text-center mt-1">Rejoignez SmartHub en tant qu'étudiant</p>
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
          {/* Form Content */}
          {/* eslint-disable-next-line no-constant-condition */}
          {false ? (
            <div className="text-center py-8">
              {/* Success Animation */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-2xl mb-6 animate-pulse">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">🎉 Félicitations !</h3>
                  <p className="text-xl text-gray-700 font-medium">Votre demande d'information a été envoyée avec succès</p>
                </div>
              </div>

              {/* Thank You Content */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
                <div className="space-y-4">
                  <h4 className="text-2xl font-semibold text-blue-900 mb-4">Prochaines Étapes</h4>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-3 text-left">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <p className="text-gray-700">Notre équipe examine votre demande (sous 24h)</p>
                    </div>
                    <div className="flex items-center space-x-3 text-left">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <p className="text-gray-700">Vous recevrez un email avec toutes les informations</p>
                    </div>
                    <div className="flex items-center space-x-3 text-left">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <p className="text-gray-700">Un conseiller vous contactera pour personnaliser votre parcours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-6">
                <p className="text-lg text-gray-600">
                  Commencez votre parcours éducatif dès maintenant ! Notre équipe est prête à vous accompagner et à répondre à toutes vos questions sur <strong>SmartHub</strong> et nos services personnalisés.
                </p>
                <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
                  {/* Primary CTA - Contact */}
                  <a
                    href="https://wa.me/21699730144?text=Bonjour! Je viens de m'inscrire et j'aimerais en savoir plus sur SmartHub."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-semibold"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Parler à un Conseiller</span>
                  </a>
                  
                  {/* Secondary CTA - Explore */}
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center space-x-2 bg-white border-2 border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                  >
                    <span>Explorer le Site</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {showError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">Nous n'avons pas pu confirmer votre inscription.</p>
                    <p className="text-red-600 text-sm">Vérifiez le format de votre numéro de téléphone (6-19 chiffres, sans +/0) ou contactez-nous directement.</p>
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
                value={formData.NOM}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                value={formData.PRENOM}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  required
                >
                  <option value="+216" selected>+216 TN</option>
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
                  value={formData.SMS}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="LANDLINE_NUMBER"
                  pattern="[1-9][0-9]{5,18}"
                  title="Le numéro doit contenir entre 6 et 19 chiffres sans +/0 au début"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Le champ SMS doit contenir entre 6 et 19 chiffres sans utiliser +/0 (ex: 99123456 pour la Tunisie)
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                <span>Adresse email *</span>
              </label>
              <input
                type="text"
                id="email"
                name="EMAIL"
                required
                value={formData.EMAIL}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="votre.email@exemple.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Veuillez renseigner votre adresse email pour recevoir nos actualités
              </p>
            </div>

            {/* Newsletter Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-800 text-sm text-center">
                Inscrivez-vous à notre newsletter pour suivre nos actualités et recevoir des informations exclusives sur nos services éducatifs.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>S'inscrire</span>
                  </>
                )}
              </button>
            </div>
          </form>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default StudentSubscriptionForm;