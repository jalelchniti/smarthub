import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, AlertCircle, ArrowLeft, GraduationCap } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const TeacherRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NOM: '',
    PRENOM: '',
    EMAIL: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    // Basic validation
    if (!formData.NOM || !formData.PRENOM || !formData.EMAIL) {
      setShowError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit to Brevo using the new simplified endpoint
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('NOM', formData.NOM);
      formDataToSubmit.append('PRENOM', formData.PRENOM);
      formDataToSubmit.append('EMAIL', formData.EMAIL);
      formDataToSubmit.append('locale', 'fr');
      formDataToSubmit.append('email_address_check', '');

      // Try to submit to Brevo with new endpoint
      try {
        await fetch('https://e631d0f7.sibforms.com/serve/MUIFAKuRgvqGcQcfBJI3mwdtTe7tsQ9ZhTlNuUbUil0FVBeLEU4zvxTwJYGRnAB9oH95dYMXZT1LX37JhNOWQS-M8omyw4VMfVOEL_xetC1_GasitEGghw_gzatqXOOrlgk-YL7cHiV7yNe30b2QzoxYs-ko1LA3LQ6Z3TU79HNFnPjTB8Lx1n7WgpTnDXK_7ntHofOVfOXnlP0C', {
          method: 'POST',
          body: formDataToSubmit,
          mode: 'no-cors' // This allows the request but we won't get response details
        });
        
        console.log('Teacher form submitted to Brevo successfully');
      } catch (brevoError) {
        console.log('Brevo submission error (expected due to CORS):', brevoError);
        // Continue anyway since we still want to redirect to thank you page
      }

      // Always redirect to thank you page after attempting Brevo submission
      navigate('/thank-you/teacher');
      
    } catch (error) {
      console.error('Form submission error:', error);
      setShowError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Inscription Enseignant
            </h1>
            <p className="text-xl text-gray-600">
              Rejoignez notre équipe d'enseignants compétents et partagez votre expertise
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Error Message - Only show for validation errors */}
            {showError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Erreur de validation</p>
                  <p className="text-red-600 text-sm">Veuillez remplir tous les champs obligatoires.</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Entrez votre prénom"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="votre.email@exemple.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Veuillez renseigner votre adresse email professionnel pour recevoir nos communications
                </p>
              </div>

              {/* Newsletter Notice for Teachers */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-purple-800 text-sm text-center">
                  En tant qu'enseignant, vous recevrez des informations sur les opportunités d'enseignement, les ressources pédagogiques et nos événements professionnels.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5" />
                      <span>Rejoindre SmartHub</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                Des questions sur notre processus de sélection ?
              </p>
              <a
                href="https://wa.me/21699730144?text=Bonjour! Je souhaite enseigner chez SmartHub et j'aimerais connaître le processus de sélection."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <span>📞</span>
                <span>Parler à un Responsable</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherRegistration;