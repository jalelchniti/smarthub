import React from 'react';
import { CheckCircle, Phone } from 'lucide-react';

const StudentThankYou: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center p-5">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-12 text-center">
          {/* Success Animation */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-2xl mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 Félicitations !</h1>
          <p className="text-xl text-gray-600 font-medium mb-8">Votre demande d'information a été envoyée avec succès</p>
          
          {/* Next Steps */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Prochaines Étapes</h2>
            <div className="space-y-4">
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
          
          {/* Call to Action */}
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Commencez votre parcours éducatif dès maintenant ! Notre équipe est prête à vous accompagner et à répondre à toutes vos questions sur <strong>SmartHub</strong> et nos services personnalisés.
          </p>
          
          <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
            {/* Primary CTA - WhatsApp Contact */}
            <a
              href="https://wa.me/21699456059?text=Bonjour! Je viens de m'inscrire et j'aimerais en savoir plus sur SmartHub."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-semibold"
            >
              <Phone className="w-5 h-5" />
              <span>Parler à un Conseiller</span>
            </a>
            
            {/* Secondary CTA - Explore Site */}
            <a
              href="/"
              className="flex items-center justify-center space-x-2 bg-white border-2 border-blue-300 text-blue-600 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl transition-all duration-200 font-medium"
            >
              <span>Explorer le Site</span>
            </a>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-12 py-6 text-center border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-4">
            Merci de votre confiance en SmartHub - Votre partenaire éducatif au centre de Tunis
          </p>
          <div className="text-gray-500 text-sm">
            📍 13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis<br />
            📞 <a href="tel:+21699456059" className="text-blue-600 hover:underline">+216 99 730 144</a> • 
            📧 <a href="mailto:contact@smarthub.com.tn" className="text-blue-600 hover:underline">contact@smarthub.com.tn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentThankYou;