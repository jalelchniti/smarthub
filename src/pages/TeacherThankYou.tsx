import React from 'react';
import { GraduationCap, Phone } from 'lucide-react';

const TeacherThankYou: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 flex items-center justify-center p-5">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-12 text-center">
          {/* Success Animation */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full shadow-2xl mb-6 animate-pulse">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎓 Merci de votre intérêt !</h1>
          <p className="text-xl text-gray-600 font-medium mb-8">Votre candidature d'enseignant a été transmise avec succès</p>
          
          {/* Process Steps */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">Processus de Candidature</h2>
            <div className="space-y-4">
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
          
          {/* Call to Action */}
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Rejoignez l'excellence éducative avec <strong>SmartHub</strong>. Nous connectons les meilleurs enseignants compétents aux étudiants les plus sérieux. Notre équipe pédagogique est disponible pour discuter de votre profil et des opportunités qui correspondent à vos compétences.
          </p>
          
          <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
            {/* Primary CTA - WhatsApp Contact */}
            <a
              href="https://wa.me/21699456059?text=Bonjour! Je viens de postuler comme enseignant et j'aimerais discuter des opportunités chez SmartHub."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-semibold"
            >
              <Phone className="w-5 h-5" />
              <span>Discuter avec l'Équipe</span>
            </a>
            
            {/* Secondary CTA - Discover Services */}
            <a
              href="/"
              className="flex items-center justify-center space-x-2 bg-white border-2 border-green-300 text-green-600 hover:border-green-500 hover:text-green-700 hover:bg-green-50 px-6 py-3 rounded-xl transition-all duration-200 font-medium"
            >
              <span>Découvrir nos Services</span>
            </a>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-12 py-6 text-center border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-4">
            Merci de rejoindre l'équipe SmartHub - Excellence éducative au centre de Tunis
          </p>
          <div className="text-gray-500 text-sm">
            📍 13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis<br />
            📞 <a href="tel:+21699456059" className="text-green-600 hover:underline">+216 99 730 144</a> • 
            📧 <a href="mailto:souad.dkhili@u-smart.net" className="text-green-600 hover:underline">souad.dkhili@u-smart.net</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherThankYou;