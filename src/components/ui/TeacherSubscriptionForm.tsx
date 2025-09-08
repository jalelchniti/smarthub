import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { X, User, Mail, Phone, AlertCircle, GraduationCap } from 'lucide-react';

interface TeacherSubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeacherSubscriptionForm: React.FC<TeacherSubscriptionFormProps> = ({ isOpen, onClose }) => {
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
      iframe.name = 'brevo-submit-frame-teacher';
      document.body.appendChild(iframe);

      // Create a hidden form that targets the iframe
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://e631d0f7.sibforms.com/serve/MUIFAOl0zZjF9_ETgLWZ1u9kUW5ZHwhDBg3EkmUE5vao2JdvBLDFgKQfMyG7fHUYoTlRcZ-vdATljkhFuMWnM3VYg4OnDhVv4C8Cc2j_P8CRHn94CbppJIbDDiHoyB7Lw7PLYY-zw4P7jL_cMhTsudsYJ_Vk5jWWj5zhxWtUsPJWHXvXWQp9VxM_iaUoKbl4Jxu6RnvCV8ZLqi5x';
      form.target = 'brevo-submit-frame-teacher'; // Submit to hidden iframe
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
      navigate('/thank-you/teacher');
      
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
          {/* Form Content */}
          {/* eslint-disable-next-line no-constant-condition */}
          {false ? (
            <div className="text-center py-8">
              {/* Success Animation */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full shadow-2xl mb-6 animate-pulse">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">🎓 Merci de votre intérêt !</h3>
                  <p className="text-xl text-gray-700 font-medium">Votre candidature d'enseignant a été transmise avec succès</p>
                </div>
              </div>

              {/* Thank You Content */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 mb-8">
                <div className="space-y-4">
                  <h4 className="text-2xl font-semibold text-green-900 mb-4">Processus de Candidature</h4>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-3 text-left">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <p className="text-gray-700">Évaluation de votre profil par notre équipe pédagogique</p>
                    </div>
                    <div className="flex items-center space-x-3 text-left">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <p className="text-gray-700">Entretien téléphonique pour discuter de vos compétences</p>
                    </div>
                    <div className="flex items-center space-x-3 text-left">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <p className="text-gray-700">Intégration dans notre réseau d'enseignants qualifiés</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-6">
                <p className="text-lg text-gray-600">
                  Rejoignez l'excellence éducative avec <strong>SmartHub</strong>. Nous connectons les meilleurs enseignants compétents aux étudiants les plus sérieux. Notre équipe pédagogique est disponible pour discuter de votre profil et des opportunités qui correspondent à vos compétences.
                </p>
                <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
                  {/* Primary CTA - Contact */}
                  <a
                    href="https://wa.me/21699456059?text=Bonjour! Je viens de postuler comme enseignant et j'aimerais discuter des opportunités chez SmartHub."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-semibold"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Discuter avec l'Équipe</span>
                  </a>
                  
                  {/* Secondary CTA - Discover */}
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center space-x-2 bg-white border-2 border-green-300 text-green-600 hover:border-green-500 hover:text-green-700 hover:bg-green-50 px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                  >
                    <span>Découvrir SmartHub</span>
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
                    <p className="text-red-800 font-medium">Nous n'avons pas pu enregistrer votre candidature.</p>
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
                value={formData.PRENOM}
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
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSubscriptionForm;